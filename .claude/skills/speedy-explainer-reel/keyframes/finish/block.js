/* finish: the camera-lens layer that makes drawn scenes feel filmed: film grain, a vignette, a faint lens bloom and (optional) a slow handheld drift you apply to your scene.
 * opts:  { grain: 0..1 strength (default 0.5), vignette: 0..1 (default 0.6), tint: colour of the bloom }
 * state: { bloom: 0..1 (a soft glow from the top, e.g. on a big reveal), flash: 0..1 (white flash, e.g. on a cut) } · api: frame(t, state) · drift(t, amount) → [dx, dy, rotDeg] for a handheld feel
 * Put its host on TOP of the scene (same size), pointer-events none. Grain changes 24 times a second, like film. */
KF.define("finish", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), G = o.grain ?? 0.5, V = o.vignette ?? 0.6, tiles = [0, 1, 2, 3].map(k => { const c = document.createElement("canvas"); c.width = c.height = 256; const x = c.getContext("2d"), d = x.createImageData(256, 256);
    for (let i = 0; i < 256 * 256; i++) { const v = 128 + 127 * (KF.hash(i * 1.7 + k * 9973) * 2 - 1); d.data[i * 4] = d.data[i * 4 + 1] = d.data[i * 4 + 2] = v; d.data[i * 4 + 3] = 255; } x.putImageData(d, 0, 0); return c; });
  return { drift: (t, a = 1) => [6 * a * KF.noise(t * 0.7), 5 * a * KF.noise(t * 0.6 + 40), 0.25 * a * KF.noise(t * 0.5 + 80)],
    frame(t, s = {}) { clear(); if (G > 0) { ctx.globalAlpha = 0.09 * G; ctx.globalCompositeOperation = "overlay"; const tl = tiles[Math.floor(t * 24) % 4], ox = Math.floor(KF.hash(Math.floor(t * 24)) * 256), oy = Math.floor(KF.hash(Math.floor(t * 24) + 5) * 256);
        for (let y = -oy; y < h; y += 256) for (let x = -ox; x < w; x += 256) ctx.drawImage(tl, x, y); ctx.globalCompositeOperation = "source-over"; ctx.globalAlpha = 1; }
      if (V > 0) { const g = ctx.createRadialGradient(w / 2, h * 0.48, Math.min(w, h) * 0.34, w / 2, h * 0.48, Math.max(w, h) * 0.78); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, `rgba(0,0,0,${0.75 * V})`); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
      const b = KF.clamp(s.bloom ?? 0); if (b > 0) { const g = ctx.createRadialGradient(w / 2, -h * 0.1, 0, w / 2, -h * 0.1, h * 0.9); g.addColorStop(0, KF.rgba(o.tint || "#ffe9d2", 0.28 * b)); g.addColorStop(1, KF.rgba(o.tint || "#ffe9d2", 0)); ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); ctx.globalCompositeOperation = "source-over"; }
      const f = KF.clamp(s.flash ?? 0); if (f > 0) { ctx.fillStyle = `rgba(255,255,255,${f})`; ctx.fillRect(0, 0, w, h); } } };
});
