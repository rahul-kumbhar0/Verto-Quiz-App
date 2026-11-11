/* flow-nodes: boxes joined by wires with packets travelling along them (request → server → database, a pipeline, "how X talks to Y").
 * opts:  { nodes: [{ id, label, sub, x, y, w, h, color, at }], edges: [{ from, to, at: time packets start, until, color, rate: packets per second, bend }] }
 * state: { active: [ids] (boxes that glow), dim: [ids] } · api: frame(t, state) · center(id) → [x, y] */
KF.define("flow-nodes", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), C = KF.C, N = {}; (o.nodes || []).forEach(n => (N[n.id] = { w: 330, h: 136, at: 0, color: C.blue, ...n }));
  const E = (o.edges || []).map(e => ({ at: 0, rate: 2.2, bend: 0, ...e }));
  const port = (a, b) => { const dx = b.x - a.x, dy = b.y - a.y; return Math.abs(dx) * a.h > Math.abs(dy) * a.w ? [a.x + Math.sign(dx) * a.w / 2, a.y] : [a.x, a.y + Math.sign(dy) * a.h / 2]; };
  const path = e => { const a = N[e.from], b = N[e.to], p0 = port(a, b), p1 = port(b, a), mx = (p0[0] + p1[0]) / 2, my = (p0[1] + p1[1]) / 2, nx = -(p1[1] - p0[1]), ny = p1[0] - p0[0], L = Math.hypot(nx, ny) || 1; return [p0, [mx + nx / L * e.bend, my + ny / L * e.bend], p1]; };
  const at = (P, q) => { const u = 1 - q; return [u * u * P[0][0] + 2 * u * q * P[1][0] + q * q * P[2][0], u * u * P[0][1] + 2 * u * q * P[1][1] + q * q * P[2][1]]; };
  return {
    frame(t, s = {}) { clear(); const act = s.active || [], dim = s.dim || []; ctx.lineCap = "round";
      E.forEach((e, k) => { const a = N[e.from], b = N[e.to]; if (t < Math.max(a.at, b.at)) return; const P = path(e), col = e.color || C.gold, dr = KF.ease.out(KF.prog(t, Math.max(a.at, b.at) + 0.1, 0.4));
        ctx.strokeStyle = "rgba(255,255,255,.16)"; ctx.lineWidth = 3; ctx.setLineDash([2, 12]); ctx.beginPath(); ctx.moveTo(P[0][0], P[0][1]); const m = at(P, dr); ctx.quadraticCurveTo(KF.lerp(P[0][0], P[1][0], dr), KF.lerp(P[0][1], P[1][1], dr), m[0], m[1]); ctx.stroke(); ctx.setLineDash([]);
        if (t >= e.at && (e.until == null || t < e.until)) { ctx.globalCompositeOperation = "lighter"; const n = Math.max(1, Math.round(e.rate)); for (let i = 0; i < n; i++) { const q = ((t - e.at) * e.rate / n + i / n) % 1; if ((t - e.at) * e.rate / n + i / n < i / n + 0 && q > (t - e.at)) continue;
            for (let tr = 0; tr < 6; tr++) { const qq = q - tr * 0.018; if (qq < 0) break; const p = at(P, qq); ctx.fillStyle = KF.rgba(col, (1 - tr / 6) * 0.9); ctx.beginPath(); ctx.arc(p[0], p[1], 7 - tr * 0.9, 0, 7); ctx.fill(); } }
          ctx.globalCompositeOperation = "source-over"; } });
      Object.values(N).forEach(n => { if (t < n.at) return; const p = KF.spring(t, n.at, { f: 2.6, z: 0.6 }), on = act.includes(n.id), d = dim.includes(n.id), ww = n.w * (0.7 + 0.3 * p), hh = n.h * (0.7 + 0.3 * p), x = n.x - ww / 2, y = n.y - hh / 2;
        ctx.globalAlpha = Math.min(1, p * 1.5) * (d ? 0.35 : 1); if (on) { ctx.shadowColor = n.color; ctx.shadowBlur = 40; }
        ctx.fillStyle = "#15171c"; KF.rr(ctx, x, y, ww, hh, 20); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = on ? n.color : "rgba(255,255,255,.14)"; ctx.lineWidth = on ? 4 : 2; ctx.stroke();
        ctx.fillStyle = n.color; KF.rr(ctx, x + 22, y + hh / 2 - 22, 44, 44, 11); ctx.fill();
        ctx.textAlign = "left"; ctx.fillStyle = C.ink; ctx.font = "800 38px Inter"; ctx.fillText(n.label, x + 84, y + hh / 2 + (n.sub ? -4 : 13)); if (n.sub) { ctx.fillStyle = C.mute; ctx.font = '700 24px "JetBrains Mono"'; ctx.fillText(n.sub, x + 84, y + hh / 2 + 32); }
        ctx.globalAlpha = 1; }); },
    center: id => [N[id].x, N[id].y],
  };
});
