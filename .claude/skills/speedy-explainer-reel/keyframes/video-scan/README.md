# video-scan

An AI "watching" a video: a YouTube-style player plays a tutorial made of slides, a scan line sweeps the picture, timestamped frames fly out into a row underneath and timestamped transcript lines stack up beside it ("it pulls the frames and the transcript"). `solo: true` gives only the player.

![preview](preview.jpg)

- `opts`: { cmd: text typed in the command bar on top (omit = no bar), title, channel, dur: "14:32", slides: [{ h: headline, sub, color }], frames: [{ t: "00:42", slide: index }], lines: [{ t: "00:42", text }], solo: true = only the player, centred and bigger, theme: "dark"|"light" (the page behind it) }
- `state`: { show: 0..1, typed: 0..1 (command bar), play: 0..1 (how far the video has played), scan: 0..1 (strength of the scan line), nF: frames pulled so far (fractions = flying), nL: transcript lines so far } · api: frame(t, state) · el (root) · player (element)

Use: `const b = KF.make("video-scan", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=video-scan`). Used in the LEARN reel (studio/reels/learn).
