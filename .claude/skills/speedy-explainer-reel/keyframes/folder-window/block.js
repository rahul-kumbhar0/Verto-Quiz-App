/* folder-window: a file-explorer window whose files appear one by one ("with this folder…", project structure, what's inside the download).
 * opts:  { theme, title, files: [{ name, dir: bool, depth: 0.., note }], w }
 * state: { show: 0..1, n: how many rows are visible (fractional = the next one is sliding in), hot: index of a highlighted row } · api: frame(t, state) */
KF.define("folder-window", (host, o) => {
  const U = KF.ui(o.theme || "dark"), w = o.w || 820, files = o.files || [], c = KF.el("div", "", host); c.dataset.qa = "ok";
  c.style.cssText = `position:absolute;left:${(host.clientWidth - w) / 2}px;top:${o.top ?? 90}px;width:${w}px;min-height:${o.h || 620}px;border-radius:26px;background:${U.card};border:2px solid ${U.line};color:${U.ink};box-sizing:border-box;font-family:Inter;box-shadow:0 40px 90px -30px rgba(0,0,0,.65);overflow:hidden`;
  c.innerHTML = `<div style="display:flex;align-items:center;gap:10px;height:76px;padding:0 26px;border-bottom:2px solid ${U.line};font:800 30px Inter"><i style="width:16px;height:16px;border-radius:50%;background:#ff5f57"></i><i style="width:16px;height:16px;border-radius:50%;background:#febc2e"></i><i style="width:16px;height:16px;border-radius:50%;background:#28c840;margin-right:14px"></i>📁 ${o.title || "folder"}</div><div style="padding:18px 20px">` +
    files.map(f => `<div class="f" style="display:flex;align-items:center;gap:16px;height:70px;padding:0 16px;margin-left:${(f.depth || 0) * 44}px;border-radius:14px;font:700 32px 'JetBrains Mono',monospace"><span style="font-size:34px">${f.dir ? "📂" : "📄"}</span>${f.name}${f.dir ? "/" : ""}<span style="margin-left:auto;font:600 24px Inter;color:${U.mute}">${f.note || ""}</span></div>`).join("") + "</div>";
  const F = [...c.querySelectorAll(".f")];
  return { frame(t, s = {}) { const a = KF.clamp(s.show ?? 1); c.style.opacity = Math.min(1, a * 2); c.style.transform = `translateY(${((1 - KF.ease.out(a)) * 100).toFixed(1)}px) scale(${(0.95 + 0.05 * KF.ease.out(a)).toFixed(4)})`; const n = s.n ?? files.length;
      F.forEach((e, i) => { const q = KF.ease.out(KF.clamp(n - i)); e.style.opacity = q; e.style.transform = `translateX(${((1 - q) * -40).toFixed(1)}px)`; e.style.background = s.hot === i ? KF.rgba(KF.C.blue, 0.22) : "transparent"; }); } };
});
