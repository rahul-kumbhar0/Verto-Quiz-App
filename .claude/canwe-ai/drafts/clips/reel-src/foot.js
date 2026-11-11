// footage frames for seek(t) reels: FOOT.paint(el, set, localTime) → background-image of the right frame (preloaded + decoded)
(function () {
  const S = window.FOOT_SETS || {}, fps = 15, cache = {};
  const url = (set, i) => `foot/${set}/${String(i + 1).padStart(4, "0")}.jpg`;
  const jobs = [];
  for (const k in S) for (let i = 0; i < S[k].n; i++) { const im = new Image(); im.src = url(k, i); cache[url(k, i)] = im; jobs.push(im.decode().catch(() => {})); }
  window.__ready = Promise.all(jobs);
  window.FOOT = {
    meta: window.FOOT_META || {},
    n: set => (S[set] || { n: 1 }).n,
    src(set, lt, loop = true) { const n = this.n(set); let i = Math.floor(lt * fps); i = loop ? ((i % n) + n) % n : Math.max(0, Math.min(n - 1, i)); return url(set, i); },
    still: (set, i) => url(set, i),
    paint(el, set, lt, loop = true, pos) { if (typeof el === "string") el = document.getElementById(el); const u = this.src(set, lt, loop);
      if (el.dataset.f !== u) { el.style.backgroundImage = `url(${u})`; el.dataset.f = u; } if (pos && el.dataset.p !== pos) { el.style.backgroundPosition = pos; el.dataset.p = pos; } },
  };
})();
