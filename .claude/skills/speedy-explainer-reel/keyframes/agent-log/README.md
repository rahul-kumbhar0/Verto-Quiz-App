# agent-log

A terminal window running a coding agent, laid out like Claude Code (the "> request" line, "● Tool(target)" steps with a "⎿ result" line under each, and the orange "✻ Working…" line while a step runs).

![preview](preview.jpg)

- `opts`: { title: window title, prompt: the request, steps: [{ verb, obj, meta }], w, top, welcome: false to hide the banner }
- `state`: { show: 0..1, n: progress in steps (2.5 = two done, the third half-way and running) } · api: frame(t, state)

Use: `const b = KF.make("agent-log", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=agent-log`).
