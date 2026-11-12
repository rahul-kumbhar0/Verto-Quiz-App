/* clip-stack: real vertical clips fly in and fan out in a 3D arc (each card has thickness, a shadow and a glass glint), then collapse onto one neat pile with a bounce ("a whole stack of Shorts from one video", outputs piling up).
 * opts:  { n: cards, card: [w, h], captions: [..] (HTML; real words only), images: [urls] (default: our own reel covers), top }
 * state: { fan: 0..1 (cards fly in and fan out), stack: 0..1 (they collapse onto one pile) } · api: frame(t, state) · cards → the card elements */
KF.define("clip-stack", (host, o) => {
  const n = o.n || 5, cw = (o.card || [260, 462])[0], ch = (o.card || [260, 462])[1], cx = host.clientWidth / 2, top = o.top ?? 180, imgs = o.images || KF.covers().slice(0, n); host.style.perspective = "1600px";
  const wrap = KF.el("div", "", host); wrap.style.cssText = "position:absolute;inset:0;transform-style:preserve-3d";
  const cards = Array.from({ length: n }, (_, i) => { const e = KF.el("div", "", wrap); e.dataset.qa = "texture"; e.style.cssText = `position:absolute;left:${cx - cw / 2}px;top:${top}px;width:${cw}px;height:${ch}px;transform-style:preserve-3d`;
    e.innerHTML = `<i style="position:absolute;inset:0;border-radius:26px;background:#0b0c0f;transform:translateZ(-8px);box-shadow:0 40px 70px -24px rgba(0,0,0,.85)"></i><div style="position:absolute;inset:0;border-radius:26px;overflow:hidden;background:#15171c url(${imgs[i % imgs.length]}) center/cover;box-shadow:inset 0 0 0 3px rgba(255,255,255,.85)">
<b class="gl" style="position:absolute;top:-30%;bottom:-30%;width:40%;left:-60%;background:linear-gradient(100deg,rgba(255,255,255,0),rgba(255,255,255,.38),rgba(255,255,255,0));transform:skewX(-16deg)"></b><span style="position:absolute;left:12px;top:12px;padding:6px 14px;border-radius:999px;background:rgba(0,0,0,.6);color:#fff;font:700 24px 'JetBrains Mono',monospace">#${i + 1}</span>
${(o.captions || [])[i] ? `<div style="position:absolute;left:0;right:0;bottom:0;padding:80px 14px 26px;text-align:center;font:900 30px/1.1 Inter;color:#fff;text-shadow:0 3px 0 #000;background:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.75))">${o.captions[i]}</div>` : ""}</div>`; return e; });
  return { cards, frame(t, s = {}) { const f = KF.clamp(s.fan ?? 0), st = KF.clamp(s.stack ?? 0); cards.forEach((e, i) => { const k = i - (n - 1) / 2, d = f - i * 0.08, q = KF.spring(d, 0, { f: 1.5, z: 0.6 }), on = d > 0;
        const ax = k * 210, ay = Math.abs(k) * 40, az = -Math.abs(k) * 120, ary = -k * 16, arz = k * 5;
        const fx = KF.lerp(k * 1100, ax, q), fy = KF.lerp(-700 - i * 80, ay, q), fz = KF.lerp(600, az, q), fry = KF.lerp(-k * 70, ary, q), frx = KF.lerp(60, 0, q), frz = KF.lerp(k * 40, arz, q);
        const sq = KF.keys(st, [[0, 0], [0.75, 1, "inOut"], [0.86, 1.04, "out"], [1, 1, "inOut"]]), drop = KF.ease.inOut(KF.clamp(st * 1.33 - i * 0.07));
        e.style.opacity = on ? 1 : 0; e.style.zIndex = st > 0.4 ? i + 1 : 10 - Math.abs(Math.round(k * 2));
        e.style.transform = `translate3d(${KF.lerp(fx, k * 6, drop).toFixed(1)}px,${KF.lerp(fy, -i * 10, drop).toFixed(1)}px,${KF.lerp(fz, i * 6, drop).toFixed(1)}px) rotateX(${KF.lerp(frx, 8, drop).toFixed(2)}deg) rotateY(${KF.lerp(fry, 0, drop).toFixed(2)}deg) rotateZ(${KF.lerp(frz, k * 2.2, drop).toFixed(2)}deg) scale(${(st > 0.75 ? KF.lerp(1, 1.0, 1) * (sq > 1 ? 2 - sq : 1) : 1).toFixed(4)})`;
        e.querySelector(".gl").style.left = (-60 + 200 * (((t * 0.25) + i * 0.17) % 1.6)) + "%"; }); } };
});
