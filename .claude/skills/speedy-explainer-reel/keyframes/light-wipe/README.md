# light-wipe

An anamorphic light streak crosses the picture to change scenes: a bright core line, a wide horizontal lens streak, flare ghosts, colour fringing at the edge and sparkles left in its wake.

![preview](preview.jpg)

- `opts`: { color: tint of the streak, dir: "x"|"y", angle: degrees of tilt (default 8), width: core px }
- `state`: { p: 0..1 (bar position), cover: colour that fills the side the bar has passed (use the next scene's background) } · api: frame(t, state) · edge(p) → bar position in px (clip the new scene to it: clip-path inset(0 calc(100% - edge px) 0 0))
- Put its host above both scenes.

Use: `const b = KF.make("light-wipe", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=light-wipe`).
