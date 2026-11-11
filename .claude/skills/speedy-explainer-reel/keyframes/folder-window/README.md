# folder-window

A file-explorer window whose files appear one by one ("with this folder…", project structure, what's inside the download).

![preview](preview.jpg)

- `opts`: { theme, title, files: [{ name, dir: bool, depth: 0.., note }], w }
- `state`: { show: 0..1, n: how many rows are visible (fractional = the next one is sliding in), hot: index of a highlighted row } · api: frame(t, state)

Use: `const b = KF.make("folder-window", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=folder-window`).
