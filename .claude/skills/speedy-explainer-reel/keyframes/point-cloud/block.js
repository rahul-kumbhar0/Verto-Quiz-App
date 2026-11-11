/* point-cloud: clusters of dots in 3D space that the camera orbits (embeddings, customers, "things that are similar sit together").
 * opts:  { clusters: [{ name, color, center: [x, y, z] (−1..1), n, spread }], scale: px per unit, floor: true }
 * state: { rot: radians (orbit), pitch, show: 0..1 (dots arrive), names: 0..1 (cluster names), arrow: { from: [x,y,z], to: [x,y,z], p: 0..1, color, label },
 *          lift: { i: cluster index, y: amount } , squash: 0..1 (remove the arrow's direction from every dot: the "abliteration" move) }
 * api:   frame(t, state) · project([x,y,z]) → [x, y] host pixels */
KF.define("point-cloud", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), C = KF.C, sc = o.scale || w * 0.3, cl = o.clusters || [
    { name: "cooking", color: C.gold, center: [-0.7, 0.1, 0.3], n: 46 }, { name: "coding", color: C.blue, center: [0.7, 0.05, 0.4], n: 46 },
    { name: "music", color: C.violet, center: [-0.2, 0.1, -0.7], n: 40 }, { name: "refused", color: C.red, center: [0.15, -0.75, -0.1], n: 40 }];
  const pts = []; cl.forEach((c, ci) => { for (let i = 0; i < (c.n || 40); i++) { const sp = c.spread || 0.2, k = ci * 1000 + i; pts.push({ ci, p: [c.center[0] + sp * KF.gauss(k), c.center[1] + sp * 0.8 * KF.gauss(k + 0.3), c.center[2] + sp * KF.gauss(k + 0.7)], o: KF.hash(k * 3) }); } });
  let R = { rot: 0, pitch: 0.35 };
  const proj = ([x, y, z]) => { const c = Math.cos(R.rot), s = Math.sin(R.rot), x1 = x * c - z * s, z1 = x * s + z * c, cp = Math.cos(R.pitch), spp = Math.sin(R.pitch), y1 = y * cp - z1 * spp, z2 = y * spp + z1 * cp, f = 3.2 / (3.2 + z2);
    return [w / 2 + x1 * sc * f, h * 0.52 + y1 * sc * f, z2, f]; };
  return {
    frame(t, s = {}) { clear(); R = { rot: s.rot ?? t * 0.25, pitch: s.pitch ?? 0.36 }; const show = KF.clamp(s.show ?? 1), sq = KF.clamp(s.squash ?? 0), ar = s.arrow;
      let dir = null; if (ar) { const d = [ar.to[0] - ar.from[0], ar.to[1] - ar.from[1], ar.to[2] - ar.from[2]], L = Math.hypot(...d) || 1; dir = d.map(v => v / L); }
      if (o.floor !== false) { ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.lineWidth = 1; for (let i = -5; i <= 5; i++) { let a = proj([i / 4, 0.55, -1.25]), b = proj([i / 4, 0.55, 1.25]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
          a = proj([-1.25, 0.55, i / 4]); b = proj([1.25, 0.55, i / 4]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); } }
      const dr = pts.map(P => { let p = P.p.slice(); if (s.lift && s.lift.i === P.ci) p[1] -= s.lift.y; if (dir && sq > 0) { const d = (p[0] - ar.from[0]) * dir[0] + (p[1] - ar.from[1]) * dir[1] + (p[2] - ar.from[2]) * dir[2]; p = p.map((v, k) => v - dir[k] * d * sq); }
        const q = proj(p); return { q, P }; }).sort((a, b) => b.q[2] - a.q[2]);
      ctx.globalCompositeOperation = "lighter"; dr.forEach(({ q, P }) => { const a = KF.clamp((show * 1.4 - P.o) * 4); if (a <= 0) return; const c = cl[P.ci].color, r = 7.5 * q[3] * (0.8 + 0.2 * KF.ease.back(a));
        ctx.fillStyle = KF.rgba(c, 0.16 * a); ctx.beginPath(); ctx.arc(q[0], q[1], r * 2.6, 0, 7); ctx.fill(); ctx.fillStyle = KF.rgba(c, 0.95 * a); ctx.beginPath(); ctx.arc(q[0], q[1], r, 0, 7); ctx.fill(); });
      if (ar && ar.p > 0) { const p = KF.ease.out(KF.clamp(ar.p)), a = proj(ar.from), e = proj(ar.from.map((v, k) => KF.lerp(v, ar.to[k], p))), col = ar.color || C.red;
        ctx.strokeStyle = KF.rgba(col, 0.25); ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); ctx.strokeStyle = col; ctx.lineWidth = 4; ctx.stroke();
        const an = Math.atan2(e[1] - a[1], e[0] - a[0]); ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(e[0] + 18 * Math.cos(an), e[1] + 18 * Math.sin(an)); ctx.lineTo(e[0] + 14 * Math.cos(an + 2.5), e[1] + 14 * Math.sin(an + 2.5)); ctx.lineTo(e[0] + 14 * Math.cos(an - 2.5), e[1] + 14 * Math.sin(an - 2.5)); ctx.fill();
        ctx.globalCompositeOperation = "source-over"; if (ar.label) { ctx.font = "800 26px Inter"; ctx.fillStyle = col; ctx.textAlign = "left"; ctx.globalAlpha = KF.clamp(ar.p * 2 - 1); ctx.fillText(ar.label, e[0] + 24, e[1] - 10); ctx.globalAlpha = 1; } }
      ctx.globalCompositeOperation = "source-over"; const nm = KF.clamp(s.names ?? 0); if (nm > 0) cl.forEach((c, i) => { let cc = c.center.slice(); if (s.lift && s.lift.i === i) cc[1] -= s.lift.y; const q = proj([cc[0], cc[1] + 0.34, cc[2]]);
        ctx.font = "800 30px Inter"; ctx.textAlign = "center"; const tw = ctx.measureText(c.name).width; ctx.fillStyle = `rgba(12,12,15,${0.82 * nm})`; KF.rr(ctx, q[0] - tw / 2 - 16, q[1] - 34, tw + 32, 48, 24); ctx.fill(); ctx.fillStyle = KF.rgba(c.color, nm); ctx.fillText(c.name, q[0], q[1]); }); },
    project: p => proj(p).slice(0, 2),
  };
});
