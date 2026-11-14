/* connector-hub: one hub tile in the middle (the assistant) and app tiles around it, joined by real cables. Each app starts grey with its plug hanging loose; at its time the plug drives in (sparks, shock ring), the tile pops into full colour and packets start running ("5 apps that plug into X", connectors, integrations, an MCP hub).
 * Needs plug-cable/block.js loaded first (it uses KF.drawCable).
 * opts:  { hub: { logo, label, x, y, size, bg }, apps: [{ id, logo, label, x, y, at: time its plug seats, color, bg: tile colour }], tile: px, tone: "dark"|"light", gap }
 * state: { show: 0..1, hot: [ids] (ringed and bigger), dim: [ids], badge: "FREE" + badgeAt: time the badges start popping (one after another), flow: 0..1, blind: 0..1 (a red "can't see" bar across the hub) }
 * api:   frame(t, state) · count(t) → how many are plugged in */
KF.define("connector-hub", (host, o) => {
  const { ctx, clear } = KF.canvas(host), dk = (o.tone || "dark") !== "light", H = { x: host.clientWidth / 2, y: 400, size: 200, bg: "#F4EFE6", ...(o.hub || {}) }, T = o.tile || 150, apps = o.apps || [], c = KF.el("div", "kf-hub", host); c.dataset.qa = "ok";
  KF.css("hub", `.kf-hub{position:absolute;inset:0;font-family:Inter}.kf-hub .t{position:absolute;display:grid;place-items:center;border-radius:26%;box-shadow:0 26px 50px -20px rgba(0,0,0,.6),inset 0 0 0 1px rgba(0,0,0,.06);will-change:transform}
.kf-hub .t img{width:58%;height:58%;object-fit:contain}.kf-hub .l{position:absolute;text-align:center;font:800 30px Inter;white-space:nowrap;transform:translateX(-50%)}
.kf-hub .bd{position:absolute;right:-18px;top:-16px;padding:6px 14px;border-radius:999px;background:#3ECF8E;color:#062414;font:900 24px Inter;box-shadow:0 8px 18px -6px rgba(0,0,0,.5)}
.kf-hub .ring{position:absolute;inset:-10px;border-radius:30%;border:6px solid #fff;opacity:0}.kf-hub .x{position:absolute;left:8%;right:8%;top:50%;height:12px;margin-top:-6px;border-radius:6px;background:#ff5a5a;transform:rotate(-38deg) scaleX(0);box-shadow:0 0 0 4px rgba(12,12,15,.55)}`);
  const tile = (x, y, sz, bg, logo, label) => { const e = KF.el("div", "t", c, `<img src="${logo}"><div class="ring"></div>`); e.style.cssText += `;left:${x - sz / 2}px;top:${y - sz / 2}px;width:${sz}px;height:${sz}px;background:${bg}`; KF.img(logo);
    const l = KF.el("div", "l", c, label || ""); l.style.left = x + "px"; l.style.top = y + sz / 2 + 12 + "px"; l.style.color = dk ? "#F3F1EC" : "#16181d"; return { e, l, ring: e.querySelector(".ring") }; };
  const hub = tile(H.x, H.y, H.size, H.bg, H.logo, H.label), blind = KF.el("div", "x", hub.e);
  const A = apps.map((a, i) => { const el = tile(a.x, a.y, T, a.bg || "#fff", a.logo, a.label), bd = KF.el("div", "bd", el.e, ""), L = Math.hypot(a.x - H.x, a.y - H.y) || 1, dx = (a.x - H.x) / L, dy = (a.y - H.y) / L;
    // cable runs from the hub's edge to a socket on the tile's near edge
    const edge = (sz) => sz / 2 / Math.max(Math.abs(dx), Math.abs(dy)); return { ...a, ...el, bd, i, from: [H.x + dx * (edge(H.size) - 6), H.y + dy * (edge(H.size) - 6)], to: [a.x - dx * (edge(T) + 26), a.y - dy * (edge(T) + 26)] }; });
  const api = {
    count: t => A.filter(a => a.at != null && t >= a.at).length,
    frame(t, s = {}) { clear(); const sh = s.show ?? 1; c.style.opacity = sh; if (sh <= 0) return; const hot = s.hot || [], dim = s.dim || []; ctx.globalAlpha = sh;
      A.forEach(a => { const seat = a.at != null, p = seat ? KF.plugP(t, a.at) : 0, on = seat && t >= a.at, d = dim.includes(a.id);
        ctx.globalAlpha = sh * (d ? 0.3 : 1); KF.drawCable(ctx, t, { from: a.from, to: a.to, p, power: on ? KF.prog(t, a.at, 0.25) : 0, flow: (s.flow ?? 1) * (d ? 0 : 1), color: a.color, tone: o.tone, gap: o.gap ?? 74, sag: 26, thick: 13, hitAt: seat ? a.at : null, seed: a.i * 3 + 1, back: a.i % 2 === 1 });
        const q = on ? KF.spring(t, a.at, { f: 3, z: 0.45 }) : 0, h = hot.includes(a.id), hs = h ? KF.spring(t, s.hotAt ?? 0, { f: 2.6, z: 0.5 }) : 0;
        a.e.style.transform = `scale(${(0.9 + 0.1 * q + 0.1 * hs).toFixed(3)})`; a.e.style.filter = on ? "none" : "grayscale(1) brightness(.62)"; a.e.style.opacity = d ? 0.3 : 1; a.l.style.opacity = d ? 0.3 : on ? 1 : 0.5;
        a.ring.style.opacity = h ? Math.min(1, hs * 1.5) : 0; a.ring.style.borderColor = a.color || "#fff"; a.ring.style.boxShadow = h ? `0 0 40px ${a.color || "#fff"}` : "none";
        const bq = s.badgeAt != null ? KF.spring(t, s.badgeAt + a.i * 0.09, { f: 3, z: 0.45 }) : 0; a.bd.textContent = s.badge || "FREE"; a.bd.style.opacity = d ? 0 : Math.min(1, bq * 2); a.bd.style.transform = `scale(${(0.4 + 0.6 * bq).toFixed(3)}) rotate(8deg)`; });
      ctx.globalAlpha = 1; const n = api.count(t), last = A.reduce((m, a) => (a.at != null && t >= a.at ? Math.max(m, a.at) : m), -9), pulse = 1 + 0.06 * Math.max(0, 1 - (t - last) / 0.35) + 0.012 * Math.sin(t * 5) * (n ? 1 : 0);
      hub.e.style.transform = `scale(${pulse.toFixed(3)})`; hub.e.style.boxShadow = `0 30px 60px -22px rgba(0,0,0,.7),0 0 ${(n * 16).toFixed(0)}px ${KF.rgba(KF.C.accent, Math.min(0.9, n * 0.18))}`; blind.style.transform = `rotate(-38deg) scaleX(${KF.clamp(s.blind ?? 0)})`; },
  };
  return api;
});
