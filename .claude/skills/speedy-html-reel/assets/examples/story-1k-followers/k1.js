// tiny manual presenter driver for the story frames: POSES = [[t, pose, expr]], FX = [[t, name, dur]], BEATS = [t...]
window.K1 = (POSES, FX = [], BEATS = [], extra = () => ({})) => t => {
  let i = 0; POSES.forEach((q, k) => { if (t >= q[0]) i = k; });
  const [ta, pose, ex] = POSES[i], prev = POSES[Math.max(0, i - 1)];
  const fx = []; FX.forEach(([a, n, d]) => { const u = (t - a) / d; if (u > 0 && u < 1) fx.push([n, u]); });
  const beat = Math.max(0, ...BEATS.map(a => { const d = t - a; return d >= 0 && d < 0.42 ? Math.sin(Math.PI * d / 0.42) : 0; }));
  const P = Reel.prog(t, ta, 0.18);
  Avatar.frame(t, pose, P, prev[1], 0, Object.assign({ beat, expr: ex, exprPrev: prev[2], exprP: P, fx }, extra(t)));
};
