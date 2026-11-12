# strike-row

A row of solid tiles holding illustrated objects. Each one drops in with a bounce, then gets crossed out by a rough red marker stroke that hits hard (the tile recoils and tilts, sparks fly, the object goes grey), or gets a green tick with a sparkle ("no camera, no drawing, no editing").

![preview](preview.jpg)

- The things are illustrated objects: art: "camera"|"tablet"|"timeline"|"mic"|"laptop"|"card"|"chat" (or icon: any emoji / short text).
- `opts`: { items: [{ art | icon, label, at: time it appears, strike: time it gets crossed (omit = stays), tick: time it gets a green tick }], size, top }
- `api`: frame(t)

Use: `const b = KF.make("strike-row", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=strike-row`).
