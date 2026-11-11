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
  KF.define = (name, fn) => (KF.blocks[name] = fn);
  KF.make = (name, host, opts) => { if (!KF.blocks[name]) throw new Error("KF block not loaded: " + name); return KF.blocks[name](KF.host(host), opts || {}); };
  KF.demo = d => KF.demos.push(d);
  // canvas text needs the fonts decoded before the first frame
  const prev = window.__ready || Promise.resolve();
  window.__ready = Promise.all([prev, document.fonts.load('800 20px Inter'), document.fonts.load('900 20px Inter'), document.fonts.load('600 20px Inter'), document.fonts.load('700 20px "JetBrains Mono"')]).catch(() => {});
})();
