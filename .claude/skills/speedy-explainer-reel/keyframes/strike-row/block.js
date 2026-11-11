/* strike-row: a row of things, each crossed out in red ("no camera, no drawing, no editing"), or ticked in green.
 * opts:  { items: [{ icon: emoji / short text, label, at: time it appears, strike: time it gets crossed (omit = stays), tick: time it gets a green tick }], size, top }
 * api:   frame(t) */
KF.define("strike-row", (host, o) => {
  const items = o.items || [], size = o.size || 200, gap = 40, tot = items.length * size + (items.length - 1) * gap, x0 = (host.clientWidth - tot) / 2, c = KF.el("div", "", host); c.dataset.qa = "ok"; c.style.cssText = "position:absolute;inset:0;font-family:Inter";
  const E = items.map((it, i) => { const e = KF.el("div", "", c); e.style.cssText = `position:absolute;left:${x0 + i * (size + gap)}px;top:${o.top ?? 280}px;width:${size}px;text-align:center`;
    e.innerHTML = `<div style="position:relative;width:${size}px;height:${size}px;border-radius:44px;background:#15171c;border:2px solid #2a2d35;display:grid;place-items:center;font-size:${Math.round(size * 0.5)}px">${it.icon}<svg viewBox="0 0 100 100" style="position:absolute;inset:-12%;width:124%;height:124%;overflow:visible"><line x1="8" y1="8" x2="92" y2="92" stroke="#ff3b3b" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg>
<b style="position:absolute;right:-14px;top:-14px;width:64px;height:64px;border-radius:50%;background:#3ECF8E;color:#06281a;display:grid;place-items:center;font:900 38px Inter;transform:scale(0)">✓</b></div><div style="margin-top:18px;font:800 34px Inter;color:#F3F1EC">${it.label || ""}</div>`; return e; });
  return { frame(t) { E.forEach((e, i) => { const it = items[i], a = KF.spring(t, it.at ?? i * 0.4, { f: 2.8, z: 0.55 }), on = t >= (it.at ?? i * 0.4), st = it.strike != null ? KF.ease.out(KF.prog(t, it.strike, 0.22)) : 0;
        e.style.opacity = on ? 1 : 0; e.style.transform = `scale(${(0.5 + 0.5 * a).toFixed(3)}) translateX(${(st > 0 && st < 1 ? 8 * Math.sin(st * 30) * (1 - st) : 0).toFixed(1)}px)`; e.querySelector("line").setAttribute("stroke-dashoffset", (1 - st).toFixed(3));
        e.firstChild.style.filter = st >= 1 ? "saturate(.3) brightness(.7)" : "none"; e.lastChild.style.opacity = st >= 1 ? 0.5 : 1; e.querySelector("b").style.transform = `scale(${it.tick != null ? KF.spring(t, it.tick, { f: 3, z: 0.5 }).toFixed(3) : 0})`; }); } };
});
