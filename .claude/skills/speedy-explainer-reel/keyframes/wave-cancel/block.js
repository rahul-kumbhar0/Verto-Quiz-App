/* wave-cancel: one wave, its opposite, and what is left when they meet (noise cancelling, interference, "two things that cancel out").
 * opts:  { labels: ["noise", "anti-noise", "what you hear"], colors: [a, b, sum], freq, amp }
 * state: { a: 0..1 size of wave A, b: 0..1 size of the opposite wave, merge: 0..1 (the two lanes slide together), sum: 0..1 show the result lane, speed }
 * api:   frame(t, state) */
KF.define("wave-cancel", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), L = o.labels || ["noise", "anti-noise", "what you hear"], col = o.colors || [KF.C.gold, KF.C.sky, KF.C.ink], fr = o.freq || 2.6, amp = o.amp || h * 0.085;
  function wave(y, A, ph, c, a, sign, rough) { ctx.beginPath(); for (let x = 60; x <= w - 60; x += 4) { const u = (x - 60) / (w - 120), env = Math.sin(Math.PI * u) ** 0.6;
      const v = Math.sin(u * fr * 2 * Math.PI - ph) + 0.35 * Math.sin(u * fr * 4.6 * Math.PI - ph * 1.7) + (rough ? 0.12 * KF.noise(x * 0.05 + ph * 3) : 0); const yy = y + sign * A * env * v; x === 60 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy); }
    ctx.strokeStyle = KF.rgba(c, 0.18 * a); ctx.lineWidth = 16; ctx.stroke(); ctx.strokeStyle = KF.rgba(c, a); ctx.lineWidth = 4.5; ctx.stroke(); }
  function label(txt, y, c, a) { ctx.font = '800 26px Inter'; ctx.fillStyle = KF.rgba(c, a); ctx.textAlign = "left"; ctx.fillText(txt.toUpperCase().split("").join(" "), 60, y); }
  return { frame(t, s = {}) { clear(); const a = KF.clamp(s.a ?? 1), b = KF.clamp(s.b ?? 0), m = KF.ease.inOut(KF.clamp(s.merge ?? 0)), sm = KF.clamp(s.sum ?? 0), ph = t * (s.speed ?? 1) * 3.2;
      ctx.lineCap = ctx.lineJoin = "round"; ctx.globalCompositeOperation = "lighter";
      const y1 = KF.lerp(h * 0.2, h * 0.36, m), y2 = KF.lerp(h * 0.52, h * 0.36, m), y3 = h * 0.82;
      ctx.strokeStyle = "rgba(255,255,255,.08)"; ctx.lineWidth = 2; [y1, y2, y3].forEach((y, i) => { if (i < 2 || sm > 0) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(w - 60, y); ctx.stroke(); } });
      if (a > 0) wave(y1, amp * a, ph, col[0], 1, 1, true); if (b > 0) wave(y2, amp * b, ph, col[1], b, -1, false);
      if (sm > 0) wave(y3, amp * Math.max(0.02, a - b * a), ph, col[2], sm, 1, a - b > 0.2);
      ctx.globalCompositeOperation = "source-over"; label(L[0], y1 - amp - 34, col[0], a * (1 - m * 0.4)); if (b > 0) label(L[1], KF.lerp(y2 - amp - 34, y2 + amp + 52, m), col[1], b); if (sm > 0) label(L[2], y3 - amp * 0.6 - 30, col[2], sm); } };
});
