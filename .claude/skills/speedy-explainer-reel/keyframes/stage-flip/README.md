# stage-flip

The background flips between dark and light as a circle growing from a point (marks a new chapter; light = real screens, dark = diagrams).

![preview](preview.jpg)

- `opts`: { light: colour, dark: colour, origin: [x, y] in host px }
- `state`: { p: 0..1 (0 = dark, 1 = light), origin } · api: frame(t, state) · isLight(state) → true once most of the stage is light (switch your text colours on it)
- Put its host BEHIND your content (first child of the stage).

Use: `const b = KF.make("stage-flip", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=stage-flip`).
