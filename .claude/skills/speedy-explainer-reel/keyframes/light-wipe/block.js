/* light-wipe: a glowing bar that sweeps across the picture to change scenes.
 * opts:  { color, dir: "x"|"y", width: bar px }
 * state: { p: 0..1 (bar position), cover: colour that fills the side the bar has passed (use the next scene's background), alpha } · api: frame(t, state) · edge(p) → bar position in px (clip the new scene to it)
 * Put its host above both scenes. To reveal scene B: set B's clip-path to inset(0 calc(100% - edge px) 0 0). */
KF.define("light-wipe", (host, o) => {
  const { ctx, w, h, clear } = KF.canvas(host), col = o.color || "#7fd0ff", ver = o.dir === "y", L = ver ? h : w, bw = o.width || 14;
  return { edge: p => KF.ease.inOut(KF.clamp(p)) * (L + 200) - 100, frame(t, s = {}) { clear(); const p = KF.clamp(s.p ?? 0); if (p <= 0 || p >= 1) return; const e = KF.ease.inOut(p) * (L + 200) - 100;
      if (s.cover) { ctx.fillStyle = s.cover; ver ? ctx.fillRect(0, 0, w, e) : ctx.fillRect(0, 0, e, h); }
      ctx.globalCompositeOperation = "lighter"; const g = ver ? ctx.createLinearGradient(0, e - 220, 0, e + 220) : ctx.createLinearGradient(e - 220, 0, e + 220, 0); g.addColorStop(0, KF.rgba(col, 0)); g.addColorStop(0.5, KF.rgba(col, 0.55)); g.addColorStop(1, KF.rgba(col, 0));
      ctx.fillStyle = g; ver ? ctx.fillRect(0, e - 220, w, 440) : ctx.fillRect(e - 220, 0, 440, h); ctx.fillStyle = "#fff"; ver ? ctx.fillRect(0, e - bw / 2, w, bw) : ctx.fillRect(e - bw / 2, 0, bw, h); ctx.globalCompositeOperation = "source-over"; } };
});
