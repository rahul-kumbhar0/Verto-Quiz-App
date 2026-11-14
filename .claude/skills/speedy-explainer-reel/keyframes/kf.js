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

/* ───────── KF.device: real-looking hardware and window chrome, shared by every screen block ─────────
 * Measured against real products (iPhone 15 Pro, MacBook Pro 14, Chrome, a macOS window), see references/realism.md.
 *   const d = KF.device("iphone" | "macbook" | "browser" | "window", parent, { w, h, ...opts });   d.el = the whole device, d.screen = put content here
 *   iphone  { w (h = w × 2.05 unless given), status: false | { time, light: true for dark icons }, home: true }
 *   macbook { w = lid width (screen is 16:10.4), status: false }      d.lid(p) opens the lid 0..1
 *   browser { w, h, url, tab, dark: true }      window { w, h, title, dark: true }
 * All sizes scale from w, so the same device looks right at any size. */
(function () {
  const KF = window.KF;
  const SIG = c => `<svg viewBox="0 0 18 12" style="height:.74em"><rect x="0" y="8" width="3" height="4" rx=".8" fill="${c}"/><rect x="5" y="5.4" width="3" height="6.6" rx=".8" fill="${c}"/><rect x="10" y="2.7" width="3" height="9.3" rx=".8" fill="${c}"/><rect x="15" y="0" width="3" height="12" rx=".8" fill="${c}"/></svg>`;
  const WIFI = c => `<svg viewBox="0 0 17 12" style="height:.74em"><path d="M8.5 2.2c2.5 0 4.7 1 6.3 2.6l1.1-1.2C14 1.700 11.400.5 8.500.5S3 1.700 1.100 3.600l1.100 1.200C3.800 3.200 6 2.200 8.500 2.200z" fill="${c}"/><path d="M8.5 5.800c1.500 0 2.800.6 3.800 1.500l1.100-1.200C12.100 4.900 10.400 4.100 8.500 4.100S4.900 4.900 3.600 6.100l1.100 1.200c1-.9 2.300-1.500 3.800-1.500z" fill="${c}"/><path d="M8.5 7.700c-1 0-1.900.4-2.600 1l2.600 2.800 2.600-2.800c-.7-.6-1.600-1-2.600-1z" fill="${c}"/></svg>`;
  const BAT = c => `<svg viewBox="0 0 27 13" style="height:.8em"><rect x=".5" y=".5" width="22" height="12" rx="3.600" fill="none" stroke="${c}" stroke-opacity=".4"/><rect x="2" y="2" width="19" height="9" rx="2.200" fill="${c}"/><path d="M24 4.300v4.400c.9-.3 1.500-1.200 1.500-2.200s-.6-1.900-1.500-2.200z" fill="${c}" fill-opacity=".45"/></svg>`;
  KF.sysIcons = { signal: SIG, wifi: WIFI, battery: BAT };
  KF.statusBar = (time, light) => { const c = light ? "#000" : "#fff"; return `<span style="letter-spacing:-.02em">${time || "9:41"}</span><span style="display:flex;align-items:center;gap:.36em">${SIG(c)}${WIFI(c)}${BAT(c)}</span>`; };
  KF.css("device", `
.kfd{position:absolute;box-sizing:border-box}.kfd *{box-sizing:border-box}
/* iPhone: brushed titanium band, black glass bezel, Dynamic Island with the camera lens, side buttons, antenna breaks */
.kfd-ip{border-radius:calc(var(--u)*15.2);background:linear-gradient(100deg,#6f6b66 0%,#b9b4ad 7%,#8a8680 16%,#5c5955 40%,#77736e 62%,#a8a39c 88%,#5f5c58 100%);padding:calc(var(--u)*1.05);box-shadow:0 0 0 1px rgba(0,0,0,.7),inset 0 0 calc(var(--u)*.6) rgba(255,255,255,.35),0 calc(var(--u)*14) calc(var(--u)*26) calc(var(--u)*-8) rgba(0,0,0,.85),0 calc(var(--u)*3) calc(var(--u)*6) rgba(0,0,0,.5)}
.kfd-ip>.gl{position:absolute;inset:calc(var(--u)*1.05);border-radius:calc(var(--u)*14.200);background:#000;box-shadow:inset 0 0 0 1px #1d1d1f,inset 0 0 calc(var(--u)*.5) 1px rgba(255,255,255,.12)}
.kfd-ip>.sc{position:absolute;inset:calc(var(--u)*3.100);border-radius:calc(var(--u)*12.100);overflow:hidden;background:#000}
.kfd-ip>.isl{position:absolute;left:50%;top:calc(var(--u)*5.600);width:calc(var(--u)*29);height:calc(var(--u)*8.500);margin-left:calc(var(--u)*-14.500);border-radius:99px;background:#000;z-index:8}
.kfd-ip>.isl:after{content:"";position:absolute;right:calc(var(--u)*2.300);top:50%;width:calc(var(--u)*2.900);height:calc(var(--u)*2.900);margin-top:calc(var(--u)*-1.450);border-radius:50%;background:radial-gradient(circle at 38% 34%,#3b4a78 0,#141a30 38%,#05060a 70%);box-shadow:0 0 0 1px #0d0e14}
.kfd-ip>.bt{position:absolute;width:calc(var(--u)*.9);border-radius:calc(var(--u)*.4);background:linear-gradient(90deg,#4f4c48,#a39e97 45%,#6a6661);box-shadow:0 0 0 .5px rgba(0,0,0,.6)}
.kfd-ip>.an{position:absolute;height:calc(var(--u)*1.05);width:calc(var(--u)*.7);background:rgba(40,38,36,.75)}
.kfd-ip>.sc>.st{position:absolute;left:0;right:0;top:0;height:calc(var(--u)*13.800);padding:calc(var(--u)*5.300) calc(var(--u)*7.200) 0 calc(var(--u)*10.500);display:flex;justify-content:space-between;align-items:flex-start;font:600 calc(var(--u)*4.400)/1 Inter;color:#fff;z-index:7;pointer-events:none}
.kfd-ip>.sc>.hm{position:absolute;left:50%;bottom:calc(var(--u)*2.100);width:calc(var(--u)*34);height:calc(var(--u)*1.250);margin-left:calc(var(--u)*-17);border-radius:9px;background:#fff;opacity:.92;z-index:7}
.kfd-ip>.rf{position:absolute;inset:calc(var(--u)*1.05);border-radius:calc(var(--u)*14.200);pointer-events:none;z-index:9;background:linear-gradient(118deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,.03) 22%,rgba(255,255,255,0) 38%,rgba(255,255,255,0) 72%,rgba(255,255,255,.05) 100%)}
/* MacBook: thin black bezel with the camera notch, aluminium lid edge, front lip with the thumb scoop */
.kfd-mb{perspective:calc(var(--u)*260);perspective-origin:50% 100%}
.kfd-mb>.lid{position:absolute;left:0;top:0;width:100%;transform-origin:50% 100%;border-radius:calc(var(--u)*1.900) calc(var(--u)*1.900) calc(var(--u)*.5) calc(var(--u)*.5);background:#0a0a0b;box-shadow:0 0 0 calc(var(--u)*.22) #8d9096,0 0 0 calc(var(--u)*.3) #3a3b3e,inset 0 0 0 1px #222}
.kfd-mb>.lid>.sc{position:absolute;left:calc(var(--u)*1.150);right:calc(var(--u)*1.150);top:calc(var(--u)*1.150);bottom:calc(var(--u)*1.500);border-radius:calc(var(--u)*.9) calc(var(--u)*.9) 0 0;overflow:hidden;background:#000}
.kfd-mb>.lid>.nt{position:absolute;left:50%;top:calc(var(--u)*1.100);width:calc(var(--u)*11.600);height:calc(var(--u)*2.050);margin-left:calc(var(--u)*-5.800);border-radius:0 0 calc(var(--u)*.7) calc(var(--u)*.7);background:#0a0a0b;z-index:6}
.kfd-mb>.lid>.nt:after{content:"";position:absolute;left:50%;top:50%;width:calc(var(--u)*.62);height:calc(var(--u)*.62);margin:calc(var(--u)*-.36) 0 0 calc(var(--u)*-.31);border-radius:50%;background:radial-gradient(circle at 40% 35%,#35406a,#0b0d18 60%)}
.kfd-mb>.lid>.rf{position:absolute;inset:0;pointer-events:none;z-index:5;background:linear-gradient(112deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,.015) 26%,rgba(255,255,255,0) 40%)}
.kfd-mb>.bs{position:absolute;left:-9.500%;width:119%;height:calc(var(--u)*2.500);border-radius:calc(var(--u)*.35) calc(var(--u)*.35) calc(var(--u)*1.700) calc(var(--u)*1.700)/calc(var(--u)*.35) calc(var(--u)*.35) calc(var(--u)*2.200) calc(var(--u)*2.200);background:linear-gradient(180deg,#f1f2f4 0%,#d2d4d8 9%,#b4b7bc 38%,#8b8e94 78%,#5e6065 100%);box-shadow:inset 0 1px 0 rgba(255,255,255,.9),0 calc(var(--u)*1.200) calc(var(--u)*2.400) rgba(0,0,0,.55),0 calc(var(--u)*5) calc(var(--u)*9) calc(var(--u)*-3) rgba(0,0,0,.7)}
.kfd-mb>.bs:before{content:"";position:absolute;left:50%;top:0;width:15.500%;height:38%;margin-left:-7.750%;border-radius:0 0 calc(var(--u)*1.200) calc(var(--u)*1.200);background:linear-gradient(180deg,#77797e,#a4a6ab)}
.kfd-mb>.bs:after{content:"";position:absolute;left:3%;right:3%;bottom:calc(var(--u)*-.5);height:calc(var(--u)*.5);border-radius:0 0 50% 50%;background:rgba(0,0,0,.5);filter:blur(2px)}
/* browser (Chrome on macOS) and a plain macOS window */
.kfd-br,.kfd-wn{border-radius:calc(var(--u)*1.300);overflow:hidden;box-shadow:0 0 0 1px rgba(255,255,255,.14),0 0 0 2px rgba(0,0,0,.6),0 calc(var(--u)*5) calc(var(--u)*11) calc(var(--u)*-2) rgba(0,0,0,.75),0 calc(var(--u)*1) calc(var(--u)*2.500) rgba(0,0,0,.4)}
.kfd>*>.tl{display:flex;gap:calc(var(--u)*.86);align-items:center}.kfd>*>.tl i{width:calc(var(--u)*1.300);height:calc(var(--u)*1.300);border-radius:50%;box-shadow:inset 0 0 0 .6px rgba(0,0,0,.22)}
.kfd-br>.tabs{position:absolute;left:0;right:0;top:0;height:calc(var(--u)*4.300);display:flex;align-items:flex-end;padding-left:calc(var(--u)*1.400);gap:calc(var(--u)*1.400)}
.kfd-br>.tabs .tl{height:100%;padding-bottom:calc(var(--u)*.2)}
.kfd-br>.tabs .tab{position:relative;height:calc(var(--u)*3.500);min-width:calc(var(--u)*22);max-width:calc(var(--u)*30);padding:0 calc(var(--u)*1.200);border-radius:calc(var(--u)*.9) calc(var(--u)*.9) 0 0;display:flex;align-items:center;gap:calc(var(--u)*.8);font:600 calc(var(--u)*1.350)/1 Inter;white-space:nowrap;overflow:hidden}
.kfd-br>.tabs .tab u{flex:none;width:calc(var(--u)*1.600);height:calc(var(--u)*1.600);border-radius:calc(var(--u)*.4)}.kfd-br>.tabs .tab s{margin-left:auto;text-decoration:none;opacity:.6;font-size:calc(var(--u)*1.500)}
.kfd-br>.tabs .plus{align-self:center;font:600 calc(var(--u)*2)/1 Inter;opacity:.6;margin-bottom:calc(var(--u)*.1)}
.kfd-br>.bar{position:absolute;left:0;right:0;top:calc(var(--u)*4.300);height:calc(var(--u)*4.600);display:flex;align-items:center;gap:calc(var(--u)*1.300);padding:0 calc(var(--u)*1.300)}
.kfd-br>.bar svg{flex:none;width:calc(var(--u)*1.900);height:calc(var(--u)*1.900)}
.kfd-br>.bar .url{flex:1;height:calc(var(--u)*3.300);border-radius:99px;display:flex;align-items:center;gap:calc(var(--u)*.9);padding:0 calc(var(--u)*1.300);font:600 calc(var(--u)*1.500)/1 Inter;white-space:nowrap;overflow:hidden}
.kfd-br>.bar .url em{font-style:normal;opacity:.55}.kfd-br>.bar .pf{flex:none;width:calc(var(--u)*2.500);height:calc(var(--u)*2.500);border-radius:50%;background:linear-gradient(140deg,#F0A585,#D97757)}
.kfd-br>.sc{position:absolute;left:0;right:0;bottom:0;top:calc(var(--u)*8.900);overflow:hidden}
.kfd-wn>.tb{position:absolute;left:0;right:0;top:0;height:calc(var(--u)*4.600);display:flex;align-items:center;padding:0 calc(var(--u)*1.500);font:700 calc(var(--u)*1.950)/1 Inter}
.kfd-wn>.tb b{position:absolute;left:0;right:0;text-align:center;font-weight:600;pointer-events:none}
.kfd-wn>.sc{position:absolute;left:0;right:0;bottom:0;top:calc(var(--u)*4.600);overflow:hidden}`);
  const TL = '<span class="tl"><i style="background:#ff5f57"></i><i style="background:#febc2e"></i><i style="background:#28c840"></i></span>';
  const IC = (d, c) => `<svg viewBox="0 0 20 20" fill="none" stroke="${c}" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  KF.device = (kind, parent, o = {}) => { const el = KF.el("div", "kfd", parent), w = o.w || 440; el.style.setProperty("--u", w / 100 + "px"); el.style.width = w + "px"; let screen, api = { el };
    if (kind === "iphone") { const h = o.h || Math.round(w * 2.05); el.classList.add("kfd-ip"); el.style.height = h + "px";
      el.innerHTML = `<i class="bt" style="left:calc(var(--u)*-.75);top:16%;height:3.300%"></i><i class="bt" style="left:calc(var(--u)*-.75);top:22.500%;height:6%"></i><i class="bt" style="left:calc(var(--u)*-.75);top:30%;height:6%"></i><i class="bt" style="right:calc(var(--u)*-.75);top:26%;height:9.500%;transform:scaleX(-1)"></i>
<i class="an" style="left:17%;top:0"></i><i class="an" style="right:17%;bottom:0"></i><i class="an" style="left:0;top:9%;width:calc(var(--u)*1.050);height:calc(var(--u)*.7)"></i><i class="an" style="right:0;bottom:9%;width:calc(var(--u)*1.050);height:calc(var(--u)*.7)"></i>
<div class="gl"></div><div class="sc"></div><div class="isl"></div><div class="rf"></div>`;
      screen = el.querySelector(".sc"); if (o.status !== false) { const st = KF.el("div", "st", screen, KF.statusBar(o.status && o.status.time, o.status && o.status.light)); if (o.status && o.status.light) st.style.color = "#000"; api.status = st; }
      if (o.home !== false) api.home = KF.el("div", "hm", screen); }
    else if (kind === "macbook") { const lh = Math.round(w * 0.662); el.classList.add("kfd-mb"); el.style.height = lh + Math.round(w * 0.025) + "px";
      el.innerHTML = `<div class="lid" style="height:${lh}px"><div class="sc"></div><div class="nt"></div><div class="rf"></div></div><div class="bs" style="top:${lh}px"></div>`;
      const lid = el.firstChild; screen = el.querySelector(".sc"); api.lid = p => { p = KF.clamp(p); lid.style.transform = p >= 1 ? "" : `rotateX(${(-88 * (1 - p)).toFixed(2)}deg)`; screen.style.filter = p >= 1 ? "" : `brightness(${(0.2 + 0.8 * p).toFixed(2)})`; }; }
    else if (kind === "browser") { const dk = o.dark !== false, fg = dk ? "#e8eaed" : "#3c4043", bg = dk ? "#1f2023" : "#dee1e6", tb = dk ? "#35363a" : "#fff", ub = dk ? "#202124" : "#f1f3f4"; el.classList.add("kfd-br"); el.style.height = (o.h || 600) + "px"; el.style.background = bg; el.style.color = fg;
      el.innerHTML = `<div class="tabs">${TL}<span class="tab" style="background:${tb}"><u style="background:${o.fav || "#D97757"}"></u>${o.tab || (o.url || "").replace(/^https?:\/\//, "").split("/")[0] || "New Tab"}<s>✕</s></span><span class="plus">+</span></div>
<div class="bar" style="background:${tb}">${IC('<path d="M12 4l-6 6 6 6"/>', fg)}${IC('<path d="M8 4l6 6-6 6"/>', dk ? "#6b6e73" : "#b6b9be")}${IC('<path d="M15.500 10a5.500 5.500 0 1 1-1.600-3.900"/><path d="M15.800 3.200v3.300h-3.300"/>', fg)}
<span class="url" data-qa="texture" style="background:${ub}">${IC('<rect x="5" y="9" width="10" height="7.500" rx="1.600"/><path d="M7.200 9V6.800a2.800 2.800 0 0 1 5.600 0V9"/>', fg)}<span>${(o.url || "").replace(/^https?:\/\//, "").replace(/^([^/]+)(.*)$/, "$1<em>$2</em>")}</span></span>${IC('<path d="M10 2.800l2.200 4.600 5 .7-3.600 3.500.9 5-4.500-2.400-4.500 2.400.9-5L2.800 8.100l5-.7z"/>', fg)}<i class="pf"></i>${IC('<circle cx="10" cy="4.500" r=".9" fill="' + fg + '"/><circle cx="10" cy="10" r=".9" fill="' + fg + '"/><circle cx="10" cy="15.500" r=".9" fill="' + fg + '"/>', fg)}</div><div class="sc"></div>`;
      screen = el.querySelector(".sc"); screen.style.background = dk ? "#0d1117" : "#fff"; }
    else { const dk = o.dark !== false; el.classList.add("kfd-wn"); el.style.height = (o.h || 500) + "px"; el.style.background = dk ? "#1e1f22" : "#f6f6f6"; el.style.color = dk ? "#d5d7db" : "#3a3a3c";
      el.innerHTML = `<div class="tb" style="background:${dk ? "linear-gradient(#3a3b3f,#2d2e32)" : "linear-gradient(#ececec,#dcdcdc)"};box-shadow:inset 0 1px 0 rgba(255,255,255,${dk ? 0.1 : 0.7}),0 1px 0 ${dk ? "#000" : "#bdbdbd"}">${TL}<b>${o.title || ""}</b></div><div class="sc"></div>`; screen = el.querySelector(".sc"); api.titleEl = el.querySelector(".tb b"); }
    api.screen = screen; return api; };
})();
