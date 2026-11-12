/* KEYFRAMES core. Every block is a pure function of time: make it once, call frame(t, state) on every seek.
 *   const b = KF.make("wave-cancel", hostEl, { ...options });   b.frame(t, { ...state });
 * Blocks never keep a clock, never use Math.random or Date: same t → same picture (so renders are repeatable).
 * Helpers: KF.prog(t, start, dur) 0..1 · KF.ease.{out,in,inOut,expo,back} · KF.spring(t, start, {f,z}) · KF.hash(i) · KF.noise(x)
 *          KF.canvas(host) → {cv, ctx, w, h, clear()} · KF.el(tag, cls, parent, html) · KF.C colour tokens */
(function () {
  const KF = (window.KF = window.KF || {}); KF.blocks = {}; KF.demos = [];
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, p) => a + (b - a) * p;
  KF.clamp = clamp; KF.lerp = lerp; KF.prog = (t, a, d) => clamp((t - a) / d);
  KF.ease = {
    out: p => 1 - Math.pow(1 - p, 3), in: p => p * p * p, inOut: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    expo: p => (p <= 0 ? 0 : p >= 1 ? 1 : p < 0.5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2),
    back: p => { const c = 1.70158; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
  };
  KF.spring = (t, a, o = {}) => { const f = o.f ?? 2.4, z = o.z ?? 0.6, x = t - a; if (x <= 0) return 0;
    const w = 2 * Math.PI * f, wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + (z * w / wd) * Math.sin(wd * x)); };
  KF.hash = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  KF.gauss = i => { const u = Math.max(1e-6, KF.hash(i)), v = KF.hash(i + 0.5); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  KF.noise = x => { const i = Math.floor(x), f = x - i, s = f * f * (3 - 2 * f); return lerp(KF.hash(i), KF.hash(i + 1), s) * 2 - 1; };
  KF.C = { bg: "#0c0c0f", panel: "#15171c", line: "#2a2d35", ink: "#F3F1EC", mute: "#8b8f98", gold: "#F2C14E", accent: "#D97757", blue: "#4b8bff", sky: "#7fd0ff", green: "#3ECF8E", red: "#ff5a5a", violet: "#a78bfa" };
  KF.el = (tag, cls, parent, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; };
  KF.host = h => (typeof h === "string" ? document.getElementById(h) : h);
  KF.canvas = (host, o = {}) => { host = KF.host(host); const w = o.w || host.clientWidth, h = o.h || host.clientHeight, cv = KF.el("canvas", "kf-cv", host);
    cv.width = w; cv.height = h; cv.style.cssText = "position:absolute;left:0;top:0;width:" + w + "px;height:" + h + "px;pointer-events:none";
    const ctx = cv.getContext("2d"); return { cv, ctx, w, h, clear: () => { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, w, h); } }; };
  KF.rr = (ctx, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
  KF.rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
  KF.css = (id, css) => { if (document.getElementById("kfcss-" + id)) return; const st = document.createElement("style"); st.id = "kfcss-" + id; st.textContent = css; document.head.appendChild(st); };
  KF.box = (host, css, cls) => { const d = KF.el("div", "kf-host" + (cls ? " " + cls : ""), KF.host(host)); d.style.cssText = css; return d; };
  KF.fmt = (n, dec = 0) => Number(n).toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });
  KF.typed = (text, t, start, cps = 18) => text.slice(0, Math.max(0, Math.floor((t - start) * cps)));
  KF.ui = theme => (theme === "light" ? { bg: "#F6F4EF", card: "#ffffff", ink: "#16181d", mute: "#6b7280", line: "#e3e0d8", chip: "#eeebe4" } : { bg: "#0c0c0f", card: "#15171c", ink: "#F3F1EC", mute: "#8b8f98", line: "#2a2d35", chip: "#22252c" });
  /** loop-back: feed the opening scene this time during the last `tail` seconds so the reel ends on its first frame. → { t0: time for the opening scene, mix: 0..1 its opacity } */
  KF.loopBack = (t, dur, tail = 1.2) => { const a = dur - tail; return t < a ? { t0: null, mix: 0 } : { t0: (t - a) - tail, mix: KF.ease.inOut(KF.prog(t, a, tail * 0.7)) }; };
  // shared real material lives in keyframes/_assets (our covers, a sheet of real reel frames)
  KF.base = (document.currentScript && document.currentScript.src || "").replace(/[^/]*$/, "");
  KF.asset = p => KF.base + "_assets/" + p;
  KF.img = url => { const im = new Image(); im.src = url; window.__ready = Promise.all([window.__ready, im.decode().catch(() => {})]); return im; };
  KF.covers = (n = 24) => Array.from({ length: n }, (_, i) => KF.asset("covers/c" + String(i + 1).padStart(2, "0") + ".jpg"));
  /** multi-key animation: KF.keys(t, [[time, value, ease?], …]) → value at t (numbers or equal-length arrays). ease names: out in inOut expo back (applies to the segment that ENDS at that key). */
  KF.keys = (t, K) => { if (t <= K[0][0]) return K[0][1]; for (let i = 1; i < K.length; i++) if (t <= K[i][0]) { const a = K[i - 1], b = K[i], p = (KF.ease[b[2]] || (x => x))(KF.prog(t, a[0], b[0] - a[0])); return Array.isArray(a[1]) ? a[1].map((v, k) => lerp(v, b[1][k], p)) : lerp(a[1], b[1], p); } return K[K.length - 1][1]; };
  /** a burst of sparks at (x, y) starting at t0: deterministic, with gravity and fade. opts { n, color, speed, life, g, size, seed, spread: [a0, a1] radians } */
  KF.sparks = (ctx, t, t0, x, y, o = {}) => { const d = t - t0, life = o.life || 0.7; if (d < 0 || d > life) return; const n = o.n || 18, sp = o.speed || 420, g = o.g ?? 900, a0 = (o.spread || [0, 6.283])[0], a1 = (o.spread || [0, 6.283])[1]; ctx.save(); ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < n; i++) { const sd = (o.seed || 1) * 31 + i, an = lerp(a0, a1, KF.hash(sd)), v = sp * (0.35 + 0.65 * KF.hash(sd + 0.3)), px = x + Math.cos(an) * v * d, py = y + Math.sin(an) * v * d + 0.5 * g * d * d, k = 1 - d / life, r = (o.size || 5) * (0.5 + KF.hash(sd + 0.7)) * k;
      ctx.fillStyle = KF.rgba(o.color || "#ffd166", k); ctx.beginPath(); ctx.arc(px, py, r, 0, 7); ctx.fill(); ctx.strokeStyle = KF.rgba(o.color || "#ffd166", 0.5 * k); ctx.lineWidth = r * 0.8; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - Math.cos(an) * v * 0.04, py - Math.sin(an) * v * 0.04 - g * d * 0.04); ctx.stroke(); } ctx.restore(); };
  /** a soft light band sweeping across a rectangle (glass / metal sheen). p 0..1 */
  KF.sheen = (ctx, x, y, w, h, p, a = 0.35) => { if (p <= 0 || p >= 1) return; const cx = x - w * 0.4 + (w * 1.8) * p, g = ctx.createLinearGradient(cx - w * 0.25, y, cx + w * 0.25, y + h * 0.4); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, `rgba(255,255,255,${a})`); g.addColorStop(1, "rgba(255,255,255,0)"); ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g; ctx.fillRect(x, y, w, h); ctx.restore(); };
  KF.define = (name, fn) => (KF.blocks[name] = fn);
  KF.make = (name, host, opts) => { if (!KF.blocks[name]) throw new Error("KF block not loaded: " + name); return KF.blocks[name](KF.host(host), opts || {}); };
  KF.demo = d => KF.demos.push(d);
  // canvas text needs the fonts decoded before the first frame
  const prev = window.__ready || Promise.resolve();
  window.__ready = Promise.all([prev, document.fonts.load('800 20px Inter'), document.fonts.load('900 20px Inter'), document.fonts.load('600 20px Inter'), document.fonts.load('700 20px "JetBrains Mono"')]).catch(() => {});
})();
