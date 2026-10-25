/* Drivers for props.css (load after speedy.js). All pure functions of t.
 *
 *   R.stack(el,t,{at,discs,core,base,explode,spin})  build + raise + split the database stack
 *   R.callout(el,t,at,{from})                        label + leader line flies in
 *   R.rays(el,t,at) · R.rings(el,t,[times])          floor petals · shockwaves
 *   R.bolt(el,t,at) · R.bokehDrift(el,t)             glyph pop + glow · backdrop drift
 *   R.fans(el,t) · R.dial(el,t,{at,dur,label})       spinning fans · countdown dial
 *   R.rack(el... )  (rackbar uses R.card)            —
 *   R.fibers(svg,t,{at,n,x1,y1,x2,y2,sweep})         fiber stream with flowing particles
 *   R.lanes(el,t,{at,busy:[[lane,a,b],…]})           connection lanes light up while borrowed
 */
(function () {
  const R = window.Reel, { clamp, prog, lerp, ease: E, $ } = R;
  const rnd = (seed => () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)(42);

  // ---------- database stack ----------
  /** o: {discs:5, dh:86, overlap:58, coreH:120, at, explode, spin:12} — builds once, then:
      discs rise in bottom-up at `at`, split apart at `explode` (gap grows), slats slowly scroll */
  R.stack = (el, t, o = {}) => {
    el = $(el);
    const n = o.discs ?? 5, dh = o.dh ?? 96, ov = o.overlap ?? 50, coreH = o.coreH ?? 130, baseH = o.baseH ?? 100;
    if (!el.dataset.built) {
      let html = `<div class="base"><i class="side"></i><i class="top"></i></div>`;
      html += `<div class="core"><i class="side"></i><i class="top"></i><span class="pg">🐘</span></div>`;
      for (let i = 0; i < n; i++) {
        let leds = "";
        for (let k = 0; k < 4; k++) leds += `<i class="led" style="left:${12 + rnd() * 76}%;top:${58 + rnd() * 30}%"></i>`;
        html += `<div class="disc" data-i="${i}"><i class="side"></i><i class="top"></i>${leds}</div>`;
      }
      el.innerHTML = html; el.dataset.built = 1;
    }
    const a = o.at ?? 0, ex = o.explode != null ? E.inOut(prog(t, o.explode, 0.6)) : 1, gap = (o.gap ?? 20) * ex;
    const H = +el.style.width.replace("px", "") || 420;    // disc ellipse height scales with width
    const topE = dh * 0.56;
    const baseY = 0;                                        // we lay out bottom-up from el's bottom
    const put = (node, y, h, pin, dy) => {
      node.style.bottom = y + "px"; node.style.height = h + "px";
      node.style.opacity = pin;
      node.style.transform = `translateY(${(1 - pin) * (dy ?? 60)}px) scaleY(${lerp(0.6, 1, pin)})`;
    };
    const base = el.querySelector(".base"), core = el.querySelector(".core");
    put(base, 0, baseH, E.out3(prog(t, a, 0.5)), 40);
    put(core, baseH - 34 + gap, coreH, E.out3(prog(t, a + 0.12, 0.5)), 60);
    el.querySelectorAll(".disc").forEach(d => {
      const i = +d.dataset.i, pin = E.spring(prog(t, a + 0.22 + i * 0.09, 0.5));
      put(d, baseH - 34 + coreH - 30 + i * (dh - ov) + gap * (2 + i), dh, clamp(pin * 1.4), 90);
      // slats drift sideways slowly so the stack feels alive
      d.querySelector(".side").style.backgroundPosition = `${(t * (o.spin ?? 10)) % 13}px 0`;
    });
    base.querySelector(".side").style.backgroundPosition = `${(t * (o.spin ?? 10) * 0.7) % 15}px 0`;
  };

  /** label + leader line + dot flying in from its side ("from" = "left"|"right") */
  R.callout = (el, t, a, o = {}) => {
    el = $(el); const p = E.out3(prog(t, a, 0.45));
    const from = o.from ?? (el.classList.contains("r") ? "right" : "left"), s = from === "left" ? -1 : 1;
    el.style.opacity = p;
    el.style.transform = `translateX(${(1 - p) * s * 90}px)`;
    el.style.filter = p < 1 ? `blur(${(1 - p) * 8}px)` : "";
    if (p > 0) R.cue("pop", a, { soft: true });
  };

  /** floor petals fan out around the base */
  R.rays = (el, t, a) => {
    el = $(el);
    if (!el.dataset.built) {
      let h = `<i class="pool"></i>`;
      for (let i = 0; i < 10; i++) h += `<i class="ray" data-a="${i * 36 + 8}"></i>`;
      el.innerHTML = h; el.dataset.built = 1;
    }
    el.querySelectorAll(".ray").forEach((r, i) => {
      const p = E.out3(prog(t, a + i * 0.04, 0.5));
      r.style.opacity = p * 0.8;
      r.style.transform = `rotate(${+r.dataset.a}deg) scaleY(0.34) scaleX(${lerp(0.3, 1, p)})`;
    });
    el.querySelector(".pool").style.opacity = E.out3(prog(t, a, 0.6));
  };

  /** expanding shockwave rings on the floor */
  R.rings = (el, t, times) => {
    el = $(el);
    if (!el.dataset.rings) { el.insertAdjacentHTML("beforeend", times.map(() => `<i class="ring"></i>`).join("")); el.dataset.rings = 1; }
    el.querySelectorAll(".ring").forEach((r, i) => {
      const p = prog(t, times[i], 0.9);
      r.style.opacity = p > 0 && p < 1 ? (1 - p) * 0.8 : 0;
      r.style.transform = `scale(${lerp(0.4, 2.6, E.out3(p))})`;
      R.cue("whoosh", times[i]);
    });
  };

  const BOLT = `<svg viewBox="0 0 109 113" xmlns="http://www.w3.org/2000/svg"><path d="M63.7 110.3c-2.8 3.6-8.6 1.6-8.7-3l-1-67h45.1c8.2 0 12.7 9.4 7.7 15.9z" fill="#3ECF8E"/><path d="M45.3 2.1c2.9-3.6 8.7-1.6 8.7 3l.5 67H9.8C1.6 72.1-3 62.7 2.1 56.2z" fill="#4EE39E"/></svg>`;
  /** bolt glyph pop with glow bloom; add class "refl" on the mirrored copy */
  R.bolt = (el, t, a) => {
    el = $(el); if (!el.dataset.built) { el.innerHTML = BOLT; el.dataset.built = 1; }
    const p = E.spring(prog(t, a, 0.5));
    el.style.opacity = clamp(p * 1.6) * (el.classList.contains("refl") ? 0.35 : 1);
    const base = el.classList.contains("refl") ? "scaleY(-1) " : "";
    el.style.transform = base + `scale(${lerp(0.4, 1, p)}) rotate(${(1 - p) * -20}deg)`;
    if (!el.classList.contains("refl")) R.cue("ding", a);
  };

  /** bokeh glyph backdrop: builds once from a seeded layout, drifts very slowly */
  R.bokehDrift = (el, t) => {
    el = $(el);
    if (!el.dataset.built) {
      const G = ["id", "42", "sql", "{ }", "0x1A", "row", "::", "key", "01", "ack", "fk", "db"];
      let h = "";
      for (let i = 0; i < 26; i++) {
        const big = i % 5 === 0;
        h += `<i class="${big ? "big" : ""}" data-s="${(rnd() * 2 - 1).toFixed(2)}" style="left:${rnd() * 92}%;top:${rnd() * 70}%">${G[i % G.length]}</i>`;
      }
      el.innerHTML = h; el.dataset.built = 1;
    }
    el.querySelectorAll("i").forEach((g, i) => { g.style.transform = `translateY(${8 * Math.sin(t * 0.3 + i)}px)`; });
  };

  // ---------- server tray ----------
  R.fans = (el, t) => { $(el).querySelectorAll(".fan i").forEach((f, i) => (f.style.transform = `rotate(${t * (260 + i * 40)}deg)`)); };

  /** countdown dial: fills over dur after at, label = mm:ss remaining */
  R.dial = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) { el.innerHTML = `<i></i><span></span>`; el.dataset.built = 1; }
    const p = clamp(prog(t, o.at, o.dur ?? 2));
    el.style.opacity = E.out3(prog(t, o.show ?? o.at - 0.3, 0.4)) * (1 - prog(t, o.hide ?? 1e9, 0.3));
    el.querySelector("i").style.setProperty("--p", p * 100 + "%");
    const left = Math.max(0, Math.round((o.secs ?? 120) * (1 - p)));
    el.querySelector("span").textContent = o.label ?? `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  };

  // ---------- pooler fiber stream ----------
  /** svg el sized/positioned absolutely; o = {at, n:14, x1,y1 (grid right edge), x2,y2 (ring centre), spreadY} */
  R.fibers = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      let defs = `<defs><linearGradient id="figrad" gradientUnits="userSpaceOnUse" x1="${o.x1}" y1="0" x2="${o.x2}" y2="0"><stop offset="0" stop-color="rgba(62,207,142,.1)"/><stop offset="1" stop-color="rgba(62,207,142,.8)"/></linearGradient></defs>`;
      let paths = "", dots = "";
      const n = o.n ?? 14;
      for (let i = 0; i < n; i++) {
        const y1 = o.y1 + (i - n / 2) * (o.spreadY ?? 36) / (n / 14), c = (o.x1 + o.x2) / 2;
        paths += `<path data-i="${i}" d="M${o.x1} ${y1} C ${c} ${y1}, ${c} ${o.y2}, ${o.x2} ${o.y2}"/>`;
        dots += `<circle data-i="${i}" r="${3 + rnd() * 2.5}"/>`;
      }
      el.innerHTML = defs + paths + dots; el.dataset.built = 1;
      el.querySelectorAll("path").forEach(p => { p.dataset.len = p.getTotalLength(); });
    }
    const pin = E.out3(prog(t, o.at, 0.7));
    el.style.opacity = pin;
    el.querySelectorAll("path").forEach(p => {
      const L = +p.dataset.len; p.style.strokeDasharray = L; p.style.strokeDashoffset = L * (1 - pin);
      p.style.opacity = 0.35 + 0.3 * Math.sin(t * 2 + +p.dataset.i);
    });
    el.querySelectorAll("circle").forEach(c => {
      const i = +c.dataset.i, path = el.querySelector(`path[data-i="${i}"]`), L = +path.dataset.len;
      const u = ((t * (0.55 + (i % 5) * 0.12) + i * 0.17) % 1) * pin;
      const pt = path.getPointAtLength(u * L);
      c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y);
      c.style.opacity = pin * (0.4 + 0.6 * Math.sin(Math.PI * u));
    });
  };

  /** connection lanes: lane `i` lights + pulses while borrowed (busy windows) */
  R.lanes = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      el.innerHTML = `<div style="display:flex;align-items:center;gap:14px;font:700 34px Mono;color:#3ECF8E;padding:4px 6px 10px"><span style="font-size:30px">🐘</span><span style="margin-left:auto" class="cnt">0</span></div>` +
        Array.from({ length: o.count ?? 8 }, (_, i) => `<div class="lane" data-i="${i}"><span>${i + 1}</span><i class="pulse"></i><b></b></div>`).join("");
      el.dataset.built = 1;
    }
    R.card(el, t, { in: o.at });
    (o.busy || []).forEach(([i, a, b]) => {
      const lane = el.querySelector(`.lane[data-i="${i}"]`); if (!lane) return;
      const on = t >= a && t < b;
      lane.classList.toggle("busy", on);
      const pl = lane.querySelector(".pulse"), u = ((t - a) * 1.6) % 1;
      pl.style.opacity = on ? 0.9 : 0;
      pl.style.transform = `translateX(${u * (lane.offsetWidth + 60) - 60}px)`;
      if (on) R.cue("pop", a, { soft: true });
    });
    if (o.cnt != null) el.querySelector(".cnt").textContent = o.cnt(t);
  };
})();

/* ---------- generic any-topic primitives (appended) ---------- */
(function () {
  const R = window.Reel, { clamp, prog, lerp, ease: E, $ } = R;

  /** 3D box. o:{at, w,h,d (px), label, icon, side, spin}. Assembles with a spring, idles with a slow sway. */
  R.box = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      const s0 = o.w ?? o.size ?? 230;                      // a true cube: one size for every face
      el.style.width = s0 + "px"; el.style.height = s0 + "px";
      el.innerHTML = `<div class="cube">
        <div class="f front">${o.icon ? `<span class="ic">${o.icon}</span>` : o.label ?? ""}</div>
        <div class="f top"></div><div class="f side">${o.side ?? ""}</div></div>`;
      const c = el.querySelector(".cube");
      c.querySelector(".front").style.transform = `translateZ(${s0 / 2}px)`;
      c.querySelector(".top").style.transform = `rotateX(90deg) translateZ(${s0 / 2}px)`;
      c.querySelector(".side").style.transform = `rotateY(-90deg) translateZ(${s0 / 2}px)`;
      el.dataset.built = 1;
    }
    const p = E.spring(prog(t, o.at, 0.55));
    el.style.opacity = clamp(p * 1.6);
    el.querySelector(".cube").style.transform =
      `rotateX(${-24 + 2 * Math.sin(t * 0.7)}deg) rotateY(${32 + (o.spin ? t * o.spin : 3 * Math.sin(t * 0.5))}deg) scale(${lerp(0.5, 1, p)}) translateY(${(1 - p) * 60}px)`;
    if (p > 0) R.cue("pop", o.at);
  };

  /** chip (CPU/GPU/model). o:{at, size, label, pins} */
  R.chip = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      const s = o.size ?? 260, n = o.pins ?? 7; el.style.width = s + "px"; el.style.height = s + "px";
      let pins = "";
      for (let i = 0; i < n; i++) {
        const u = 18 + (i * (s - 36 - 8)) / (n - 1);
        pins += `<i class="pin" style="left:${u}px;top:-14px"></i><i class="pin" style="left:${u}px;bottom:-14px"></i>` +
                `<i class="pin" style="top:${u}px;left:-14px;width:16px;height:8px"></i><i class="pin" style="top:${u}px;right:-14px;width:16px;height:8px"></i>`;
      }
      el.innerHTML = pins + `<div class="body"><div class="die">${o.label ?? ""}</div></div>`;
      el.dataset.built = 1;
    }
    const p = E.spring(prog(t, o.at, 0.5));
    el.style.opacity = clamp(p * 1.6);
    el.style.transform = `scale(${lerp(0.6, 1, p)}) rotate(${(1 - p) * -8}deg)`;
    const die = el.querySelector(".die");
    die.style.boxShadow = `0 0 ${26 + 10 * Math.sin(t * 3)}px rgba(62,207,142,.45), inset 0 0 18px rgba(62,207,142,.3)`;
    if (p > 0) R.cue("pop", o.at);
  };

  /** globe. o:{at, size, pins:[{x,y,alt,at}], arc:{from:i,to:j,at}, spinBg} — x,y in % of the globe */
  R.globe = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      const s = o.size ?? 480; el.style.width = s + "px"; el.style.height = s + "px";
      el.innerHTML = `<i class="dots"></i><i class="shade"></i>` +
        (o.pins || []).map((p, i) => `<i class="pin ${p.alt ? "alt" : ""}" data-i="${i}" style="left:${p.x}%;top:${p.y}%"></i>`).join("") +
        `<svg viewBox="0 0 100 100" preserveAspectRatio="none"><path id="${el.id}_arc" d=""/><circle r="2.2" opacity="0"/></svg>`;
      el.dataset.built = 1;
    }
    const pin = E.out3(prog(t, o.at, 0.6));
    el.style.opacity = pin;
    el.style.transform = `scale(${lerp(0.92, 1, pin)})`;
    el.querySelector(".dots").style.backgroundPosition = `${(t * (o.spinBg ?? 6)) % 17}px 0`;
    (o.pins || []).forEach((p, i) => {
      const e = E.spring(prog(t, p.at ?? o.at + 0.3 + i * 0.15, 0.4));
      const n = el.querySelector(`.pin[data-i="${i}"]`);
      n.style.opacity = clamp(e * 2); n.style.transform = `translate(-50%,-50%) scale(${lerp(0.3, 1, e)})`;
      if (e > 0) R.cue("pop", p.at ?? o.at + 0.3 + i * 0.15, { soft: true });
    });
    if (o.arc) {
      const A = o.pins[o.arc.from], B = o.pins[o.arc.to];
      const path = el.querySelector("path");
      const mx = (A.x + B.x) / 2, my = Math.min(A.y, B.y) - (o.arc.lift ?? 26);
      path.setAttribute("d", `M${A.x} ${A.y} Q ${mx} ${my}, ${B.x} ${B.y}`);
      path.setAttribute("vector-effect", "non-scaling-stroke");
      if (!path.dataset.len) path.dataset.len = path.getTotalLength();
      const L = +path.dataset.len, dp = E.inOut(prog(t, o.arc.at, o.arc.d ?? 0.9));
      path.style.strokeDasharray = L; path.style.strokeDashoffset = L * (1 - dp);
      path.style.strokeWidth = 1.6;                       // viewBox units
      const dot = el.querySelector("circle");
      const u = clamp(dp) * 0.999, pt = L ? path.getPointAtLength(u * L) : { x: 0, y: 0 };
      dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
      dot.setAttribute("opacity", dp > 0 && dp < 1 ? 1 : 0);
    }
  };

  /** packets flowing along an arbitrary SVG path. o:{at, path:"M…", n, speed, doc, size, hide} */
  R.flow = (el, t, o) => {
    el = $(el);
    if (!el.dataset.built) {
      el.innerHTML = `<svg style="position:absolute;inset:0;overflow:visible" width="100%" height="100%"><path class="track" d="${o.path}"/></svg>` +
        Array.from({ length: o.n ?? 5 }, () => `<i class="pk ${o.doc ? "doc" : ""}"></i>`).join("");
      const p = el.querySelector("path"); el.dataset.len = p.getTotalLength(); el.dataset.built = 1;
    }
    const pin = E.out3(prog(t, o.at, 0.5)) * (1 - prog(t, o.hide ?? 1e9, 0.3));
    const path = el.querySelector("path"), L = +el.dataset.len;
    path.style.opacity = pin;
    el.querySelectorAll(".pk").forEach((k, i) => {
      const u = ((t * (o.speed ?? 0.35) + i / (o.n ?? 5)) % 1);
      const pt = path.getPointAtLength(u * L), pt2 = path.getPointAtLength(Math.min(L, u * L + 2));
      const ang = Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180 / Math.PI;
      k.style.opacity = pin * (u < 0.06 || u > 0.94 ? 0 : 1);
      k.style.transform = `translate(${pt.x - 13}px, ${pt.y - 9}px) rotate(${ang}deg) scale(${o.size ?? 1})`;
    });
  };
})();
