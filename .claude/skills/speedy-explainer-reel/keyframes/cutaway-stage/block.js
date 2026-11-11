/* cutaway-stage: a magnified cross-section. Layers stacked at the bottom, one hero object (finger / pen / none) coming down onto them.
 * opts:  { top: y of the first layer (default 62% of host height), hero: "finger"|"pen"|"none", heroX: 0..1,
 *          layers: [{ name, h, kind: "glass"|"wires"|"pixels"|"mesh"|"dots"|"solid", color }] }
 * state: { touch: 0..1 (hero away → touching), glow: 0..1 (light where it touches), zoom: 1.., focus: [x, y] (zoom centre), heroX: 0..1 }
 * api:   frame(t, state) · anchor(name) → [x, y] in host pixels for a layer name, "tip" (hero tip) or "hero" (hero body) — feed these to tracked-labels */
KF.define("cutaway-stage", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), C = KF.C, top = o.top ?? h * 0.62, hero = o.hero || "finger";
  const layers = o.layers || [{ name: "glass", h: 46, kind: "glass" }, { name: "wires", h: 34, kind: "wires" }, { name: "pixels", h: 26, kind: "pixels" }, { name: "body", h: 400, kind: "mesh" }];
  let M = { z: 1, fx: w / 2, fy: top, tipX: w / 2, tipY: top, ys: [] };
  const toHost = (x, y) => [(x - M.fx) * M.z + M.fx, (y - M.fy) * M.z + M.fy];
  function drawLayer(L, y) {
    const k = L.kind || "solid";
    if (k === "glass") { const g = ctx.createLinearGradient(0, y, 0, y + L.h); g.addColorStop(0, "rgba(170,200,230,.34)"); g.addColorStop(0.12, "rgba(120,150,185,.16)"); g.addColorStop(1, "rgba(90,110,140,.10)");
      ctx.fillStyle = g; ctx.fillRect(-w, y, 3 * w, L.h); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.fillRect(-w, y, 3 * w, 2); }
    else if (k === "wires") { ctx.fillStyle = "#101216"; ctx.fillRect(-w, y, 3 * w, L.h); const s = L.step || 60;
      for (let x = -w; x < 2 * w; x += s) { ctx.fillStyle = L.color || "#d9dde6"; KF.rr(ctx, x + s * 0.2, y + L.h * 0.3, s * 0.6, L.h * 0.4, 6); ctx.fill(); } }
    else if (k === "pixels") { ctx.fillStyle = "#07080a"; ctx.fillRect(-w, y, 3 * w, L.h); const s = L.step || 14, col = ["#ff4d4d", "#3ddc6b", "#4b8bff"];
      for (let x = -w, i = 0; x < 2 * w; x += s, i++) { ctx.fillStyle = col[((i % 3) + 3) % 3]; ctx.fillRect(x + 2, y + 4, s - 4, L.h - 8); } }
    else if (k === "mesh") { const g = ctx.createLinearGradient(0, y, 0, y + L.h); g.addColorStop(0, "#1a1c22"); g.addColorStop(1, "#0b0c0f"); ctx.fillStyle = g; ctx.fillRect(-w, y, 3 * w, L.h);
      ctx.strokeStyle = "rgba(255,255,255,.05)"; ctx.lineWidth = 1; for (let x = -w; x < 2 * w; x += 22) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + L.h * 0.5, y + L.h); ctx.stroke(); }
      ctx.fillStyle = "rgba(75,139,255,.5)"; ctx.fillRect(-w, y + 70, 3 * w, 3); }
    else if (k === "dots") { ctx.fillStyle = L.color || "#14161b"; ctx.fillRect(-w, y, 3 * w, L.h); ctx.fillStyle = "rgba(255,255,255,.2)";
      for (let x = -w, i = 0; x < 2 * w; x += 18, i++) for (let yy = y + 9; yy < y + L.h; yy += 18) { ctx.beginPath(); ctx.arc(x + (Math.round((yy - y) / 18) % 2) * 9, yy, 2.4, 0, 7); ctx.fill(); } }
    else { ctx.fillStyle = L.color || "#15171c"; ctx.fillRect(-w, y, 3 * w, L.h); }
    ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.fillRect(-w, y + L.h - 1, 3 * w, 1);
  }
  function finger(x, y, t) { ctx.save(); ctx.translate(x, y - 170); ctx.rotate(-0.62 + 0.012 * Math.sin(t * 1.3));
    const g = ctx.createLinearGradient(-170, 0, 170, 0); g.addColorStop(0, "#c98f78"); g.addColorStop(0.35, "#f1c7ad"); g.addColorStop(0.75, "#eab89c"); g.addColorStop(1, "#b77f69");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-170, -1500); ctx.lineTo(-170, 0); ctx.arc(0, 0, 170, Math.PI, 0, true); ctx.lineTo(170, -1500); ctx.closePath(); ctx.fill();
    const sh = ctx.createRadialGradient(40, 40, 10, 0, 0, 190); sh.addColorStop(0, "rgba(255,235,220,.35)"); sh.addColorStop(1, "rgba(255,235,220,0)"); ctx.fillStyle = sh; ctx.beginPath(); ctx.arc(0, 0, 170, 0, 7); ctx.fill();
    ctx.strokeStyle = "rgba(120,70,55,.25)"; ctx.lineWidth = 2; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, -330 - i * 16, 150 - i * 4, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); }
    ctx.restore(); }
  function pen(x, y, t) { ctx.save(); ctx.translate(x, y); ctx.rotate(0.5 + 0.01 * Math.sin(t * 1.1));
    const g = ctx.createLinearGradient(-46, 0, 46, 0); g.addColorStop(0, "#8a6a2c"); g.addColorStop(0.45, "#f2d488"); g.addColorStop(1, "#7a5a20");
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(46, -190); ctx.lineTo(-46, -190); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#e9edf3"; ctx.beginPath(); ctx.arc(0, -3, 7, 0, 7); ctx.fill();
    const b = ctx.createLinearGradient(-70, 0, 70, 0); b.addColorStop(0, "#10122e"); b.addColorStop(0.4, "#3b46c8"); b.addColorStop(0.6, "#2a33a0"); b.addColorStop(1, "#0c0e24");
    ctx.fillStyle = b; ctx.fillRect(-70, -1500, 140, 1310); ctx.fillStyle = "rgba(255,255,255,.14)"; ctx.fillRect(-36, -1500, 16, 1310); ctx.restore(); }
  return {
    frame(t, s = {}) { clear();
      const touch = KF.ease.inOut(KF.clamp(s.touch ?? 0)), z = s.zoom || 1, f = s.focus || [w / 2, top], hx = (s.heroX ?? o.heroX ?? 0.42) * w;
      const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, "#0b0d14"); bg.addColorStop(0.6, "#10131c"); bg.addColorStop(1, "#08090c"); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 46; i++) { ctx.fillStyle = `rgba(255,255,255,${0.12 + 0.3 * KF.hash(i * 3)})`; ctx.fillRect(KF.hash(i) * w, KF.hash(i + 9) * top * 0.9, 2, 2); }
      ctx.setTransform(z, 0, 0, z, f[0] - f[0] * z, f[1] - f[1] * z);
      const tipY = KF.lerp(top - 420, top + 1, touch) + (1 - touch) * 8 * Math.sin(t * 1.7), ys = []; let y = top;
      layers.forEach(L => { drawLayer(L, y); ys.push([L.name, y + L.h / 2]); y += L.h; });
      const gl = KF.clamp(s.glow ?? touch * touch); if (gl > 0.01) { const r = 260, g = ctx.createRadialGradient(hx, top, 0, hx, top, r); g.addColorStop(0, `rgba(242,193,78,${0.75 * gl})`); g.addColorStop(1, "rgba(242,193,78,0)");
        ctx.globalCompositeOperation = "lighter"; ctx.fillStyle = g; ctx.fillRect(hx - r, top - r * 0.5, 2 * r, r * 1.1); ctx.globalCompositeOperation = "source-over"; }
      if (hero === "finger") finger(hx, tipY, t); else if (hero === "pen") pen(hx, tipY, t);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      M = { z, fx: f[0], fy: f[1], tipX: hx, tipY, ys };
    },
    anchor(name) { if (name === "tip") return toHost(M.tipX, M.tipY); if (name === "hero") return toHost(M.tipX - 150, M.tipY - 330);
      const L = M.ys.find(a => a[0] === name); return L ? toHost(w * 0.7, L[1]) : [w / 2, top]; },
  };
});
