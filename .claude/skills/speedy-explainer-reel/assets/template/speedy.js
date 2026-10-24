/* SPEEDY style layer for engine.js (load after engine.js and avatar.js).
 *
 *   R.speedy({ light:[[a,b]], emph:{box,bold}, chapters:[{label,at}], counter:{unit,steps:[[t,value,unit?]]},
 *              poses:[[t,"name"],...], avatar:{x,y,w,mode,png,style}, rail:true })     once, after R.setup
 *   R.speedyFrame(t)      right after R.frame(t) in seek: theme flip, kinetic captions, rail+counter, avatar, watermark
 *   R.card(el,t,{in,out,y,d,blur,back})   focus-pull card (same API as the noir pack)
 *   R.note(el,t,a,b)      footnote fades in a..b           R.sel(el,t,a,b)   selection box on UI
 *   R.hilite(el,t,a,b)    green highlight ring             R.finger(el,t,keys)  giant finger: keys [{t,x,y,press?}]
 *   R.keyboard(el,{theme}) builds an iOS keyboard; R.zone(kbEl,key,t,{at,grow,glow})  invisible hit-zone glow
 *   R.preview(kbEl,key,t,a,b)  the letter popping above the finger
 *   R.matrix(el,t,{cols,rows,at,d,to,cap})  connection grid filling up      R.rack(el,t,at,{stagger})  recap stack
 *   R.press(el,t,a)       button press flash               R.meas(el,t,a)    dimension line draws in
 * Every helper is a pure function of t. Call them unconditionally in seek. */
(function () {
  const R = window.Reel, { clamp, prog, lerp, ease: E, $ } = R;
  let N = { light: [], emph: {}, chapters: [], counter: null, poses: [["0", "talk"]], avatar: {}, rail: false };

  // ---------- emphasis on caption tokens ----------
  const nrm = s => s.toLowerCase().replace(/[^\w]/g, "");
  function mark(list, kind) {
    const T = (window.CAPTION_PAGES || []).flat();
    (list || []).forEach(entry => {
      const [phrase, nthS] = String(entry).split("#"), nth = nthS ? +nthS - 1 : 0, q = nrm(phrase);
      let hit = -1, found = false;
      for (let i = 0; i < T.length && !found; i++) {
        let acc = "";
        for (let j = i; j < T.length && acc.length < q.length; j++) {
          acc += nrm(T[j].t);
          if (acc === q && ++hit === nth) { for (let k = i; k <= j; k++) { T[k].k = kind; if (kind === "box") T[k].g = `g${i}`; } found = true; break; }
        }
      }
      if (!found) throw new Error(`Reel.speedy: emphasis phrase not found in captions: "${entry}"`);
    });
  }

  R.speedy = cfg => {
    N = { ...N, ...cfg };
    mark(N.emph.bold, "b"); mark(N.emph.box, "box");
    N.poses = (N.poses || []).map(([t, n]) => [+t, n]).sort((a, b) => a[0] - b[0]);
    if (!N.poses.length || N.poses[0][0] > 0) N.poses.unshift([-1, "talk"]);
    N.poses.forEach(p => R.cue("pop", p[0], { soft: true }));
    const av = $("avatar");
    if (av) { const a = N.avatar; av.style.left = (a.x ?? 240) + "px"; av.style.top = (a.y ?? 1330) + "px"; av.style.width = (a.w ?? 600) + "px"; av.style.height = (a.w ?? 600) * 640 / 600 + "px"; window.Avatar && Avatar.init(av, a); }
    if (N.chapters.length && $("rail")) buildRail();
  };

  // ---------- theme: hard-ish flip between dark and light chapters ----------
  function theme(t) {
    let lt = 0;
    N.light.forEach(([a, b]) => { lt = Math.max(lt, prog(t, a - 0.05, 0.22) * (1 - prog(t, b - 0.12, 0.22))); });
    const L = document.querySelector(".s-light"); if (L) L.style.opacity = lt;
    document.body.classList.toggle("is-light", lt > 0.5);
    return lt;
  }

  // ---------- kinetic headline: words accumulate, blur in as spoken; page blurs out ----------
  function kinetic(t) {
    const el = $("kin"); if (!el) return;
    const P = window.CAPTION_PAGES || [];
    let pi = -1;
    for (let i = 0; i < P.length; i++) if (t >= P[i][0].s - 0.12) pi = i;
    if (pi < 0) { el.innerHTML = ""; el.dataset.page = ""; return; }
    const page = P[pi], nx = P[pi + 1];
    const endAt = nx ? nx[0].s - 0.14 : page[page.length - 1].e + 1.3;
    const out = prog(t, endAt - 0.14, 0.14);
    if (el.dataset.page != pi) {
      let html = "", open = null;
      page.forEach((w, k) => {
        if (w.g !== open && open) { html += `</span>`; open = null; }
        if (w.g && w.g !== open) { html += `<span class="sel" data-g="${w.g}"><span class="box"></span><span class="hd tl"></span><span class="hd br"></span>`; open = w.g; }
        const emo = /\p{Extended_Pictographic}/u.test(w.t) ? " emoji" : "";
        html += `<span class="w ${w.k && w.k !== "box" ? w.k : ""}${emo}" data-k="${k}">${w.t}</span>`;
      });
      if (open) html += "</span>";
      el.innerHTML = html; el.dataset.page = pi;
    }
    const ws = el.querySelectorAll(".w");
    ws.forEach(s => {
      const k = +s.dataset.k, w = page[k], p = E.out3(prog(t, w.s - 0.08, 0.24));
      s.style.opacity = p; s.style.filter = p < 1 ? `blur(${(1 - p) * 14}px)` : ""; s.style.transform = `translateY(${(1 - p) * 6}px)`;
      // the just-spoken word is white+bold; it relaxes to grey/regular once the next word lands,
      // unless it is a marked bold or boxed word (those stay white+bold)
      if (w.k || (w.g != null)) { s.classList.add("hot"); s.style.removeProperty("--relax"); return; }
      const nx = page[k + 1];
      const relax = nx ? E.out3(prog(t, nx.s - 0.02, 0.18)) : 0;
      s.classList.toggle("hot", relax < 0.5);
      s.style.setProperty("--relax", relax.toFixed(3));
    });
    el.querySelectorAll(".sel").forEach(g => {
      const first = page[+g.querySelector(".w").dataset.k], p = E.out3(prog(t, first.s, 0.26));
      g.querySelector(".box").style.opacity = p; g.querySelector(".box").style.transform = `scale(${lerp(1.1, 1, p)})`;
      g.querySelectorAll(".hd").forEach(h => (h.style.transform = `scale(${E.spring(prog(t, first.s + 0.06, 0.3))})`));
    });
    el.style.opacity = 1 - out; el.style.filter = out > 0 ? `blur(${out * 16}px)` : "";
  }

  // ---------- chapter rail + live counter ----------
  const BOLT = `<svg viewBox="0 0 24 24" width="44" height="44"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="currentColor"/></svg>`;
  function buildRail() {
    const el = $("rail"), n = N.chapters.length, left = 86, right = 1080 - 140 - 200 - 86; // usable width inside .line
    const W = 1080 - 140 - 86 - 200;
    el.innerHTML = `<div class="glyph">${N.glyph || BOLT}</div><div class="line"><div class="fill"></div></div>` +
      N.chapters.map((c, i) => `<div class="ch" style="left:${left + (W * (i + 0.5)) / n}px"><i></i><span>${c.label.replace(/\\n/g, "\n")}</span></div>`).join("") +
      `<div class="ctr"><b>0</b><span>${N.counter ? N.counter.unit : ""}</span></div>`;
  }
  function rail(t) {
    const el = $("rail"); if (!el || !N.chapters.length) return;
    const first = N.chapters[0].at, last = N.chapters[N.chapters.length - 1].end ?? 1e9;
    el.style.opacity = E.out3(prog(t, first - 0.1, 0.4)) * (1 - prog(t, last, 0.3));
    let cur = -1; N.chapters.forEach((c, i) => { if (t >= c.at) cur = i; });
    const n = N.chapters.length;
    el.querySelectorAll(".ch").forEach((c, i) => { c.className = "ch" + (i < cur ? " done" : i === cur ? " on" : ""); });
    const f = cur < 0 ? 0 : (cur + 0.5) / n + (cur < n - 1 ? 0 : 0.5 / n) * E.out3(prog(t, N.chapters[cur].at, 0.6));
    const fw = cur < 0 ? 0 : lerp(cur > 0 ? (cur - 0.5) / n : 0, (cur + 0.5) / n, E.out3(prog(t, N.chapters[cur].at, 0.6)));
    el.querySelector(".fill").style.width = fw * 100 + "%";
    if (N.counter) {
      const st = N.counter.steps || []; let v = 0, unit = N.counter.unit, from = 0;
      st.forEach(([a, val, u]) => { if (t >= a) { v = lerp(from, val, E.out3(prog(t, a, 0.6))); if (u) unit = u; } if (t >= a + 0.6) from = val; else if (t < a) return; });
      el.querySelector(".ctr b").textContent = Math.round(v).toLocaleString("en-US");
      el.querySelector(".ctr span").textContent = unit;
    }
  }

  // ---------- presenter ----------
  function mouthAt(t) {
    const T = (window.CAPTION_PAGES || []).flat();
    let env = 0;
    for (let i = 0; i < T.length; i++) {
      const w = T[i]; if (t < w.s - 0.05) break;
      if (t >= w.s - 0.05 && t <= w.e + 0.05) { env = 0.45 + 0.55 * Math.abs(Math.sin(2 * Math.PI * 6.3 * t + i)); break; }
      const nx = T[i + 1]; if (nx && t > w.e && t < nx.s && nx.s - w.e < 0.28) { env = 0.25; break; }
    }
    return env;
  }
  function avatar(t) {
    if (!window.Avatar || !$("avatar")) return;
    let i = 0; for (let k = 0; k < N.poses.length; k++) if (t >= N.poses[k][0]) i = k;
    const cur = N.poses[i][1], prev = N.poses[Math.max(0, i - 1)][1], p = prog(t, N.poses[i][0], 0.18);
    const av = $("avatar"), a = N.avatar, show = a.hide ? !a.hide.some(([x, y]) => t >= x && t < y) : true;
    const inT = a.in ?? 0, pin = E.out3(prog(t, inT, 0.5));
    av.style.opacity = show ? pin : 0; av.style.transform = `translateY(${(1 - pin) * 120}px)`;
    Avatar.frame(t, cur, p, prev, mouthAt(t));
  }

  R.speedyFrame = t => { theme(t); kinetic(t); rail(t); avatar(t); const wm = $("wm"); if (wm) wm.style.opacity = N.wm ? prog(t, N.wm, 0.4) : 0; };

  // ---------- stage helpers ----------
  R.card = (el, t, o) => {
    el = $(el);
    const pin = E.out3(prog(t, o.in, o.d ?? 0.5)), pout = o.out != null ? prog(t, o.out - 0.1, 0.3) : 0;
    const back = o.back ? E.inOut(prog(t, o.back[0], 0.5)) * (o.back[1] != null ? 1 - E.inOut(prog(t, o.back[1], 0.5)) : 1) : 0;
    const y = (1 - pin) * (o.y ?? 40) - back * (o.dz ?? 50) - pout * 30, s = lerp(0.96, 1, pin) * (1 - 0.06 * back) * (1 - 0.03 * pout);
    el.style.opacity = pin * (1 - 0.6 * back) * (1 - pout); el.style.transform = `translateY(${y}px) scale(${s})`;
    const bl = (1 - pin) * (o.blur ?? 18) + back * 6 + pout * 16; el.style.filter = bl > 0.05 ? `blur(${bl}px)` : "";
    el.style.display = pin <= 0 || pout >= 1 ? "none" : "";
  };
  R.note = (el, t, a, b = 1e9) => { el = $(el); el.style.opacity = E.out3(prog(t, a, 0.4)) * (1 - prog(t, b, 0.3)); };
  R.sel = (el, t, a, b = 1e9) => { el = $(el); const p = E.out3(prog(t, a, 0.3)); el.style.opacity = p * (1 - prog(t, b, 0.25)); el.style.transform = `scale(${lerp(1.06, 1, p)})`; };
  R.hilite = R.sel;
  R.press = (el, t, a) => { el = $(el); const p = prog(t, a, 0.45); R.cue("click", a); el.style.filter = p > 0 && p < 1 ? `brightness(${1 + 0.6 * Math.sin(Math.PI * p)})` : ""; el.style.transform = `scale(${1 - 0.05 * Math.sin(Math.PI * p)})`; };
  R.meas = (el, t, a) => { el = $(el); const p = E.inOut(prog(t, a, 0.5)); el.style.opacity = clamp(p * 3); el.style.transform = `scaleX(${p})`; el.style.transformOrigin = "0 50%"; const b = el.querySelector("b"); if (b) { b.style.opacity = prog(t, a + 0.3, 0.3); b.style.transform = `translateX(-50%) scaleX(${1 / Math.max(p, 0.01)})`; } };
  /** giant finger: keys [{t,x,y,press}] (x,y = fingertip position); it slides between keys, dips on press */
  R.finger = (el, t, keys) => {
    el = $(el);
    const posAt = tt => {
      let x = keys[0].x, y = keys[0].y;
      for (let i = 0; i < keys.length - 1; i++) { const k0 = keys[i], k1 = keys[i + 1]; if (tt >= k0.t) { const p = E.inOut(prog(tt, k0.t, k1.t - k0.t)); x = lerp(k0.x, k1.x, p); y = lerp(k0.y, k1.y, p); } }
      return [x, y];
    };
    const [x, y] = posAt(t), [px, py] = posAt(t - 1 / 30);
    const speed = Math.hypot(x - px, y - py);                 // px per frame -> motion blur while sliding
    let press = 0; keys.forEach(k => { if (!k.press) return; R.cue("click", k.t); const p = prog(t, k.t, 0.5); if (p > 0 && p < 1) press = Math.sin(Math.PI * clamp(p * 2)); });
    const pin = E.out3(prog(t, keys[0].t - 0.4, 0.5)), pout = keys.out != null ? prog(t, keys.out, 0.4) : 0;
    el.style.opacity = pin * (1 - pout);
    el.style.transform = `translate(${x - 165 + (1 - pin) * 300}px, ${y - 60 + (1 - pin) * 500 + pout * 500}px) rotate(${-22 + 4 * press}deg) scale(${1 - 0.04 * press})`;
    el.style.filter = speed > 6 ? `blur(${Math.min(10, (speed - 6) * 0.45)}px)` : "";
    const sh = el.querySelector(".shadow"); if (sh) sh.style.opacity = 0.35 + 0.4 * press;
  };
  /** tap mark: small circle + crosshair where a tap landed (el positioned absolute), visible a..b */
  R.tapmark = (el, t, a, b = a + 1.2) => {
    el = $(el); const p = E.spring(prog(t, a, 0.3));
    el.style.opacity = clamp(p * 2) * (1 - prog(t, b, 0.25));
    el.style.transform = `scale(${lerp(1.6, 1, p)})`;
  };
  /** a tiny particle dot rising off a pressed key (el = .spark-dot) */
  R.spark = (el, t, a) => {
    el = $(el); const p = prog(t, a, 0.7);
    el.style.opacity = p > 0 && p < 1 ? Math.sin(Math.PI * p) : 0;
    el.style.transform = `translateY(${-90 * E.out3(p)}px) scale(${lerp(1, 0.4, p)})`;
  };
  /** iOS keyboard. layout rows; returns map key->element */
  R.keyboard = (el, o = {}) => {
    el = $(el); if (el.dataset.built) return;
    const rows = o.rows || ["qwertyuiop", "asdfghjkl", "zxcvbnm"];
    el.className = "kb" + (o.theme === "light" ? " light" : "");
    el.innerHTML = rows.map((r, i) => `<div class="row">${i === 2 ? `<div class="k fn w">⇧</div>` : ""}${[...r].map(c => `<div class="k" data-key="${c}">${c}</div>`).join("")}${i === 2 ? `<div class="k fn w">⌫</div>` : ""}</div>`).join("") +
      `<div class="row"><div class="k fn w">123</div><div class="k sp">space</div><div class="k fn w">return</div></div>`;
    el.dataset.built = 1;
  };
  /** invisible hit-zone glow behind a key; grow = size multiplier (1 = the key), glow 0..1 */
  R.zone = (kb, key, t, o) => {
    kb = $(kb); const k = kb.querySelector(`[data-key="${key}"]`); if (!k) return;
    let z = kb.querySelector(`.zone[data-key="${key}"]`);
    if (!z) { z = document.createElement("div"); z.className = "zone"; z.dataset.key = key; k.parentNode.appendChild(z); }
    const p = E.spring(prog(t, o.at, 0.5)), g = lerp(1, o.grow ?? 1.6, p), w = k.offsetWidth * g, h = k.offsetHeight * (1 + (g - 1) * 0.5);
    z.style.width = w + "px"; z.style.height = h + "px"; z.style.left = k.offsetLeft + k.offsetWidth / 2 - w / 2 + "px"; z.style.top = k.offsetTop + k.offsetHeight / 2 - h / 2 + "px";
    z.style.opacity = (o.glow ?? 1) * E.out3(prog(t, o.show ?? o.at - 0.3, 0.4)) * (1 - prog(t, o.hide ?? 1e9, 0.3));
    let flash = 0;                                         // zone flashes white at each press time
    (o.press || []).forEach(a => { const p = prog(t, a, 0.5); if (p > 0 && p < 1) flash = Math.max(flash, Math.sin(Math.PI * p)); R.cue("click", a); });
    z.style.background = flash > 0.03
      ? `radial-gradient(circle, rgba(255,250,235,${0.35 + 0.55 * flash}), rgba(243,178,58,.25) 70%, transparent)`
      : "";
  };
  /** letter preview popping above a key a..b */
  R.preview = (kb, key, t, a, b = 1e9) => {
    kb = $(kb); const k = kb.querySelector(`[data-key="${key}"]`); if (!k) return;
    let pv = kb.querySelector(`.pv[data-key="${key}"]`);
    if (!pv) { pv = document.createElement("div"); pv.className = "pv"; pv.dataset.key = key; pv.textContent = key; k.parentNode.appendChild(pv); }
    const p = E.spring(prog(t, a, 0.3));
    pv.style.left = k.offsetLeft + k.offsetWidth / 2 - 36 + "px"; pv.style.top = k.offsetTop - 100 + "px";
    pv.style.opacity = clamp(p * 2) * (1 - prog(t, b, 0.2)); pv.style.transform = `scale(${lerp(0.6, 1, p)})`;
    R.cue("pop", a);
  };
  /** grid of connections lighting up to `to` out of cols*rows; cap = number after which cells turn red */
  R.matrix = (el, t, o) => {
    el = $(el); const n = o.cols * o.rows;
    if (!el.dataset.built) { el.style.gridTemplateColumns = `repeat(${o.cols},1fr)`; el.innerHTML = "<i></i>".repeat(n); el.dataset.built = 1; }
    const k = Math.round(lerp(o.from ?? 0, o.to, E.out3(prog(t, o.at, o.d ?? 1.2))));
    el.querySelectorAll("i").forEach((c, i) => (c.className = i < k ? (o.cap != null && i >= o.cap ? "hot" : "on") : ""));
    return k;
  };
  /** schema/table rows appearing one per word: el contains .rw children; counter ticks live via R.speedy counter steps */
  R.rows = (el, t, times, o = {}) => {
    el = $(el); const rows = el.querySelectorAll(".rw");
    rows.forEach((r, i) => {
      const a = times[Math.min(i, times.length - 1)], p = E.out3(prog(t, a, 0.3));
      r.style.display = p <= 0 ? "none" : "";               // the card grows taller with each row
      r.style.opacity = p; r.style.filter = p < 1 ? `blur(${(1 - p) * 8}px)` : "";
      r.style.transform = `translateY(${(1 - p) * 14}px)`;
      if (p > 0 && p < 1) R.cue("pop", a, { soft: true });
    });
  };
  /** chat bubbles popping in in sequence; the thread scrolls up to keep the newest visible.
      el = container with .bub children (position:relative flow), times[i] = bubble i's time */
  R.bubbles = (el, t, times, o = {}) => {
    el = $(el); const bs = el.querySelectorAll(".bub"); let scroll = 0;
    bs.forEach((b, i) => {
      const a = times[Math.min(i, times.length - 1)], p = E.spring(prog(t, a, 0.4));
      b.style.opacity = clamp(prog(t, a, 0.15) * 2);
      b.style.transform = `translateY(${(1 - E.out3(prog(t, a, 0.35))) * 26}px) scale(${lerp(0.82, 1, p)})`;
      b.style.transformOrigin = b.classList.contains("me") ? "100% 100%" : "0 100%";
      if (i >= (o.keep ?? 3)) scroll += (o.row ?? 92) * E.out3(prog(t, a, 0.35));
      R.cue("pop", a, { soft: true });
    });
    const inner = el.querySelector(".scroll") || el;
    inner.style.transform = `translateY(${-scroll}px)`;
  };
  /** iOS bottom sheet: slides up from below with a spring (el positioned at its final place) */
  R.sheet = (el, t, a, o = {}) => {
    el = $(el); const p = prog(t, a, o.d ?? 0.55), e = E.spring(p);
    const pout = o.out != null ? prog(t, o.out, 0.3) : 0;
    el.style.opacity = p <= 0 ? 0 : 1 - pout;
    el.style.transform = `translateY(${(1 - e) * (o.dy ?? 520) + pout * 200}px)`;
    if (p > 0) R.cue("whoosh", a);
  };
  /** "+1" floating up off a counter (el = small absolute element) */
  R.plusone = (el, t, a) => {
    el = $(el); const p = prog(t, a, 0.9);
    el.style.opacity = p > 0 && p < 1 ? Math.sin(Math.PI * clamp(p * 1.6)) : 0;
    el.style.transform = `translateY(${-46 * E.out3(p)}px)`;
  };
  /** recap rack: layers pop in bottom-up */
  R.rack = (el, t, at, o = {}) => {
    el = $(el); const L = [...el.querySelectorAll(".lay")].reverse(), st = o.stagger ?? 0.22;
    L.forEach((l, i) => { const a = Array.isArray(at) ? at[i] : at + i * st, p = E.spring(prog(t, a, 0.45)); R.cue("pop", a); l.style.opacity = clamp(p * 2); l.style.transform = `translateY(${(1 - p) * 40}px) scale(${lerp(0.94, 1, p)})`; });
  };
})();
