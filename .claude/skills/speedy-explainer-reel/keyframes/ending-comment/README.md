# ending-comment

The "Comment KEYWORD" ending: big call to action, the keyword typed into an Instagram comment sheet (emoji row, avatar, pill input, blue send) and sent, then our DM arrives as a phone notification from Instagram.

![preview](preview.jpg)

- `opts`: { keyword: "SHORTS", pill: "to get the free setup", handle: "@canwe.ai", dm: "The free setup, every step 👇", logo: url, theme }
- `state`: { show: 0..1, typed: 0..1, sent: 0..1, dm: 0..1 } · api: frame(t, state)

Use: `const b = KF.make("ending-comment", hostElement, opts);` then `b.frame(t, state)` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=ending-comment`).
