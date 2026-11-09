# Advanced editing (the "edit level 2" rules + the fx kit)

> Level 3 sits on top of this: `motion-graphics.md` (`mg.js`: springs, drawn connectors + packets, iris/morph seams,
> marker/strike text edits, rings/rays, gauges, the living dot grid). Use both on every reel.

Owner's asks (1 Nov 2026): "make our editing level advanced" and "don't use these colours, it looks like cheap
editing — use open source like HyperFrames". Look: `references/look.md`. Motion rules below are adapted from
HeyGen's open-source HyperFrames (Apache-2.0, github.com/heygen-com/hyperframes: motion-doctrine, cut-the-curve,
references/motion.md). Their registry (210 blocks + components: caption styles, transitions, camera rigs) is a
reference library: `git clone --depth 1 https://github.com/heygen-com/hyperframes` and read
`registry/components/CATALOG.md`; port techniques into fx.js with credit, never their scripts or brand looks. Our LOOK stays (presenter, kinetic captions,
selection box, dark/light flips, rail, mascot). What changes is the EDITING GRAMMAR: camera, transitions,
reveals, text, particles, beat sync, sound design and real motion blur. Code: `assets/template/fx.js` +
`fx.css` (namespace `R.fx`, load after engine.js). Live demo of every effect: `assets/examples/fx-demo/`.

## 1. Motion doctrine (adopted from HyperFrames' motion-doctrine + cut-the-curve, Apache-2.0)
Look first: `references/look.md` (materials, one accent, BANNED candy colours). Then:
1. **One film, one current.** Pick the dominant direction (default LEFT). Every ordinary scene boundary is
   `R.fx.cutCurve` in that direction: partial travel ±230 px, mirrored `power4` eases, cut MID-motion on both
   sides, never both scenes visible, never a crossfade. Other vectors are reserved and MEAN something:
   up = a conclusion rises · `R.fx.zoomCut` (Z forward) = deeper into the same thought · `R.fx.inverseZoom`
   (Z back) = ARRIVAL/payoff · `R.fx.dive` (object becomes the world) = going inside · `R.fx.rackFocus` =
   the one visible cut, same surface new state (≤ once per ~8 s) · `R.fx.whip` = fast list items.
2. **Z sign rule:** a push exit (growing) is answered by a growing entry; a pull (shrinking) by a shrinking
   entry. A receding exit + grow-from-small entry is the classic mistake.
3. **No idle wobble.** Breathing/floating/pulsing loops are banned as "motion". Between entry and exit every
   scene is owned by a route: staged reveals on narration words · camera WITH INTENT (establish → travel →
   arrive, `R.fx.cam` keyframes, `power2InOut`) · the UI doing its job (counts tick, rows fill) · an
   animated sequence (a card files into a stack) · a cursor/finger leading the eye. Pause test: at any
   second something meaningful is mid-flight. (`R.fx.pulse` is only for a beat ACCENT on a hit, never a loop.)
4. **Arrive slow, leave clean.** Arrivals on long-tailed `expoOut`/`power4Out` (overshoot max `backOut 1.4–1.7`
   on position/size, never on opacity/colour); exits 40–50 % shorter on `power3In`/`power4In`; camera and
   colour floods `power2InOut`. Linear only for rotation/progress. Overlap: next element starts when the
   previous is 30–50 % done. Stagger: letters 1 frame, words 60–120 ms, list items 40–80 ms, total ≤ 500 ms.
5. **Titles land and hold DEAD STILL.** Waterfall entry (`R.fx.waterfall`, words from below, binary opacity,
   gaps shrinking ×0.84, heavy word travels further) or per-word blur-in 8 → 0 px in 0.13 s. Hold ≈ 0.5 s +
   0.3 s per word; last line ≥ 2 s. Exit = blur-out + fade 0.13–0.25 s or ride the seam.
6. **Causal chain.** Effects start ON the causing frame (press → squash → release → flight → impact →
   reveal). Reactions scale with mass: big things rebound slower.
7. **Stillness before climax.** 0.3–0.75 s of nothing between the action and the result, then the payoff at
   normal speed (inverse zoom + accent material + small burst + soft flash ≤ 0.3).
8. **Transition budget:** 2–3 seam types per reel, repeated; cut-the-curve is the default and does not count.
9. **Blur logic:** text-scale 8–10 px, full-frame surfaces 18–20 px, same peak on both sides of a cut; blur
   the wrapper, never the children.
10. **Beat grid:** compute beats by index (`R.fx.beats`), cut on the beat, change layout on the bar.
11. **Sound under every move** (automatic cues): swish = seams/flip/whip, riser → impact = dive / payoff,
    impact = flash/shake/inverse zoom, glitch, type, pop, click, ding, shutter. Music dips before the payoff.
12. **Signature shot in 0–3 s** (the cover frame) and **real motion blur** on finals (`MBLUR=3`).

**Always inside the Speedy template** (presenter + kinetic captions + rail): the fx demo is only a kit test. Worked
integration: `assets/examples/madeby-speedy-look/` (`R.setup({scenes:[]})`, then per frame `R.frame` → `R.fx.slots` → seams
→ `R.fx.cam` → `R.speedyFrame` → scene motion; `<body class="look">`; emphasis tokens must match display merges).

Scene plumbing: call `R.fx.slots(t, [[id,start,end]…])` FIRST every frame (base visibility/reset), THEN the
seams (each only touches its own window), THEN in-scene motion.

## 2. fx kit API (all pure functions of t, deterministic, auto sound cues)
| call | does | notes |
|---|---|---|
| `R.fx.slots(t,[[el,a,b]])` | base state: scene visible + reset inside its slot, hidden outside | call first |
| `R.fx.cutCurve(out,in,t,cut,{dir,travel,d,blur})` | DEFAULT seam: velocity-matched partial-travel cut in the current | swish |
| `R.fx.zoomCut` / `R.fx.inverseZoom(out,in,t,cut)` | Z forward (deeper) / Z back (arrival, payoff) | swish / impact |
| `R.fx.rackFocus(out,in,t,cut)` | blur-spike swap of the same surface | — |
| `R.fx.waterfall(el,words,t,at)` | title cascade from below; `*word*` = heavy + accent | type |
| `R.fx.cam(el,t,keys,{drift,mblur,persp})` | keyframed camera WITH INTENT: `keys=[{t,x,y,z,rx,ry,rz,s,ease}]`, auto blur from speed (drift = handheld, use rarely) | wrapper must be absolute + full size |
| `R.fx.shake(el,t,at,{amp,d})` | decaying handheld shake (uses CSS translate/rotate, composes with transforms) | impact cue |
| `R.fx.whip(out,in,t,at,{dir,d})` | whip pan with skew + streak blur | swish cue |
| `R.fx.dive(out,in,t,at,{origin,d})` (alias zoomThrough) | object becomes the world: dive into a point, next scene grows out of it | riser + impact |
| `R.fx.flash(t,at,{color,max,d})` / `R.fx.leak(t,at,{color,max,d})` | full-frame flash / warm light leak (one `#fxOverlay`, auto-created) | impact cue on flash |
| `R.fx.glitch(el,t,at,{amp,d})` | RGB split + slice jitter | glitch cue |
| `R.fx.flip(el,t,at,{axis,dir,d,back})` | 3D card flip `.fx-flip > .fx-card > .fx-front + .fx-back` | swish cue |
| `R.fx.sheen(el,t,at,{d})` | specular light sweep across a card | — |
| `R.fx.dof(list,focusZ,{k,max})` | depth-of-field blur by distance | — |
| `R.fx.letters(el,text,t,at,{mode,stagger,d})` | per-letter flip / rise / pop | type cue |
| `R.fx.scramble(el,text,t,at,{d,glyphs})` | decode text left→right | type cue |
| `R.fx.odometer(el,t,at,d,to,{fmt,spins,stagger})` | rolling digits per column | type cue |
| `R.fx.code(el,src,t,at,{cps})` | syntax-coloured code typing + caret (`.fx-code`) | type cue |
| `R.fx.burst(el,t,at,{n,r,colors,d})` | spark/confetti burst from a point (`.fx-burst`) | pop cue |
| `R.fx.beats(cfg)` · `R.fx.pulse(t,{decay})` · `R.fx.snap(x)` | beat grid from music.json, 0..1 beat pulse, snap a time to the beat | — |
| `R.ease.expoOut/expoInOut/backOut/elastic` | extra easings | — |
Every call accepts `{sfx:false}` to mute its cue (e.g. a second code block typing under the first).

## 2b. LEVEL 4 — the PRO PASS (added 8 Nov 2026, from the speedy_devv / pro-editor study)
A finished reel gets one more pass on top of everything above. Six tools (in fx.js), each with ONE job:
| call | does | when |
|---|---|---|
| `F.punchS(t, stops, {seq})` | punch-in rhythm: the frame SNAPS between zoom levels (~1.0/1.05) at every sentence stop, 0.12 s expoOut — a punch, not a drift. Returns the scale; multiply it into a transform you own (the theme camera), or `F.punch(el,…)` to own a wrapper | EVERY reel: stops.json times or the T.* moments (~10–14 punches / 45 s). Never punch mid-boxed-keyword |
| `F.matchCut(fromEl, toEl, t, cut, {d})` | true match cut: toEl ENTERS from fromEl's exact live box (FLIP morph + blur), object continuity across scenes | once per reel, where one scene's hero literally becomes the next scene's hero (the render → the post). Call at the END of seek so it wins the frame |
| `F.wipe(el, t, at, {dir,d})` | masked clip-path reveal (left/right/up/down/iris); hands opacity back when done | wide panels (timelines, tables). Pairs with M.fly for slide+mask |
| `F.ramp(t, a, b, {k})` | speed-ramp time remap: slow → rush → settle; feed the result to any F./M. call in place of t | playheads, long fills, "fast-forward through the boring part" |
| `F.pop(el, t, at)` | spring pop + pop cue | badges, counters, stickers |
| `F.vig(t, at, {max,d})` | focus vignette: edges darken ~1.2 s so the payoff owns the frame (own overlay `#fxVig`, composes with flash/leak) | the 1–2 biggest payoffs only |
Rules: punch origin ≈ (540, 700) so the presenter stays planted · matchCut measures LIVE rects — layout must be static at the cut and overlapping M.fly settles after the window · ramp k=3–5 · J-cut audio: place the cue 0.05–0.1 s BEFORE the visual (R.cue takes any time). Worked example: `/root/reel-work/reels/demo-pro/` (VIDEO v2 + the pro pass).


## 2c. FINISH every reel with `reel-pro-stack` (added 9 Nov 2026)
After the build: follow cam (R.stageEX), earshot sound pass (sfx_pro.py), and the QA gate (reeltext.mjs + reelqa.py,
score /100). Rules from huashu-motion, argo, explainroo, earshot and video-director live in that skill.

## 3. Pitfalls (found while building the demo)
- A transformed wrapper becomes the containing block: `#cam` without `position:absolute; inset:0` collapses
  every absolutely-positioned scene to 0 height.
- Only ONE overlay effect at a time (flash OR leak); they share `#fxOverlay` and hand it over by owner.
- Cue export (`render.mjs --cues`) seeks only t = 0 and 1, so fx calls register their cue unconditionally:
  call them every frame (never inside `if (t > …)`).
- Glitch/shake use the individual `translate`/`rotate` CSS properties so they never fight your transforms.
- Motion blur multiplies render time by MBLUR; use it for the final render only, not for previews.

## 4. Checklist before the final render
signature shot in 0–3 s · camera drift on · ≥ 4 gear changes · cuts snapped to beats · max 3 transition types
· every reveal has sheen/impact · music dips before the biggest reveal · MBLUR=3 · captions still readable
during camera moves (never move the camera during the boxed keyword).
