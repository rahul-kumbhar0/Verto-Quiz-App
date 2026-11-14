/* face-fx: creator-style video effects that follow a face, split into a layer BEHIND the person and a layer IN FRONT (so nothing covers the face). Put the back host under your presenter / video and the front host over it.
 * kinds (state.fx):
 *   orbit     real reel covers circle the head on a tilted ring: behind the head at the top, in front lower down
 *   spotlight the lights drop, a soft cone from above keeps the person lit, dust floats in the beam
 *   locked    target brackets snap onto the face and track it, with a scan line and a label
 *   stamp     a big red rubber stamp slams down (wind-up, hit, ink bleed, dust ring, sparks)
 * opts:  { front: host element for the front layer, images: [urls] for orbit (default: our reel covers), word: stamp text ("REJECTED"), label: locked label ("LOCKED ON") }
 * state: { fx, p: 0..1 (how far the effect is in), face: [x, y] in host px, r: face radius, at: [x, y] where the stamp lands, t0: time the stamp hits } · api: frame(t, state) */
KF.define("face-fx", (host, o) => {
  const B = KF.canvas(host), F = KF.canvas(o.front || host), imgs = (o.images || KF.covers(8)).map(KF.img), word = o.word || "REJECTED", C = KF.C;
  const card = (ctx, im, x, y, hh, a, rot) => { const ww = hh * 0.5625; ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha = a; ctx.shadowColor = "rgba(0,0,0,.6)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 12; KF.rr(ctx, -ww / 2, -hh / 2, ww, hh, ww * 0.13); ctx.fillStyle = "#1b1d23"; ctx.fill(); ctx.shadowColor = "transparent"; ctx.save(); ctx.clip();
    if (im.complete && im.naturalWidth) ctx.drawImage(im, -ww / 2, -hh / 2, ww, hh); const g = ctx.createLinearGradient(-ww / 2, -hh / 2, ww / 2, hh / 2); g.addColorStop(0, "rgba(255,255,255,.22)"); g.addColorStop(0.35, "rgba(255,255,255,0)"); ctx.fillStyle = g; ctx.fillRect(-ww / 2, -hh / 2, ww, hh); ctx.restore();
    ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); };
  const FX = {
    orbit(t, s, p, f, r) { const n = imgs.length, cy = f[1] - r * 1.35, rx = r * 3.1, ry = r * 0.62, e = KF.ease.out(p);
      for (let i = 0; i < n; i++) { const a = t * 1.5 + i / n * 6.283, z = Math.sin(a), x = f[0] + Math.cos(a) * rx * e, y = cy + z * ry * e - (1 - e) * r, back = z < 0, k = 0.8 + 0.28 * z, q = KF.clamp(p * 1.6 - i * 0.07);
        card(back ? B.ctx : F.ctx, imgs[i], x, y, r * 1.5 * k * (0.5 + 0.5 * KF.ease.out(q)), (back ? 0.72 : 1) * Math.min(1, q * 2), Math.cos(a) * 0.14); } },
    spotlight(t, s, p, f, r) { const ctx = F.ctx, w = F.w, h = F.h, e = KF.ease.inOut(p); ctx.save(); ctx.fillStyle = `rgba(3,4,8,${(0.86 * e).toFixed(3)})`; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "destination-out"; const g = ctx.createRadialGradient(f[0], f[1] + r * 1.2, r * 0.6, f[0], f[1] + r * 1.2, r * 4.2); g.addColorStop(0, "rgba(0,0,0,1)"); g.addColorStop(0.55, "rgba(0,0,0,.85)"); g.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter"; const top = f[1] - r * 6.5, cone = ctx.createLinearGradient(0, top, 0, f[1] + r * 4); cone.addColorStop(0, `rgba(255,244,214,${(0.34 * e).toFixed(3)})`); cone.addColorStop(1, "rgba(255,244,214,0)"); ctx.fillStyle = cone; ctx.filter = "blur(14px)";
      ctx.beginPath(); ctx.moveTo(f[0] - r * 0.5, top); ctx.lineTo(f[0] + r * 0.5, top); ctx.lineTo(f[0] + r * 3.6, f[1] + r * 4); ctx.lineTo(f[0] - r * 3.6, f[1] + r * 4); ctx.closePath(); ctx.fill(); ctx.filter = "none";
      for (let i = 0; i < 46; i++) { const u = KF.hash(i * 7 + 1), v = (KF.hash(i * 13 + 5) + t * (0.02 + 0.03 * KF.hash(i))) % 1, yy = top + v * (r * 10), half = r * 0.5 + (yy - top) / (r * 10.5) * r * 3.1, xx = f[0] + (u - 0.5) * 2 * half + Math.sin(t * 0.8 + i) * 8; ctx.fillStyle = `rgba(255,240,205,${(0.55 * e * (0.3 + 0.7 * KF.hash(i * 3))).toFixed(3)})`; ctx.beginPath(); ctx.arc(xx, yy, 1.5 + 2.5 * KF.hash(i * 5), 0, 7); ctx.fill(); }
      // the lamp at the top of the beam
      ctx.fillStyle = `rgba(255,250,235,${(0.95 * e).toFixed(3)})`; ctx.shadowColor = "#fff2c8"; ctx.shadowBlur = 50; ctx.beginPath(); ctx.ellipse(f[0], top + 6, r * 0.55, r * 0.12, 0, 0, 7); ctx.fill(); ctx.restore(); },
    locked(t, s, p, f, r) { const ctx = F.ctx, e = KF.ease.out(p), half = r * (2.7 - 1.45 * e), L = r * 0.55, col = p > 0.75 ? "#3ECF8E" : "#F3F1EC", x = f[0], y = f[1]; ctx.save(); ctx.globalAlpha = Math.min(1, p * 3); ctx.strokeStyle = col; ctx.lineWidth = 7; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.shadowColor = col; ctx.shadowBlur = p > 0.75 ? 22 : 8;
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.moveTo(x + sx * half, y + sy * (half - L)); ctx.lineTo(x + sx * half, y + sy * half); ctx.lineTo(x + sx * (half - L), y + sy * half); ctx.stroke(); });
      ctx.lineWidth = 3; ctx.shadowBlur = 0; [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(([sx, sy]) => { ctx.beginPath(); ctx.moveTo(x + sx * (half + 14), y + sy * (half + 14)); ctx.lineTo(x + sx * (half + 40), y + sy * (half + 40)); ctx.stroke(); });
      if (p > 0.2) { const sy = y - half + ((t * 0.9) % 1) * half * 2, g = ctx.createLinearGradient(0, sy - 40, 0, sy); g.addColorStop(0, KF.rgba("#3ECF8E", 0)); g.addColorStop(1, KF.rgba("#3ECF8E", 0.3)); ctx.fillStyle = g; ctx.fillRect(x - half + 8, sy - 40, half * 2 - 16, 40); ctx.fillStyle = KF.rgba("#3ECF8E", 0.9); ctx.fillRect(x - half + 8, sy, half * 2 - 16, 3); }
      if (p > 0.75) { const lb = o.label || "LOCKED ON"; ctx.font = '700 28px "JetBrains Mono"'; const tw = ctx.measureText(lb).width + 54; ctx.fillStyle = "#3ECF8E"; KF.rr(ctx, x - half, y - half - 58, tw, 44, 10); ctx.fill(); ctx.fillStyle = "#062414"; ctx.beginPath(); ctx.arc(x - half + 22, y - half - 36, 7 * (0.6 + 0.4 * Math.abs(Math.sin(t * 6))), 0, 7); ctx.fill(); ctx.textBaseline = "middle"; ctx.textAlign = "left"; ctx.fillText(lb, x - half + 40, y - half - 34); }
      ctx.restore(); },
    stamp(t, s, p, f, r) { const ctx = F.ctx, t0 = s.t0 ?? 0, d = t - t0, at = s.at || [f[0], f[1] + r * 2.6]; if (d < -0.28) return; const k = d < 0 ? 1 + 2.6 * KF.ease.in(-d / 0.28) : 1 + 0.07 * Math.max(0, 1 - d / 0.12), a = d < 0 ? 1 + d / 0.28 : 1, RED = "#e5262b";
      ctx.save(); ctx.translate(at[0], at[1]); ctx.rotate(-0.19 + (d < 0 ? d * 0.6 : 0)); ctx.scale(k, k); ctx.globalAlpha = KF.clamp(a) * (d < 0 ? 0.75 : 0.94); ctx.font = `900 ${r * 0.95}px Inter`; const tw = ctx.measureText(word).width, bw = tw + r * 0.9, bh = r * 1.55;
      if (d < 0) { ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 40; ctx.shadowOffsetY = 40 * (k - 1); }
      ctx.strokeStyle = RED; ctx.lineWidth = r * 0.13; KF.rr(ctx, -bw / 2, -bh / 2, bw, bh, r * 0.2); ctx.stroke(); ctx.shadowColor = "transparent"; ctx.lineWidth = r * 0.04; KF.rr(ctx, -bw / 2 + r * 0.14, -bh / 2 + r * 0.14, bw - r * 0.28, bh - r * 0.28, r * 0.12); ctx.stroke();
      ctx.fillStyle = RED; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(word, 0, r * 0.05);
      // worn ink: knock small specks out of the stamp
      ctx.globalCompositeOperation = "destination-out"; for (let i = 0; i < 150; i++) { ctx.fillStyle = `rgba(0,0,0,${0.35 + 0.5 * KF.hash(i * 3)})`; ctx.beginPath(); ctx.ellipse((KF.hash(i) - 0.5) * bw * 1.05, (KF.hash(i + 99) - 0.5) * bh * 1.1, 2 + 9 * KF.hash(i * 7), 1 + 3 * KF.hash(i * 11), KF.hash(i * 5) * 3, 0, 7); ctx.fill(); }
      ctx.restore(); if (d >= 0 && d < 0.5) { const q = d / 0.5; ctx.save(); ctx.strokeStyle = KF.rgba("#ffffff", (1 - q) * 0.7); ctx.lineWidth = 8 * (1 - q) + 1; ctx.beginPath(); ctx.ellipse(at[0], at[1], bw * 0.5 + KF.ease.out(q) * r * 2.4, bh * 0.5 + KF.ease.out(q) * r * 1.3, -0.19, 0, 7); ctx.stroke(); ctx.restore(); }
      KF.sparks(ctx, t, t0, at[0], at[1], { n: 26, color: "#ff6b6b", speed: 620, life: 0.7, size: 5, seed: 3 }); },
  };
  return { frame(t, s = {}) { B.clear(); F.clear(); const p = KF.clamp(s.p ?? 1); if (!s.fx || !FX[s.fx] || (p <= 0 && s.fx !== "stamp")) return; FX[s.fx](t, s, p, s.face || [B.w / 2, B.h / 2], s.r || 110); } };
});
