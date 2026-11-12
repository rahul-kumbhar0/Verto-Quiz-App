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

  // ---------- PHOTO PLATES · INFINITE ZOOM · PORTAL FLIP (from the 9-reel scan, 11 Nov 2026) ----------
  // The 3D-hero reels (tires, glove+phone, DRAM) never cut: one photoreal object, a camera that
  // pushes / pulls back / whips across it with DIRECTIONAL motion blur, layers you zoom through, and
  // dark⇄light flips where a card grows into the next theme. references/motion-spec.md §9.
  const svgNS = "http://www.w3.org/2000/svg";
  const dirBlur = id => {
    let f = document.getElementById(id);
    if (!f) {
      let s = document.getElementById("fxDefs");
      if (!s) { s = document.createElementNS(svgNS, "svg"); s.id = "fxDefs"; s.setAttribute("width", 0); s.setAttribute("height", 0); s.style.position = "absolute"; document.body.appendChild(s); }
      f = document.createElementNS(svgNS, "filter"); f.id = id;
      ["x", "y"].forEach(k => f.setAttribute(k, "-25%")); ["width", "height"].forEach(k => f.setAttribute(k, "150%"));
      const g = document.createElementNS(svgNS, "feGaussianBlur"); g.setAttribute("stdDeviation", "0 0"); f.appendChild(g); s.appendChild(f);
    }
    return f.firstChild;
  };
  /** plate: a photoreal still (AI render / product photo) as the hero, filmed by a camera WITH INTENT.
   *  el = .fx-plate wrapper (needs an id) holding one <img>. keys: [{t, x, y, s, r, focus, ease}]
   *  x/y = pan px, s = zoom (keep ≥ 1.06 so edges never show), r = roll deg, focus = lens blur px.
   *  Blur follows the velocity DIRECTION (SVG feGaussianBlur), so a whip pan streaks sideways and a
   *  pull-back smears radially-ish, like the reference. Moves faster than ~220 px in < 0.6 s cue a swish. */
  F.plate = (el, t, keys, o = {}) => {
    el = $(el); if (!el || !keys.length) return; const img = el.querySelector("img") || el;
    const val = tt => {
      let k0 = keys[0], k1 = keys[0], p = 0;
      for (let i = 0; i < keys.length - 1; i++) if (tt >= keys[i].t) { k0 = keys[i]; k1 = keys[i + 1]; p = clamp((tt - k0.t) / Math.max(0.001, k1.t - k0.t)); }
      if (tt >= keys[keys.length - 1].t) { k0 = k1 = keys[keys.length - 1]; p = 1; }
      const e = (E[k1.ease || "power2InOut"] || E.power2InOut)(p), g = (k, d) => lerp(k0[k] ?? d, k1[k] ?? k0[k] ?? d, e);
      return { x: g("x", 0), y: g("y", 0), s: g("s", 1.08), r: g("r", 0), f: g("focus", 0) };
    };
    const a = val(t), b = val(t - 1 / 30);
    const dx = o.drift === false ? 0 : noise(t * 0.5) * 6, dy = o.drift === false ? 0 : noise(t * 0.45 + 7) * 5;
    img.style.transformOrigin = o.origin || "50% 50%";
    img.style.transform = `translate(${(a.x + dx).toFixed(1)}px,${(a.y + dy).toFixed(1)}px) rotate(${a.r.toFixed(2)}deg) scale(${a.s.toFixed(4)})`;
    const vx = a.x - b.x, vy = a.y - b.y, vs = (a.s - b.s) * 900, k = (o.k ?? 0.42) / Math.max(1, a.s);
    const sx = Math.min(40, Math.max(0, Math.abs(vx) - 3) * k + Math.abs(vs) * 0.22), sy = Math.min(40, Math.max(0, Math.abs(vy) - 3) * k + Math.abs(vs) * 0.22);
    const parts = [];
    if (o.mblur !== false && el.id && sx + sy > 0.4) { dirBlur("mb_" + el.id).setAttribute("stdDeviation", `${sx.toFixed(1)} ${sy.toFixed(1)}`); parts.push(`url(#mb_${el.id})`); }
    if (a.f > 0.3) parts.push(`blur(${a.f.toFixed(1)}px)`);
    if (o.grade !== "") parts.push(o.grade || "saturate(.86) contrast(1.05)");   // graphite grade (look.md); "" = untouched
    img.style.filter = parts.join(" ");
    keys.forEach((kk, i) => { if (i && kk.whoosh !== false && kk.t - keys[i - 1].t < 0.6 &&
      Math.hypot((kk.x || 0) - (keys[i - 1].x || 0), (kk.y || 0) - (keys[i - 1].y || 0)) + Math.abs((kk.s ?? 1.08) - (keys[i - 1].s ?? 1.08)) * 400 > 220) R.cue("swish", keys[i - 1].t); });
  };
  /** infinite zoom through nested plates (chip → die → cells → one bit). el = .fx-zchain with N <img>:
   *  image i is the detail at the CENTRE of image i-1 at 1/k of its size (compose the stills that way).
   *  The camera runs from layer 0 to layer N-1 between a and b; inner layers feather in through an
   *  elliptical mask that opens as they grow, so there is never a seam. Riser cue under the dive. */
  F.zoomChain = (el, t, a, b, o = {}) => {
    el = $(el); if (!el) return; const imgs = [...el.querySelectorAll("img")], k = o.k ?? 4, N = imgs.length;
    const ez = E[o.ease || "power2InOut"] || E.power2InOut, U = tt => (N - 1) * ez(prog(tt, a, b - a));
    const u = U(t), S = Math.pow(k, u);
    imgs.forEach((im, i) => {
      const s = S / Math.pow(k, i);
      im.style.transformOrigin = "50% 50%"; im.style.transform = `scale(${s.toFixed(4)})`;
      im.style.display = s > 60 || s < 0.02 ? "none" : "";
      if (i === 0) return;
      const X = lerp(40, 100, clamp((s - 0.45) / 0.6));   // mask opens from a soft centre to full frame
      const m = `radial-gradient(ellipse 72% 72% at 50% 50%, #000 ${X.toFixed(1)}%, transparent 100%)`;
      im.style.maskImage = m; im.style.webkitMaskImage = m; im.style.opacity = clamp((s - 1 / k) / 0.35);
    });
    const v = Math.abs(u - U(t - 1 / 30)) * 30;   // layers per second
    el.style.filter = v > 0.5 ? `blur(${Math.min(9, (v - 0.5) * 5).toFixed(1)}px)` : "";
    if (o.sfx !== false) R.cue("riser", a, { t2: b });
  };
  /** portal (measured on 9222 @30.9, every frame): the next theme FLOODS from a card in 2–3 frames, the outgoing
   *  scene is swallowed (scale up + blur) and the incoming content is already arriving inside the flood —
   *  never an empty canvas. box = the card on screen {x,y,w,h,r}; o.dark floods to the dark canvas.
   *  Start R.speedy's light range at `at + d`. Defaults: d 0.24 s flood, incoming settles 0.45 s from 1.22× + 18 px blur. */
  F.portal = (outEl, inEl, t, at, box, o = {}) => {
    let P = $("fxPortal");
    if (!P) { P = document.createElement("div"); P.id = "fxPortal"; (document.querySelector(".s-light") || document.querySelector(".s-bg")).after(P); }
    const d = o.d ?? 0.24, p = prog(t, at, d), e = E.expoInOut(p), id = "portal" + at, hold = o.hold ?? 0.12;
    if (o.sfx !== false) R.cue("swish", at - 0.04);
    const pv = prog(t - 1 / 30, at, d), vel = Math.abs(e - E.expoInOut(pv)) * 30;            // flood speed → edge blur
    if (p > 0 && t < at + d + hold) {
      const x = lerp(box.x, 0, e), y = lerp(box.y, 0, e);
      P.dataset.owner = id; P.className = o.dark ? "s-bg" : "s-light";
      Object.assign(P.style, { display: "block", opacity: 1, zIndex: 0,   // BEHIND the scenes: the content lands inside the flood left: x + "px", top: y + "px", width: lerp(box.w, 1080, e) + "px", height: lerp(box.h, 1920, e) + "px",
        borderRadius: lerp(box.r ?? 28, 0, e) + "px", backgroundPosition: `${-x - 1}px ${-y - 1}px`, filter: vel > 0.5 ? `blur(${Math.min(10, vel * 2.2).toFixed(1)}px)` : "" });
    } else if (P.dataset.owner === id) { P.style.display = "none"; P.dataset.owner = ""; }
    const A = $(outEl), B = $(inEl), sw = o.s0 ?? 1.22, ds = o.settle ?? 0.45;
    if (A && t >= at - 0.06 && t < at + d) { const q = E.power3In(prog(t, at - 0.06, d + 0.06)); A.style.transformOrigin = `${box.x + box.w / 2}px ${box.y + box.h / 2}px`;
      A.style.transform = `scale(${1 + 0.12 * q})`; A.style.opacity = 1 - q; A.style.filter = `blur(${(q * 14).toFixed(1)}px)`; A.style.visibility = "visible"; }
    else if (A && t >= at + d && t < at + d + 0.1) { A.style.opacity = 0; A.style.visibility = "hidden"; }
    const q0 = at + d * 0.55;
    if (B && t >= q0 && t < q0 + ds + 0.05) { const q = E.expoOut(prog(t, q0, ds)); B.style.visibility = "visible"; B.style.transformOrigin = "540px 900px";
      B.style.transform = `scale(${lerp(sw, 1, q).toFixed(4)})`; B.style.opacity = clamp(prog(t, q0, 0.06)); B.style.filter = q < 0.995 ? `blur(${(Math.pow(1 - q, 1.5) * 18).toFixed(1)}px)` : ""; }
    else if (B && t >= at && t < q0) { B.style.opacity = 0; }
  };
  /** settle cut (measured on 14866 @72.6, every frame): the outgoing scene leans in for ~5 frames (scale +10 %,
   *  blur 12 px), then the incoming scene lands in ONE frame — full opacity, oversized (1.38×) and blurred (22 px)
   *  — and settles on a long expo tail (~0.42 s); the outgoing leaves a 2-frame ghost. No empty frame, ever.
   *  Use it as the default scene boundary (with R.fx.slots + a .rig camera inside each scene). */
  F.settle = (outEl, inEl, t, cut, o = {}) => {
    const pre = o.pre ?? 0.16, d = o.d ?? 0.42, s0 = o.s0 ?? 1.38, b0 = o.blur ?? 22, [ox, oy] = o.origin || [540, 900];
    if (o.sfx !== false) R.cue("swish", cut - pre);
    if (t < cut - pre || t > cut + d + 0.04) return;
    const A = $(outEl), B = $(inEl); [A, B].forEach(el => el && (el.style.transformOrigin = `${ox}px ${oy}px`));
    if (t < cut) { const e = E.power3In(prog(t, cut - pre, pre)); seamSet(A, { s: 1 + 0.1 * e, a: 1, b: 12 * e }); seamSet(B, { a: 0 }); return; }
    const q = E.expoOut(prog(t, cut, d)), g = 1 - prog(t, cut, 2 / 30);
    seamSet(A, { s: 1.12, a: 0.45 * g, b: 14 }); seamSet(B, { s: lerp(s0, 1, q), a: 1, b: b0 * Math.pow(1 - q, 1.5) });
    if (A && B && g > 0) A.style.zIndex = 2;   // ghost sits on top for its 2 frames
    else if (A) A.style.zIndex = "";
  };
  /** caption page start times in [a, b) — the natural beat grid for camera nudges */
  F.pageStarts = (a = 0, b = 1e9) => (window.CAPTION_PAGES || []).map(p => p[0].s).filter(s => s >= a && s < b);
  /** rig: a camera that is NEVER locked (measured: the 3D-hero reels move 52–59 % of frames, ours moved 5 %).
   *  el = a .rig wrapper INSIDE a scene (the scene itself is driven by slots/seams). shots: [{t, x, y, s, r, d, ease}]
   *  — at each shot time the camera travels to that framing over d (default 0.8 s, power2InOut), then keeps a slow
   *  push (o.push, default +3 %) and a few px of drift until the next shot. Speed → blur, big moves → whoosh. */
  F.rig = (el, t, shots, o = {}) => {
    el = $(el); if (!el || !shots.length) return;
    const push = o.push ?? 0.03, drift = o.drift ?? 10, S = shots.map(k => ({ x: 0, y: 0, s: 1, r: 0, d: 0.8, ...k }));
    const held = (i, tt) => { const k = S[i], st = k.t + k.d, en = i + 1 < S.length ? S[i + 1].t : st + 6, u = E.inOut(clamp((tt - st) / Math.max(0.3, en - st)));
      return { x: k.x + drift * u, y: k.y - drift * 0.4 * u, s: k.s * (1 + push * u), r: k.r }; };
    const val = tt => {
      let i = 0; for (let j = 0; j < S.length; j++) if (tt >= S[j].t) i = j;
      const k = S[i]; if (tt < k.t) return held(0, k.t - 1);          // before the first shot: its start framing
      const p = (tt - k.t) / k.d;
      if (i === 0 || p >= 1) return held(i, tt);
      const A = held(i - 1, k.t), e = (E[k.ease || "power2InOut"] || E.power2InOut)(clamp(p));
      return { x: lerp(A.x, k.x, e), y: lerp(A.y, k.y, e), s: lerp(A.s, k.s, e), r: lerp(A.r, k.r, e) };
    };
    // beat nudges (measured: the reference makes a distinct move every ~1.8 s): on every beat (default = each caption
    // page start) the framing eases to a new deterministic offset, alternating sides so it never drifts away
    const bt = o.beats === false ? [] : (o.beats || F.pageStarts(S[0].t, o.until ?? 1e9)), amp = o.amp ?? 34;
    const nudge = tt => { let k = -1; for (let j = 0; j < bt.length; j++) if (tt >= bt[j]) k = j;
      const N = j => j < 0 ? [0, 0, 0] : [Math.cos(j * 2.39) * amp, Math.sin(j * 1.71) * amp * 0.45, ((j % 3) - 1) * 0.018];
      const e = k < 0 ? 0 : E.power2InOut(clamp((tt - bt[k]) / (o.beatD ?? 0.7))), A = N(k - 1), B = N(k);
      return [lerp(A[0], B[0], e), lerp(A[1], B[1], e), lerp(A[2], B[2], e)]; };
    const val2 = tt => { const v = val(tt), n = nudge(tt); return { x: v.x + n[0], y: v.y + n[1], s: v.s * (1 + n[2]), r: v.r }; };
    const a = val2(t), b = val2(t - 1 / 30);
    el.style.transformOrigin = o.origin || "540px 900px";
    el.style.transform = `translate(${a.x.toFixed(1)}px,${a.y.toFixed(1)}px) rotate(${a.r.toFixed(2)}deg) scale(${a.s.toFixed(4)})`;
    const sp = Math.hypot(a.x - b.x, a.y - b.y) + Math.abs(a.s - b.s) * 700;
    el.style.filter = sp > 3 ? `blur(${Math.min(8, (sp - 3) * 0.3).toFixed(1)}px)` : "";
    S.forEach((k, i) => { if (i && Math.hypot(k.x - S[i - 1].x, k.y - S[i - 1].y) + Math.abs(k.s - S[i - 1].s) * 600 > 160) R.cue("whoosh", k.t, { soft: true }); });
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
