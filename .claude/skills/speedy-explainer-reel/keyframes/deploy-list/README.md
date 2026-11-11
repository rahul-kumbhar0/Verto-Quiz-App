# deploy-list

A list of jobs that go from "building" to "ready" one by one (deployments, uploads, exports, tests).

![preview](preview.jpg)

- `opts`: { theme, title, rows: [{ name, sub, at: time it appears, done: time it turns ready, fail: bool }], w }
- `state`: { busy: "Building", ok: "Ready", bad: "Failed" } (labels, optional) · api: frame(t, state)

Use: `const b = KF.make("deploy-list", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=deploy-list`).
