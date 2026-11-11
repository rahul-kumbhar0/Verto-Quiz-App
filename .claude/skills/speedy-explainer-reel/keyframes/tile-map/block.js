/* tile-map: a board of small tiles that fill in (test results, chips on a wafer, seats, days, pixels, "N of them").
 * opts:  { cols, rows, gap, mask: "rect"|"circle", order: "scan"|"random"|"center", colors: [..] (good tiles), bad: colour, radius }
 * state: { fill: 0..1 (how many are on), bad: 0..1 share of the on-tiles that are bad, sweep: 0..1 (a bright scan line crossing the board), dim: 0..1 }
 * api:   frame(t, state) · count(state) → { on, bad, total } (drive a counter with it) · cell(i) → [x, y, size] host pixels */
KF.define("tile-map", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), cols = o.cols || 24, rows = o.rows || 24, gap = o.gap ?? 4, sz = Math.min((w - gap) / cols, (h - gap) / rows), ox = (w - sz * cols) / 2, oy = (h - sz * rows) / 2;
  const colors = o.colors || [KF.C.green], badC = o.bad || KF.C.red, cells = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) { const dx = (i + 0.5) / cols - 0.5, dy = (j + 0.5) / rows - 0.5; if (o.mask === "circle" && Math.hypot(dx, dy) > 0.5) continue; cells.push({ i, j, d: Math.hypot(dx, dy), k: j * cols + i }); }
  const N = cells.length, ord = o.order || "scan"; cells.forEach((c, n) => { c.rank = ord === "random" ? KF.hash(c.k * 1.7) : ord === "center" ? c.d * 1.9 + 0.02 * KF.hash(c.k) : n / N; c.badR = KF.hash(c.k * 9.1 + 4); c.col = colors[Math.floor(KF.hash(c.k * 5.3) * colors.length)]; });
  const sorted = cells.map(c => c.rank).sort((a, b) => a - b), thr = f => (f >= 1 ? 2 : sorted[Math.floor(KF.clamp(f) * (N - 1))]);
  return {
    frame(t, s = {}) { clear(); const f = KF.clamp(s.fill ?? 0), T = thr(f), bad = KF.clamp(s.bad ?? 0), sw = s.sweep, r = o.radius ?? sz * 0.18;
      cells.forEach(c => { const x = ox + c.i * sz + gap / 2, y = oy + c.j * sz + gap / 2, on = f > 0 && c.rank <= T, edge = on ? KF.clamp((T - c.rank) * N / 6 + 0.25) : 0, pop = on ? 1 + 0.25 * (1 - edge) : 1, q = (sz - gap) * pop, off = (sz - gap - q) / 2;
        ctx.fillStyle = on ? (c.badR < bad ? badC : c.col) : "rgba(255,255,255,.07)"; ctx.globalAlpha = on ? 1 - 0.6 * KF.clamp(s.dim ?? 0) : 1; KF.rr(ctx, x + off, y + off, q, q, r); ctx.fill();
        if (sw != null && sw > 0 && sw < 1) { const d = Math.abs((c.j + 0.5) / rows - sw); if (d < 0.05) { ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - d / 0.05)})`; KF.rr(ctx, x, y, sz - gap, sz - gap, r); ctx.fill(); } } });
      ctx.globalAlpha = 1; },
    count(s = {}) { const on = Math.round(KF.clamp(s.fill ?? 0) * N); return { on, bad: Math.round(on * KF.clamp(s.bad ?? 0)), total: N }; },
    cell(n) { const c = cells[n % N]; return [ox + c.i * sz + sz / 2, oy + c.j * sz + sz / 2, sz]; },
  };
});
