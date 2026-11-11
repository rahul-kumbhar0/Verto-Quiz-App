/* calendar: a month grid where days fill in (streaks, "40 days", deadlines, a date that matters).
 * opts:  { theme, title: "November 2026", days: 30, offset: weekday of day 1 (0 = Monday), w, mark: colour, big: [day numbers ringed as key dates] }
 * state: { show: 0..1, fill: number of days marked so far (can be fractional), today: day number (ringed) } · api: frame(t, state) · cell(day) → [x, y] host pixels */
KF.define("calendar", (host, o) => {
  const U = KF.ui(o.theme || "dark"), w = o.w || 820, n = o.days || 30, off = o.offset || 0, cs = Math.floor((w - 60 - 6 * 12) / 7), c = KF.el("div", "", host), top = o.top ?? 80, left = (host.clientWidth - w) / 2; c.dataset.qa = "ok";
  c.style.cssText = `position:absolute;left:${left}px;top:${top}px;width:${w}px;border-radius:28px;background:${U.card};border:2px solid ${U.line};color:${U.ink};padding:30px;box-sizing:border-box;font-family:Inter;box-shadow:0 40px 90px -30px rgba(0,0,0,.6)`;
  c.innerHTML = `<div style="font:900 44px Inter;margin-bottom:18px">${o.title || "This month"}</div><div style="display:grid;grid-template-columns:repeat(7,${cs}px);gap:12px">${["M", "T", "W", "T", "F", "S", "S"].map(d => `<div style="text-align:center;font:800 24px Inter;color:${U.mute}">${d}</div>`).join("")}${"<div></div>".repeat(off)}${Array.from({ length: n }, (_, i) => `<div class="d" style="height:${cs}px;border-radius:18px;background:${U.chip};display:grid;place-items:center;font:800 32px Inter">${i + 1}</div>`).join("")}</div>`;
  const D = [...c.querySelectorAll(".d")], mk = o.mark || KF.C.accent;
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1); c.style.opacity = Math.min(1, a * 2); c.style.transform = `scale(${(0.9 + 0.1 * KF.ease.back(a)).toFixed(4)})`; const f = s.fill ?? 0;
      D.forEach((e, i) => { const q = KF.clamp(f - i), big = (o.big || []).includes(i + 1), ring = s.today === i + 1; e.style.background = q > 0 ? mk : U.chip; e.style.color = q > 0 ? "#1a0e08" : U.ink; e.style.transform = `scale(${(1 + 0.22 * Math.sin(Math.PI * q)).toFixed(3)})`;
        e.style.boxShadow = ring ? `0 0 0 5px ${KF.C.blue}` : big ? `0 0 0 4px ${KF.C.gold}` : "none"; }); },
    cell(d) { const i = d - 1 + off; return [left + 30 + (i % 7) * (cs + 12) + cs / 2, top + 30 + 62 + 36 + Math.floor(i / 7) * (cs + 12) + cs / 2]; } };
});
