# real-screen

A REAL screenshot shown in a device frame (phone, browser or app window) that scrolls, zooms into exact spots and draws highlight boxes on them, so viewers see the actual page, button or line ("this is the repo", "click here", "this is the model it really uses").

![preview](preview.jpg)

- Coordinates are in the screenshot's own pixels, so boxes land exactly on the real thing.
- `opts`: { safeLeft: px from the host's left edge that box labels never cross (default 72, the Reels safe margin), src: image url, natural: [w, h] of the image, frame: "phone"|"browser"|"window", url: text in the browser bar, w: frame width px, vh: visible height px (phone/browser crop; default = whole image), top, x (centre) }
- `state`: { show: 0..1, scroll: y in image px at the top edge, zoom: 1.., focus: [x, y] image px kept in the middle while zoomed, dim: 0..1 (darken everything outside the active box),
- boxes: [{ x, y, w, h (image px), p: 0..1 draw-in, color, label, side: "top"|"bottom" }] } · api: frame(t, state)

How to get the screenshots: Playwright from tools/ (`viewport 430×932, deviceScaleFactor 2, iPhone user agent` for phone pages; `fullPage` to scroll), plus a project's own README images from raw.githubusercontent.com. Read element positions with `getBoundingClientRect()` (×2 for the image) so boxes land exactly. Log-in pages: show the public page instead, never a real account.
Working example: `demo.js` (`../gallery.html?only=real-screen`). Used in: the FREE reel (studio/reels/free).
