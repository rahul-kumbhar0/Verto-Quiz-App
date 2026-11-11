/* chapter-rail: a thin progress rail with chapter dots and a live counter on the right (where am I in the video + the number that matters now).
 * opts:  { steps: ["step 1", "step 2", …], theme, color, top }
 * state: { at: position in chapters (1.5 = half-way through the second), value: number for the counter, label: its caption, alert: bool (rail turns red: "the catch") } · api: frame(t, state) */
KF.define("chapter-rail", (host, o) => {
  const U = KF.ui(o.theme || "dark"), steps = o.steps || [], c = KF.el("div", "", host), W = host.clientWidth - 120 - 190; c.dataset.qa = "texture";
  c.style.cssText = `position:absolute;left:60px;right:60px;top:${o.top ?? 20}px;height:90px;font-family:Inter`;
  c.innerHTML = `<div style="position:absolute;left:0;top:26px;width:${W}px;height:4px;border-radius:2px;background:${U.line}"><b style="display:block;height:100%;border-radius:2px;width:0"></b></div>` + steps.map((s, i) => `<div class="d" style="position:absolute;left:${(i + 0.5) / steps.length * W - 9}px;top:19px;width:18px;height:18px;border-radius:50%"></div><div class="l" style="position:absolute;left:${(i + 0.5) / steps.length * W - 80}px;top:48px;width:160px;text-align:center;font:700 20px 'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:1px">${s}</div>`).join("") +
    `<div style="position:absolute;right:0;top:0;width:170px;text-align:right"><div class="v" style="font:900 44px Inter;color:${U.ink};font-variant-numeric:tabular-nums"></div><div class="c" style="font:700 18px 'JetBrains Mono',monospace;color:${U.mute}"></div></div>`;
  const bar = c.querySelector("b"), D = [...c.querySelectorAll(".d")], L = [...c.querySelectorAll(".l")], v = c.querySelector(".v"), cp = c.querySelector(".c");
  return { frame(t, s = {}) { const at = s.at ?? 0, col = s.alert ? KF.C.red : o.color || KF.C.green; bar.style.width = (KF.clamp(at / steps.length) * 100).toFixed(2) + "%"; bar.style.background = col;
      D.forEach((d, i) => { const on = at >= i + 0.5, cur = Math.floor(at) === i; d.style.background = on || cur ? col : U.line; d.style.boxShadow = cur ? `0 0 0 ${(5 + 3 * Math.sin(t * 5)).toFixed(1)}px ${KF.rgba(col, 0.3)}` : "none"; L[i].style.color = cur ? col : U.mute; });
      v.textContent = s.value != null ? KF.fmt(Math.round(s.value)) : ""; cp.textContent = s.label || ""; } };
});
