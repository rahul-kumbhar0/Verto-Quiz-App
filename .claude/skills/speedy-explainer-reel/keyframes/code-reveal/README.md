# code-reveal

The picture dissolves into the code that draws it ("all of this was written by Claude"), then back.

![preview](preview.jpg)

- `opts`: { code: "…" (your real source; a sample is used when missing), size: font px, tint }
- `state`: { p: 0..1 (0 = no code, 1 = full wall of code over a dark veil), type: 0..1 (how much of the code has been typed), scroll: px } · api: frame(t, state)
- Put this block's host ABOVE the scene it covers (same position and size).

Use: `const b = KF.make("code-reveal", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=code-reveal`).
