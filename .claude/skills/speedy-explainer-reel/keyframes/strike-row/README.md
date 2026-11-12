# strike-row

A row of things, each crossed out with a red marker stroke ("no camera, no drawing, no editing"), or ticked in green.

![preview](preview.jpg)

- The things are illustrated objects: art: "camera"|"tablet"|"timeline"|"mic"|"laptop"|"card"|"chat" (or icon: any emoji / short text).
- `opts`: { items: [{ art | icon, label, at: time it appears, strike: time it gets crossed (omit = stays), tick: time it gets a green tick }], size, top }
- `api`: frame(t)

Use: `const b = KF.make("strike-row", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=strike-row`).
