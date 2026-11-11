# thumb-wall

Rows of vertical video covers drifting past in opposite directions ("the videos on this account", a body of work, a feed).

![preview](preview.jpg)

- `opts`: { rows: 3, card: [w, h], gap, images: [urls] (optional; coloured placeholder covers are drawn when missing), tilt: degrees }
- `state`: { show: 0..1 (rows slide in), speed, dim: 0..1, hot: index of a cover to ring (the "most viewed" one) } · api: frame(t, state)

Use: `const b = KF.make("thumb-wall", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=thumb-wall`).
