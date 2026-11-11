/* dashboard: a gauge, a rolling total and a bar chart (traffic, revenue, usage: "the numbers went up").
 * opts:  { title, unit, max: gauge maximum, total: final big number, bars: [..] heights 0..1, labels: [..], color }
 * state: { p: 0..1 (everything animates in together), gauge: 0..1 (override), total: number (override), hi: index of the bar to highlight } · api: frame(t, state) */
KF.define("dashboard", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), C = KF.C, col = o.color || C.blue, bars = o.bars || [0.2, 0.3, 0.28, 0.45, 0.6, 0.52, 0.8, 1], cx = w / 2, cy = 330, R = 230;
  return { frame(t, s = {}) { clear(); const p = KF.clamp(s.p ?? 1), g = s.gauge ?? KF.ease.out(p) * (o.gaugeTo ?? 0.82), tot = s.total ?? (o.total || 0) * KF.ease.out(p);
      ctx.fillStyle = C.panel; KF.rr(ctx, 60, 30, w - 120, h - 60, 32); ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 2; ctx.stroke();
      ctx.textAlign = "left"; ctx.font = "800 32px Inter"; ctx.fillStyle = C.mute; ctx.fillText(o.title || "Requests per second", 100, 92);
      ctx.lineCap = "round"; ctx.lineWidth = 34; ctx.strokeStyle = "#23262d"; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 0.85, Math.PI * 2.15); ctx.stroke();
      const a1 = Math.PI * (0.85 + 1.3 * KF.clamp(g)); ctx.strokeStyle = KF.rgba(col, 0.25); ctx.lineWidth = 60; ctx.beginPath(); ctx.arc(cx, cy, R, Math.PI * 0.85, a1); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 34; ctx.stroke();
      ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + (R - 60) * Math.cos(a1), cy + (R - 60) * Math.sin(a1)); ctx.stroke(); ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 7); ctx.fill();
      ctx.textAlign = "center"; ctx.font = "900 96px Inter"; ctx.fillStyle = C.ink; ctx.fillText(KF.fmt(Math.round(tot)), cx, cy + 150); ctx.font = "800 28px Inter"; ctx.fillStyle = C.mute; ctx.fillText(o.unit || "requests per second, peak", cx, cy + 196);
      const bw = (w - 240) / bars.length, by = h - 110, bh = 250; bars.forEach((v, i) => { const q = KF.ease.out(KF.clamp(p * 1.6 - i / bars.length * 0.6)), x = 120 + i * bw, hh = bh * v * q; ctx.fillStyle = i === (s.hi ?? bars.length - 1) ? col : "#2f333c"; KF.rr(ctx, x + 8, by - hh, bw - 16, hh, 10); ctx.fill();
        if (o.labels) { ctx.font = '700 22px "JetBrains Mono"'; ctx.fillStyle = C.mute; ctx.fillText(o.labels[i] || "", x + bw / 2, by + 34); } }); } };
});
