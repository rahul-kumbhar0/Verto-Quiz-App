# frame-wall

A wall of tiny REAL video frames streaming past in rows ("over 5,000 frames, one by one", every photo, every commit).

![preview](preview.jpg)

- `opts`: { sheet: url of a frame sheet (default: keyframes/_assets/frames.jpg, 96 frames from our own reels, 12×8, each 54×96), grid: [cols, rows] of the sheet, tile: [w, h] on screen, gap }
- `state`: { fill: 0..1 (the wall draws itself in, row by row), speed, dim: 0..1, focus: 0..1 (one frame in the middle grows to show it is a real picture; opts.focusFrame = its index in the sheet) } · api: frame(t, state) · total → tiles on screen

Use: `const b = KF.make("frame-wall", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=frame-wall`).
