/* hero-stat: one huge glowing number that rolls up (views, users, money, "18.2M").
 * opts:  { from, to, dec: decimals, prefix: "▶ " | "$", suffix: "M", label: "views", color, size, top }
 * state: { p: 0..1 (count progress), value: number (override), show: 0..1 } · api: frame(t, state) */
KF.define("hero-stat", (host, o) => {
  const c = KF.el("div", "", host), size = o.size || 190; c.dataset.qa = "ok";
  c.style.cssText = `position:absolute;left:0;right:0;top:${o.top ?? 300}px;text-align:center;font-family:Inter;color:${o.color || "#fff"}`;
  c.innerHTML = `<div class="n" style="font:900 ${size}px Inter;letter-spacing:-6px;white-space:nowrap;font-variant-numeric:tabular-nums"></div><div class="l" style="font:800 40px Inter;color:#8b8f98;margin-top:6px">${o.label || ""}</div>`;
  const n = c.querySelector(".n"), l = c.querySelector(".l");
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1), p = KF.clamp(s.p ?? 1), e = KF.ease.out(p), v = s.value ?? KF.lerp(o.from || 0, o.to ?? 100, e), moving = p > 0 && p < 1 ? 1 - e : 0;
      n.textContent = (o.prefix || "") + KF.fmt(v, o.dec || 0) + (o.suffix || ""); n.style.filter = `blur(${(moving * 7).toFixed(1)}px)`; const g = 1 - moving;
      n.style.textShadow = `0 0 ${(30 * g).toFixed(0)}px rgba(255,255,255,${(0.55 * g).toFixed(2)}),0 0 ${(90 * g).toFixed(0)}px ${KF.rgba(o.glow || KF.C.blue, 0.6 * g)}`;
      c.style.opacity = a; n.style.transform = `scale(${(0.9 + 0.1 * KF.ease.back(KF.clamp(p * 1.2)) + 0.05 * Math.sin(Math.PI * KF.prog(p, 0.92, 0.08))).toFixed(4)})`; l.style.opacity = KF.clamp(p * 3); } };
});
