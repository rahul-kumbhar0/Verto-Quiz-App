# repo-card

A GitHub-style repo card with a live star count.

![preview](preview.jpg)

- `opts`: { theme, owner, name, desc, stars, chips: ["Rust", "MIT"], w }
- `state`: { show: 0..1, stars: number (defaults to opts.stars × count), count: 0..1 (rolls the number up), starred: 0..1 (the Star button gets pressed) } · api: frame(t, state)

Use: `const b = KF.make("repo-card", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=repo-card`).
