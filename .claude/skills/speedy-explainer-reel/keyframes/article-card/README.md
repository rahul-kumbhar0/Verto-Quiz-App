# article-card

A news / blog / report page with the headline marked up (the source of a claim, shown on screen).

![preview](preview.jpg)

- `opts`: { theme: "light"|"dark", site, date, headline: "The *Hugging Face* incident" (the part in *stars* gets the marker), lines: number of body lines, tags: [..], w }
- `state`: { show: 0..1, mark: 0..1 (marker sweeps over the starred words), body: 0..1 (body lines draw in), scroll: px } · api: frame(t, state)

Use: `const b = KF.make("article-card", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=article-card`).
