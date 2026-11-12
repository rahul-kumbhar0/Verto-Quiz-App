# canwe.ai keyframes

Reusable scene blocks for our reels: 44 folders plus `_assets/`. Each block folder has `block.js` (the code), `demo.js` (a working example), `preview.jpg` and `README.md` (its options).

**Rule:** every block is a pure function of time. Build it once with `KF.make(name, host, opts)`, then call `frame(t, state)` on every `seek(t)`. No clocks, no randomness, so a render always comes out the same.

```html
<link rel="stylesheet" href="keyframes/kf.css">
<script src="keyframes/kf.js"></script><script src="keyframes/wave-cancel/block.js"></script>
<div id="w" class="kf-host" style="left:0;top:340px;width:1080px;height:900px"></div>
<script>const wv = KF.make("wave-cancel", "w", {}); /* inside seek(t): */ wv.frame(t, { a: 1, b: KF.prog(t, 2, 1) });</script>
```

- Blocks layer on one host (`cutaway-stage/demo.js` = stage + field-arcs + value-strip + tracked-labels) and nest (`before-after` holds two other blocks; `magnifier` reads another block's canvas).
- Timing: drive `state` from word times, e.g. `KF.prog(t, at("touch"), 0.6)`. Helpers in `kf.js`: `prog`, `ease`, `spring`, `hash`, `noise`, `fmt`, `typed`, `ui(theme)`, `loopBack`.
- Themes: screen blocks take `theme: "light" | "dark"`.
- See them all: `gallery.html` · one block: `gallery.html?only=<name>` · one group: `gallery.html?group=B`. Render: `node tools/render.mjs keyframes/gallery.html out.mp4 auto 30 6`.
- Adding a block: new folder with `block.js` (header comment = its docs) + `demo.js`, add it to `manifest.js`.


## Real material (`_assets/`)
- `_assets/covers/c01…c24.jpg`: 24 of our own reel covers (270×480). `KF.covers()` returns their URLs; `thumb-wall` uses them by default.
- `_assets/frames.jpg`: 96 real frames from 8 of our finished reels (12×8 sheet, 54×96 each); `frame-wall` uses it by default.
- Refresh them when new reels ship (ffmpeg commands in RECORD.md, KEYFRAMES section). `KF.asset(path)` / `KF.img(url)` load anything else you add there.
- Advanced helpers in `kf.js`: `KF.keys(t, [[time, value, ease], …])` (multi-stage motion: wind-up, overshoot, settle), `KF.sparks(ctx, t, t0, x, y, opts)` (impact sparks), `KF.sheen(ctx, x, y, w, h, p)` (light sweeping across glass). Put a `finish` block on top of every scene for grain, vignette, bloom and handheld drift.
- Realism rule (group C onward): real pictures over placeholders, drawn objects over emoji, numbers only if they are true.

## A. Diagram blocks

| Block | What it shows |
|---|---|
| [`cutaway-stage`](cutaway-stage/) | A magnified cross-section. Layers stacked at the bottom, one hero object (finger / pen / none) coming down onto them. |
| [`tracked-labels`](tracked-labels/) | Small caps labels with a pointer line that stay glued to moving things. |
| [`value-strip`](value-strip/) | A row of live numbers (sensor readings, prices, scores). Cells roll to new values and light up while they differ from the base. |
| [`field-arcs`](field-arcs/) | Glowing arcs jumping between a row of points, with sparks running along them. A "sink" (finger, hand, magnet) pulls the nearby arcs toward it. |
| [`grid-zoom`](grid-zoom/) | A woven grid of rows and columns (sensor grid, pixel grid, city blocks, seats). Light up one row, one column, then fly into their crossing. |
| [`wave-cancel`](wave-cancel/) | One wave, its opposite, and what is left when they meet (noise cancelling, interference, "two things that cancel out"). |
| [`point-cloud`](point-cloud/) | Clusters of dots in 3D space that the camera orbits (embeddings, customers, "things that are similar sit together"). |
| [`tile-map`](tile-map/) | A board of small tiles that fill in (test results, chips on a wafer, seats, days, pixels, "N of them"). |
| [`flow-nodes`](flow-nodes/) | Boxes joined by wires with packets travelling along them (request → server → database, a pipeline, "how X talks to Y"). |
| [`magnifier`](magnifier/) | A lens that travels over another picture and shows it enlarged (inspect, review, "look closer"). |

## B. Real-screen blocks

| Block | What it shows |
|---|---|
| [`phone-frame`](phone-frame/) | A phone with real-looking screens (lock screen, incoming call, settings page, or your own content). |
| [`article-card`](article-card/) | A news / blog / report page with the headline marked up (the source of a claim, shown on screen). |
| [`repo-card`](repo-card/) | A GitHub-style repo card with a live star count. |
| [`deploy-list`](deploy-list/) | A list of jobs that go from "building" to "ready" one by one (deployments, uploads, exports, tests). |
| [`dashboard`](dashboard/) | A gauge, a rolling total and a bar chart (traffic, revenue, usage: "the numbers went up"). |
| [`world-map`](world-map/) | A dotted world map with cities and routes that light up (CDN, servers, "your request travels from A to B", users everywhere). |
| [`calendar`](calendar/) | A month grid where days fill in (streaks, "40 days", deadlines, a date that matters). |
| [`folder-window`](folder-window/) | A file-explorer window whose files appear one by one ("with this folder…", project structure, what's inside the download). |
| [`agent-log`](agent-log/) | An AI agent's activity log ticking through its steps ("Searched the web… Created script.txt… Made voice.mp3"). |
| [`prompt-box`](prompt-box/) | An AI chat input being typed into and sent ("just one sentence"). |
| [`product-page`](product-page/) | A shop / app page in a browser that loads (skeleton → content), with a load timer ("the page took 1.4 s", pricing, "what the user sees"). |

## C. Number and comparison blocks

| Block | What it shows |
|---|---|
| [`hero-stat`](hero-stat/) | One huge number on a real mechanical counter. Every digit is a wheel in its own housing (curved shading top and bottom, like a car odometer); the wheels spin with blur, land one after another from the left with a click-bounce, then a light sweeps across the glass and sparks fly. |
| [`multiply-field`](multiply-field/) | One thing becomes a whole field of them on a real 3D ground: the camera starts close on ONE item, then cranes up and pulls back while the rest drop in around it, with shadows, depth haze and floodlight glow ("that's 180 full stadiums", 700 agents, 5,000 students). |
| [`frame-wall`](frame-wall/) | A wall of thousands of REAL video frames, seen at an angle like a wall of prints: rows recede into the distance, far rows are out of focus, a light sweeps across, and one frame can fly out of the wall toward the camera ("over 5,000 frames, one by one"). |
| [`thumb-wall`](thumb-wall/) | Rows of real vertical video covers drifting past at three depths (far row small and soft, near row big), with glass reflections; one cover can lift out, straighten up and start PLAYING like a real reel (progress bar, like / comment / share buttons, a heart pop). |
| [`strike-row`](strike-row/) | A row of solid tiles holding illustrated objects. Each one drops in with a bounce, then gets crossed out by a rough red marker stroke that hits hard (the tile recoils and tilts, sparks fly, the object goes grey), or gets a green tick with a sparkle ("no camera, no drawing, no editing"). |
| [`before-after`](before-after/) | Two pictures behind a sliding divider with a glass handle, like a real comparison slider; a fingertip presses the handle and drags it (old vs new, without vs with, slow vs fast). |

## D. Metaphor props

| Block | What it shows |
|---|---|
| [`props`](props/) | Realistic metaphor objects, each with its own multi-stage action. Materials are lit from the top-left (brushed steel, gold, glass, plastic, paper), every object stands on a soft floor shadow and gets a rim light. |

## E. Transitions and effects

| Block | What it shows |
|---|---|
| [`code-reveal`](code-reveal/) | The picture dissolves into the code that draws it ("all of this was written by Claude"), then back. |
| [`light-wipe`](light-wipe/) | A glowing bar that sweeps across the picture to change scenes. |
| [`stage-flip`](stage-flip/) | The background flips between dark and light as a circle growing from a point (marks a new chapter; light = real screens, dark = diagrams). |
| [`blade-cut`](blade-cut/) | Two glowing blades slice a wide picture; the sides fall away and the middle becomes a vertical clip ("it cuts them into Shorts", crop, trim). |
| [`film-strip`](film-strip/) | A long video shown as a strip of frames running under a playhead; the best moments light up with a score ("the AI picks the moments"). |
| [`clip-stack`](clip-stack/) | Vertical clips fan out in an arc, then drop onto one stack ("a whole stack of Shorts from one video", outputs piling up). |
| [`world-camera`](world-camera/) | A 3D world with a camera that flies between stations (engine `world3d.js`, see its README). |

## F. Structure, endings and extras

| Block | What it shows |
|---|---|
| [`captions`](captions/) | Word-by-word captions with one key word in a blue selection box (the house caption style). |
| [`presenter`](presenter/) | The cartoon presenter (wraps avatar.js; load ../../assets/template/avatar.js before this block). |
| [`chapter-rail`](chapter-rail/) | A thin progress rail with chapter dots and a live counter on the right (where am I in the video + the number that matters now). |
| [`ending-follow`](ending-follow/) | The closing card: a profile with a Follow button that gets tapped, then a share sheet sending the reel to a friend ("follow for more, and send this to the friend who…"). |
| [`ending-comment`](ending-comment/) | The "Comment KEYWORD" ending: big call to action, the keyword typed into a comment box and sent, then our DM reply drops in. |
| [`loop-back`](loop-back/) | The reel ends on its own first frame, so the replay is seamless (helper `KF.loopBack`, no block.js). |
| [`cover`](cover/) | The reel cover (grid thumbnail): kicker pill, big headline with one phrase in the blue selection box, a footer line, over a darkened still. |
| [`finish`](finish/) | The camera-lens layer that makes drawn scenes feel filmed: film grain, a vignette, a faint lens bloom and (optional) a slow handheld drift you apply to your scene. |
| [`podcast-set`](podcast-set/) | Our own two-person demo podcast, to use as sample footage (see its README). |

## Known limits
- Hero drawings (finger, pen, props) are simple; a new topic's hero object still has to be drawn for that reel.
- `thumb-wall`, `film-strip`, `clip-stack`, `blade-cut` draw placeholders unless you pass images.
- Not every block has been used in a posted reel yet; run the reel QA gate (reel-pro-stack) on any reel built from them.
- Study notes behind this library: `../references/keyframes-study.md`.
