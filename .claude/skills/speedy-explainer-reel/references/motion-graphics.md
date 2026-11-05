# Motion graphics — edit level 3 (`mg.js` + `mg.css`, namespace `R.mg`)

Level 2 (`advanced-editing.md`, `fx.js`) made the camera and the cuts feel edited. Level 3 makes the objects
behave like motion design. Things are drawn on and connected, data visibly moves, shapes become other shapes,
and the background reacts to the music. Our look stays the same: presenter, kinetic captions, blue selection
box, rail, graphite + ONE terracotta accent (`look.md`). These are techniques, not a new style.

Load order: `engine.js → fx.js → ui.js → mg.js` and `mg.css` after `look.css`. The template already has the layers:
`<canvas id="mgGrid" class="mg-grid">` (after `.s-light`), `#mgFx` (rings, above `#cam`) and `#irisRing`.
Demo: `assets/examples/mg-demo/index.html`, the LinkedIn posts reel rebuilt scene by scene. Diff it against
`linkedin-posts-reel/index.html` to see each upgrade.

## The 8 laws
1. **Nothing just appears.** Every entrance is a spring (`M.fly`, `M.rise`, `M.morph`), every line is drawn
   (`M.draw`), every reveal is a mask (`M.reveal`, `M.iris`). Opacity fades alone are level 1.
2. **Springs, not eases, for objects; eases for the camera.** `M.spring` f 2.2–2.8 Hz, z 0.45–0.6 for chips
   and cards (one visible overshoot), z 0.7+ for big panels and morphs. The camera keeps `power2InOut`/`expo`.
3. **If something goes from X to Y, draw the path and send packets down it** (`M.curve` + `M.draw` + `M.flow`).
   Examples: repo → skills, comment → DM, Claude → LinkedIn, prompt → tool → answer.
4. **Shared-element continuity.** The thing you tap becomes the next scene. Use `M.morph` (logo tile → app
   window) or `M.iris` (the circle opens from the button or chip that was just touched). Use one per reel, at
   the hook → proof seam.
5. **The background is alive but quiet.** `M.grid` dots: drift, a pulse on the beat (`F.beats` + `F.pulse`), a
   shockwave through the field on each impact, and a warm focus spot under the hero. Dot alpha stays ≤ 0.17 at
   rest. No pulse during a musical breakdown.
6. **One impact stack per reel**, on the single biggest number or payoff, landed on the music drop:
   `F.shake` + `M.rays` + a double `M.ring` + a grid wave (amp 1.5+) + the odometer. Smaller moments get ONE ring.
7. **Edit text like a designer.** For slop/wrong → right: `M.marker` sweeps behind the word, `M.strike` draws
   through it, the fix springs in. For a headline: `M.rise` (masked word rise). Never use CSS `line-through`.
8. **Every number gets a shape.** Show a score as an arc gauge (`M.gauge`), a choice "N → k" as tiles where k
   get picked, a sequence as a line drawn through the days. A bare number on a card is level 1.

## API (all pure functions of `t`, deterministic, safe to seek)
| call | what it does | where we use it |
|---|---|---|
| `M.spring(t, at, {f, z})` | damped spring 0→1 with overshoot | the base for everything below |
| `M.ramp(t, at, d, k)` | speed ramp: fast → hold → fast progress | camera dolly past a hero, chip flights |
| `M.svg(id)`, `M.path(svg, id, d, cls)` | stage-space SVG layer (1080×1920) + path upsert | connectors |
| `M.curve(x1,y1,x2,y2,bend)` | smooth S-curve between two points | connectors |
| `M.ellipse(cx,cy,rx,ry,seed)` | hand-drawn circle (≈1.1 turns, wobble) | circle a word or number (`class="mg-line scrib"`) |
| `M.draw(el, t, at, d, {head, out, ease})` | trim-path draw-on, glowing head dot, optional un-draw | lines, underlines, week lines |
| `M.flow(path, t, {n, speed, from, to, cool})` | glowing packets loop along a path | data moving |
| `M.reveal(el, t, at, {shape})` | clip mask: `iris` · `wipe` · `up` · `split` · `diag` | panels, images |
| `M.iris(out, in, t, cut, {x, y, d})` | seam: next scene opens as a circle from a point, lit ring edge | hook → proof |
| `M.rise(el, text, t, at)` | masked word rise, `*word*` = accent | titles, end cards |
| `M.marker(el, t, at)`, `M.strike(el, t, at)` | highlighter sweep / drawn strike-through | humanizer, before → after |
| `M.morph(el, t, at, A, B)` | box→box shared-element move {x,y,w,h,r} on a spring + velocity blur | logo → window |
| `M.fly(el, t, at, from)` / `M.flyT(...)` | spring in from an offset {x,y,r,s} (flyT returns the transform) | chips, cards, rows |
| `M.trail(el, t, tt => transform)` | echo ghosts behind a moving element (out of flow) | fast flights |
| `M.ring(layer, t, at, {x, y, r})` | double shockwave ring | presses, arrivals, the drop |
| `M.rays(svg, t, at, {x, y, r0, len, n})` | burst rays shoot out and retract | the big number |
| `M.gauge(circle, t, at, d, value, max)` | arc gauge, returns the live number | scores, % done |
| `M.grid(canvas, t, {pulse, waves, focus, light, cam})` | living dot field | every reel |

Positions: probe them ONCE before the first `seek` (show all sections, read `getBoundingClientRect` relative to
`#stage`, hide them again). For things inside a moving camera (the GitHub page), read the rect live each
frame; `M.path` re-measures the path when `d` changes.

## Scene recipes (from the demo)
- **Hook:** the brand tile pops (spring) and then `M.morph`s into the real app window, the window content
  fades in at ~94 % of the morph, and Claude types. The grid sends one soft wave from the centre at 0.2 s.
- **Hook → proof seam:** `M.iris` from the Claude chip, 0.12 s before the cut, d 0.5. The grid wave starts at
  the same point.
- **Repo:** the camera dives to the folder, a connector draws from the folder row to the panel, packets flow
  down it, and the items fly out of the folder on springs with 3 echo ghosts, staggered 45 ms.
- **"N options → k picked":** N tiles cascade in (22 ms stagger, random tilt), the k picks turn accent and
  lift (spring), the rest dim to 0.4, and a mono label lands.
- **Before → after text (light chapter):** marker (cool) → strike (red) → the fix springs in from above. Hidden
  characters vanish with a small ring.
- **Feature cards:** deal them on springs from below with fanned rotation, show the score as a gauge driving
  the rubric bars, and draw a line through the days with the head dot as the plan builds.
- **The guardrail:** the lock slams on with a cool ring, a scan line reads the post, and the press sends a
  ring plus a grid wave from the button.
- **The drop:** the impact stack (law 6), with the odometer rolling under the rays.
- **CTA:** the comment rows spring in, and your comment fires a packet along a drawn path to where the DM
  banner lands. The path un-draws as the banner arrives, and a ring marks the DM avatar.

## Music sync
`F.beats({bpm, groove_in})` from the track (for a user song, find the beat entry and drop by RMS, see RECORD.md).
Pass `pulse: F.pulse(t, {decay: 7})` to `M.grid` and zero it in breakdowns. Land the impact stack on the drop.
Cuts stay on words, but snap within ±0.1 s to a beat when it's free (`F.snap`).

## Checklist (level 3, before render)
- [ ] grid on, pulse on the beat, ≥ 3 waves (hook, a press, the drop)
- [ ] 1 morph or iris seam at hook → proof
- [ ] every "X → Y" has a drawn path + packets
- [ ] every entrance is a spring; no bare opacity fades on cards/chips
- [ ] the impact stack only once; it lands on the drop or the biggest number
- [ ] every number has a shape (gauge / tiles / line / odometer)
- [ ] stills at the start of each seam + the drop; `MBLUR=3` final

## Stage: the presenter walks over and points at what's being explained (5 Nov 2026, owner request)
House rule from the VIDEO reel on: the presenter is the job-search character (`look:"street"`), and he MOVES with the explanation.
- Mark any element with `data-ex="<spoken word>"` (or `"word#n"`, 0-based nth, same matcher as `at()`). On that word he walks
  (0.6 s, stepping bob + lean) to the side opposite the element (element left → he stands right, and the reverse; elements within
  ±120 px of centre keep his current side), then aims the arm on that side at the element (live: it tracks a moving element) and
  holds until the next marked word or `stage.hold` seconds, then walks home.
- Config: `R.speedy({ …, stage: { hold: 2.6, left: -90, right: 570, lead: 0.5 } })`; `stage:false` turns it off. Manual `{pose}` pins
  still play whenever he is not aiming. The arm angle is clamped to a readable diagonal (25–142°).
- Mark 1 element per sentence that has a visual (12–16 per 40 s reel). Side switches are what make it feel alive: lay the hero
  objects out left/right alternately where the story allows.
- House outfit ("street creator"): `style: { shirt:"#1D1E23", shirtLine:"#0B0C0F", print:"#D97757", chain:"#F2C14E", lens1:"#F0A585", lens2:"#D97757" }`
  (graphite oversized tee, terracotta lightning print, gold chain, warm peach-to-terracotta shades).

## The Claude spark (the "Claude emoji")
Every spoken "Claude" gets: the caption word turns peach with a glow + a small spinning Claude logo after it, and a big spark
pops ABOVE the word (spring scale, 450° spin, halo, 16-particle burst, drifts up and fades in 1.5 s). See `claudePop()` in
reels/video/index.html (canwe-ai/drafts/video/reel.html); copy it into any reel that names Claude.
