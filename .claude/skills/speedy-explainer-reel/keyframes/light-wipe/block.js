/* light-wipe: an anamorphic light streak crosses the picture to change scenes: a bright core line, a wide horizontal lens streak, flare ghosts, colour fringing at the edge and sparkles left in its wake.
 * opts:  { color: tint of the streak, dir: "x"|"y", angle: degrees of tilt (default 8), width: core px }
 * state: { p: 0..1 (bar position), cover: colour that fills the side the bar has passed (use the next scene's background) } · api: frame(t, state) · edge(p) → bar position in px (clip the new scene to it: clip-path inset(0 calc(100% - edge px) 0 0))
 * Put its host above both scenes. */
KF.define("light-wipe", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), col = o.color || "#9ad8ff", ver = o.dir === "y", L = ver ? h : w, bw = o.width || 10, ang = (o.angle ?? 8) * Math.PI / 180;
  const edge = p => KF.ease.inOut(KF.clamp(p)) * (L + 400) - 200;
  return { edge, frame(t, s = {}) { clear(); const p = KF.clamp(s.p ?? 0); if (p <= 0 || p >= 1) return; const e = edge(p), speed = Math.sin(Math.PI * p), cx = ver ? w / 2 : e, cy = ver ? e : h * 0.45;
      if (s.cover) { ctx.fillStyle = s.cover; ver ? ctx.fillRect(0, 0, w, e) : ctx.fillRect(0, 0, e, h); }
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ver ? Math.PI / 2 + ang : ang); ctx.globalCompositeOperation = "lighter";
      // wide soft glow, then the motion smear behind the bar, then the core
      let g = ctx.createLinearGradient(-320, 0, 320, 0); g.addColorStop(0, KF.rgba(col, 0)); g.addColorStop(0.5, KF.rgba(col, 0.45)); g.addColorStop(1, KF.rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(-320, -h * 1.2, 640, h * 2.4);
      g = ctx.createLinearGradient(-500 * speed, 0, 0, 0); g.addColorStop(0, KF.rgba(col, 0)); g.addColorStop(1, KF.rgba(col, 0.35)); ctx.fillStyle = g; ctx.fillRect(-500 * speed, -h * 1.2, 500 * speed, h * 2.4);
      ctx.fillStyle = KF.rgba("#ff4f7a", 0.5); ctx.fillRect(-bw * 1.6 - 6, -h * 1.2, bw, h * 2.4); ctx.fillStyle = KF.rgba("#4fd6ff", 0.5); ctx.fillRect(bw * 0.6 + 6, -h * 1.2, bw, h * 2.4); ctx.fillStyle = "#fff"; ctx.fillRect(-bw / 2, -h * 1.2, bw, h * 2.4);
      ctx.restore(); ctx.save(); ctx.globalCompositeOperation = "lighter";
      // anamorphic streak through the hot spot + flare ghosts on the opposite side of centre
      const hs = ver ? [w * 0.5, e] : [e, h * 0.4]; g = ctx.createLinearGradient(0, hs[1], w, hs[1]); g.addColorStop(0, KF.rgba(col, 0)); g.addColorStop(KF.clamp(hs[0] / w), KF.rgba("#ffffff", 0.9)); g.addColorStop(1, KF.rgba(col, 0)); ctx.fillStyle = g; ctx.fillRect(0, hs[1] - 3, w, 6); ctx.fillStyle = KF.rgba(col, 0.25); ctx.fillRect(0, hs[1] - 14, w, 28);
      const rg = ctx.createRadialGradient(hs[0], hs[1], 0, hs[0], hs[1], 160); rg.addColorStop(0, "rgba(255,255,255,.95)"); rg.addColorStop(0.2, KF.rgba(col, 0.6)); rg.addColorStop(1, KF.rgba(col, 0)); ctx.fillStyle = rg; ctx.fillRect(hs[0] - 160, hs[1] - 160, 320, 320);
      [[0.4, 46, "#7fd0ff"], [0.75, 24, "#ffd166"], [1.15, 70, "#a78bfa"], [1.5, 16, "#ffffff"]].forEach(([k, r, c2]) => { const fx = w / 2 + (w / 2 - hs[0]) * k, fy = h / 2 + (h / 2 - hs[1]) * k, rg2 = ctx.createRadialGradient(fx, fy, 0, fx, fy, r); rg2.addColorStop(0, KF.rgba(c2, 0.28 * speed)); rg2.addColorStop(0.7, KF.rgba(c2, 0.12 * speed)); rg2.addColorStop(1, KF.rgba(c2, 0)); ctx.fillStyle = rg2; ctx.beginPath(); ctx.arc(fx, fy, r, 0, 7); ctx.fill(); });
      for (let i = 0; i < 40; i++) { const lag = KF.hash(i) * 0.25, q = KF.clamp((p - lag) / (1 - lag)); if (q <= 0) continue; const se = edge(q) - 60 * KF.hash(i + 2), y = KF.hash(i * 3.7) * h, life = KF.clamp(1 - (p - lag) * 4), x = ver ? KF.hash(i * 3.7) * w : se, yy = ver ? se : y;
        if (life <= 0) continue; ctx.fillStyle = KF.rgba("#ffffff", 0.8 * life); ctx.beginPath(); ctx.arc(x, yy, 1.5 + 2.5 * KF.hash(i + 9), 0, 7); ctx.fill(); }
      ctx.restore(); } };
});
