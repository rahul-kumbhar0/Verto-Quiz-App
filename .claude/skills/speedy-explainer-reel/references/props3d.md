# The 3D props (database stack, server tray, rack bar, pooler, exploded view, detail lens…) and their animations

The reference reel's hero objects look like 3D renders; they are reproduced here in pure
CSS/SVG so any concept (a database, a queue, a cache, a load balancer, your own app's parts)
gets the same treatment with no asset pipeline. Everything lives in
`assets/template/props.css` + `props.js`; a full working reproduction of the "Let's design
Supabase" hook, the PostgREST translator, the Supavisor pooler and the server tray is in
`assets/examples/supabase-hook/index.html` — COPY FROM IT, it is the quality bar (stills were
compared side-by-side against the reference frames in `ref-frames/`).

## The database stack (the hook object)
```html
<div class="floor" id="fl" style="left:90px;top:760px"></div>
<div class="stack" id="st" style="left:330px;top:430px;width:420px;height:620px"></div>
<div class="bolt" id="b1" style="left:480px;top:400px"></div>
<div class="bolt refl" id="b2" style="left:480px;top:1040px"></div>
<div class="wordmark" id="wm2" style="top:1150px">yourproduct</div>
<div class="callout" id="c1" style="right:770px;top:555px">LabelLeft <span class="ic">💧</span><i class="ln"></i></div>
<div class="callout r" id="c2" style="left:760px;top:605px"><i class="ln"></i><span class="ic">◔</span>LabelRight</div>
```
```js
R.bokehDrift("bk", t);                       // blurred mono-glyph backdrop, slow drift
R.rays("fl", t, 0.35);                       // floor light petals fan out
R.rings("fl", t, [0.5, 1.0]);                // expanding shockwave ellipses
R.stack("st", t, { at: 0.15, explode: 0.95, gap: 20 });   // discs rise bottom-up w/ spring,
                                             // then SPLIT apart at `explode` (the signature move)
R.bolt("b1", t, 1.35); R.bolt("b2", t, 1.45);// glyph pops w/ glow; .refl = faded mirror
R.callout("c1", t, 1.15);                    // labels fly in from their side, staggered 0.1 s
R.count("statn", t, 0.3, 2.2, 1000000);      // the stat counts DURING the hook, not after
```
Anatomy the stack builds for you: slatted dark discs with a glowing green rim + LED dots
(the services), a translucent blue cylinder core with the elephant (the database), a wider
base disc (the machine). Map YOUR concept onto it: discs = layers/services, core = the heart,
base = the infra. The slats drift slowly so it never looks frozen. Explode timing in the
reference: stack assembles ~0.8 s, splits at ~1.0 s, labels land 1.15–1.95 s, glyph at 1.35 s.

## The isometric server tray ("a whole server for you")
`.isotray > .board` (CSS 3D: rotateX(55°) rotateZ(-10°), green PCB grid, 6 `.fan`s whose
blades `R.fans(el,t)` spin, vendor + region strip) and `.stand` children that stand upright on
the board (a chip card, a table card). Enter it with the scene's `blurzoom`.

## The rack bar (translator: URL → SQL)
`.rackbar` = brushed-metal bar with corner screws, product name, dark glass slot, green LED,
and a `.stem` down to the next card. Beat: request card in → bar in (`R.card`) → output card
out below (`R.card`, `y:70`). Keep input above, machine middle, output below — the reference's
reading order.

## The WAL journal + timer
`.wal` cream card (header + green `.ribbon` bookmark) with `.lsn` rows via `R.rows`;
`.dial` + `R.dial(el,t,{at,dur,secs})` = the WAL-G countdown ring filling while the clock
counts down. Arrow to an S3 file-browser card whose newest row highlights green.

## The pooler (fan-in stream)
```html
<div class="ftiles" id="ft" …></div>                       <!-- grid of function tiles -->
<svg class="fibers" id="fb" style="left:0;top:0;width:1080px;height:1920px"></svg>
<div class="poolring" id="pr" …><i class="u" …></i>…</div> <!-- glowing ring w/ user avatars -->
<div class="lanes" id="ln" …></div>                        <!-- numbered connection lanes -->
```
```js
R.fibers("fb", t, { at, n: 14, x1: gridRightEdge, y1: gridMidY, x2: ringCenterX, y2: ringCenterY, spreadY: 22 });
R.lanes("ln", t, { at, count: 8, busy: [[1, a, b], [4, a2, b2]], cnt: tt => …" });
```
The fibers draw in with the stream, each with particles flowing along the curve; lanes light
green and pulse only WHILE borrowed (`busy` windows) — that is the lend/take-back idea shown,
not told. Generalises to any fan-in/fan-out: requests → load balancer, events → queue.

## Rules that keep the props premium
- One prop per beat; labels land on their spoken word; the stat counter rolls during the hook.
- Green rim + LED glow only on the dark canvas; on light chapters use the flat cards instead.
- Props never move linearly: assemble with springs, split with ease-in-out, drift subtly forever.
- The floor anchors everything: rays + glow pool under the hero, shock rings only at birth.
- Swap the palette per product via `--accent` (rim/ray/ring colours inherit from it where set);
  keep the blue core for "the database" whatever the product.

## The any-topic kit (generic primitives)
Four primitives cover concepts that are not a database company. All in props.css/js:
| Prop | Call | Use for |
|---|---|---|
| **3D box** | `R.box(el,t,{at,size,icon,label,side,spin})` — a closed cube with glowing green edges, icon/label on the front, mono label on the side; assembles with a spring, idles with a slow sway | any service, node, container, package, app, server |
| **Chip** | `R.chip(el,t,{at,size,label,pins})` — CPU package with pins and a pulsing green die | an AI model, CPU/GPU, the "brain", firmware, an algorithm |
| **Globe** | `R.globe(el,t,{at,size,pins:[{x,y,alt,at}],arc:{from,to,at,lift}})` — dotted sphere, popping region pins (green / orange `alt`), a glowing arc with a travelling dot drawn between two pins | regions, distance, latency, CDN, sync, "a user across the world" |
| **Packet flow** | `R.flow(el,t,{at,path:"M…C…",n,speed,doc,hide})` — packets travelling along ANY svg path between props, rotated to the path's direction; `doc:true` = paper-coloured documents | requests, messages, events, queues, pipelines, replication |
HTML: `<div class="box3d" id=…>` / `<div class="chip3d">` / `<div class="globe">` /
`<div class="flow" style="left:0;top:0;width:1080px;height:1920px">`.

## Topic → prop recipes (so ANY topic gets the 3D treatment)
| Topic family | Hook object | Chapter props |
|---|---|---|
| database / BaaS / storage | `R.stack` exploding into layers | tray, rack bar, WAL card, bucket, lanes |
| networking / CDN / DNS / replication | `R.globe` with pins + arc | `R.box` nodes + `R.flow` packets, latency card |
| AI / LLM / GPU / inference | `R.chip` with pulsing die | box (the app) → flow (prompts) → chip, matrix for tokens/batches |
| queues / events / pipelines | two `R.box` + `R.flow` | lanes (consumers), matrix (backlog), dial (retry timer) |
| auth / security | token card + `.selbox` | rack bar (the checker), lanes (sessions), box with a lock icon |
| scaling / load / caching | `R.matrix` to the cap | pooler fibers + ring, box (cache) answering flow before the DB |
| client / app mechanics | `.phone` + keyboard + finger | zones, previews, meas callouts |
Rule: the hook gets ONE 3D hero built from these; each chapter re-dresses or feeds it, never
replaces the metaphor mid-reel.

## Exploded view, part pull-out and detail lens ("what's inside X")
The premium "product teardown" look: the object floats in 3D, its layers separate along a dashed
assembly axis, every part gets a numbered leader-line label, then ONE part slides out of the stack
and lights up while its label opens to explain it, and a magnifier lens zooms into a detail.
Working demo (phone teardown + chip lens + logo chips): `assets/examples/exploded-view-demo/`.
```html
<div class="xv" id="xv" style="left:20px;top:480px;width:1040px;height:860px"></div>
<div class="lens" id="ln" style="left:0;top:0;width:1080px;height:1920px"></div>
```
```js
const PARTS = [                                   // parts[0] = TOP layer, listed like a parts list
  { name: "Cover glass", gloss: "scratch-resistant front", skin: "glass", th: 6, at: at("glass") },
  { name: "Battery", gloss: "lithium-ion cells", skin: "battery", th: 18, w: 170, d: 360, x: 26, y: 150,
    html: `<div class="lbl">Li-ion</div>`, more: "The biggest part inside…", at: at("battery") },
  { name: "Logic board", skin: "pcb", th: 10, w: 98, d: 420, x: 210, y: 120, html: chipArt, at: at("board") },
  …];
R.xview("xv", t, { at: T.inside, w: 330, d: 660, parts: PARTS, explode: at("inside") + 0.3, gap: 64,
  tilt: [56, -30], labels: { x: 700, y0: 20, y1: 700, w: 330 },
  focus: [[at("biggest part"), 1], [at("the board"), 2], [T.next - 0.4, -1]] });   // pull out → explain → put back
R.lens("ln", t, { at: at("zoom in"), out: T.next, from: () => R.xpoint("xv", 2, 0.5, 0.42), c: [330, 1240], r: 150,
  html: dieArt, title: "The chip, zoomed in", text: "CPU · GPU · AI engine on one piece of silicon" });
```
- **Parts**: `w,d,x,y` place a smaller part inside the footprint (battery left, board right);
  `th` = thickness; `skin` = glass · screen · metal · frame (hollow ring) · battery · pcb · chip ·
  back · plastic, or your own `.sk-name{--topbg:…;--side:…;--edge:…}`; `html` = art on its top face
  (a logo via `R.lg`, a label, chip art). A real product's own logo goes on its back/lid part.
- **Explode**: layers rise in bottom-up with a spring at `at`, split at `explode` (`gap` px per
  layer) with ease-in-out; the dashed axis shows while exploded; the model sways slowly forever
  (`sway` deg) and can turn (`orbit:{at,d,to}`) for a reveal.
- **Labels**: one per part, numbered, landing on the part's spoken word (`at`); leader lines are
  drawn from each part's projected position every frame, so they follow the explode/pull-out.
- **Pull-out (focus)**: `focus:[[t,i],…,[t,-1]]`. Part `i` slides out (`pull:[dx,dy,dz]`, default
  left-up), gets the accent edge + glow, its label opens the `more` explanation (the column
  re-flows), everything else dims to 30%. One part per sentence; put it back (`-1`) before the
  next chapter.
- **Lens**: spot ring on the detail → a light cone → a magnified circle with authored art (draw
  the detail bigger: cells, cores, wires, a key's dome switch) + title + one-line explanation
  under it. `from` can track a moving part with `R.xpoint(xv, i, fx, fy)`. Put the lens in empty
  space, never over the label column or the presenter.
- **Light chapters**: add class `lt` to the `.xv` for dark lines/white labels.

Beat pattern that reads best (≈2.6 w/s): "Here's what's actually inside." (assemble + explode) →
name the parts top to bottom, one label per word → "The biggest part is the battery…" (pull-out +
`more`) → "and the brain is this tiny board" (pull-out) → "zoom in on the chip" (lens) → put
back, recap. Footnote "Simplified illustration, not to scale" on every teardown.

Topic → exploded-view recipes: phone/laptop/earbuds/smartwatch (device teardown), a chip (package
→ die → cores), a server (case → board → CPU/RAM/disks), an EV battery (pack → modules → cells),
your app (UI → API → database → infra as slabs with the real tool logos on their faces), an AI
model (input → layers → output), a resume (header → skills → projects → education) for a
"what recruiters read first" teardown.
