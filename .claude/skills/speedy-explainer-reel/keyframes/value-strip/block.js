/* value-strip: a row of live numbers (sensor readings, prices, scores). Cells roll to new values and light up while they differ from the base.
 * opts:  { n: cells, base: resting value, size: font px, unit: "" , hot: colour when changed, keys: [{ t, values: [..] | fn(i) }] (optional timeline) }
 * state: { values: [..] } (optional; overrides keys) · api: frame(t, state) */
KF.define("value-strip", (host, o) => {
  const n = o.n || 9, base = o.base ?? 100, row = KF.el("div", "kf-strip", host), cells = [], keys = (o.keys || []).slice().sort((a, b) => a.t - b.t);
  row.style.fontSize = (o.size || 34) + "px"; for (let i = 0; i < n; i++) cells.push(KF.el("span", "", row, String(base)));
  const val = (k, i) => (typeof k.values === "function" ? k.values(i) : k.values[i] ?? base);
  return { frame(t, s = {}) { for (let i = 0; i < n; i++) { let v = base;
        if (s.values) v = s.values[i] ?? base; else { let cur = base; for (const k of keys) { if (t < k.t) break; const p = KF.ease.out(KF.prog(t, k.t, k.d || 0.35)); cur = KF.lerp(cur, val(k, i), p); } v = cur; }
        const r = Math.round(v), d = Math.abs(r - base) / Math.max(1, Math.abs(base)), c = cells[i]; const txt = r + (o.unit || ""); if (c.textContent !== txt) c.textContent = txt;
        c.style.color = d > 0.005 ? (o.hot || KF.C.gold) : KF.C.mute; c.style.transform = `scale(${(1 + Math.min(0.35, d * 0.9)).toFixed(3)})`; c.style.textShadow = d > 0.005 ? "0 0 18px rgba(242,193,78,.7)" : "none"; } } };
});
