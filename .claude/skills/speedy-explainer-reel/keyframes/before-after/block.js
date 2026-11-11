/* before-after: two pictures side by side behind a sliding divider (old vs new, without vs with, slow vs fast).
 * opts:  { labels: ["Before", "After"], w, h, top, radius }
 * state: { x: 0..1 (divider position; 0 = all "after", 1 = all "before"), show: 0..1 } · api: frame(t, state) · a, b → the two host elements (build any blocks or content inside them) */
KF.define("before-after", (host, o) => {
  const w = o.w || 920, h = o.h || 760, c = KF.el("div", "", host), L = o.labels || ["Before", "After"]; c.dataset.qa = "ok";
  c.style.cssText = `position:absolute;left:${(host.clientWidth - w) / 2}px;top:${o.top ?? 100}px;width:${w}px;height:${h}px;border-radius:${o.radius ?? 30}px;overflow:hidden;background:#15171c;box-shadow:0 40px 90px -30px rgba(0,0,0,.7)`;
  const b = KF.box(c, `left:0;top:0;width:${w}px;height:${h}px`), aw = KF.box(c, `left:0;top:0;width:${w}px;height:${h}px`), a = KF.box(aw, `left:0;top:0;width:${w}px;height:${h}px`);
  const bar = KF.el("div", "", c); bar.style.cssText = "position:absolute;top:0;width:6px;height:100%;margin-left:-3px;background:#fff;box-shadow:0 0 30px rgba(255,255,255,.8)";
  bar.innerHTML = `<i style="position:absolute;left:-31px;top:50%;margin-top:-34px;width:68px;height:68px;border-radius:50%;background:#fff;display:grid;place-items:center;font:900 30px Inter;font-style:normal;color:#16181d">⇆</i>`;
  const tag = (txt, side) => { const e = KF.el("div", "", c, txt); e.style.cssText = `position:absolute;${side}:22px;top:22px;padding:10px 20px;border-radius:999px;background:rgba(12,12,15,.8);color:#fff;font:800 28px Inter`; return e; }, ta = tag(L[0], "left"), tb = tag(L[1], "right");
  return { a, b, frame(t, s = {}) { const x = KF.clamp(s.x ?? 0.5), sh = KF.clamp(s.show ?? 1); c.style.opacity = Math.min(1, sh * 2); c.style.transform = `scale(${(0.92 + 0.08 * KF.ease.back(sh)).toFixed(4)})`; aw.style.width = (x * w).toFixed(1) + "px"; bar.style.left = (x * w).toFixed(1) + "px";
      ta.style.opacity = KF.clamp(x * 6 - 1); tb.style.opacity = KF.clamp((1 - x) * 6 - 1); } };
});
