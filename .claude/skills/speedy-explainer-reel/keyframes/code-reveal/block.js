/* code-reveal: the picture dissolves into the code that draws it ("all of this was written by Claude"), then back.
 * opts:  { code: "…" (your real source; a sample is used when missing), size: font px, tint }
 * state: { p: 0..1 (0 = no code, 1 = full wall of code over a dark veil), type: 0..1 (how much of the code has been typed), scroll: px } · api: frame(t, state)
 * Put this block's host ABOVE the scene it covers (same position and size). */
KF.define("code-reveal", (host, o) => {
  const code = o.code || `export const Hook: Scene = ({ t, theme }) => {\n  const cam   = camera(t, KEYS);\n  const touch = spring(t, at("touch"));\n  const glow  = touch * touch;\n  // when the finger lands, the field bends\n  const pull  = lerp(0, 0.38, ease(glow));\n  const cells = strip.map((v, i) =>\n    v - pull * falloff(i, tip.x));\n  return (\n    <Stage cam={cam}>\n      <Cutaway touch={touch} glow={glow} />\n      <FieldArcs sink={tip} k={pull} />\n      <ValueStrip values={cells} />\n      <Labels at={["GLASS", "WIRES"]} />\n    </Stage>\n  );\n};`;
  const v = KF.el("div", "", host), pre = KF.el("pre", "", host); v.style.cssText = "position:absolute;inset:0;background:#07080b"; pre.dataset.qa = "texture";
  pre.style.cssText = `position:absolute;left:36px;top:30px;right:20px;margin:0;font:700 ${o.size || 30}px/1.5 "JetBrains Mono",monospace;color:#cfd6e4;white-space:pre;overflow:hidden`;
  const esc = x => x.replace(/&/g, "&amp;").replace(/</g, "&lt;"), KW = /^(export|const|return|import|from|function|let|if|else)$/;
  const paint = src => src.replace(/(\/\/[^\n]*)|("[^"\n]*")|([A-Za-z_]\w*)|([\s\S])/g, (m, com, str, word, other) => com ? `<i style="color:#6b7280;font-style:normal">${esc(com)}</i>` : str ? `<u style="color:#a5e075;text-decoration:none">${esc(str)}</u>` : word ? (KW.test(word) ? `<b style="color:#c792ea">${word}</b>` : word) : esc(other));
  return { frame(t, s = {}) { const p = KF.clamp(s.p ?? 0), ty = KF.clamp(s.type ?? 1), n = Math.round(ty * code.length); v.style.opacity = 0.88 * p; pre.style.opacity = p; pre.style.transform = `translateY(${(-(s.scroll || 0) + (1 - p) * 30).toFixed(1)}px) scale(${(1 + 0.06 * (1 - p)).toFixed(4)})`;
      pre.style.filter = `blur(${((1 - p) * 8).toFixed(1)}px)`; const html = paint(code.slice(0, n)) + (ty < 1 ? '<span style="background:#D97757">&nbsp;</span>' : ""); if (pre.dataset.n !== String(n)) { pre.innerHTML = html; pre.dataset.n = n; } } };
});
