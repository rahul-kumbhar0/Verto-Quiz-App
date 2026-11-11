/* grid-zoom: a woven grid of rows and columns (sensor grid, pixel grid, city blocks, seats). Light up one row, one column, then fly into their crossing.
 * opts:  { cell: px, tilt: 0..1 (lay the grid back in perspective), rowColor, colColor }
 * state: { row: index, rowP: 0..1 sweep, col: index, colP: 0..1, zoom: 1..6, pulse: 0..1 glow on the crossing, drift: px slow pan }
 * api:   frame(t, state) · crossing() → [x, y] host pixels of the lit crossing (for labels / magnifier) */
KF.define("grid-zoom", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), s = o.cell || 72, cols = Math.ceil(w / s) + 2, rows = Math.ceil(h / s) + 2; let X = [w / 2, h / 2];
  const dia = (x, y, r, fill) => { ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y); ctx.closePath(); ctx.fill(); };
  return {
    frame(t, st = {}) { clear(); const r = st.row ?? Math.floor(rows / 2), c = st.col ?? Math.floor(cols / 2), z = st.zoom || 1, cx = (c + 0.5) * s - s, cy = r * s - s / 2 + s / 2;
      ctx.fillStyle = "#0b0c0f"; ctx.fillRect(0, 0, w, h);
      const fx = KF.lerp(w / 2, cx, KF.clamp((z - 1) / 1.5)), fy = KF.lerp(h / 2, cy, KF.clamp((z - 1) / 1.5));
      ctx.setTransform(z, 0, 0, z, w / 2 - fx * z, h / 2 - fy * z);
      for (let j = -1; j < rows; j++) for (let i = -1; i < cols; i++) { const x = i * s, y = j * s;
        // row electrodes (diamonds joined left-right) and column electrodes (joined up-down), half a cell apart
        const rl = j === r ? KF.clamp(((st.rowP ?? 0) * (cols + 2) - i - 1)) : 0, cl = i === c ? KF.clamp(((st.colP ?? 0) * (rows + 2) - j - 1)) : 0;
        ctx.strokeStyle = rl ? KF.rgba("#ffffff", 0.9 * rl) : "rgba(255,255,255,.10)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + s, y); ctx.stroke();
        dia(x, y, s * 0.36, rl ? KF.rgba(o.rowColor || "#ffffff", 0.25 + 0.75 * rl) : "#2b2e36");
        ctx.strokeStyle = cl ? KF.rgba("#ffffff", 0.9 * cl) : "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.moveTo(x + s / 2, y + s / 2); ctx.lineTo(x + s / 2, y + s * 1.5); ctx.stroke();
        dia(x + s / 2, y + s / 2, s * 0.36, cl ? KF.rgba(o.colColor || "#cfd6e4", 0.25 + 0.75 * cl) : "#1d1f26"); }
      const pu = KF.clamp(st.pulse ?? 0); if (pu > 0) { const px = c * s + s / 4, py = r * s + s / 4, rr = s * (0.5 + 0.25 * Math.sin(t * 6)); ctx.globalCompositeOperation = "lighter";
        const g = ctx.createRadialGradient(px, py, 0, px, py, rr * 2.2); g.addColorStop(0, KF.rgba(KF.C.gold, 0.9 * pu)); g.addColorStop(1, KF.rgba(KF.C.gold, 0)); ctx.fillStyle = g; ctx.fillRect(px - rr * 3, py - rr * 3, rr * 6, rr * 6);
        ctx.strokeStyle = KF.rgba(KF.C.gold, pu); ctx.lineWidth = 3 / z; ctx.beginPath(); ctx.arc(px, py, rr, 0, 7); ctx.stroke(); ctx.globalCompositeOperation = "source-over";
        X = [(px - fx) * z + w / 2, (py - fy) * z + h / 2]; }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.25, w / 2, h / 2, h * 0.75); v.addColorStop(0, "rgba(0,0,0,0)"); v.addColorStop(1, "rgba(0,0,0,.7)"); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h); },
    crossing: () => X,
  };
});
