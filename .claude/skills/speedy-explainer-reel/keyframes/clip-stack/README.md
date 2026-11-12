# clip-stack

Real vertical clips fly in and fan out in a 3D arc (each card has thickness, a shadow and a glass glint), then collapse onto one neat pile with a bounce ("a whole stack of Shorts from one video", outputs piling up).

![preview](preview.jpg)

- `opts`: { n: cards, card: [w, h], captions: [..] (HTML; real words only), images: [urls] (default: our own reel covers), top }
- `state`: { fan: 0..1 (cards fly in and fan out), stack: 0..1 (they collapse onto one pile) } · api: frame(t, state) · cards → the card elements

Use: `const b = KF.make("clip-stack", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=clip-stack`).
