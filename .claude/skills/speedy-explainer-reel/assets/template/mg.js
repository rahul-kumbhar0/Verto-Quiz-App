/* mg.js — MOTION GRAPHICS kit, edit level 3 (load AFTER engine.js + fx.js; pair with mg.css). Namespace: Reel.mg (R.mg).
 * After-Effects-grade primitives as pure functions of t (seekable, deterministic, no Math.random):
 *   spring physics · speed ramps · trim-path line draw (with a glowing head) · data packets flowing along paths
 *   · shape-mask reveals and an iris seam · masked word rise · shared-element morph · echo trails
 *   · shockwave rings · burst rays · a living dot-grid field (ripples, beat pulse, parallax)
 *   · hand-drawn scribble circles · highlighter marker · arc gauges.
 * Rules + recipes: references/motion-graphics.md. Demo: assets/examples/mg-demo/ (the LinkedIn reel rebuilt).
 */
(function () {
  const R = window.Reel; if (!R || !R.fx) throw new Error("mg.js needs engine.js + fx.js first");
  const { clamp, prog, lerp, $ } = R, E = R.ease, F = R.fx, hash = F.hash, noise = F.noise;
  const M = (R.mg = {});
  const SVGNS = "http://www.w3.org/2000/svg";

  // ---------- TIME: springs and speed ramps ----------
  /** damped spring 0→1 (overshoots, settles). f = Hz (2–3 snappy), z = damping (0.35 bouncy … 0.8 firm). */
  M.spring = (t, at, o = {}) => {
    const s = t - at; if (s <= 0) return 0;
    const w = 2 * Math.PI * (o.f ?? 2.4), z = o.z ?? 0.5, wd = w * Math.sqrt(1 - z * z);
    const v = 1 - Math.exp(-z * w * s) * (Math.cos(wd * s) + (z * w / wd) * Math.sin(wd * s));
    return s > 4 ? 1 : v;
  };
  /** speed ramp: progress through [at, at+d] that runs FAST → SLOW (hold on the hero) → FAST. k 0..0.95 */
  M.ramp = (t, at, d, k = 0.8) => { const p = prog(t, at, d); return p + (k * Math.sin(2 * Math.PI * p)) / (2 * Math.PI); };

  // ---------- SVG helpers ----------
  /** full-stage SVG layer (1080×1920 user units = px). Put <svg class="mg-svg" id="…"></svg> where you want it in z-order. */
  M.svg = (id) => { const s = $(id); if (!s.getAttribute("viewBox")) s.setAttribute("viewBox", "0 0 1080 1920"); return s; };
  M.path = (svgId, id, d, cls = "mg-line") => { const s = M.svg(svgId); let p = document.getElementById(id);
    if (!p) { p = document.createElementNS(SVGNS, "path"); p.id = id; p.setAttribute("class", cls); s.appendChild(p); } if (p.getAttribute("d") !== d) { p.setAttribute("d", d); p._len = 0; } return p; };
  /** smooth S-curve between two points (connectors) */
  M.curve = (x1, y1, x2, y2, bend = 0.5) => { const dy = (y2 - y1) * bend; return `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`; };
  /** hand-drawn ellipse (scribble circle round a word): slightly more than one turn, deterministic wobble */
  M.ellipse = (cx, cy, rx, ry, seed = 1, turns = 1.12) => { const n = 48, pts = [];
    for (let i = 0; i <= n * turns; i++) { const a = -2.2 + (i / n) * Math.PI * 2, j = 1 + noise(i * 0.35 + seed * 7) * 0.05;
      pts.push(`${(cx + Math.cos(a) * rx * j).toFixed(1)},${(cy + Math.sin(a) * ry * j + i * 0.12).toFixed(1)}`); }
    return "M" + pts.join(" L"); };

  // ---------- LINE DRAW (trim paths) ----------
  /** draws a path/line/circle/rect on in [at, at+d]; o.out = time it un-draws from the tail; o.head = id of a dot riding the tip */
  M.draw = (el, t, at, d = 0.6, o = {}) => {
    el = typeof el === "string" ? document.getElementById(el) : el; if (!el) return 0;
    const L = el._len || (el._len = el.getTotalLength());
    const p = (E[o.ease || "expoInOut"] || E.expoInOut)(prog(t, at, d)), q = o.out != null ? E.power4In(prog(t, o.out, o.outD ?? 0.4)) : 0;
    if (q > 0) { el.style.strokeDasharray = `0 ${L * q} ${Math.max(0, L * (p - q))} ${L}`; el.style.strokeDashoffset = 0; }
    else { el.style.strokeDasharray = `${L} ${L}`; el.style.strokeDashoffset = L * (1 - p); }
    el.style.opacity = p <= 0 || q >= 1 ? 0 : 1;
    if (o.head) { const h = document.getElementById(o.head), pt = el.getPointAtLength(L * p);
      h.setAttribute("cx", pt.x); h.setAttribute("cy", pt.y); h.style.opacity = p > 0 && p < 1 ? 1 : 0; }
    if (o.sfx) R.cue("swish", at);
    return p;
  };

  // ---------- DATA FLOW: packets travelling along a path ----------
  /** n glowing packets loop along a path between [from, to] (fade in/out at the ends of the window and the path) */
  M.flow = (pathEl, t, o = {}) => {
    const p = typeof pathEl === "string" ? document.getElementById(pathEl) : pathEl; if (!p) return;
    const n = o.n ?? 4, sp = o.speed ?? 0.9, from = o.from ?? 0, to = o.to ?? 1e9, L = p._len || (p._len = p.getTotalLength());
    if (!p._pk) { p._pk = Array.from({ length: n }, () => { const c = document.createElementNS(SVGNS, "circle"); c.setAttribute("r", o.r ?? 7); c.setAttribute("class", "mg-pk" + (o.cool ? " cool" : "")); p.parentNode.appendChild(c); return c; }); }
    const win = clamp(prog(t, from, 0.25)) * (1 - prog(t, to - 0.25, 0.25));
    p._pk.forEach((c, i) => { const u = (((t - from) * sp + i / n) % 1 + 1) % 1, pt = p.getPointAtLength(L * u);
      c.setAttribute("cx", pt.x); c.setAttribute("cy", pt.y); c.style.opacity = t < from ? 0 : win * Math.sin(Math.PI * u); });
  };

  // ---------- REVEALS + IRIS SEAM ----------
  /** shape-mask reveal of an element. shape: iris (circle from o.x,o.y) | wipe (left→right) | up | split | diag */
  M.reveal = (el, t, at, o = {}) => {
    el = $(el); const p = (E[o.ease || "expoOut"] || E.expoOut)(prog(t, at, o.d ?? 0.6)), sh = o.shape || "wipe";
    let c = "";
    if (sh === "iris") c = `circle(${(p * (o.r ?? 2300)).toFixed(1)}px at ${o.x ?? 540}px ${o.y ?? 960}px)`;
    else if (sh === "wipe") c = `inset(0 ${(100 - p * 100).toFixed(2)}% 0 0)`;
    else if (sh === "up") c = `inset(${(100 - p * 100).toFixed(2)}% 0 0 0)`;
    else if (sh === "split") c = `inset(0 ${(50 - p * 50).toFixed(2)}% 0 ${(50 - p * 50).toFixed(2)}%)`;
    else if (sh === "diag") { const k = p * 200; c = `polygon(0 0, ${k}% 0, ${k - 100}% 100%, 0 100%)`; }
    el.style.clipPath = p >= 1 ? "" : c; return p;
  };
  /** iris seam: the incoming scene opens as a circle from a point (the thing you just tapped), edge lit by an accent ring.
   *  Put <div class="mg-iris" id="irisRing"></div> in #stage (above #cam). */
  M.iris = (outEl, inEl, t, cut, o = {}) => {
    const d = o.d ?? 0.55, x = o.x ?? 540, y = o.y ?? 960, ring = $(o.ring || "irisRing");
    if (o.sfx !== false) R.cue("whoosh", cut - 0.1);
    if (t < cut || t > cut + d) { $(inEl).style.clipPath = ""; if (ring && ring.dataset.owner === inEl) ring.style.opacity = 0; return; }
    const e = E.expoInOut(prog(t, cut, d)), r = e * 2300;
    $(outEl).style.visibility = "visible"; $(outEl).style.opacity = 1; $(outEl).style.transform = `scale(${1 + 0.06 * e})`; $(outEl).style.filter = `blur(${(6 * e).toFixed(1)}px) brightness(${1 - 0.4 * e})`;
    $(inEl).style.visibility = "visible"; $(inEl).style.opacity = 1; $(inEl).style.clipPath = `circle(${r.toFixed(1)}px at ${x}px ${y}px)`; $(inEl).style.transform = `scale(${1.08 - 0.08 * e})`;
    if (ring) { ring.dataset.owner = inEl; ring.style.opacity = e < 1 ? 1 - e * 0.6 : 0; ring.style.left = x - r + "px"; ring.style.top = y - r + "px"; ring.style.width = ring.style.height = 2 * r + "px"; }
  };

  // ---------- TYPE ----------
  /** masked word rise: each word slides up from behind its own mask line, staggered; *word* = accent. Builds once. */
  M.rise = (el, text, t, at, o = {}) => {
    el = $(el); if (el.dataset.rise !== text) { el.innerHTML = text.split(" ").map(w => { const h = /^\*.*\*$/.test(w);
      return `<span class="mg-mw"><span class="${h ? "h" : ""}">${h ? w.slice(1, -1) : w}</span></span>`; }).join(" "); el.dataset.rise = text; }
    const st = o.stagger ?? 0.06;
    el.querySelectorAll(".mg-mw>span").forEach((w, i) => { const p = M.spring(t, at + i * st, { f: o.f ?? 2.2, z: o.z ?? 0.62 });
      w.style.transform = `translateY(${((1 - p) * 110).toFixed(1)}%) rotate(${((1 - p) * 6).toFixed(2)}deg)`; });
    if (o.out != null) { const q = E.power4In(prog(t, o.out, 0.3)); el.style.opacity = 1 - q; el.style.transform = `translateY(${-q * 40}px)`; }
  };
  /** highlighter: a marker stroke sweeps behind the word (left→right). Adds a .mg-mk child once. */
  M.marker = (el, t, at, o = {}) => { el = $(el); let k = el.querySelector(":scope>.mg-mk");
    if (!k) { k = document.createElement("span"); k.className = "mg-mk" + (o.cool ? " cool" : ""); el.prepend(k); el.classList.add("mg-mkh"); }
    const p = E.expoOut(prog(t, at, o.d ?? 0.35)); k.style.transform = `scaleX(${p})`; return p; };

  // ---------- SHAPE MOTION ----------
  /** shared-element morph: el (position:absolute) travels from box A to box B {x,y,w,h,r} on a spring, with velocity blur */
  M.morph = (el, t, at, A, B, o = {}) => { el = $(el); const sp = { f: o.f ?? 1.9, z: o.z ?? 0.72 };
    const p = M.spring(t, at, sp), pv = M.spring(t - 1 / 30, at, sp), g = k => lerp(A[k], B[k], p);
    el.style.left = g("x") + "px"; el.style.top = g("y") + "px"; el.style.width = g("w") + "px"; el.style.height = g("h") + "px"; el.style.borderRadius = g("r") + "px";
    const v = Math.abs(p - pv) * 60; el.style.filter = v > 0.5 && o.blur !== false ? `blur(${Math.min(8, v * 1.4).toFixed(1)}px)` : "";
    if (o.sfx !== false) R.cue("whoosh", at); return p; };
  /** fly-in on a spring from an offset {x,y,r,s} (cards dealt from a deck, chips flying out of a folder) */
  M.flyT = (t, at, from = {}, o = {}) => { const p = M.spring(t, at, { f: o.f ?? 2.3, z: o.z ?? 0.55 }), q = 1 - p;
    return `translate(${((from.x || 0) * q).toFixed(1)}px,${((from.y || 0) * q).toFixed(1)}px) rotate(${((from.r || 0) * q).toFixed(2)}deg) scale(${lerp(from.s ?? 1, 1, p).toFixed(3)})`; };
  M.fly = (el, t, at, from = {}, o = {}) => { el = $(el); el.style.transform = M.flyT(t, at, from, o);
    el.style.opacity = t < at ? 0 : clamp((t - at) / 0.08); return M.spring(t, at, { f: o.f ?? 2.3, z: o.z ?? 0.55 }); };
  /** animated strike-through: a line sweeps across the word (left→right). Adds a .mg-st child once. */
  M.strike = (el, t, at, o = {}) => { el = $(el); let k = el.querySelector(":scope>.mg-st");
    if (!k) { k = document.createElement("span"); k.className = "mg-st"; el.appendChild(k); el.classList.add("mg-sth"); }
    const p = E.expoOut(prog(t, at, o.d ?? 0.3)); k.style.transform = `scaleX(${p})`; return p; };
  /** echo trail: n ghost copies of el follow the same motion with a lag (AE "Echo"). pos(tt) → CSS transform string. */
  M.trail = (el, t, pos, o = {}) => { el = $(el); const n = o.n ?? 4, lag = o.lag ?? 0.035;
    if (!el._gh) { el._gh = Array.from({ length: n }, () => { const g = el.cloneNode(true); g.removeAttribute("id"); g.querySelectorAll("[id]").forEach(x => x.removeAttribute("id")); g.classList.add("mg-ghost");   // no duplicate ids
      Object.assign(g.style, { position: "absolute", left: el.offsetLeft + "px", top: el.offsetTop + "px", width: el.offsetWidth + "px", margin: 0 });   // out of flow: never pushes the layout
      el.parentNode.insertBefore(g, el); return g; }); }
    el.style.transform = pos(t); el._gh.forEach((g, i) => { const tt = t - (i + 1) * lag, same = pos(tt) === pos(t);
      g.style.transform = pos(tt); g.style.opacity = same ? 0 : (o.a ?? 0.35) * (1 - i / n) * (el.style.opacity === "" ? 1 : +el.style.opacity); }); };

  // ---------- IMPACT GRAPHICS ----------
  /** shockwave: 2 rings expand from (x,y) and fade. layer = any absolutely-positioned full-stage div. */
  M.ring = (layer, t, at, o = {}) => { layer = $(layer); const key = "r" + at;
    if (!layer._rings) layer._rings = {}; let rs = layer._rings[key];
    if (!rs) { rs = layer._rings[key] = [0, 1].map(() => { const r = document.createElement("i"); r.className = "mg-ring" + (o.cool ? " cool" : ""); layer.appendChild(r); return r; }); }
    rs.forEach((r, i) => { const p = prog(t, at + i * 0.09, o.d ?? 0.8), rad = E.expoOut(p) * (o.r ?? 420) * (1 - i * 0.25);
      r.style.left = (o.x ?? 540) - rad + "px"; r.style.top = (o.y ?? 960) - rad + "px"; r.style.width = r.style.height = 2 * rad + "px";
      r.style.opacity = p > 0 && p < 1 ? (1 - p) * (i ? 0.5 : 0.9) : 0; r.style.borderWidth = Math.max(1, 10 * (1 - p)) + "px"; });
    if (o.sfx) R.cue("impact", at, { soft: true }); };
  /** burst rays: n short lines shoot out radially from (x,y) and retract (a star, a win, the big number) */
  M.rays = (svgId, t, at, o = {}) => { const s = M.svg(svgId), key = "ry" + at, n = o.n ?? 14;
    if (!s._rays) s._rays = {}; let ls = s._rays[key];
    if (!ls) { ls = s._rays[key] = Array.from({ length: n }, () => { const l = document.createElementNS(SVGNS, "line"); l.setAttribute("class", "mg-ray"); s.appendChild(l); return l; }); }
    const p = prog(t, at, o.d ?? 0.6), a = E.expoOut(p), b = E.power3In(clamp((p - 0.25) / 0.75));
    ls.forEach((l, i) => { const ang = (i / n) * Math.PI * 2 + (o.rot ?? 0.2), r0 = o.r0 ?? 150, len = (o.len ?? 120) * (i % 2 ? 0.7 : 1);
      const ra = r0 + len * b, rb = r0 + len * a, cx = o.x ?? 540, cy = o.y ?? 960;
      l.setAttribute("x1", cx + Math.cos(ang) * ra); l.setAttribute("y1", cy + Math.sin(ang) * ra); l.setAttribute("x2", cx + Math.cos(ang) * rb); l.setAttribute("y2", cy + Math.sin(ang) * rb);
      l.style.opacity = p > 0 && p < 1 ? 1 : 0; }); };
  /** arc gauge 0→value/max on a <circle class="mg-arc"> (score out of 100, % done). Returns the live number. */
  M.gauge = (el, t, at, d, value, max = 100) => { el = $(el); const r = +el.getAttribute("r"), C = 2 * Math.PI * r, p = E.expoOut(prog(t, at, d)) * value / max;
    el.style.strokeDasharray = `${C * p} ${C}`; el.style.opacity = t < at ? 0 : 1; return Math.round(p * max); };

  /** first-frame headline: big type that rises on frame 0 (hook #7/#8) and exits at o.out; "|" = line break, *word* = accent */
  M.headline = (el, text, t, o = {}) => { el = $(el); const lines = text.split("|"), at = o.at ?? 0.02;
    if (el.dataset.hl !== text) { el.innerHTML = lines.map(() => "<div></div>").join(""); el.dataset.hl = text; }
    lines.forEach((ln, i) => M.rise(el.children[i], ln.trim(), t, at + i * (o.lineGap ?? 0.12), { stagger: o.stagger ?? 0.07, f: 2.1, z: 0.66 }));
    const q = o.out != null ? E.power3In(prog(t, o.out, o.outD ?? 0.32)) : 0;
    el.style.opacity = t < at ? 0 : 1 - q; el.style.transform = `translateY(${(-q * 140).toFixed(1)}px) scale(${(1 - q * 0.08).toFixed(3)})`; el.style.visibility = q >= 1 ? "hidden" : "visible";
    if (o.sfx !== false && o.out != null) R.cue("swish", o.out); return q; };

  // ---------- EDITORIAL (paper mode): word pairs, tear, ticks, underline ----------
  /** word pair: a sans line + an italic serif accent line, both masked-rise. M.pair("id","Stop paying.","for tutorials.",t,at,{out}) */
  M.pair = (el, a, b, t, at, o = {}) => { el = $(el); const key = a + "|" + b;
    if (el.dataset.pair !== key) { el.innerHTML = `<span class="e-a"></span><span class="e-b"></span>`; el.dataset.pair = key; }
    M.rise(el.children[0], a, t, at, { stagger: o.stagger ?? 0.07 }); M.rise(el.children[1], b, t, at + (o.gap ?? 0.22), { stagger: o.stagger ?? 0.07 });
    const q = o.out != null ? E.power4In(prog(t, o.out, 0.3)) : 0; el.style.opacity = t < at ? 0 : 1 - q; el.style.transform = `translateY(${(-q * 40).toFixed(1)}px)`; };
  /** tear: the element rips down a jagged centre line; the halves fall apart and fade. el = position:absolute card. */
  M.tear = (el, t, at, o = {}) => { el = $(el); const d = o.d ?? 1.0;
    if (!el._tear) { const n = o.n ?? 11, pts = []; for (let i = 0; i <= n; i++) pts.push([50 + (i % 2 ? -1 : 1) * (o.jag ?? 3) * (0.5 + 0.5 * Math.abs(hash(i + 1))), (i / n) * 100]);
      const line = pts.map(p => `${p[0].toFixed(1)}% ${p[1].toFixed(1)}%`).join(",");
      el._tear = [-1, 1].map(side => { const g = el.cloneNode(true); g.removeAttribute("id"); g.querySelectorAll("[id]").forEach(x => x.removeAttribute("id")); g.classList.add("mg-tear");
        Object.assign(g.style, { position: "absolute", left: el.offsetLeft + "px", top: el.offsetTop + "px", width: el.offsetWidth + "px", height: el.offsetHeight + "px", margin: 0, opacity: 0 });
        g.style.clipPath = side < 0 ? `polygon(0 0,${line},0 100%)` : `polygon(100% 0,${line},100% 100%)`; el.parentNode.appendChild(g); return g; }); }
    const p = prog(t, at, d);
    if (p <= 0) { el.style.visibility = ""; el._tear.forEach(g => (g.style.opacity = 0)); return 0; }
    el.style.visibility = "hidden"; const sep = E.expoOut(clamp(p * 2.2)), fall = p * p;
    el._tear.forEach((g, i) => { const s = i ? 1 : -1; g.style.opacity = 1 - clamp((p - 0.65) / 0.35);
      g.style.transform = `translate(${(s * (26 + 34 * sep)).toFixed(1)}px,${(30 * sep + 760 * fall).toFixed(1)}px) rotate(${(s * (5 + 16 * fall)).toFixed(2)}deg)`; });
    if (o.sfx !== false) R.cue("impact", at, { soft: true }); return p; };
  /** progress ticks: n bars, bar i turns on at times[i] */
  M.ticks = (el, t, times) => { el = $(el); if (el.children.length !== times.length) el.innerHTML = times.map(() => "<i></i>").join("");
    [...el.children].forEach((c, i) => c.classList.toggle("on", t >= times[i])); };
  /** underline: an accent line draws under a word (adds a .mg-ul child once) */
  M.underline = (el, t, at, o = {}) => { el = $(el); let u = el.querySelector(":scope>.mg-ul");
    if (!u) { u = document.createElement("i"); u.className = "mg-ul"; el.appendChild(u); el.classList.add("mg-ulh"); }
    const p = E.expoOut(prog(t, at, o.d ?? 0.35)); u.style.transform = `scaleX(${p})`; return p; };
  /** strike + replace: the old word (italic serif) gets struck, the new word springs in over it. el = .e-swap with .was and .now */
  M.swap = (el, t, at, o = {}) => { el = $(el); const was = el.querySelector(".was"), now = el.querySelector(".now");
    M.strike(was, t, at, { d: 0.25 }); was.style.opacity = 1 - 0.75 * prog(t, at + 0.15, 0.3);
    now.style.display = t >= at + 0.2 ? "" : "none"; M.fly(now, t, at + 0.2, { y: -30, s: 0.6 }, { f: 2.8, z: 0.45 }); };

  // ---------- LIVING BACKGROUND: dot-grid field ----------
  /** <canvas id="mgGrid" class="mg-grid" width="1080" height="1920"> right after .s-bg.
   *  o.waves: [[t0, x, y, amp?]] shockwaves through the field · o.pulse: 0..1 (F.pulse on the beat) · o.cam: {x,y} parallax
   *  o.light: true in light chapters · o.focus: [x,y] warm spot that follows the hero */
  M.grid = (id, t, o = {}) => {
    const cv = $(id); if (!cv) return; const g = cv.getContext("2d"), W = cv.width, H = cv.height, gap = o.gap ?? 60;
    g.clearRect(0, 0, W, H);
    const px = ((o.cam?.x ?? 0) * 0.35) % gap, py = ((o.cam?.y ?? 0) * 0.35 + t * (o.drift ?? 6)) % gap, pulse = o.pulse ?? 0, lt = !!o.light;
    const waves = (o.waves || []).filter(w => t >= w[0] && t < w[0] + 2.2), fx = o.focus || [540, 900];
    for (let y = -gap; y < H + gap; y += gap) for (let x = -gap; x < W + gap; x += gap) {
      let X = x + px, Y = y + py, glow = 0;
      for (const [t0, wx, wy, amp = 1] of waves) { const r = (t - t0) * 1500, dx = X - wx, dy = Y - wy, dist = Math.hypot(dx, dy) || 1;
        const k = Math.exp(-Math.pow((dist - r) / 90, 2)) * Math.exp(-(t - t0) * 1.6) * amp; X += (dx / dist) * 22 * k; Y += (dy / dist) * 22 * k; glow = Math.max(glow, k); }
      const f = Math.exp(-Math.pow(Math.hypot(X - fx[0], Y - fx[1]) / 520, 2)), base = (lt ? 0.10 : 0.07) + f * (lt ? 0.08 : 0.10) + pulse * 0.06;
      const a = Math.min(1, base + glow * 0.75), rr = 2.1 + glow * 3 + pulse * 0.6;
      g.fillStyle = glow > 0.12 ? `rgba(240,165,133,${a})` : lt ? `rgba(40,30,20,${a})` : `rgba(243,241,236,${a})`;
      g.beginPath(); g.arc(X, Y, rr, 0, 6.2832); g.fill(); }
  };
})();
