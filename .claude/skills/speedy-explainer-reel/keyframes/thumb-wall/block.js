/* thumb-wall: rows of real vertical video covers drifting past in opposite directions, laid back in perspective ("the videos on this account", a body of work, a feed).
 * opts:  { images: [urls] (default: our own 24 reel covers from keyframes/_assets/covers), rows: 3, card: [w, h], gap, tilt: degrees of lean, views: { index: "18.2M" } (view badges; only pass real numbers) }
 * state: { show: 0..1 (rows slide in), speed, dim: 0..1 (others fade), hot: cover index to ring and lift (the "most viewed" one) } · api: frame(t, state) */
KF.define("thumb-wall", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), cw = (o.card || [190, 338])[0], ch = (o.card || [190, 338])[1], gap = o.gap ?? 20, rows = o.rows || 3, per = Math.ceil(w * 1.3 / (cw + gap)) + 3, imgs = (o.images || KF.covers()).map(KF.img), V = o.views || {};
  function card(idx, x, y, a, hot) { const im = imgs[idx]; ctx.globalAlpha = a; ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 26; ctx.shadowOffsetY = 12; ctx.fillStyle = "#15171c"; KF.rr(ctx, x, y, cw, ch, 18); ctx.fill(); ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.save(); KF.rr(ctx, x, y, cw, ch, 18); ctx.clip(); if (im && im.naturalWidth) { const k = Math.max(cw / im.naturalWidth, ch / im.naturalHeight); ctx.drawImage(im, x + (cw - im.naturalWidth * k) / 2, y + (ch - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k); }
    const g = ctx.createLinearGradient(0, y + ch * 0.62, 0, y + ch); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.7)"); ctx.fillStyle = g; ctx.fillRect(x, y, cw, ch);
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(x + 16, y + ch - 34); ctx.lineTo(x + 30, y + ch - 25); ctx.lineTo(x + 16, y + ch - 16); ctx.fill(); if (V[idx]) { ctx.font = "800 20px Inter"; ctx.textAlign = "left"; ctx.fillText(V[idx], x + 38, y + ch - 17); } ctx.restore();
    ctx.strokeStyle = hot ? KF.C.gold : "rgba(255,255,255,.14)"; ctx.lineWidth = hot ? 7 : 2; KF.rr(ctx, x, y, cw, ch, 18); ctx.stroke(); ctx.globalAlpha = 1; }
  return { frame(t, s = {}) { clear(); const a = KF.clamp(s.show ?? 1), sp = s.speed ?? 1, dim = KF.clamp(s.dim ?? 0), y0 = (h - rows * ch - (rows - 1) * gap) / 2, n = imgs.length; let hotAt = null;
      ctx.save(); ctx.translate(w / 2, h / 2); ctx.rotate((o.tilt ?? -5) * Math.PI / 180); ctx.translate(-w / 2, -h / 2);
      for (let j = 0; j < rows; j++) { const dir = j % 2 ? 1 : -1, d = t * sp * 55 * dir + (1 - KF.ease.out(a)) * 1100 * dir, off = ((d % (cw + gap)) + (cw + gap)) % (cw + gap), base = Math.floor(d / (cw + gap));
        for (let i = -3; i < per; i++) { const idx = ((((i - base) * 7 + j * 5) % n) + n) % n, x = i * (cw + gap) + off - w * 0.15, y = y0 + j * (ch + gap); if (s.hot === idx && !hotAt && x > 0 && x < w - cw) { hotAt = [idx, x, y]; continue; } card(idx, x, y, a * (1 - 0.7 * dim), false); } }
      if (hotAt) { const k = KF.ease.back(KF.clamp(dim * 1.6)), sc = 1 + 0.18 * k; ctx.translate(hotAt[1] + cw / 2, hotAt[2] + ch / 2); ctx.scale(sc, sc); ctx.translate(-cw / 2, -ch / 2); card(hotAt[0], 0, 0, a, true); }
      ctx.restore(); const v = ctx.createLinearGradient(0, 0, w, 0); v.addColorStop(0, "rgba(12,12,15,.9)"); v.addColorStop(0.12, "rgba(12,12,15,0)"); v.addColorStop(0.88, "rgba(12,12,15,0)"); v.addColorStop(1, "rgba(12,12,15,.9)"); ctx.fillStyle = v; ctx.fillRect(0, 0, w, h); } };
});
