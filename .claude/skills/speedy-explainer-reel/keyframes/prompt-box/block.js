/* prompt-box: an AI chat input being typed into and sent ("just one sentence").
 * opts:  { theme, text: what gets typed, placeholder, model: "Opus 5.5", w, top }
 * state: { show: 0..1, typed: 0..1 (share of the text typed), send: 0..1 (the send button press; text clears after it) } · api: frame(t, state) */
KF.define("prompt-box", (host, o) => {
  const U = KF.ui(o.theme || "dark"), w = o.w || 900, text = o.text || "Make a reel about how a touchscreen works", c = KF.el("div", "", host); c.dataset.qa = "ok";
  c.style.cssText = `position:absolute;left:${(host.clientWidth - w) / 2}px;top:${o.top ?? 300}px;width:${w}px;border-radius:34px;background:${U.card};border:2px solid ${U.line};color:${U.ink};padding:30px 32px 24px;box-sizing:border-box;font-family:Inter;box-shadow:0 40px 90px -30px rgba(0,0,0,.7)`;
  c.innerHTML = `<div class="tx" style="min-height:104px;font:600 40px/1.3 Inter"></div><div style="display:flex;align-items:center;gap:16px;margin-top:14px;color:${U.mute};font:700 28px Inter"><span style="font-size:36px">＋</span><span style="margin-left:auto">${o.model || "Opus 5.5"} ▾</span><div class="sd" style="width:68px;height:68px;border-radius:20px;display:grid;place-items:center;font:900 36px Inter;color:#fff">↑</div></div>`;
  const tx = c.querySelector(".tx"), sd = c.querySelector(".sd");
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1), ty = KF.clamp(s.typed ?? 0), sn = KF.clamp(s.send ?? 0), n = Math.round(ty * text.length), sent = sn >= 0.5;
      c.style.opacity = Math.min(1, a * 2); c.style.transform = `translateY(${((1 - KF.ease.back(a)) * 120).toFixed(1)}px)`;
      const cur = !sent && Math.floor(t * 2.5) % 2 === 0 ? `<span style="display:inline-block;width:4px;height:44px;background:${KF.C.accent};vertical-align:-8px;margin-left:2px"></span>` : "";
      tx.innerHTML = sent ? `<span style="color:${U.mute}">${o.placeholder || "Reply to Claude…"}</span>` : n === 0 ? `${cur}<span style="color:${U.mute}">${o.placeholder || "Reply to Claude…"}</span>` : text.slice(0, n) + cur;
      sd.style.background = n > 0 && !sent ? KF.C.accent : U.chip; sd.style.transform = `scale(${(1 - 0.18 * Math.sin(Math.PI * sn)).toFixed(3)})`; } };
});
