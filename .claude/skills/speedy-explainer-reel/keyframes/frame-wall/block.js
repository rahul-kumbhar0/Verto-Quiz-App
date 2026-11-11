/* frame-wall: a wall of thousands of tiny frames streaming past ("over 5,000 frames, one by one", every photo, every commit).
 * opts:  { rows, tile: [w, h], gap, colors: [..] tint palette }
 * state: { fill: 0..1 (how much of the wall has been drawn in), speed, dim: 0..1 } · api: frame(t, state) · total → number of tiles on the wall */
KF.define("frame-wall", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), tw = (o.tile || [22, 34])[0], th = (o.tile || [22, 34])[1], gap = o.gap ?? 5, rows = o.rows || Math.floor(h / (th + gap)), per = Math.ceil(w / (tw + gap)) + 2, pal = o.colors || ["#e8b48f", "#D97757", "#5a7bd9", "#2b2e36", "#F2C14E", "#3ECF8E", "#15171c"];
  return { frame(t, s = {}) { clear(); const f = KF.clamp(s.fill ?? 1), sp = s.speed ?? 1, dim = KF.clamp(s.dim ?? 0); for (let j = 0; j < rows; j++) { const dir = j % 2 ? 1 : -1, off = ((t * sp * (30 + 22 * KF.hash(j * 3)) * dir) % (tw + gap) + (tw + gap)) % (tw + gap), base = Math.floor(t * sp * (30 + 22 * KF.hash(j * 3)) * dir / (tw + gap));
        const rowOn = KF.clamp(f * rows * 1.15 - j); if (rowOn <= 0) continue; for (let i = -1; i < per; i++) { const id = (i - base) * 131 + j * 977, x = i * (tw + gap) + off, y = j * (th + gap), edge = KF.clamp(rowOn * per - i);
          if (edge <= 0) continue; ctx.globalAlpha = (0.35 + 0.65 * KF.hash(id)) * (1 - 0.7 * dim) * Math.min(1, edge); ctx.fillStyle = pal[Math.floor(KF.hash(id * 1.3) * pal.length)]; KF.rr(ctx, x, y, tw, th, 4); ctx.fill();
          ctx.fillStyle = "rgba(255,255,255,.5)"; ctx.fillRect(x + 4, y + th * (0.25 + 0.4 * KF.hash(id * 2.1)), tw - 8, 3); } } ctx.globalAlpha = 1; },
    total: rows * per };
});
