/* thumb-wall: rows of vertical video covers drifting past in opposite directions ("the videos on this account", a body of work, a feed).
 * opts:  { rows: 3, card: [w, h], gap, images: [urls] (optional; coloured placeholder covers are drawn when missing), tilt: degrees }
 * state: { show: 0..1 (rows slide in), speed, dim: 0..1, hot: index of a cover to ring (the "most viewed" one) } · api: frame(t, state) */
KF.define("thumb-wall", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), cw = (o.card || [170, 300])[0], ch = (o.card || [170, 300])[1], gap = o.gap ?? 18, rows = o.rows || 3, per = Math.ceil(w / (cw + gap)) + 3, imgs = (o.images || []).map(u => { const im = new Image(); im.src = u; return im; });
  if (imgs.length) window.__ready = Promise.all([window.__ready, ...imgs.map(im => im.decode().catch(() => {}))]);
  const pal = [["#D97757", "#5b2a1c"], ["#4b8bff", "#172a52"], ["#3ECF8E", "#0f3a28"], ["#a78bfa", "#2b1d52"], ["#F2C14E", "#4d3a0c"], ["#ff5a5a", "#4a1414"]];
  function card(id, x, y, a, hot) { ctx.globalAlpha = a; ctx.save(); KF.rr(ctx, x, y, cw, ch, 18); ctx.clip(); const im = imgs.length ? imgs[((id % imgs.length) + imgs.length) % imgs.length] : null;
    if (im && im.naturalWidth) { const k = Math.max(cw / im.naturalWidth, ch / im.naturalHeight); ctx.drawImage(im, x + (cw - im.naturalWidth * k) / 2, y + (ch - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k); }
    else { const p = pal[Math.floor(KF.hash(id * 1.7) * pal.length)], g = ctx.createLinearGradient(x, y, x + cw, y + ch); g.addColorStop(0, p[0]); g.addColorStop(1, p[1]); ctx.fillStyle = g; ctx.fillRect(x, y, cw, ch);
      ctx.fillStyle = "rgba(255,255,255,.9)"; KF.rr(ctx, x + 16, y + ch * 0.2, cw * (0.5 + 0.3 * KF.hash(id)), 16, 8); ctx.fill(); KF.rr(ctx, x + 16, y + ch * 0.2 + 28, cw * (0.3 + 0.3 * KF.hash(id + 2)), 16, 8); ctx.fill();
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.arc(x + cw / 2, y + ch * 0.62, 34, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(x + cw / 2 - 10, y + ch * 0.62 - 15); ctx.lineTo(x + cw / 2 + 16, y + ch * 0.62); ctx.lineTo(x + cw / 2 - 10, y + ch * 0.62 + 15); ctx.fill(); }
    ctx.restore(); if (hot) { ctx.strokeStyle = KF.C.gold; ctx.lineWidth = 8; KF.rr(ctx, x, y, cw, ch, 18); ctx.stroke(); } ctx.globalAlpha = 1; }
  return { frame(t, s = {}) { clear(); const a = KF.clamp(s.show ?? 1), sp = s.speed ?? 1, y0 = (h - rows * ch - (rows - 1) * gap) / 2; ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate((o.tilt ?? -4) * Math.PI / 180); ctx.translate(-w / 2, -h / 2);
      for (let j = 0; j < rows; j++) { const dir = j % 2 ? 1 : -1, d = t * sp * 60 * dir + (1 - KF.ease.out(a)) * 900 * dir, off = ((d % (cw + gap)) + (cw + gap)) % (cw + gap), base = Math.floor(d / (cw + gap));
        for (let i = -2; i < per; i++) { const id = (i - base) + j * 1000; card(id, i * (cw + gap) + off, y0 + j * (ch + gap), a * (1 - 0.65 * KF.clamp(s.dim ?? 0)) || 0, s.hot != null && id === s.hot); } } ctx.restore(); } };
});
