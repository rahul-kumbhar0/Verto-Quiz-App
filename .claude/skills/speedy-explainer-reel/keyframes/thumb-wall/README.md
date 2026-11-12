# thumb-wall

Rows of real vertical video covers drifting past in opposite directions, laid back in perspective ("the videos on this account", a body of work, a feed).

![preview](preview.jpg)

- `opts`: { images: [urls] (default: our own 24 reel covers from keyframes/_assets/covers), rows: 3, card: [w, h], gap, tilt: degrees of lean, views: { index: "18.2M" } (view badges; only pass real numbers) }
- `state`: { show: 0..1 (rows slide in), speed, dim: 0..1 (others fade), hot: cover index to ring and lift (the "most viewed" one) } · api: frame(t, state)

Use: `const b = KF.make("thumb-wall", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=thumb-wall`).
