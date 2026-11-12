# thumb-wall

Rows of real vertical video covers drifting past at three depths (far row small and soft, near row big), with glass reflections; one cover can lift out, straighten up and start PLAYING like a real reel (progress bar, like / comment / share buttons, a heart pop).

![preview](preview.jpg)

- `opts`: { images: [urls] (default: our own 24 reel covers from keyframes/_assets/covers), card: [w, h] of the middle row, tilt: degrees of lean, views: { index: "18.2M" } (only pass real numbers) }
- `state`: { show: 0..1 (rows slide in), speed, dim: 0..1 (the wall falls back), hot: cover index that lifts out, play: 0..1 (progress of the hot reel's playback bar), like: 0..1 (heart pop) } · api: frame(t, state)

Use: `const b = KF.make("thumb-wall", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=thumb-wall`).
