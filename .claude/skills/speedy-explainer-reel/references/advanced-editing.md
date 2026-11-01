# Advanced editing (the "edit level 2" rules + the fx kit)

Owner's ask (1 Nov 2026): "make our editing level advanced". Our LOOK stays (presenter, kinetic captions,
selection box, dark/light flips, rail, mascot). What changes is the EDITING GRAMMAR: camera, transitions,
reveals, text, particles, beat sync, sound design and real motion blur. Code: `assets/template/fx.js` +
`fx.css` (namespace `R.fx`, load after engine.js). Live demo of every effect: `assets/examples/fx-demo/`.

## 1. The 12 rules of an advanced edit
1. **The camera is never locked off.** Wrap the stage content in a full-size `#cam`
   (`position:absolute; inset:0`, REQUIRED or children collapse) and drive it with `R.fx.cam(…, {drift:true})`:
   slow push-ins on explanations, a fast dolly/whip on "next", a pull-back on the recap.
2. **Every cut lands on a beat.** `R.fx.beats(music.json)` once, then `R.fx.snap(T.x)` for scene starts.
   Cuts on the beat feel "edited"; cuts between beats feel "assembled".
3. **Transition = meaning, never decoration.** Pick by what the line does:
   | line does | transition | call |
   |---|---|---|
   | next item / "and another" | whip pan | `R.fx.whip(out, in, t, at, {dir})` |
   | go inside / "under the hood" | zoom-through | `R.fx.zoomThrough(out, in, t, at, {origin})` |
   | reveal the hidden side / "behind this" | 3D card flip | `R.fx.flip(el, t, at)` (.fx-flip markup) |
   | surprise / number drop / payoff | flash + shake (+ burst) | `R.fx.flash`, `R.fx.shake`, `R.fx.burst` |
   | code, error, hack, "wait what" | glitch | `R.fx.glitch(el, t, at)` |
   | mood shift / premium moment | light leak | `R.fx.leak(t, at)` |
   | calm chapter change | blur dissolve (engine `enter:"blur"`) | — |
   Max 3 transition TYPES per reel; repeat them so they become the reel's grammar.
4. **Hold 0.6–1.2 s after every reveal.** Fast in, still hold, fast out. Never move during the payoff word.
5. **Three depth layers per scene:** background (grid/glow, slow), hero (the prop, medium), foreground
   (chips/particles, fastest). Optional `R.fx.dof([[el,z]…], focusZ)` to blur what is not in focus.
6. **Overshoot, don't bounce.** Entrances use `ease.backOut`/`ease.spring` (one overshoot), exits use
   `ease.expoInOut`. No linear motion anywhere.
7. **Text is animated by the letter for titles,** by the word for captions (engine), by the digit for numbers:
   `R.fx.letters` (flip/rise/pop), `R.fx.odometer` (money, counts), `R.fx.scramble` (decode), `R.fx.code`
   (syntax-coloured typing + caret).
8. **Every reveal gets a light:** `R.fx.sheen(el, t, at)` on the card/button the moment it lands.
9. **Sound design is layered under every move** (cues are automatic): whoosh = camera move, swish = whip/flip,
   riser → impact = zoom-through / big reveal, impact = flash/shake, glitch = glitch, type = text/code,
   pop = particles/chips, click = presses, ding = success, shutter = photo/frame.
   Drop the music for 0.5–1 s before the biggest reveal (`breaks` in music.json), land the impact on the beat.
10. **Real motion blur on final renders:** `MBLUR=3 node tools/render.mjs …` (3 sub-frames per frame,
    blended; 3× render time). Fast moves then look filmed, not "web".
11. **One signature shot per reel** in the first 3 s (the flip of the reel into its code, the zoom into the
    phone, the slab cut by lasers). Plan it before anything else; it is the cover frame.
12. **Pattern interrupt every ~8 s:** a flash, a theme flip, a camera whip or a glitch — the viewer must feel
    the reel "change gear" at least 4× in 40 s.

## 2. fx kit API (all pure functions of t, deterministic, auto sound cues)
| call | does | notes |
|---|---|---|
| `R.fx.cam(el,t,keys,{drift,mblur,persp})` | keyframed virtual camera: `keys=[{t,x,y,z,rx,ry,rz,s,ease}]`, auto blur from speed | wrapper must be absolute + full size |
| `R.fx.shake(el,t,at,{amp,d})` | decaying handheld shake (uses CSS translate/rotate, composes with transforms) | impact cue |
| `R.fx.whip(out,in,t,at,{dir,d})` | whip pan with skew + streak blur | swish cue |
| `R.fx.zoomThrough(out,in,t,at,{origin,d})` | dive into a point; next scene grows out of it | riser + impact |
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
