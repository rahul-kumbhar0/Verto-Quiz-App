/* captions: word-by-word captions with one key word in a blue selection box (the house caption style).
 * opts:  { words: [{ w: "word", s: start, e: end }] (from words.json), keys: ["word", …] or [indexes] to box, max: words per screen (default 4), size, top, theme }
 * api:   frame(t) · The spoken word is bright, words not yet spoken are dim, the screen clears at each sentence end or after `max` words. */
KF.define("captions", (host, o) => {
  const U = KF.ui(o.theme || "dark"), W = o.words || [], max = o.max || 4, size = o.size || 64, c = KF.el("div", "", host), keys = o.keys || []; c.dataset.qa = "ok";
  c.style.cssText = `position:absolute;left:60px;right:60px;top:${o.top ?? 0}px;text-align:center;font:800 ${size}px/1.22 Inter;color:${U.ink};letter-spacing:-1px`;
  const groups = []; let g = []; W.forEach((x, i) => { g.push(i); if (g.length >= max || /[.!?,]$/.test(x.w)) { groups.push(g); g = []; } }); if (g.length) groups.push(g);
  const isKey = i => keys.includes(i) || keys.includes(W[i].w.replace(/[.,!?]/g, "").toLowerCase()) || keys.includes(W[i].w); let last = -1;
  return { frame(t) { let gi = 0; groups.forEach((gr, k) => { if (t >= W[gr[0]].s - 0.05) gi = k; }); const gr = groups[gi] || [];
      if (gi !== last) { c.innerHTML = gr.map(i => `<span data-i="${i}" style="display:inline-block;position:relative;margin:0 .14em;padding:0 .12em">${isKey(i) ? `<i style="position:absolute;inset:6% -2% 4%;border:3px solid #4b8bff;background:rgba(75,139,255,.2)"></i><i style="position:absolute;left:-9px;top:-3px;width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid #4b8bff"></i><i style="position:absolute;right:-9px;bottom:-5px;width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid #4b8bff"></i>` : ""}<b style="position:relative;font-weight:800">${W[i].w}</b></span>`).join(""); last = gi; }
      [...c.children].forEach(e => { const x = W[+e.dataset.i], said = t >= x.s - 0.03, p = KF.spring(t, x.s - 0.03, { f: 3.2, z: 0.6 }); e.style.opacity = said ? 1 : 0.34; e.style.transform = `translateY(${(said ? (1 - p) * 14 : 0).toFixed(1)}px)`;
        e.querySelectorAll("i").forEach(b => (b.style.opacity = said ? 1 : 0)); }); } };
});
