/* agent-log: an AI agent's activity log ticking through its steps ("Searched the web… Created script.txt… Made voice.mp3").
 * opts:  { theme, title, prompt: the request shown at the top, steps: [{ verb, obj, meta }], w }
 * state: { show: 0..1, n: progress in steps (2.5 = two done, the third half-way and spinning) } · api: frame(t, state) */
KF.define("agent-log", (host, o) => {
  const U = KF.ui(o.theme || "dark"), w = o.w || 860, steps = o.steps || [], c = KF.el("div", "", host); c.dataset.qa = "ok";
  c.style.cssText = `position:absolute;left:${(host.clientWidth - w) / 2}px;top:${o.top ?? 70}px;width:${w}px;border-radius:26px;background:${U.card};border:2px solid ${U.line};color:${U.ink};padding:28px;box-sizing:border-box;font-family:Inter;box-shadow:0 40px 90px -30px rgba(0,0,0,.65)`;
  c.innerHTML = (o.prompt ? `<div style="margin:0 0 22px auto;max-width:82%;padding:18px 24px;border-radius:22px;background:${U.chip};font:700 32px/1.3 Inter">${o.prompt}</div>` : "") +
    steps.map(s => `<div class="s" style="display:flex;align-items:center;gap:16px;height:66px;font:700 30px Inter"><i style="width:34px;height:34px;border-radius:50%;display:grid;place-items:center;font:900 22px Inter;font-style:normal;flex:none"></i><span style="color:${U.mute}">${s.verb}</span><span style="font-family:'JetBrains Mono',monospace;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${s.obj || ""}</span><span style="margin-left:auto;font:700 24px 'JetBrains Mono',monospace;color:${KF.C.green};white-space:nowrap">${s.meta || ""}</span></div>`).join("");
  const S = [...c.querySelectorAll(".s")];
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1); c.style.opacity = Math.min(1, a * 2); c.style.transform = `translateY(${((1 - KF.ease.out(a)) * 100).toFixed(1)}px)`; const n = s.n ?? steps.length;
      S.forEach((e, i) => { const vis = KF.clamp((n - i) * 4), done = n >= i + 1, ic = e.firstChild; e.style.opacity = vis; e.style.transform = `translateY(${((1 - KF.ease.out(vis)) * 18).toFixed(1)}px)`;
        ic.textContent = done ? "✓" : ""; ic.style.background = done ? KF.C.green : "transparent"; ic.style.color = "#06281a"; ic.style.border = done ? "none" : `4px solid ${KF.C.gold}`; ic.style.borderRightColor = done ? "" : "transparent"; ic.style.boxSizing = "border-box";
        ic.style.transform = done ? `scale(${(1 + 0.3 * Math.sin(Math.PI * KF.clamp((n - i - 1) * 3))).toFixed(3)})` : `rotate(${(t * 540) % 360}deg)`; e.lastChild.style.opacity = done ? 1 : 0; }); } };
});
