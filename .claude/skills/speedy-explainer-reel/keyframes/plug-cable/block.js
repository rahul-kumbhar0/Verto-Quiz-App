/* plug-cable: a real cable with a plug that drives into a socket: the cable hangs slack while it is unplugged, the plug thrusts in with a small recoil, sparks and a shock ring fly, the socket LED turns green, and light packets start running along the cable ("connect X to Y", "plug it in", a connector, an integration).
 * opts:  { from: [x, y] (where the cable starts), to: [x, y] (the socket mouth), color, tone: "dark"|"light" (the background it sits on), sag: px of slack, gap: px the plug waits back, thick, socket: false to draw no socket plate, packets: per second }
 * state: { show: 0..1, at: time the plug seats (the block does the wind-up, thrust and recoil itself), out: time it is pulled back out (optional), p: 0..1 (override: 0 = waiting, 1 = seated), flow: 0..1 (packet brightness), color, back: true = packets run to → from }
 * api:   frame(t, state) · KF.drawCable(ctx, t, spec) is the shared painter (connector-hub uses it): spec = { from, to, p, power, flow, color, tone, sag, gap, thick, hitAt, socket, seed, back } */
(function () {
  const bz = (P, q) => { const u = 1 - q; return [u * u * u * P[0][0] + 3 * u * u * q * P[1][0] + 3 * u * q * q * P[2][0] + q * q * q * P[3][0], u * u * u * P[0][1] + 3 * u * u * q * P[1][1] + 3 * u * q * q * P[2][1] + q * q * q * P[3][1]]; };
  /** seat progress from a seat time: waits (0), winds back a little, thrusts in past 1, settles */
  KF.plugP = (t, at, out) => { let p = KF.keys(t, [[at - 0.42, 0], [at - 0.2, -0.12, "inOut"], [at, 1.06, "in"], [at + 0.1, 0.97, "out"], [at + 0.22, 1, "inOut"]]); if (out != null && t > out - 0.25) p = Math.min(p, 1 - KF.ease.in(KF.prog(t, out - 0.25, 0.25))); return p; };
  KF.drawCable = (ctx, t, s) => {
    const dk = (s.tone || "dark") !== "light", col = s.color || KF.C.accent, th = s.thick || 16, gap = s.gap ?? 110, p = s.p ?? 0, pw = KF.clamp(s.power ?? 0), sd = s.seed || 0;
    const A = s.from, B = s.to, L0 = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, dx = (B[0] - A[0]) / L0, dy = (B[1] - A[1]) / L0, ang = Math.atan2(dy, dx), k = th / 16;
    const loose = KF.clamp(1 - p), sway = Math.sin(t * 2.6 + sd * 1.7) * 7 * loose, depth = 22 * k;
    const tip = [B[0] + dx * (depth - (gap + depth) * (1 - p)) - dy * sway, B[1] + dy * (depth - (gap + depth) * (1 - p)) + dx * sway], PL = 122 * k, R = [tip[0] - dx * PL, tip[1] - dy * PL];
    const len = Math.hypot(R[0] - A[0], R[1] - A[1]), sag = (s.sag ?? 46) * (0.35 + 0.65 * loose) + Math.sin(t * 1.9 + sd) * 5 * loose;
    const P = [A, [A[0] + dx * len * 0.38, A[1] + dy * len * 0.38 + sag], [R[0] - dx * len * 0.34, R[1] - dy * len * 0.34 + sag * 0.7], R];
    const trace = () => { ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); ctx.bezierCurveTo(P[1][0], P[1][1], P[2][0], P[2][1], P[3][0], P[3][1]); };
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    // shadow under the cable
    ctx.save(); ctx.translate(0, th * 0.9); ctx.filter = "blur(8px)"; ctx.strokeStyle = dk ? "rgba(0,0,0,.55)" : "rgba(20,24,40,.22)"; ctx.lineWidth = th; trace(); ctx.stroke(); ctx.restore();
    // rubber body: edge, body, top highlight
    ctx.strokeStyle = dk ? "#0a0b0e" : "#14161b"; ctx.lineWidth = th + 3; trace(); ctx.stroke();
    ctx.strokeStyle = dk ? "#d9dce3" : "#2d3039"; ctx.lineWidth = th; trace(); ctx.stroke();
    ctx.save(); ctx.translate(-th * 0.1, -th * 0.24); ctx.strokeStyle = dk ? "rgba(255,255,255,.85)" : "rgba(255,255,255,.28)"; ctx.lineWidth = th * 0.22; trace(); ctx.stroke(); ctx.restore();
    ctx.save(); ctx.translate(0, th * 0.26); ctx.strokeStyle = dk ? "rgba(60,66,84,.5)" : "rgba(0,0,0,.4)"; ctx.lineWidth = th * 0.24; trace(); ctx.stroke(); ctx.restore();
    // power: a lit core + packets
    if (pw > 0.01) { ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 26 * pw; ctx.strokeStyle = KF.rgba(col, 0.92 * pw); ctx.lineWidth = th * 0.42; trace(); ctx.stroke(); ctx.restore();
      const fl = KF.clamp(s.flow ?? 1) * pw; if (fl > 0.01) { ctx.save(); ctx.globalCompositeOperation = dk ? "lighter" : "source-over"; const n = Math.max(2, Math.round(len / 150)), rate = s.packets || 0.9;
        for (let i = 0; i < n; i++) { let q = (t * rate + i / n + sd * 0.137) % 1; if (s.back) q = 1 - q; for (let tr = 0; tr < 7; tr++) { const qq = q + (s.back ? 1 : -1) * tr * 0.014; if (qq < 0 || qq > 1) break; const c = bz(P, qq); ctx.fillStyle = dk ? KF.rgba("#ffffff", (1 - tr / 7) * 0.95 * fl) : KF.rgba("#ffffff", (1 - tr / 7) * fl); ctx.beginPath(); ctx.arc(c[0], c[1], th * (0.36 - tr * 0.03), 0, 7); ctx.fill(); } }
        ctx.restore(); } }
    // plug (drawn in its own frame: +x points at the socket, the tip ends at x = 0)
    const plug = part => { ctx.save(); ctx.translate(tip[0], tip[1]); ctx.rotate(ang); ctx.scale(k, k);
      if (part === "tip") { const g = ctx.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, "#f4f6f9"); g.addColorStop(0.45, "#b9bec8"); g.addColorStop(0.55, "#8d93a0"); g.addColorStop(1, "#dfe3ea"); ctx.fillStyle = g; KF.rr(ctx, -34, -11, 34, 22, 8); ctx.fill(); ctx.strokeStyle = "rgba(0,0,0,.35)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.fillStyle = "rgba(20,22,28,.75)"; KF.rr(ctx, -9, -5, 7, 10, 2); ctx.fill(); }
      else { // strain relief, then the housing with a colour band
        ctx.fillStyle = dk ? "#c3c7cf" : "#23262d"; ctx.beginPath(); ctx.moveTo(-122, -8); ctx.lineTo(-96, -15); ctx.lineTo(-96, 15); ctx.lineTo(-122, 8); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = dk ? "rgba(0,0,0,.28)" : "rgba(255,255,255,.2)"; ctx.lineWidth = 2; for (let i = 0; i < 4; i++) { const x = -118 + i * 6; ctx.beginPath(); ctx.moveTo(x, -9 - i * 1.4); ctx.lineTo(x, 9 + i * 1.4); ctx.stroke(); }
        const g = ctx.createLinearGradient(0, -26, 0, 26); if (dk) { g.addColorStop(0, "#ffffff"); g.addColorStop(0.5, "#d4d8df"); g.addColorStop(1, "#9ea4b0"); } else { g.addColorStop(0, "#565b67"); g.addColorStop(0.5, "#2b2e36"); g.addColorStop(1, "#15171c"); }
        ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 8; ctx.fillStyle = g; KF.rr(ctx, -98, -26, 66, 52, 13); ctx.fill(); ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        ctx.strokeStyle = dk ? "rgba(0,0,0,.3)" : "rgba(0,0,0,.6)"; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255," + (dk ? 0.7 : 0.16) + ")"; KF.rr(ctx, -92, -22, 54, 7, 3.5); ctx.fill();
        ctx.fillStyle = KF.rgba(col, 0.35 + 0.65 * pw); if (pw > 0.05) { ctx.shadowColor = col; ctx.shadowBlur = 16 * pw; } KF.rr(ctx, -46, -26, 9, 52, 3); ctx.fill(); }
      ctx.restore(); };
    plug("tip");
    if (s.socket !== false) { ctx.save(); ctx.translate(B[0], B[1]); ctx.rotate(ang); ctx.scale(k, k); // the socket plate, mouth at x = 0
      const g = ctx.createLinearGradient(0, -40, 0, 40); g.addColorStop(0, "#3d414c"); g.addColorStop(1, "#16181d"); ctx.shadowColor = "rgba(0,0,0,.4)"; ctx.shadowBlur = 12; ctx.fillStyle = g; KF.rr(ctx, -4, -40, 30, 80, 9); ctx.fill(); ctx.shadowBlur = 0; ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255,255,255,.22)"; ctx.lineWidth = 1.5; ctx.stroke(); ctx.fillStyle = "#050608"; KF.rr(ctx, -4, -14, 16, 28, 5); ctx.fill();
      const led = pw > 0.5 ? "#3ECF8E" : "#ff5a5a"; ctx.fillStyle = led; ctx.shadowColor = led; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(14, -27, 5, 0, 7); ctx.fill(); ctx.restore(); }
    plug("body");
    // the hit: flash ring + sparks at the socket mouth
    if (s.hitAt != null) { const d = t - s.hitAt; if (d >= 0 && d < 0.5) { const q = d / 0.5; ctx.save(); ctx.globalCompositeOperation = dk ? "lighter" : "source-over"; ctx.strokeStyle = KF.rgba(col, (1 - q) * 0.9); ctx.lineWidth = 7 * (1 - q) + 1; ctx.beginPath(); ctx.arc(B[0], B[1], 18 + KF.ease.out(q) * 96 * k, 0, 7); ctx.stroke();
        if (d < 0.12) { ctx.fillStyle = KF.rgba("#ffffff", (1 - d / 0.12) * 0.85); ctx.beginPath(); ctx.arc(B[0], B[1], 30 * k, 0, 7); ctx.fill(); } ctx.restore(); }
      KF.sparks(ctx, t, s.hitAt, B[0], B[1], { n: 20, color: dk ? col : col, speed: 460 * k, life: 0.6, size: 4, seed: 7 + sd, spread: [ang + 1.9, ang + 4.4] }); }
    ctx.restore(); return { tip, P };
  };
  KF.define("plug-cable", (host, o) => {
    const { ctx, clear } = KF.canvas(host);
    return { frame(t, s = {}) { clear(); const sh = s.show ?? 1; if (sh <= 0) return; const seat = s.at != null, p = s.p ?? (seat ? KF.plugP(t, s.at, s.out) : 0), on = seat && t >= s.at && (s.out == null || t < s.out - 0.2);
        ctx.globalAlpha = sh; KF.drawCable(ctx, t, { ...o, color: s.color || o.color, p, power: s.power ?? (on ? KF.prog(t, s.at, 0.25) : 0), flow: s.flow ?? 1, hitAt: seat ? s.at : null, back: s.back }); ctx.globalAlpha = 1; } };
  });
})();
