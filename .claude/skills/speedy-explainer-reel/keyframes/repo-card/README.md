# repo-card

A GitHub repo page in a browser window, laid out like the real one (dark theme colours, owner / name, Public pill, Watch · Fork · Star buttons, description, topic pills, language bar) with a live star count.

![preview](preview.jpg)

- `opts`: { owner, name, desc, stars, forks, watching, chips: ["python", "ai"] (topics), langs: [["Python", 82, "#3572A5"], ["Shell", 18, "#89e051"]], licence, w, top, chrome: false to drop the browser frame }
- `state`: { show: 0..1, stars: number (defaults to opts.stars × count), count: 0..1 (rolls the number up), starred: 0..1 (the Star button gets pressed and turns to "Starred") } · api: frame(t, state)

Use: `const b = KF.make("repo-card", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=repo-card`).
