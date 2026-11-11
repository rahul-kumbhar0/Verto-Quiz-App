# presenter

The cartoon presenter (wraps avatar.js; load ../../assets/template/avatar.js before this block).

![preview](preview.jpg)

- `opts`: { look: "street"|"hoodie"|"classic", style: { shirt, print, lens1, … }, w: px, poses: [[time, "pose"], …], talk: [[start, end], …] (when the mouth moves) }
- `state`: { pose, mouth: 0..1, expr } (all optional; override the timeline) · api: frame(t, state) · poses() → every pose name
- Full pose list and rules: ../../references/avatar.md

Use: `const b = KF.make("presenter", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=presenter`).
