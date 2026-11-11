# phone-frame

A phone with real-looking screens (lock screen, incoming call, settings page, or your own content).

![preview](preview.jpg)

- `opts`: { w, h, screens: [{ kind: "lock", time, date, notif: { app, text } } | { kind: "call", name, sub } | { kind: "settings", title, rows: [{ label, value, toggle }] } | { kind: "custom" }] }
- `state`: { show: 0..1, screen: 0..n-1 (fractions cross-fade), notif: 0..1, slide: 0..1 (answer slider), toggles: [0..1 per row], tilt: degrees, glove: bool }
- `api`: frame(t, state) · screen(i) → the element of screen i (put your own content into a "custom" one)

Use: `const b = KF.make("phone-frame", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=phone-frame`).
