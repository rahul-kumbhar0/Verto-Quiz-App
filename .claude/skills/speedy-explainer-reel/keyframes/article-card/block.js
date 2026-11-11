/* article-card: a news / blog / report page with the headline marked up (the source of a claim, shown on screen).
 * opts:  { theme: "light"|"dark", site, date, headline: "The *Hugging Face* incident" (the part in *stars* gets the marker), lines: number of body lines, tags: [..], w }
 * state: { show: 0..1, mark: 0..1 (marker sweeps over the starred words), body: 0..1 (body lines draw in), scroll: px } · api: frame(t, state) */
KF.define("article-card", (host, o) => {
  const U = KF.ui(o.theme || "light"), w = o.w || 860, c = KF.el("div", "", host); c.dataset.qa = "ok";
  c.style.cssText = `position:absolute;left:${(host.clientWidth - w) / 2}px;top:70px;width:${w}px;border-radius:28px;background:${U.card};color:${U.ink};padding:40px 46px 46px;box-sizing:border-box;box-shadow:0 40px 90px -30px rgba(0,0,0,.6);font-family:Inter;overflow:hidden`;
  const hl = (o.headline || "The *headline* goes here").replace(/\*(.+?)\*/g, '<span class="mk" style="background:linear-gradient(#ffd166,#ffd166) no-repeat 0 88%/0% 46%;color:inherit">$1</span>');
  c.innerHTML = `<div style="display:flex;align-items:center;gap:14px;font:800 28px Inter"><i style="width:40px;height:40px;border-radius:10px;background:${o.accent || KF.C.accent}"></i>${o.site || "site.com"}<span style="margin-left:auto;font:600 24px Inter;color:${U.mute}">${o.date || ""}</span></div>
<h1 style="margin:34px 0 22px;font:900 68px/1.06 Inter;letter-spacing:-2px">${hl}</h1><div class="tg" style="display:flex;gap:10px;margin-bottom:26px">${(o.tags || []).map(x => `<span style="padding:8px 16px;border-radius:999px;background:${U.chip};font:700 22px Inter;color:${U.mute}">${x}</span>`).join("")}</div><div class="bd"></div>`;
  const bd = c.querySelector(".bd"), n = o.lines ?? 6, bars = []; for (let i = 0; i < n; i++) { const b = KF.el("div", "", bd); b.style.cssText = `height:20px;border-radius:10px;background:${U.line};margin:0 0 18px;width:${[100, 94, 98, 70, 96, 88, 60][i % 7]}%;transform-origin:0 50%`; bars.push(b); }
  const mk = c.querySelectorAll(".mk");
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1); c.style.opacity = Math.min(1, a * 2); c.style.transform = `translateY(${((1 - KF.ease.out(a)) * 120 - (s.scroll || 0)).toFixed(1)}px) scale(${(0.94 + 0.06 * KF.ease.out(a)).toFixed(4)})`;
      const m = KF.clamp(s.mark ?? 0); mk.forEach((e, i) => (e.style.backgroundSize = (KF.clamp(m * mk.length - i) * 100).toFixed(1) + "% 46%")); const b = KF.clamp(s.body ?? 1); bars.forEach((e, i) => (e.style.transform = `scaleX(${KF.ease.out(KF.clamp(b * n - i)).toFixed(3)})`)); } };
});
