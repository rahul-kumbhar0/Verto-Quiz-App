/* presenter: the cartoon presenter (wraps avatar.js; load ../../assets/template/avatar.js before this block).
 * opts:  { look: "street"|"hoodie"|"classic", style: { shirt, print, lens1, … }, w: px, poses: [[time, "pose"], …], talk: [[start, end], …] (when the mouth moves) }
 * state: { pose, mouth: 0..1, expr } (all optional; override the timeline) · api: frame(t, state) · poses() → every pose name
 * Full pose list and rules: ../../references/avatar.md */
KF.define("presenter", (host, o) => {
  if (!window.Avatar) throw new Error("presenter: load assets/template/avatar.js first"); const w = o.w || 520, el = KF.el("div", "", host), A = window.Avatar, P = (o.poses || [[0, "talk"]]).slice().sort((a, b) => a[0] - b[0]);
  el.style.cssText = `position:absolute;left:${o.x ?? (host.clientWidth - w) / 2}px;top:${o.y ?? host.clientHeight - w * 640 / 600}px;width:${w}px;height:${w * 640 / 600}px`; A.init(el, { look: o.look || "street", style: o.style });
  return { poses: () => A.names(), frame(t, s = {}) { let i = 0; P.forEach((p, k) => { if (t >= p[0]) i = k; }); const cur = s.pose || P[i][1], prev = P[Math.max(0, i - 1)][1], p = KF.prog(t, P[i][0], 0.2), talking = (o.talk || [[0, 1e9]]).some(([a, b]) => t >= a && t < b);
      const mouth = s.mouth ?? (talking ? KF.clamp(0.5 + 0.6 * Math.sin(t * 26) * (0.6 + 0.4 * KF.noise(t * 3))) : 0); A.frame(t, cur, p, prev, mouth, { beat: talking ? KF.clamp(Math.sin(t * 7)) * 0.5 : 0, expr: s.expr }); } };
});
