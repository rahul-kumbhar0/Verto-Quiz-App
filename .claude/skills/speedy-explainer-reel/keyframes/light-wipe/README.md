# light-wipe

A glowing bar that sweeps across the picture to change scenes.

![preview](preview.jpg)

- `opts`: { color, dir: "x"|"y", width: bar px }
- `state`: { p: 0..1 (bar position), cover: colour that fills the side the bar has passed (use the next scene's background), alpha } · api: frame(t, state) · edge(p) → bar position in px (clip the new scene to it)
- Put its host above both scenes. To reveal scene B: set B's clip-path to inset(0 calc(100% - edge px) 0 0).

Use: `const b = KF.make("light-wipe", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=light-wipe`).
