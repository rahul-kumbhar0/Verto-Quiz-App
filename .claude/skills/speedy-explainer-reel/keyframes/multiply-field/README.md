# multiply-field

One thing becomes a whole field of them on a real 3D ground: the camera starts close on ONE item, then cranes up and pulls back while the rest drop in around it, with shadows, depth haze and floodlight glow ("that's 180 full stadiums", 700 agents, 5,000 students).

![preview](preview.jpg)

- The items are drawn pictures: "stadium" (stands, crowd, striped pitch, floodlights, wall height), "person" (6 different people), "phone" (lit screens), "laptop".
- `opts`: { n: how many, glyph: "stadium"|"person"|"phone"|"laptop" | draw: (ctx, variant) => {} (your own 400×300 drawing), flat: true if the drawing is seen from above (stadium) }
- `state`: { p: 0..1 (0 = one item close-up, 1 = the full field from the air), show: 0..1 } · api: frame(t, state) · count(state) → how many are on screen (for a counter)

Use: `const b = KF.make("multiply-field", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=multiply-field`).
