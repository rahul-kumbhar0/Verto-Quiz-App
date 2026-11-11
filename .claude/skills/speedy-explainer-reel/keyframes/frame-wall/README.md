# frame-wall

A wall of thousands of tiny frames streaming past ("over 5,000 frames, one by one", every photo, every commit).

![preview](preview.jpg)

- `opts`: { rows, tile: [w, h], gap, colors: [..] tint palette }
- `state`: { fill: 0..1 (how much of the wall has been drawn in), speed, dim: 0..1 } · api: frame(t, state) · total → number of tiles on the wall

Use: `const b = KF.make("frame-wall", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=frame-wall`).
