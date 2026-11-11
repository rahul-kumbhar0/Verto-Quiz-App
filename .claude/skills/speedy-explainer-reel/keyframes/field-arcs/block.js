/* field-arcs: glowing arcs jumping between a row of points, with sparks running along them. A "sink" (finger, hand, magnet) pulls the nearby arcs toward it.
 * opts:  { y: baseline, x0, x1, n: number of points, color, rise: arc height, lanes: arcs per gap (1..3) }
 * state: { power: 0..1 (how alive the field is), sink: { x, y, k: 0..1 pull, r: reach in px }, speed }
 * api:   frame(t, state) · stolen(i) → 0..1 how much the sink takes from point i (use it to drive value-strip) */
KF.define("field-arcs", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), n = o.n || 16, y0 = o.y ?? h * 0.6, x0 = o.x0 ?? 0, x1 = o.x1 ?? w, col = o.color || KF.C.gold, rise = o.rise || 90, lanes = o.lanes || 3;
  const px = i => x0 + (x1 - x0) * (i + 0.5) / n; let S = {};
  const pull = i => { const s = S.sink; if (!s || !s.k) return 0; const d = (px(i) - s.x) / (s.r || 260); return s.k * Math.exp(-d * d); };
  function arc(ax, bx, by, hh, a, lw) { ctx.strokeStyle = KF.rgba(col, a); ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(ax, y0); ctx.quadraticCurveTo(bx, by - hh, 2 * bx - ax, y0); ctx.stroke(); }
  return {
    frame(t, s = {}) { S = s; clear(); const p = KF.clamp(s.power ?? 1), sp = s.speed || 1; if (p <= 0) return; ctx.globalCompositeOperation = "lighter"; ctx.lineCap = "round";
      for (let i = 0; i < n - 1; i++) { const a = px(i), b = px(i + 1), mid = (a + b) / 2, k = Math.max(pull(i), pull(i + 1)), sk = s.sink || { x: mid, y: y0 };
        for (let l = 0; l < lanes; l++) { const hh = rise * (0.45 + 0.4 * l) * p * (1 - 0.75 * k), wob = 6 * KF.noise(t * 1.4 + i * 3.1 + l);
          arc(a, mid + wob, y0, hh * 2, 0.10 * p, 9); arc(a, mid + wob, y0, hh * 2, 0.55 * p * (1 - 0.6 * k), 2.2);
          const q = (t * sp * (0.55 + 0.2 * KF.hash(i * 7 + l)) + KF.hash(i * 13 + l * 5)) % 1, u = 1 - q, xx = u * u * a + 2 * u * q * (mid + wob) + q * q * b, yy = y0 - 2 * u * q * hh * 2;
          ctx.fillStyle = KF.rgba("#fff3c4", 0.9 * p * (1 - k)); ctx.beginPath(); ctx.arc(xx, yy, 3.2, 0, 7); ctx.fill(); }
        if (k > 0.02) for (let l = 0; l < 3; l++) { const src = l % 2 ? b : a, cx = KF.lerp(src, sk.x, 0.35) + 26 * KF.noise(t * 2 + i + l * 9), cy = KF.lerp(y0, sk.y, 0.75);
          ctx.strokeStyle = KF.rgba(col, 0.12 * k); ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(src, y0); ctx.quadraticCurveTo(cx, cy, sk.x + (src - sk.x) * 0.18, sk.y); ctx.stroke();
          ctx.strokeStyle = KF.rgba(col, 0.8 * k); ctx.lineWidth = 2.4; ctx.stroke();
          const q = (t * sp * 0.9 + KF.hash(i * 5 + l)) % 1, u = 1 - q, ex = sk.x + (src - sk.x) * 0.18; ctx.fillStyle = KF.rgba("#ffffff", k);
          ctx.beginPath(); ctx.arc(u * u * src + 2 * u * q * cx + q * q * ex, u * u * y0 + 2 * u * q * cy + q * q * sk.y, 3.6, 0, 7); ctx.fill(); } }
      for (let i = 0; i < n; i++) { ctx.fillStyle = KF.rgba(col, 0.25 * p); ctx.beginPath(); ctx.arc(px(i), y0, 12, 0, 7); ctx.fill(); ctx.fillStyle = KF.rgba("#fff3c4", 0.9 * p); ctx.beginPath(); ctx.arc(px(i), y0, 3.5, 0, 7); ctx.fill(); }
      ctx.globalCompositeOperation = "source-over"; },
    stolen: pull, x: px,
  };
});
