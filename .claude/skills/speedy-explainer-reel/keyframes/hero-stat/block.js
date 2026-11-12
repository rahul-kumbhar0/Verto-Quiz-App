/* hero-stat: one huge number that counts up like a real odometer: every digit is a wheel that turns, the fast ones blur, and it settles with a small bounce and a glow.
 * opts:  { from, to, dec: decimals, icon: "play"|"heart"|"star"|"eye"|"rupee" (drawn icon in front), prefix, suffix: "M", label: "views", color, glow, size, top }
 * state: { p: 0..1 (count progress), value: number (override), show: 0..1 } · api: frame(t, state) */
KF.define("hero-stat", (host, o) => {
  const size = o.size || 190, dec = o.dec || 0, K = Math.pow(10, dec), col = o.color || "#fff", glow = o.glow || KF.C.blue, c = KF.el("div", "", host); c.dataset.qa = "ok";
  const ICON = { play: '<path d="M30 14 L88 50 L30 86 Z" fill="none" stroke="C" stroke-width="9" stroke-linejoin="round"/>', heart: '<path d="M50 86 C10 58 8 30 28 20 C40 14 48 22 50 30 C52 22 60 14 72 20 C92 30 90 58 50 86 Z" fill="C"/>',
    star: '<path d="M50 8 L62 38 L94 40 L69 60 L78 92 L50 74 L22 92 L31 60 L6 40 L38 38 Z" fill="C"/>', eye: '<path d="M6 50 C26 20 74 20 94 50 C74 80 26 80 6 50 Z" fill="none" stroke="C" stroke-width="8"/><circle cx="50" cy="50" r="14" fill="C"/>', rupee: '<path d="M28 18 H74 M28 36 H74 M28 18 H46 C66 18 66 54 46 54 H28 L64 88" fill="none" stroke="C" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' };
  c.style.cssText = `position:absolute;left:0;right:0;top:${o.top ?? 300}px;text-align:center;font-family:Inter;color:${col}`;
  const fin = KF.fmt(Math.max(Math.abs(o.to ?? 100), Math.abs(o.from || 0)), dec), row = KF.el("div", "", c); row.style.cssText = `display:inline-flex;align-items:center;justify-content:center;font:900 ${size}px/1 Inter;letter-spacing:-0.03em;white-space:nowrap`;
  if (o.icon && ICON[o.icon]) { const ic = KF.el("span", "", row, `<svg viewBox="0 0 100 100" width="${size * 0.72}" height="${size * 0.72}">${ICON[o.icon].replace(/C"/g, col + '"')}</svg>`); ic.style.cssText = `display:inline-flex;margin-right:${size * 0.12}px`; }
  if (o.prefix) KF.el("span", "", row, o.prefix);
  // one wheel per digit of the final number; separators are plain characters
  const wheels = []; let k = fin.replace(/[^0-9]/g, "").length - 1;
  [...fin].forEach(ch => { if (/[0-9]/.test(ch)) { const w = KF.el("span", "", row), st = KF.el("span", "", w, "0<br>1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>0"); w.style.cssText = `display:inline-block;height:1.1em;overflow:hidden;width:0.62em;text-align:center`; st.style.cssText = "display:block;line-height:1.1em;will-change:transform"; wheels.push({ w, st, k: k-- }); }
    else { const sp = KF.el("span", "", row, ch); sp.style.cssText = "display:inline-block;width:0.3em;text-align:center"; wheels.push({ sep: sp, k }); } });
  if (o.suffix) KF.el("span", "", row, o.suffix);
  const lab = KF.el("div", "", c, o.label || ""); lab.style.cssText = "font:800 40px Inter;color:#8b8f98;margin-top:14px";
  const val = p => KF.lerp(o.from || 0, o.to ?? 100, KF.ease.out(KF.clamp(p)));
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1), p = KF.clamp(s.p ?? 1), v = (s.value ?? val(p)) * K, rate = Math.abs(val(p + 0.02) - val(p)) * K * 50, done = KF.prog(p, 0.9, 0.1);
      wheels.forEach(wh => { if (wh.sep) { wh.sep.style.opacity = v >= Math.pow(10, wh.k + 1) || wh.k < dec ? 1 : 0; wh.sep.style.width = wh.sep.style.opacity === "0" ? "0" : "0.3em"; return; }
        const u = Math.pow(10, wh.k), raw = v / u, base = Math.floor(raw) % 10, carry = wh.k > 0 ? KF.clamp((v % u) - (u - 1)) : 0, pos = wh.k === 0 ? raw % 10 : base + carry, lead = v < u && wh.k > dec;
        wh.st.style.transform = `translateY(${(-pos * 1.1).toFixed(3)}em)`; wh.st.style.filter = `blur(${Math.min(9, rate / u * 0.5).toFixed(1)}px)`; wh.w.style.opacity = lead ? 0 : 1; wh.w.style.width = lead ? "0" : "0.62em"; });
      row.style.filter = `drop-shadow(0 0 ${(10 + 14 * done).toFixed(0)}px rgba(255,255,255,${(0.2 + 0.35 * done).toFixed(2)})) drop-shadow(0 0 ${(50 * done).toFixed(0)}px ${KF.rgba(glow, 0.75 * done)})`;
      row.style.transform = `scale(${(0.94 + 0.06 * KF.ease.out(KF.clamp(p * 4)) + 0.05 * Math.sin(Math.PI * KF.prog(p, 0.93, 0.07))).toFixed(4)})`; c.style.opacity = a; lab.style.opacity = KF.clamp(p * 3); } };
});
