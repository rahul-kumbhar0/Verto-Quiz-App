# film-strip

A long video shown as a strip of frames running under a playhead; the best moments light up with a score ("the AI picks the moments").

![preview](preview.jpg)

- `opts`: { n: frames, frame: [w, h], images: [urls] (optional), picks: [frame indexes], scores: [numbers], y }
- `state`: { show: 0..1, scroll: 0..1 (how far the strip has run), lift: 0..1 (the picked frames rise out of the strip) } · api: frame(t, state)

Use: `const b = KF.make("film-strip", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=film-strip`).
