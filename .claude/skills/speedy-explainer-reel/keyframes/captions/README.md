# captions

Word-by-word captions with one key word in a blue selection box (the house caption style).

![preview](preview.jpg)

- `opts`: { words: [{ w: "word", s: start, e: end }] (from words.json), keys: ["word", …] or [indexes] to box, max: words per screen (default 4), size, top, theme }
- `api`: frame(t) · The spoken word is bright, words not yet spoken are dim, the screen clears at each sentence end or after `max` words.

Use: `const b = KF.make("captions", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=captions`).
