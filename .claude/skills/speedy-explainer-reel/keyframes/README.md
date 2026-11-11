# canwe.ai keyframes

Reusable scene blocks for our reels. One folder per block: `block.js` (the code), `demo.js` (a working example), `preview.jpg`, `README.md` (options).

**Rule:** every block is a pure function of time. Build it once with `KF.make(name, host, opts)`, then call `frame(t, state)` on every `seek(t)`. No clocks, no randomness, so a render always comes out the same.

```html
<link rel="stylesheet" href="keyframes/kf.css">
<script src="keyframes/kf.js"></script><script src="keyframes/wave-cancel/block.js"></script>
<div id="w" class="kf-host" style="left:0;top:340px;width:1080px;height:900px"></div>
<script>const wv = KF.make("wave-cancel", "w", {}); /* inside seek(t): */ wv.frame(t, { a: 1, b: KF.prog(t, 2, 1) });</script>
```

Blocks layer on the same host (see `cutaway-stage/demo.js`: stage + field-arcs + value-strip + tracked-labels = the touchscreen shot).
See them all: open `gallery.html` (or `gallery.html?only=<name>`). Render it: `node tools/render.mjs keyframes/gallery.html out.mp4 auto 30 6`.

## Group A: diagram blocks (built 11 Nov 2026)

| Block | What it shows |
|---|---|
| [`cutaway-stage`](cutaway-stage/) | a magnified cross-section. Layers stacked at the bottom, one hero object (finger / pen / none) coming down onto them. |
| [`field-arcs`](field-arcs/) | glowing arcs jumping between a row of points, with sparks running along them. A "sink" (finger, hand, magnet) pulls the nearby arcs toward it. |
| [`flow-nodes`](flow-nodes/) | boxes joined by wires with packets travelling along them (request → server → database, a pipeline, "how X talks to Y"). |
| [`grid-zoom`](grid-zoom/) | a woven grid of rows and columns (sensor grid, pixel grid, city blocks, seats). Light up one row, one column, then fly into their crossing. |
| [`magnifier`](magnifier/) | a lens that travels over another picture and shows it enlarged (inspect, review, "look closer"). |
| [`point-cloud`](point-cloud/) | clusters of dots in 3D space that the camera orbits (embeddings, customers, "things that are similar sit together"). |
| [`tile-map`](tile-map/) | a board of small tiles that fill in (test results, chips on a wafer, seats, days, pixels, "N of them"). |
| [`tracked-labels`](tracked-labels/) | small caps labels with a pointer line that stay glued to moving things. |
| [`value-strip`](value-strip/) | a row of live numbers (sensor readings, prices, scores). Cells roll to new values and light up while they differ from the base. |
| [`wave-cancel`](wave-cancel/) | one wave, its opposite, and what is left when they meet (noise cancelling, interference, "two things that cancel out"). |

## Still to build
B real screens (phone-frame, article-card, deploy-list, dashboard, world-map, calendar, folder-window + agent-log, product-page) · C numbers (multiply-field, frame-wall, thumb-wall, strike-row, before-after) · D props · E transitions (code-reveal, light-wipe) · F endings (ending-follow, loop-back). Existing pieces to move in: hero-stat, prompt-box, repo-card, captions, presenter, chapter-rail, ending-comment, cover, blade-cut/film-strip/clip-stack, world-camera, podcast-set.
Study notes: `../references/keyframes-study.md`.
