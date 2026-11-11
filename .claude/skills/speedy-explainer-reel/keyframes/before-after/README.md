# before-after

Two pictures side by side behind a sliding divider (old vs new, without vs with, slow vs fast).

![preview](preview.jpg)

- `opts`: { labels: ["Before", "After"], w, h, top, radius }
- `state`: { x: 0..1 (divider position; 0 = all "after", 1 = all "before"), show: 0..1 } · api: frame(t, state) · a, b → the two host elements (build any blocks or content inside them)

Use: `const b = KF.make("before-after", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=before-after`).
