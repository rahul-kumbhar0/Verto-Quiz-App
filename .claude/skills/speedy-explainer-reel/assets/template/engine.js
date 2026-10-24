/* Reel engine: deterministic, seek(t)-driven animation helpers for 1080x1920 reels.
 *
 * Every helper is a pure function of the current time t, so the renderer can jump to any
 * frame. Call helpers UNCONDITIONALLY on every seek (not inside `if (t > ...)`): they also
 * register sound-effect cues (pop, whoosh, type, click, ding) that render.mjs --cues exports
 * for sfx.py, which keeps sound perfectly in sync with motion.
 */
(function () {
  const R = (window.Reel = {});
  const clamp = (R.clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)));
  const prog = (R.prog = (t, a, d) => clamp((t - a) / d));
  const lerp = (R.lerp = (a, b, p) => a + (b - a) * p);
  const E = (R.ease = {
    out3: p => 1 - Math.pow(1 - p, 3),
    out5: p => 1 - Math.pow(1 - p, 5),
    inOut: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
    // damped spring: quick, ~6% overshoot, settles - feels physical, never "bouncy"
    spring: p => (p >= 1 ? 1 : 1 - Math.exp(-6 * p) * Math.cos(9 * p)),
  });
  const $ = (R.$ = id => (typeof id === "string" ? document.getElementById(id) : id));

  // ---------- sound cues ----------
  const seen = new Set();
  R.cues = window.__cues = [];
  R.cue = (type, t, extra = {}) => {
    const k = type + ":" + (+t).toFixed(3);
    if (seen.has(k)) return;
    seen.add(k); R.cues.push({ type, t: +t, ...extra });
  };

  // ---------- element helpers ----------
  /** fade + rise (+ optional blur) in */
  R.rise = (el, t, a, o = {}) => {
    el = $(el); const d = o.d ?? 0.5, dy = o.dy ?? 50, blur = o.blur ?? 0;
    const p = E.out3(prog(t, a, d));
    el.style.opacity = p;
    el.style.transform = `translateY(${(1 - p) * dy}px)` + (o.extra || "");
    el.style.filter = blur ? `blur(${(1 - p) * blur}px)` : "";
    return p;
  };
  /** scale pop with a spring; registers a 'pop' cue unless sfx:false */
  R.pop = (el, t, a, o = {}) => {
    el = $(el); const d = o.d ?? 0.5, rot = o.rot ?? 0;
    if (o.sfx !== false) R.cue("pop", a);
    const p = prog(t, a, d);
    el.style.opacity = clamp(p * 3);
    el.style.transform = `scale(${lerp(o.from ?? 0.4, 1, E.spring(p))}) rotate(${rot * E.out3(p)}deg)`;
    return p;
  };
  /** short emphasis punch (scale up and back) */
  R.punch = (el, t, a, amt = 0.07, d = 0.35) => {
    el = $(el); const s = 1 + amt * Math.sin(Math.PI * prog(t, a, d));
    el.style.transform = (el.style.transform || "").replace(/ ?scale\([^)]*\) ?$/, "") + ` scale(${s})`;
  };

  /** kinetic text: splits el into words once, reveals them with stagger (or exact times[]) */
  R.words = (el, t, a, o = {}) => {
    el = $(el);
    if (!el.dataset.split) {
      const out = [];
      el.childNodes.forEach(n => {
        if (n.nodeType === 3) n.textContent.split(/(\s+)/).forEach(w => out.push(/\S/.test(w) ? `<span class="w">${w}</span>` : w));
        else if (n.nodeName === "BR") out.push("<br>");
        else { n.classList.add("w"); out.push(n.outerHTML); }
      });
      el.innerHTML = out.join(""); el.dataset.split = 1;
    }
    const ws = el.querySelectorAll(".w"), st = o.stagger ?? 0.09, d = o.d ?? 0.45;
    ws.forEach((w, i) => {
      const at = o.times ? o.times[Math.min(i, o.times.length - 1)] : a + i * st;
      const p = prog(t, at, d), e = E.out3(p);
      w.style.display = "inline-block";
      w.style.opacity = clamp(p * 1.6);
      w.style.transform = `translateY(${(1 - e) * 60}px) rotate(${(1 - e) * 4}deg)`;
      w.style.filter = `blur(${(1 - e) * 10}px)`;
    });
  };
  /** highlighter swipe behind text (el should be inline) */
  R.marker = (el, t, a, d = 0.45, color = "rgba(232,119,90,.32)") => {
    el = $(el); const p = E.inOut(prog(t, a, d));
    el.style.backgroundImage = `linear-gradient(transparent 55%, ${color} 55%, ${color} 92%, transparent 92%)`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundSize = `${p * 100}% 100%`;
  };
  /** typewriter; registers a 'type' cue range */
  R.type = (el, text, t, a, cps = 32) => {
    el = $(el); R.cue("type", a, { t2: a + text.length / cps });
    const n = clamp(Math.floor((t - a) * cps), 0, text.length);
    el.textContent = text.slice(0, n);
    return n >= text.length;
  };
  /** number counter; fmt formats the value; optional ding when it lands */
  R.count = (el, t, a, d, to, o = {}) => {
    el = $(el); const fmt = o.fmt || (x => Math.round(x).toLocaleString("en-US"));
    if (o.ding) R.cue("ding", a + d);
    el.textContent = fmt((o.from ?? 0) + (to - (o.from ?? 0)) * E.out3(prog(t, a, d)));
  };
  /** draw an SVG path/line/polyline via stroke-dashoffset */
  R.draw = (el, t, a, d) => {
    el = $(el);
    if (!el.dataset.len) { el.dataset.len = el.getTotalLength(); el.style.strokeDasharray = el.dataset.len; }
    el.style.strokeDashoffset = el.dataset.len * (1 - E.inOut(prog(t, a, d)));
  };
  /** clip-path wipe reveal: dir = right|left|down|up */
  R.wipe = (el, t, a, d, dir = "right") => {
    el = $(el); const r = (1 - E.inOut(prog(t, a, d))) * 100;
    const m = { right: `0 ${r}% 0 0`, left: `0 0 0 ${r}%`, down: `0 0 ${r}% 0`, up: `${r}% 0 0 0` };
    el.style.clipPath = `inset(${m[dir]})`;
  };
  /** Ken Burns / camera move on an image or element (transform-origin 0 0) */
  R.camera = (el, t, a, d, from, to) => {
    el = $(el); const p = E.inOut(prog(t, a, d));
    const x = lerp(from.x || 0, to.x || 0, p), y = lerp(from.y || 0, to.y || 0, p), s = lerp(from.s || 1, to.s || 1, p);
    el.style.transformOrigin = "0 0";
    el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  };
  /** animated cursor: keys = [{t, x, y, click?}] ; el contains a .ripple child */
  R.cursor = (el, t, keys) => {
    el = $(el); let x = keys[0].x, y = keys[0].y;
    for (let i = 0; i < keys.length - 1; i++) {
      const k0 = keys[i], k1 = keys[i + 1];
      if (t >= k0.t) { const p = E.inOut(prog(t, k0.t, k1.t - k0.t)); x = lerp(k0.x, k1.x, p); y = lerp(k0.y, k1.y, p); }
    }
    let press = 0, ring = 0, ringA = 0;
    keys.forEach(k => {
      if (!k.click) return; R.cue("click", k.t);
      const p = prog(t, k.t, 0.5); if (p > 0 && p < 1) { press = Math.sin(Math.PI * clamp(p * 3)); ring = p; ringA = 1 - p; }
    });
    el.style.opacity = prog(t, keys[0].t - 0.3, 0.3);
    el.style.transform = `translate(${x}px, ${y}px) scale(${1 - 0.15 * press})`;
    const rp = el.querySelector(".ripple");
    if (rp) { rp.style.transform = `scale(${0.3 + ring * 1.7})`; rp.style.opacity = ringA; }
  };

  // ---------- voice-synced timing ----------
  // Look up when a phrase is spoken, using the caption tokens (display forms, e.g. "294K").
  // Scenes written with R.at() re-time themselves when the real voiceover replaces the estimate.
  const nrm = s => s.toLowerCase().replace(/[^\w]/g, "");
  let TOK = null;
  const tokens = () => (TOK ||= (window.CAPTION_PAGES || []).flat());
  function find(phrase, nth = 0) {
    // match on concatenated normalised text, so merged tokens ("git reset --soft HEAD~1") still match
    const q = nrm(phrase), T = tokens();
    for (let i = 0, hit = 0; i < T.length; i++) {
      let acc = "";
      for (let j = i; j < T.length && acc.length < q.length; j++) {
        acc += nrm(T[j].t);
        if (acc === q && hit++ === nth) return [T[i], T[j]];
      }
    }
    throw new Error(`Reel.at: phrase not found in captions: "${phrase}"`);
  }
  /** start time of the nth occurrence of a spoken phrase */
  R.at = (phrase, nth = 0) => find(phrase, nth)[0].s;
  /** end time of the phrase */
  R.end = (phrase, nth = 0) => find(phrase, nth)[1].e;
  /** time the voice stops */
  R.voiceEnd = () => { const T = tokens(); return T.length ? T[T.length - 1].e : 0; };

  // ---------- frame-level systems ----------
  let C = null;
  /** cfg: {scenes:[{id,s,e,enter}], steps:{id:[n,total,label]}, dark:[[a,b]], captions, captionTop} */
  R.setup = cfg => {
    C = cfg;
    cfg.scenes.forEach(sc => { if (sc.s > 0) R.cue("whoosh", sc.s); });
    const cap = $("cap"); if (cap && cfg.captionTop) cap.style.top = cfg.captionTop + "px";
  };

  const darkAmount = t => Math.max(0, ...(C.dark || []).map(([a, b]) => prog(t, a - 0.15, 0.45) - prog(t, b - 0.2, 0.45)));

  function scenes(t) {
    let cur = null;
    for (const sc of C.scenes) {
      const el = $(sc.id); if (!el) continue;
      const pin = sc.s === 0 ? 1 : E.out3(prog(t, sc.s - 0.06, 0.42));
      const pout = prog(t, sc.e - 0.22, 0.28);
      const a = pin * (1 - pout);
      el.style.display = a <= 0.001 ? "none" : "block";
      if (a <= 0.001) continue;
      if (t >= sc.s && t < sc.e) cur = sc.id;
      const push = 1 + (C.push ?? 0.03) * prog(t, sc.s, sc.e - sc.s); // slow camera push-in
      let tf = "", blur = (1 - pin) * 8 + pout * 8;
      switch (sc.enter || "up") {
        case "zoom": tf = `scale(${lerp(1.12, 1, pin)})`; break;
        case "left": tf = `translateX(${(1 - pin) * 140}px)`; break;
        case "fade": blur = pout * 6; break;
        case "blur": tf = `translateY(${(1 - pin) * 30}px) scale(${lerp(0.96, 1, pin)})`; blur = (1 - pin) * 18 + pout * 14; break;
        case "none": blur = 0; break;
        default: tf = `translateY(${(1 - pin) * 90}px)`;
      }
      tf += ` translateY(${-70 * E.out3(pout)}px) scale(${push * (1 - 0.04 * pout)})`;
      el.style.opacity = a; el.style.transform = tf; el.style.filter = blur > 0.05 ? `blur(${blur}px)` : "";
    }
    return cur;
  }

  function pill(t, cur) {
    const el = $("pill"); if (!el || !C.steps) return;
    const st = C.steps[cur];
    const ids = Object.keys(C.steps), first = C.scenes.find(s => s.id === ids[0]), last = C.scenes.find(s => s.id === ids[ids.length - 1]);
    el.style.opacity = first && last ? prog(t, first.s - 0.05, 0.3) * (1 - prog(t, last.e - 0.2, 0.25)) : 0;
    if (!st) return;
    el.querySelector(".tag").textContent = st[2] ? `STEP ${st[0]}/${st[1]} · ${st[2]}` : `STEP ${st[0]}/${st[1]}`;
    const dashes = el.querySelector(".dashes");
    if (dashes.children.length !== st[1]) dashes.innerHTML = "<i></i>".repeat(st[1]);
    [...dashes.children].forEach((d, i) => (d.className = i < st[0] ? "on" : ""));
  }

  function captions(t, dark) {
    const el = $("cap"), P = C.captions || window.CAPTION_PAGES || [];
    if (!el) return;
    let page = null;
    for (let i = 0; i < P.length; i++) {
      const p = P[i], nx = P[i + 1];
      if (t >= p[0].s - 0.08 && t < Math.min(nx ? nx[0].s - 0.08 : 1e9, p[p.length - 1].e + 0.5)) { page = p; break; }
    }
    if (!page) { el.innerHTML = ""; return; }
    el.innerHTML = page.map(w => {
      if (t >= w.s - 0.04 && t < w.e + 0.06) {
        const s = lerp(0.85, 1.08, E.spring(prog(t, w.s - 0.04, 0.25)));
        return `<span class="on" style="transform:scale(${s})">${w.t}</span>`;
      }
      return `<span style="opacity:${t >= w.e ? 1 : 0.3}">${w.t}</span>`;
    }).join(" ");
    el.classList.toggle("dark", dark);
  }

  function background(t, dk) {
    const b = [["b1", -200, 300, 60, 50, 0.35, 0.3], ["b2", 560, 700, 50, 60, 0.28, 0.33], ["b3", 200, 1300, 70, 40, 0.22, 0.4]];
    b.forEach(([id, x, y, ax, ay, fx, fy]) => {
      const el = $(id); if (!el) return;
      el.style.transform = `translate(${x + ax * Math.sin(t * fx)}px, ${y + ay * Math.cos(t * fy)}px)`;
      el.style.opacity = 0.55 * (1 - dk);
    });
    const d = $("dark"); if (d) d.style.opacity = dk;
    const g1 = $("g1"), g2 = $("g2");
    if (g1) { g1.style.opacity = 0.45 * dk; g1.style.transform = `translate(${-150 + 40 * Math.sin(t * 0.5)}px, 300px)`; }
    if (g2) { g2.style.opacity = 0.35 * dk; g2.style.transform = `translate(600px, ${1100 + 50 * Math.cos(t * 0.5)}px)`; }
    document.querySelectorAll(".spark").forEach((s, i) => (s.style.transform = `translateY(${12 * Math.sin(t * 0.8 + i)}px) rotate(${t * 10 + i * 30}deg)`));
    const gr = $("grain");
    if (gr) { const f = Math.floor(t * 30); gr.style.backgroundPosition = `${(f * 137) % 400}px ${(f * 263) % 400}px`; }
    document.body.classList.toggle("is-dark", dk > 0.5);
  }

  /** call first thing in window.seek */
  R.frame = t => {
    const dk = C.dark ? darkAmount(t) : 0;
    background(t, dk);
    const cur = scenes(t);
    pill(t, cur);
    captions(t, dk > 0.5);
    return { scene: cur, dark: dk };
  };
})();
