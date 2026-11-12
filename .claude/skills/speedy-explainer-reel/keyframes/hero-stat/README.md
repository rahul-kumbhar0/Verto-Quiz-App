# hero-stat

One huge number on a real mechanical counter. Every digit is a wheel in its own housing (curved shading top and bottom, like a car odometer); the wheels spin with blur, land one after another from the left with a click-bounce, then a light sweeps across the glass and sparks fly.

![preview](preview.jpg)

- `opts`: { from, to, dec: decimals, icon: "play"|"heart"|"star"|"eye"|"rupee", prefix, suffix: "M", label: "views", look: "counter" (default) | "glow" (no housing, big glowing type), color, glow, size, top }
- `state`: { p: 0..1 (count progress), value: number (override), show: 0..1 } · api: frame(t, state)

Use: `const b = KF.make("hero-stat", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=hero-stat`).
