# The 3D props (database stack, server tray, rack bar, pooler…) and their animations

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
