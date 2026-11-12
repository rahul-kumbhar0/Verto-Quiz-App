/* stage-flip: the background changes between dark and light to mark a new chapter (light = real screens, dark = diagrams).
 * mode "circle" (default): the light grows from a point as a circle with a soft glowing rim and a ripple ring.
 * mode "turn": the whole stage turns over on its vertical axis like a card, with depth shading; your content hosts can follow with `turn(state)`.
 * opts:  { light: colour, dark: colour, origin: [x, y] in host px, mode: "circle"|"turn" }
 * state: { p: 0..1 (0 = dark, 1 = light), origin } · api: frame(t, state) · isLight(state) → true once most of the stage is light · turn(state) → CSS transform for content during a "turn"
 * Put its host BEHIND your content (first child of the stage). */
KF.define("stage-flip", (host, o) => {
  const W = host.clientWidth, H = host.clientHeight, R = Math.hypot(W, H), d = KF.el("div", "", host), l = KF.el("div", "", host), fx = KF.canvas(host), mode = o.mode || "circle", LC = o.light || "#F6F4EF", DC = o.dark || "#0c0c0f";
  d.style.cssText = `position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 30%,#171a22,${DC} 70%)`; l.style.cssText = `position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 30%,#ffffff,${LC} 70%)`;
  host.style.perspective = "2400px";
  return { isLight: (s = {}) => (s.p ?? 0) > 0.5, turn: (s = {}) => { const p = KF.ease.inOut(KF.clamp(s.p ?? 0)), a = p * 180; return `rotateY(${(a > 90 ? a - 180 : a).toFixed(2)}deg) scale(${(1 - 0.12 * Math.sin(Math.PI * p)).toFixed(4)})`; },
    frame(t, s = {}) { const p = KF.clamp(s.p ?? 0), e = KF.ease.inOut(p), og = s.origin || o.origin || [W / 2, H * 0.4]; fx.clear();
      if (mode === "turn") { const a = e * 180, face = a > 90, sc = 1 - 0.12 * Math.sin(Math.PI * e), tr = `rotateY(${(face ? a - 180 : a).toFixed(2)}deg) scale(${sc.toFixed(4)})`, sh = Math.abs(Math.sin(Math.PI * e));
        d.style.display = face ? "none" : ""; l.style.display = face ? "" : "none"; d.style.transform = l.style.transform = tr; l.style.clipPath = "none"; fx.ctx.fillStyle = `rgba(0,0,0,${0.6 * sh})`; fx.ctx.fillRect(0, 0, W, H); return; }
      d.style.display = l.style.display = ""; d.style.transform = l.style.transform = "none"; const r = e * R; l.style.clipPath = `circle(${r.toFixed(1)}px at ${og[0]}px ${og[1]}px)`;
      if (p > 0 && p < 1) { const c = fx.ctx, gl = c.createRadialGradient(og[0], og[1], Math.max(0, r - 60), og[0], og[1], r + 40); gl.addColorStop(0, "rgba(255,255,255,0)"); gl.addColorStop(0.6, "rgba(255,240,220,.55)"); gl.addColorStop(1, "rgba(255,240,220,0)"); c.globalCompositeOperation = "lighter"; c.fillStyle = gl; c.fillRect(0, 0, W, H);
        const rp = KF.ease.out(p) * R * 1.15; c.strokeStyle = `rgba(255,255,255,${0.35 * (1 - p)})`; c.lineWidth = 3; c.beginPath(); c.arc(og[0], og[1], rp, 0, 7); c.stroke(); c.globalCompositeOperation = "source-over"; } } };
});
