# hero-stat

One huge number that counts up like a real odometer: every digit is a wheel that turns, the fast ones blur, and it settles with a small bounce and a glow.

![preview](preview.jpg)

- `opts`: { from, to, dec: decimals, icon: "play"|"heart"|"star"|"eye"|"rupee" (drawn icon in front), prefix, suffix: "M", label: "views", color, glow, size, top }
- `state`: { p: 0..1 (count progress), value: number (override), show: 0..1 } · api: frame(t, state)

Use: `const b = KF.make("hero-stat", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=hero-stat`).
