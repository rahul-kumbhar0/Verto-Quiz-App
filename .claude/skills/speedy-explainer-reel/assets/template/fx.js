/* fx.js — advanced editing kit for speedy reels (load AFTER engine.js; pair with fx.css).
 * Everything is a pure function of t (seekable), deterministic (no Math.random), and registers
 * sound cues so sfx.py layers the right sound under every move. Namespace: Reel.fx (R.fx).
 * Reference + rules: references/advanced-editing.md. Demo: assets/examples/fx-demo/.
 */
(function () {
  const R = window.Reel; if (!R) throw new Error("fx.js needs engine.js first");
  const { clamp, prog, lerp, $ } = R;
  const F = (R.fx = {});
  // ---------- easing (adds to R.ease) ----------
  Object.assign(R.ease, {
    expoOut: p => (p >= 1 ? 1 : 1 - Math.pow(2, -10 * p)),
    expoInOut: p => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2),
    backOut: (p, s = 1.9) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2),
    elastic: p => (p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
    // GSAP-equivalent powers (HyperFrames motion doctrine: arrive on power4/expo.out, exits power3/4.in, camera power2.inOut)
    power2InOut: p => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
    power3In: p => p * p * p, power4In: p => p * p * p * p,
    power4Out: p => 1 - Math.pow(1 - p, 4),
  });
  const E = R.ease;
  // deterministic noise: hash(i) in [-1,1], smooth noise for shakes/drift
  const hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return (x - Math.floor(x)) * 2 - 1; };
  const noise = x => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return lerp(hash(i), hash(i + 1), u); };
  F.noise = noise; F.hash = hash;

  // ---------- CAMERA: keyframed virtual camera with auto motion blur ----------
  /** keys: [{t, x, y, z, rx, ry, rz, s, ease}] on a wrapper (a scene or a .q3-g group).
   *  Always add drift:true for the "camera is never locked off" feel (tiny handheld float). */
  F.cam = (el, t, keys, o = {}) => {
    el = $(el); if (!el || !keys.length) return;
    const val = tt => {
      let k0 = keys[0], k1 = keys[0], p = 0;
      for (let i = 0; i < keys.length - 1; i++) if (tt >= keys[i].t) { k0 = keys[i]; k1 = keys[i + 1]; p = clamp((tt - k0.t) / Math.max(0.001, k1.t - k0.t)); }
      if (tt >= keys[keys.length - 1].t) { k0 = k1 = keys[keys.length - 1]; p = 1; }
      const e = (E[k1.ease || "expoInOut"] || E.expoInOut)(p), g = k => lerp(k0[k] ?? (k === "s" ? 1 : 0), k1[k] ?? (k === "s" ? 1 : 0), e);
      return { x: g("x"), y: g("y"), z: g("z"), rx: g("rx"), ry: g("ry"), rz: g("rz"), s: g("s") };
    };
    const a = val(t), b = val(t - 1 / 30);
    const dx = o.drift ? noise(t * 0.6) * 10 : 0, dy = o.drift ? noise(t * 0.5 + 9) * 8 : 0, dr = o.drift ? noise(t * 0.4 + 3) * 0.6 : 0;
    el.style.transform = `perspective(${o.persp || 1600}px) translate3d(${a.x + dx}px,${a.y + dy}px,${a.z}px) rotateX(${a.rx}deg) rotateY(${a.ry}deg) rotateZ(${a.rz + dr}deg) scale(${a.s})`;
    const speed = Math.hypot(a.x - b.x, a.y - b.y) + Math.abs(a.z - b.z) * 0.5 + Math.abs(a.s - b.s) * 600 + (Math.abs(a.ry - b.ry) + Math.abs(a.rx - b.rx)) * 6;
    const blur = o.mblur === false ? 0 : Math.min(14, Math.max(0, speed - 8) * 0.35);
    el.style.filter = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "";
    keys.forEach((k, i) => { if (i && k.whoosh !== false && Math.abs((k.x || 0) - (keys[i - 1].x || 0)) + Math.abs((k.s || 1) - (keys[i - 1].s || 1)) * 500 > 120) R.cue("whoosh", keys[i - 1].t + 0.05); });
  };
  /** camera shake that decays (impact, drop, "boom" words) */
  F.shake = (el, t, at, o = {}) => {
    el = $(el); const d = o.d ?? 0.45, amp = o.amp ?? 16, p = prog(t, at, d);
    if (o.sfx !== false) R.cue("impact", at);
    if (p <= 0 || p >= 1) { el.style.translate = ""; el.style.rotate = ""; return; }   // independent props: compose with any transform
    const k = Math.pow(1 - p, 2), f = t * 38;
    el.style.translate = `${noise(f) * amp * k}px ${noise(f + 50) * amp * k}px`; el.style.rotate = `${noise(f + 99) * amp * 0.08 * k}deg`;
  };

  // ---------- TRANSITIONS (overlay-based; put <div id="fxOverlay"></div> last in #stage) ----------
  const overlay = () => { let o = $("fxOverlay"); if (!o) { o = document.createElement("div"); o.id = "fxOverlay"; $("stage").appendChild(o); } return o; };
  /** whip pan: outgoing slides+streaks out, incoming streaks in. Use between list items / "next". */
  F.whip = (outEl, inEl, t, at, o = {}) => {
    const d = o.d ?? 0.32, dir = o.dir ?? -1, p = prog(t, at - d / 2, d), e = E.expoInOut(p);
    const W = 1080 * 1.15 * dir; if (o.sfx !== false) R.cue("swish", at - d / 2);
    const set = (el, x, show) => { el = $(el); if (!el) return; el.style.transform = `translateX(${x}px) skewX(${-dir * 8 * Math.sin(Math.PI * p)}deg)`;
      el.style.filter = p > 0 && p < 1 ? `blur(${(Math.sin(Math.PI * p) * 22).toFixed(1)}px)` : ""; el.style.opacity = show ? 1 : 0; };
    if (p <= 0) { set(outEl, 0, true); set(inEl, -W, false); return; }
    if (p >= 1) { set(outEl, W, false); set(inEl, 0, true); return; }
    set(outEl, e * W, true); set(inEl, (e - 1) * W, true);
  };
  /** dive ("object becomes the world"): a point/card of the outgoing scene grows past the frame and the next scene grows out of it */
  F.dive = F.zoomThrough = (outEl, inEl, t, at, o = {}) => {
    const d = o.d ?? 0.55, p = prog(t, at - d / 2, d), [ox, oy] = o.origin || [540, 960];
    const a = $(outEl), b = $(inEl);
    if (a) { a.style.transformOrigin = `${ox}px ${oy}px`; const q = E.expoInOut(clamp(p * 1.6)); a.style.transform = `scale(${1 + q * 7})`; a.style.opacity = 1 - clamp((p - 0.35) * 3); a.style.filter = p > 0 && p < 1 ? `blur(${q * 18}px)` : ""; }
    if (b) { b.style.transformOrigin = `${ox}px ${oy}px`; const q = E.expoOut(clamp((p - 0.35) / 0.65)); b.style.transform = `scale(${lerp(0.25, 1, q)})`; b.style.opacity = clamp((p - 0.3) * 4); b.style.filter = q < 1 && p > 0.3 ? `blur(${(1 - q) * 16}px)` : ""; }
    if (o.sfx !== false) { R.cue("riser", at - d / 2 - 0.4, { t2: at }); R.cue("impact", at); }
  };
  /** white/colour flash (surprise, reveal, beat drop) */
  F.flash = (t, at, o = {}) => {
    const ov = overlay(), d = o.d ?? 0.35, p = prog(t, at, d), id = "flash" + at;
    if (o.sfx !== false) R.cue("impact", at, { soft: true });
    if (p > 0 && p < 1) { ov.dataset.owner = id; ov.style.mixBlendMode = "normal"; ov.style.background = o.color || "#fff"; ov.style.opacity = Math.pow(1 - p, 2) * (o.max ?? 0.85); }
    else if (ov.dataset.owner === id) { ov.style.opacity = 0; ov.dataset.owner = ""; }
  };
  /** light leak sweep (warm film burn across the frame) — soft, premium transition accent */
  F.leak = (t, at, o = {}) => {
    const ov = overlay(), d = o.d ?? 0.8, p = prog(t, at, d), id = "leak" + at;
    if (p > 0 && p < 1) { ov.dataset.owner = id;
      ov.style.background = `radial-gradient(60% 45% at ${lerp(-20, 120, p)}% ${lerp(30, 70, p)}%, ${o.color || "rgba(255,150,70,.95)"}, rgba(255,60,120,.35) 45%, transparent 75%)`;
      ov.style.mixBlendMode = "screen"; ov.style.opacity = Math.sin(Math.PI * p) * (o.max ?? 0.75); }
    else if (ov.dataset.owner === id) { ov.style.opacity = 0; ov.dataset.owner = ""; }
  };
  /** glitch: RGB split + slice jitter for d seconds (code, error, hack, "wait what") */
  F.glitch = (el, t, at, o = {}) => {
    el = $(el); const d = o.d ?? 0.35, p = prog(t, at, d); if (o.sfx !== false) R.cue("glitch", at);
    if (p <= 0 || p >= 1) { if (el.dataset.gl) { el.style.clipPath = ""; el.style.filter = ""; el.style.translate = ""; el.dataset.gl = ""; } return; }
    const fr = Math.floor(t * 30), s = (o.amp ?? 10) * (1 - p * 0.6), y0 = (hash(fr) * 0.5 + 0.5) * 80, h = 6 + (hash(fr + 7) * 0.5 + 0.5) * 18;
    el.style.filter = `drop-shadow(${s}px 0 0 rgba(255,0,80,.75)) drop-shadow(${-s}px 0 0 rgba(0,220,255,.75))`;
    el.style.clipPath = hash(fr + 3) > 0 ? `polygon(0 0,100% 0,100% ${y0}%,0 ${y0}%,0 ${y0 + h}%,100% ${y0 + h}%,100% 100%,0 100%)` : "";
    el.style.translate = `${hash(fr + 11) * s}px 0`; el.dataset.gl = "1";
  };
  F.glitchEnd = el => { el = $(el); el.style.translate = ""; };

  // ---------- 3D REVEALS ----------
  /** card flip: el contains .fx-front and .fx-back (fx.css). Reveal the "hidden side" (code behind a UI, answer behind a question). */
  F.flip = (el, t, at, o = {}) => {
    el = $(el); const d = o.d ?? 0.8, p = E.backOut(prog(t, at, d), 1.2), ax = o.axis === "x" ? "X" : "Y";
    el.querySelector(".fx-card").style.transform = `rotate${ax}(${(o.back ? 180 : 0) + 180 * p * (o.dir ?? 1)}deg)`;
    if (o.sfx !== false) R.cue("swish", at);
  };
  /** specular sheen: a light bar sweeps across a card/button (premium "shine" on reveal). Adds .fx-sheen child. */
  F.sheen = (el, t, at, o = {}) => {
    el = $(el); let s = el.querySelector(":scope > .fx-sheen"); if (!s) { s = document.createElement("i"); s.className = "fx-sheen"; el.appendChild(s); el.style.overflow = "hidden"; }
    const p = prog(t, at, o.d ?? 0.7); s.style.transform = `translateX(${lerp(-140, 260, E.inOut(p))}%) skewX(-18deg)`; s.style.opacity = p > 0 && p < 1 ? 1 : 0;
  };
  /** depth of field: blur each element by its distance from the focus z (els: [[el, z]]) */
  F.dof = (els, focusZ, o = {}) => els.forEach(([el, z]) => { el = $(el); const b = Math.min(o.max ?? 10, Math.abs(z - focusZ) * (o.k ?? 0.035)); el.style.filter = b > 0.3 ? `blur(${b.toFixed(1)}px)` : ""; });

  // ---------- TEXT FX ----------
  const split = (el, text) => { if (el.dataset.fxs !== text) { el.innerHTML = [...text].map(c => `<span class="fx-ch">${c === " " ? "&nbsp;" : c}</span>`).join(""); el.dataset.fxs = text; } return el.querySelectorAll(".fx-ch"); };
  /** per-letter entrance: mode "flip" (3D rotateX), "rise" (from below + blur), "pop" (scale spring) */
  F.letters = (el, text, t, at, o = {}) => {
    el = $(el); const chs = split(el, text), st = o.stagger ?? 0.035, d = o.d ?? 0.45, mode = o.mode || "flip";
    chs.forEach((c, i) => { const p = prog(t, at + i * st, d);
      if (mode === "flip") { const e = E.backOut(p, 1.4); c.style.transform = `rotateX(${(1 - e) * -95}deg)`; c.style.opacity = clamp(p * 3); }
      else if (mode === "rise") { const e = E.expoOut(p); c.style.transform = `translateY(${(1 - e) * 60}px)`; c.style.opacity = e; c.style.filter = e < 1 ? `blur(${(1 - e) * 10}px)` : ""; }
      else { const e = E.spring(p); c.style.transform = `scale(${lerp(0.2, 1, e)})`; c.style.opacity = clamp(p * 3); } });
    if (o.sfx !== false) R.cue("type", at, { t2: at + chs.length * st });
  };
  /** decode/scramble: random glyphs resolve left→right into the text (code, secrets, "hacked") */
  F.scramble = (el, text, t, at, o = {}) => {
    el = $(el); const d = o.d ?? 0.9, p = prog(t, at, d), G = o.glyphs || "01<>/{}#$%&*+=?ABCDEFXYZ", fr = Math.floor(t * 30);
    if (o.sfx !== false) R.cue("type", at, { t2: at + d });
    if (p <= 0) { el.textContent = o.hidden ? "" : text.replace(/\S/g, "·"); return; }
    const n = Math.floor(text.length * p);
    el.textContent = [...text].map((c, i) => (i < n || c === " " ? c : G[Math.floor((hash(fr * 31 + i) * 0.5 + 0.5) * G.length)])).join("");
  };
  /** odometer: each digit rolls on its own strip (money, counts). el gets .fx-odo strips. */
  F.odometer = (el, t, at, d, to, o = {}) => {
    el = $(el); const str = (o.fmt || (x => Math.round(x).toLocaleString("en-US")))(to);
    if (el.dataset.odo !== str) { el.innerHTML = [...str].map(c => /\d/.test(c) ? `<span class="fx-odo"><span>${"0123456789".split("").join("<br>")}</span></span>` : `<span>${c}</span>`).join(""); el.dataset.odo = str; }
    let di = 0; const digits = [...str].filter(c => /\d/.test(c));
    el.querySelectorAll(".fx-odo > span").forEach((s, i) => { const target = +digits[i], p = E.expoOut(prog(t, at + i * (o.stagger ?? 0.06), d));
      const spins = (digits.length - i) + (o.spins ?? 1), v = (target + 10 * spins) * p; s.style.transform = `translateY(${-(v % 10)}em)`; di++; });
    if (o.sfx !== false) R.cue("type", at, { t2: at + d * 0.8 });
  };
  /** code typing with syntax colours + blinking caret. lines: plain text; colours keywords/strings/numbers/comments. */
  F.code = (el, src, t, at, o = {}) => {
    el = $(el); const cps = o.cps ?? 38, n = clamp(Math.floor((t - at) * cps), 0, src.length), shown = src.slice(0, n);
    const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    // single pass so a colour tag can never be re-matched by the next rule
    const hl = shown.replace(/(\/\/[^\n]*)|("[^"\n]*"?)|\b(const|let|function|return|await|import|from|new|if|for)\b|\b(\d+(?:\.\d+)?)\b|([^]?)/g,
      (m, c, st, k, n, other) => c ? `<i class="c">${esc(c)}</i>` : st ? `<i class="s">${esc(st)}</i>` : k ? `<i class="k">${k}</i>` : n ? `<i class="n">${n}</i>` : esc(m));
    el.innerHTML = hl + (Math.floor(t * 2.2) % 2 || n < src.length ? '<b class="fx-caret"></b>' : "");
    if (o.sfx !== false) R.cue("type", at, { t2: at + src.length / cps });
  };


  /** base state for slot-based scenes: call FIRST every frame, seams after it.
   *  slots: [[el, start, end]] — inside its slot a scene is visible + reset, outside hidden. */
  F.slots = (t, slots) => slots.forEach(([el, a, b]) => { el = $(el); if (!el) return; const on = t >= a && t < b;
    el.style.visibility = on ? "visible" : "hidden"; el.style.opacity = on ? 1 : 0; el.style.transform = ""; el.style.filter = ""; });
  // ---------- VELOCITY-MATCHED SEAMS (HyperFrames cut-the-curve catalog, Apache-2.0, adapted to seek(t)) ----------
  // Law: cut mid-motion, same axis + direction + speed both sides (mirrored eases), never both visible, never a crossfade.
  const seamSet = (el, o) => { el = $(el); if (!el) return; el.style.transform = `translate(${o.x || 0}px,${o.y || 0}px) scale(${o.s ?? 1})`;
    el.style.opacity = o.a; el.style.filter = o.b > 0.2 ? `blur(${o.b.toFixed(1)}px)` : ""; el.style.visibility = o.a <= 0.001 ? "hidden" : "visible"; };
  /** cut-the-curve: the DEFAULT scene boundary, in the film's current (dir "left" default). Partial travel ±230 px. */
  F.cutCurve = (outEl, inEl, t, cut, o = {}) => {
    const D = o.d ?? 0.32, tr = o.travel ?? 230, ax = /up|down/.test(o.dir || "") ? "y" : "x", sg = /right|down/.test(o.dir || "") ? 1 : -1, bl = o.blur ?? 9;
    if (o.sfx !== false) R.cue("swish", cut - D * 0.6);
    const pe = prog(t, cut - D, D), pi = prog(t, cut, D);
    if (t < cut - D || t > cut + D + 0.04) return;   // outside the seam: leave the scenes to the base state
    if (t < cut) { const e = E.power4In(pe); seamSet(outEl, { [ax]: sg * tr * e, a: pe <= 0 ? 1 : clamp(1 - pe / 0.92), b: bl * e }); seamSet(inEl, { a: 0 }); }
    else { const e = E.power4Out(pi); seamSet(outEl, { a: 0 }); seamSet(inEl, { [ax]: -sg * tr * (1 - e), a: pi >= 1 ? 1 : lerp(0.35, 1, clamp(pi * 2)), b: bl * (1 - e) }); }
  };
  /** forward zoom cut (deeper into the same thought): out 1→1.2 blur→10, in 0.75→1 (everything GROWS) */
  F.zoomCut = (outEl, inEl, t, cut, o = {}) => {
    const de = o.de ?? 0.2, di = o.di ?? 0.5, bl = o.blur ?? 10;
    if (o.sfx !== false) R.cue("swish", cut - de);
    if (t < cut - de || t > cut + di + 0.04) return;
    if (t < cut) { const p = prog(t, cut - de, de), e = E.power3In(p); seamSet(outEl, { s: 1 + 0.2 * e, a: lerp(1, 0.15, p), b: bl * e }); seamSet(inEl, { a: 0 }); }
    else { const p = prog(t, cut, di), e = E.expoOut(p); seamSet(outEl, { a: 0 }); seamSet(inEl, { s: lerp(0.75, 1, e), a: lerp(0.15, 1, e), b: bl * (1 - e) }); }
  };
  /** inverse zoom (ARRIVAL / payoff only): out 1→0.8, in arrives oversized 1.25→1 (everything SHRINKS) */
  F.inverseZoom = (outEl, inEl, t, cut, o = {}) => {
    const de = o.de ?? 0.2, di = o.di ?? 0.5, bl = o.blur ?? 10;
    if (o.sfx !== false) R.cue("impact", cut, { soft: true });
    if (t < cut - de || t > cut + di + 0.04) return;
    if (t < cut) { const p = prog(t, cut - de, de), e = E.power3In(p); seamSet(outEl, { s: 1 - 0.2 * e, a: lerp(1, 0.15, p), b: bl * e }); seamSet(inEl, { a: 0 }); }
    else { const p = prog(t, cut, di), e = E.expoOut(p); seamSet(outEl, { a: 0 }); seamSet(inEl, { s: lerp(1.25, 1, e), a: lerp(0.15, 1, e), b: bl * (1 - e) }); }
  };
  /** rack-focus blur cut (the ONE visible cut, same surface state swap, ≤ once per ~8 s): blur spike hides a hard swap */
  F.rackFocus = (outEl, inEl, t, cut, o = {}) => {
    const d = o.d ?? 0.28, pk = o.blur ?? 11;
    if (t < cut - d || t > cut + d * 1.2 + 0.04) return;
    if (t < cut) { const p = prog(t, cut - d, d), e = E.power2InOut(p); seamSet(outEl, { s: 1 + 0.06 * e, a: 1, b: pk * e }); seamSet(inEl, { a: 0 }); }
    else { const p = prog(t, cut, d * 1.2), e = E.power2InOut(p); seamSet(outEl, { a: 0 }); seamSet(inEl, { s: 1.06 - 0.06 * e, a: 1, b: pk * (1 - e) }); }
  };
  /** waterfall ENTRY: words whip up from below with binary opacity, overlapping, gaps shrinking; the last word snaps.
   *  words: ["Every","frame","is","*code.*"]  (*x* = anchor/heavy word: travels further, accent colour) */
  F.waterfall = (el, words, t, at, o = {}) => {
    el = $(el); const key = words.join("|");
    if (el.dataset.wf !== key) { el.innerHTML = words.map(w => { const h = /^\*.*\*$/.test(w); return `<span class="fx-w${h ? " h" : ""}">${h ? w.slice(1, -1) : w}</span>`; }).join(" "); el.dataset.wf = key; }
    let a = at, gap = o.gap ?? 0.11;
    el.querySelectorAll(".fx-w").forEach((w, i) => { const heavy = w.classList.contains("h"), d = heavy ? 0.2 : 0.15, dy = heavy ? 76 : 46;
      const p = prog(t, a, d), e = E.power4Out(p); w.style.opacity = t >= a ? 1 : 0; w.style.transform = `translateY(${(1 - e) * dy}px)`; a += gap; gap *= 0.84; });
    if (o.sfx !== false) R.cue("type", at, { t2: a });
  };

  // ---------- PARTICLES ----------
  /** burst of sparks/confetti from a point (emphasis, "done", win). Creates children once. */
  F.burst = (el, t, at, o = {}) => {
    el = $(el); const n = o.n ?? 18, d = o.d ?? 0.9, cols = o.colors || ["#D97757", "#F0A585", "#F3F1EC", "#7A3A26"];
    if (!el.dataset.burst) { el.innerHTML = Array.from({ length: n }, (_, i) => `<i class="fx-pt" style="background:${cols[i % cols.length]}"></i>`).join(""); el.dataset.burst = 1; }
    const p = prog(t, at, d);
    el.querySelectorAll(".fx-pt").forEach((q, i) => { const ang = (i / n) * Math.PI * 2 + hash(i) * 0.4, r = (o.r ?? 220) * (0.6 + 0.4 * (hash(i + 5) * 0.5 + 0.5)) * E.expoOut(p);
      q.style.transform = `translate(${Math.cos(ang) * r}px,${Math.sin(ang) * r + 260 * p * p}px) rotate(${p * 540 * hash(i + 2)}deg) scale(${1 - p * 0.6})`; q.style.opacity = p > 0 && p < 1 ? 1 - p * p : 0; });
    if (o.sfx !== false) R.cue("pop", at);
  };

  // ---------- LEVEL 4: PRO PASS (punch-ins, match cuts, wipes, ramps, pops, vignette) ----------
  /** PUNCH-IN RHYTHM: hard micro zoom on every sentence stop (Hormozi/speedy_devv cadence).
   *  stops: array of times (use stops.json sentence ends). The frame alternates 1.0 / zoom and
   *  SNAPS there in ~0.12 s (a punch, not a drift). Put it on a full-frame wrapper (#cam).
   *  o.z = punch scale (default 1.055), o.seq = custom scale sequence, o.ox/oy = zoom origin px. */
  /** punchS: just the scale value — multiply it into a transform you already own (e.g. the theme camera). */
  F.punchS = (t, stops, o = {}) => {
    if (!stops.length) return 1;
    let i = -1; for (let k = 0; k < stops.length; k++) { if (stops[k] <= t) i = k; else break; }
    const seq = o.seq, zi = x => (x < 0 ? 1 : seq ? seq[x % seq.length] : (x % 2 ? (o.z ?? 1.055) : 1));
    const e = i < 0 ? 1 : E.expoOut(prog(t, stops[i], 0.12)); // SNAP to the new frame size at the stop
    return lerp(zi(i - 1), zi(i), e);
  };
  F.punch = (el, t, stops, o = {}) => {
    el = $(el); if (!el) return;
    el.style.transformOrigin = `${o.ox ?? 540}px ${o.oy ?? 760}px`;
    el.style.transform = `scale(${F.punchS(t, stops, o).toFixed(4)})`;
  };
  /** MATCH CUT: object continuity across a cut — toEl ENTERS from fromEl's exact box (FLIP morph).
   *  Both live anywhere in the DOM; rects are measured live (layout must be static at the cut).
   *  Call every frame around the cut, AFTER slots. */
  F.matchCut = (fromEl, toEl, t, cut, o = {}) => {
    const a = $(fromEl), b = $(toEl), d = o.d ?? 0.5;
    if (!a || !b || t < cut - 0.05 || t > cut + d + 0.04) return;
    if (o.sfx !== false) R.cue("swish", cut - 0.05);
    if (t < cut) { b.style.opacity = 0; return; }
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const st = $("stage").getBoundingClientRect(), k = 1080 / st.width;
    a.style.opacity = 0;
    const p = E.expoOut(prog(t, cut, d));
    const dx = (ra.left + ra.width / 2 - rb.left - rb.width / 2) * k * (1 - p);
    const dy = (ra.top + ra.height / 2 - rb.top - rb.height / 2) * k * (1 - p);
    const s = lerp(ra.width / Math.max(1, rb.width), 1, p);
    b.style.opacity = 1; b.style.transform = `translate(${dx}px,${dy}px) scale(${s.toFixed(4)})`;
    b.style.filter = p < 1 ? `blur(${((1 - p) * 6).toFixed(1)}px)` : "";
  };
  /** MASKED WIPE reveal: clip-path sweeps the element open from a direction ("left","right","up","down","iris"). */
  F.wipe = (el, t, at, o = {}) => {
    el = $(el); const d = o.d ?? 0.55, p = prog(t, at, d), e = E.power4Out(p), dir = o.dir || "left";
    if (o.sfx !== false) R.cue("swish", at);
    if (p <= 0) { el.style.clipPath = dir === "iris" ? "circle(0% at 50% 50%)" : "inset(0 100% 0 0)"; el.style.opacity = 0; return; }
    if (p >= 1) { if (el.dataset.wp) { el.style.clipPath = ""; el.dataset.wp = ""; } return; }  // done: hands opacity back
    el.style.opacity = 1; el.dataset.wp = "1";
    const v = (1 - e) * 100;
    el.style.clipPath = dir === "iris" ? `circle(${e * 75}% at 50% 50%)`
      : dir === "left" ? `inset(0 ${v}% 0 0)` : dir === "right" ? `inset(0 0 0 ${v}%)`
      : dir === "up" ? `inset(${v}% 0 0 0)` : `inset(0 0 ${v}% 0)`;
  };
  /** SPEED RAMP: time remap for a sub-animation — slow → very fast → settle. Returns the remapped
   *  local time in [a,b] for real time t (drive any F./M. call with it instead of t). */
  F.ramp = (t, a, b, o = {}) => {
    const p = clamp((t - a) / Math.max(0.001, b - a)), k = o.k ?? 3;
    const e = p < 0.5 ? Math.pow(2 * p, k) / 2 : 1 - Math.pow(2 * (1 - p), k) / 2;
    return a + (b - a) * e;
  };
  /** POP: spring scale-in with a pop cue (counters, badges, the boxed keyword's panel, stickers). */
  F.pop = (el, t, at, o = {}) => {
    el = $(el); const d = o.d ?? 0.5, p = prog(t, at, d), e = E.spring(p);
    if (o.sfx !== false) R.cue("pop", at);
    el.style.opacity = p > 0 ? 1 : 0; el.style.transform = `scale(${lerp(o.from ?? 0.3, 1, e).toFixed(4)})`;
  };
  /** FOCUS VIGNETTE: edges darken for a beat so the payoff owns the frame (own overlay #fxVig). */
  F.vig = (t, at, o = {}) => {
    let v = $("fxVig"); if (!v) { v = document.createElement("div"); v.id = "fxVig"; v.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:95;opacity:0;background:radial-gradient(62% 55% at 50% 46%,transparent 55%,rgba(0,0,0,.55) 100%)"; $("stage").appendChild(v); }
    const d = o.d ?? 1.4, p = prog(t, at, d);
    v.style.opacity = (p > 0 && p < 1 ? Math.sin(Math.PI * Math.min(1, p * 1.6)) * (o.max ?? 0.8) : 0);
  };

  // ---------- BEAT SYNC ----------
  /** beat grid from the music.json you pass to music.py: R.fx.beats({bpm, groove_in}) */
  F.beats = (cfg) => { const b = 60 / cfg.bpm, g = cfg.groove_in || 0, out = []; for (let i = 0; g + i * b < (cfg.dur || 120); i++) out.push(+(g + i * b).toFixed(3)); F._beats = out; F._beat = b; return out; };
  /** 0..1 pulse that spikes on every beat and decays (scale a glow, a card, the background) */
  F.pulse = (t, o = {}) => { const B = F._beats || []; let last = -9; for (const x of B) { if (x <= t) last = x; else break; } return Math.exp(-(t - last) * (o.decay ?? 9)) * (t - last < (o.every ?? 99) ? 1 : 0); };
  /** snap a time to the nearest beat (cut scenes ON the beat) */
  F.snap = x => { const B = F._beats || []; if (!B.length) return x; return B.reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a), B[0]); };
})();
/* Portions adapted from HyperFrames (https://github.com/heygen-com/hyperframes), Apache License 2.0:
 * cut-the-curve / zoom-through / inverse zoom / rack-focus seam parameters and the waterfall entry cascade. */
