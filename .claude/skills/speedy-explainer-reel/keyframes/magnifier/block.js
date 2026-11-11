/* magnifier: a lens that travels over another picture and shows it enlarged (inspect, review, "look closer").
 * opts:  { source: a <canvas> or <img> the same size as this host (e.g. another block's canvas: host.querySelector("canvas")), r: lens radius, zoom, handle: true }
 * state: { x, y: lens centre in host pixels, show: 0..1, r, zoom, ring: colour (e.g. red when it finds a fault, green when fixed) }
 * api:   frame(t, state) */
KF.define("magnifier", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), src = o.source;
  return { frame(t, s = {}) { clear(); const a = KF.clamp(s.show ?? 1); if (a <= 0 || !src) return; const r = (s.r || o.r || 150) * (0.6 + 0.4 * KF.ease.back(a)), z = s.zoom || o.zoom || 2.4, x = s.x ?? w / 2, y = s.y ?? h / 2, ring = s.ring || "#ffffff";
      ctx.globalAlpha = a; if (o.handle !== false) { ctx.lineCap = "round"; ctx.strokeStyle = "#0b0c0f"; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(x + r * 0.72, y + r * 0.72); ctx.lineTo(x + r * 1.45, y + r * 1.45); ctx.stroke(); ctx.strokeStyle = "#e9edf3"; ctx.lineWidth = 20; ctx.stroke(); }
      ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); ctx.fillStyle = "#0b0c0f"; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
      const sw = src.width || src.naturalWidth, sh = src.height || src.naturalHeight, kx = sw / w, ky = sh / h; ctx.drawImage(src, (x - r / z) * kx, (y - r / z) * ky, (2 * r / z) * kx, (2 * r / z) * ky, x - r, y - r, 2 * r, 2 * r);
      const g = ctx.createRadialGradient(x - r * 0.4, y - r * 0.5, r * 0.1, x, y, r); g.addColorStop(0, "rgba(255,255,255,.16)"); g.addColorStop(0.5, "rgba(255,255,255,0)"); g.addColorStop(1, "rgba(0,0,0,.28)"); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.restore();
      ctx.strokeStyle = ring; ctx.lineWidth = 8; ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 24; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.shadowBlur = 0; ctx.globalAlpha = 1; } };
});
