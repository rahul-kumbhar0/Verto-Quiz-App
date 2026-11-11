/* repo-card: a GitHub-style repo card with a live star count.
 * opts:  { theme, owner, name, desc, stars, chips: ["Rust", "MIT"], w }
 * state: { show: 0..1, stars: number (defaults to opts.stars × count), count: 0..1 (rolls the number up), starred: 0..1 (the Star button gets pressed) } · api: frame(t, state) */
KF.define("repo-card", (host, o) => {
  const U = KF.ui(o.theme || "dark"), w = o.w || 860, c = KF.el("div", "", host);
  c.style.cssText = `position:absolute;left:${(host.clientWidth - w) / 2}px;top:${o.top ?? 150}px;width:${w}px;border-radius:28px;background:${U.card};border:2px solid ${U.line};color:${U.ink};padding:38px 42px;box-sizing:border-box;box-shadow:0 40px 90px -30px rgba(0,0,0,.6);font-family:Inter`;
  c.innerHTML = `<div style="font:700 34px 'JetBrains Mono',monospace;color:${U.mute}">github.com/${o.owner || "owner"}/</div><div style="display:flex;align-items:center;margin:6px 0 16px"><h1 style="margin:0;font:900 76px Inter;letter-spacing:-2px">${o.name || "repo"}</h1>
<div class="st" style="margin-left:auto;display:flex;align-items:center;gap:12px;padding:14px 22px;border-radius:16px;background:${U.chip};font:800 34px Inter"><span class="ic">☆</span><span class="n">0</span></div></div>
<p style="margin:0 0 24px;font:600 34px/1.3 Inter;color:${U.mute}">${o.desc || ""}</p><div style="display:flex;flex-wrap:wrap;gap:12px">${(o.chips || []).map((x, i) => `<span style="display:flex;align-items:center;gap:10px;padding:12px 20px;border-radius:999px;background:${U.chip};font:700 34px Inter"><i style="width:16px;height:16px;border-radius:50%;background:${[KF.C.accent, KF.C.blue, KF.C.green, KF.C.gold][i % 4]}"></i>${x}</span>`).join("")}</div>`;
  const st = c.querySelector(".st"), n = c.querySelector(".n"), ic = c.querySelector(".ic");
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1), p = KF.spring(a, 0, { f: 1.2, z: 0.7 }); c.style.opacity = Math.min(1, a * 2); c.style.transform = `perspective(1400px) rotateX(${((1 - KF.ease.out(a)) * -50).toFixed(2)}deg) translateY(${((1 - KF.ease.out(a)) * 90).toFixed(1)}px)`;
      const v = s.stars ?? (o.stars || 0) * KF.ease.out(KF.clamp(s.count ?? 1)), k = KF.clamp(s.starred ?? 0); n.textContent = KF.fmt(Math.round(v) + (k >= 0.5 ? 1 : 0)); ic.textContent = k >= 0.5 ? "★" : "☆"; ic.style.color = k >= 0.5 ? KF.C.gold : U.ink;
      st.style.transform = `scale(${(1 - 0.1 * Math.sin(Math.PI * KF.clamp(k * 2))).toFixed(3)})`; st.style.boxShadow = k >= 0.5 ? "0 0 0 3px " + KF.C.gold : "none"; } };
});
