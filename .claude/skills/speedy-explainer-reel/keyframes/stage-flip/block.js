/* stage-flip: the background flips between dark and light as a circle growing from a point (marks a new chapter; light = real screens, dark = diagrams).
 * opts:  { light: colour, dark: colour, origin: [x, y] in host px }
 * state: { p: 0..1 (0 = dark, 1 = light), origin } · api: frame(t, state) · isLight(state) → true once most of the stage is light (switch your text colours on it)
 * Put its host BEHIND your content (first child of the stage). */
KF.define("stage-flip", (host, o) => {
  const d = KF.el("div", "", host), l = KF.el("div", "", host); d.style.cssText = `position:absolute;inset:0;background:${o.dark || "#0c0c0f"}`; l.style.cssText = `position:absolute;inset:0;background:${o.light || "#F6F4EF"}`;
  const R = Math.hypot(host.clientWidth, host.clientHeight);
  return { isLight: (s = {}) => (s.p ?? 0) > 0.5, frame(t, s = {}) { const p = KF.ease.inOut(KF.clamp(s.p ?? 0)), og = s.origin || o.origin || [host.clientWidth / 2, host.clientHeight * 0.4]; l.style.clipPath = `circle(${(p * R).toFixed(1)}px at ${og[0]}px ${og[1]}px)`; } };
});
