/* multiply-field: one thing becomes a whole field of them ("that's 180 full stadiums", 700 agents, 5,000 people) laid back in perspective.
 * opts:  { n: how many, glyph: "stadium"|"person"|"box"|"chip"|any emoji / text, cols, color, tilt: 0..1 }
 * state: { p: 0..1 (0 = one big item, 1 = the full field), show: 0..1 } · api: frame(t, state) · count(state) → how many are on screen (for a counter) */
KF.define("multiply-field", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), n = o.n || 180, cols = o.cols || Math.ceil(Math.sqrt(n * 0.9)), rows = Math.ceil(n / cols), g = o.glyph || "stadium", col = o.color || KF.C.green, tilt = o.tilt ?? 0.55;
  function glyph(x, y, s, a) { ctx.globalAlpha = a; if (g === "stadium") { ctx.fillStyle = "#1d2030"; KF.rr(ctx, x - s * 0.5, y - s * 0.36, s, s * 0.72, s * 0.3); ctx.fill(); ctx.strokeStyle = "#cfd6e4"; ctx.lineWidth = Math.max(1, s * 0.04); ctx.stroke();
      ctx.fillStyle = col; KF.rr(ctx, x - s * 0.3, y - s * 0.18, s * 0.6, s * 0.36, s * 0.05); ctx.fill(); if (s > 40) { ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = s * 0.015; ctx.beginPath(); ctx.moveTo(x, y - s * 0.18); ctx.lineTo(x, y + s * 0.18); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, s * 0.07, 0, 7); ctx.stroke(); } }
    else if (g === "person") { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y - s * 0.22, s * 0.17, 0, 7); ctx.fill(); KF.rr(ctx, x - s * 0.24, y - s * 0.02, s * 0.48, s * 0.42, s * 0.2); ctx.fill(); }
    else if (g === "box") { ctx.fillStyle = col; KF.rr(ctx, x - s * 0.38, y - s * 0.38, s * 0.76, s * 0.76, s * 0.14); ctx.fill(); ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.fillRect(x - s * 0.38, y - s * 0.04, s * 0.76, s * 0.08); }
    else if (g === "chip") { ctx.fillStyle = "#1d2030"; KF.rr(ctx, x - s * 0.36, y - s * 0.36, s * 0.72, s * 0.72, s * 0.1); ctx.fill(); ctx.fillStyle = col; KF.rr(ctx, x - s * 0.2, y - s * 0.2, s * 0.4, s * 0.4, s * 0.05); ctx.fill(); }
    else { ctx.font = `${Math.round(s * 0.8)}px Inter`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(g, x, y); ctx.textBaseline = "alphabetic"; }
    ctx.globalAlpha = 1; }
  const slot = k => { const i = k % cols, j = Math.floor(k / cols), d = j / Math.max(1, rows - 1), sc = KF.lerp(1 - tilt * 0.55, 1, d), rw = w * 0.9 * sc, s = rw / cols; let y = h * 0.22; for (let q = 0; q < j; q++) y += (w * 0.9 * KF.lerp(1 - tilt * 0.55, 1, q / Math.max(1, rows - 1)) / cols) * KF.lerp(0.62, 0.86, q / Math.max(1, rows - 1)); return [w / 2 - rw / 2 + (i + 0.5) * s, y, s * 0.92]; };
  return { frame(t, s = {}) { clear(); const p = KF.clamp(s.p ?? 1), a = KF.clamp(s.show ?? 1), e = KF.ease.inOut(KF.clamp(p * 3)), shown = 1 + (n - 1) * KF.ease.in(KF.clamp((p - 0.18) / 0.82));
      for (let k = n - 1; k >= 1; k--) { const q = KF.clamp(shown - k); if (q <= 0) continue; const [x, y, sz] = slot(k); glyph(x, y, sz * (0.5 + 0.5 * KF.ease.back(q)), a * Math.min(1, q * 2)); }
      const [x0, y0, s0] = slot(0); glyph(KF.lerp(w / 2, x0, e), KF.lerp(h * 0.45, y0, e), KF.lerp(w * 0.62, s0, e), a); },
    count: (s = {}) => Math.round(1 + (n - 1) * KF.ease.in(KF.clamp(((s.p ?? 1) - 0.18) / 0.82))) };
});
