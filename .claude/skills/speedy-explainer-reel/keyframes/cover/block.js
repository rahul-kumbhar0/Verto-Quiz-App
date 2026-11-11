/* cover: the reel cover (grid thumbnail): kicker pill, big headline with one phrase in the blue selection box, a footer line, over a darkened still.
 * opts:  { kicker, headline: "1 video → *a stack of Shorts*" (the *starred* part gets the box), foot, sub, bg: url of a still, dim: 0..1, theme }
 * api:   frame() (static; call once). Shoot it with assets/shot_cover.mjs at 1080×1920; keep the headline inside the centre 1080×1350 (the grid crop). */
KF.define("cover", (host, o) => {
  const c = KF.el("div", "", host); c.dataset.qa = "ok"; c.style.cssText = "position:absolute;inset:0;font-family:Inter;overflow:hidden;background:#0F0F11";
  const hl = (o.headline || "Headline *here*").replace(/\*(.+?)\*/g, `<span style="position:relative;display:inline-block;padding:0 .08em"><i style="position:absolute;inset:8% -1% 4%;border:3px solid #4b8bff;background:rgba(75,139,255,.18)"></i><i style="position:absolute;left:-8px;top:2%;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #4b8bff"></i><i style="position:absolute;right:-8px;bottom:-2%;width:14px;height:14px;border-radius:50%;background:#fff;border:3px solid #4b8bff"></i><b style="position:relative;color:#F0A585">$1</b></span>`);
  c.innerHTML = (o.bg ? `<div style="position:absolute;inset:0;background:url(${o.bg}) center/cover;filter:brightness(${1 - (o.dim ?? 0.45)})"></div>` : `<div style="position:absolute;inset:0;background:radial-gradient(90% 60% at 50% 30%,#3a2218,#0F0F11 70%)"></div>`) +
    `<div style="position:absolute;left:0;right:0;top:17%;text-align:center"><span style="display:inline-block;padding:12px 26px;border-radius:999px;background:#D97757;color:#1a0e08;font:900 34px Inter;letter-spacing:1px">${o.kicker || ""}</span></div>
<h1 style="position:absolute;left:6%;right:6%;top:23%;margin:0;text-align:center;font:900 ${o.size || 120}px/1.04 Inter;letter-spacing:-5px;color:#fff">${hl}</h1><div style="position:absolute;left:0;right:0;top:67%;text-align:center;font:800 34px Inter;color:#F3F1EC">${o.foot || ""}<small style="display:block;font:700 26px 'JetBrains Mono',monospace;color:#c9ccd3;margin-top:10px">${o.sub || ""}</small></div>`;
  return { frame() {} };
});
