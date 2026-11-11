/* blade-cut: two glowing blades slice a wide picture; the sides fall away and the middle becomes a vertical clip ("it cuts them into Shorts", crop, trim).
 * opts:  { w, h (the wide picture), keep: 0..1 share of the width that stays (default 9:16 of the height), bg: css background for the picture (image url or gradient), top }
 * state: { show: 0..1, cut: 0..1 (blades come down), fall: seconds since the sides let go (0 = still attached), grow: 0..1 (the kept piece scales up) } · api: frame(t, state) · center → the kept piece's element (paint frames or add captions inside it) */
KF.define("blade-cut", (host, o) => {
  const w = o.w || 900, h = o.h || 506, kw = Math.round((o.keep ?? (h * 9 / 16) / w) * w), sw = (w - kw) / 2, left = (host.clientWidth - w) / 2, top = o.top ?? 220, bg = o.bg || "linear-gradient(120deg,#5b2a1c,#D97757 45%,#1c3a5b)";
  const mk = (x, ww) => { const e = KF.el("div", "", host); e.style.cssText = `position:absolute;left:${left + x}px;top:${top}px;width:${ww}px;height:${h}px;background:${bg};background-size:${w}px ${h}px;background-position:${-x}px 0;overflow:hidden`; return e; };
  const P = [mk(0, sw), mk(sw, kw), mk(sw + kw, sw)], B = [0, 1].map(i => { const b = KF.el("div", "", host); b.style.cssText = `position:absolute;left:${left + sw + i * kw - 5}px;top:${top - 30}px;width:10px;height:${h + 60}px;border-radius:5px;background:#fff;box-shadow:0 0 24px #fff,0 0 70px ${KF.C.accent};transform-origin:50% 0`; return b; });
  return { center: P[1], frame(t, s = {}) { const a = KF.clamp(s.show ?? 1), cut = KF.clamp(s.cut ?? 0), f = Math.max(0, s.fall ?? 0), g = KF.ease.back(KF.clamp(s.grow ?? 0));
      B.forEach((b, i) => { const q = KF.ease.out(KF.clamp(cut * 1.6 - i * 0.6)); b.style.transform = `scaleY(${q.toFixed(3)})`; b.style.opacity = f > 0 ? Math.max(0, 1 - f * 4) : q > 0 ? 1 : 0; });
      P.forEach((e, i) => { const d = i === 0 ? -1 : 1; e.style.opacity = i === 1 ? a : a * Math.max(0, 1 - f * 1.3); e.style.transform = i === 1 ? `scale(${(1 + 0.32 * g).toFixed(4)})` : `translate(${(d * 300 * f).toFixed(1)}px,${(1500 * f * f).toFixed(1)}px) rotate(${(d * 70 * f).toFixed(1)}deg)`;
        if (i === 1) { e.style.borderRadius = (22 * g).toFixed(1) + "px"; e.style.boxShadow = g > 0 ? `0 0 0 ${(5 * g).toFixed(1)}px #fff` : "none"; e.style.zIndex = 3; } }); } };
});
