# Template API and components (`assets/template/`)

Files: `index.html` (complete 38 s demo, "Let's design a URL shortener" — copy its structure),
`speedy.css` (tokens + every component), `speedy.js` (style layer), `avatar.js` (presenter),
`engine.js` (base helpers: R.rise/pop/words/count/type/wipe/camera/cursor/draw, R.at/R.end,
R.setup/R.frame), `captions.js` (generated), `fonts/` (Inter 500–800, JetBrains Mono).

## Contents
1. Page skeleton and layer order
2. Configuration (`R.speedy`)
3. Helpers (all pure functions of t — call every one unconditionally in `seek`)
4. Component HTML snippets
5. Scene recipes per beat
6. Pitfalls seen in practice

## 1. Skeleton
```html
<div id="stage">
  <div class="s-bg"></div><div class="s-light"></div><div class="s-vig"></div>
  <section class="scene" id="sHook">…</section>   <!-- one <section class="scene"> per chapter -->
  <div id="rail"></div>        <!-- chapter rail (system-design format); delete for hidden-mechanism -->
  <div id="kin"></div>         <!-- kinetic headline (captions) -->
  <div id="avatar"></div>      <!-- presenter -->
  <div id="grain"></div>
</div>
<script src="captions.js"></script><script src="engine.js"></script><script src="avatar.js"></script><script src="speedy.js"></script>
<!-- for the 3D props (hook stack, server tray, rack bar, pooler…): -->
<link rel="stylesheet" href="props.css"> + <script src="props.js"></script> — see references/props3d.md
```
Reserved ids: `stage kin rail avatar grain wm`. z-order: stage sections (0) < rail (7) < avatar (7)
< kinetic (8) < finger (9). The finger is the only thing allowed over the presenter.

## 2. Configuration
```js
R.setup({ push: 0.012, scenes: [{ id, s, e, enter: "blurzoom"|"push"|"swing"|"blur"|"none" }] });
// blurzoom = motion-blurred cross-zoom (most chapter cuts) · push = vertical slide-push ·
// swing = 3D tilt away/in. Pick per cut; read references/motion-spec.md before authoring.
R.speedy({
  light: [[a, b], …],                      // light-canvas ranges (hard-ish flip, 0.2 s)
  emph: { box: ["URL shortener", "10,000", "Follow"], bold: ["design", "row#2"] },   // caption display text; #n = nth occurrence
  chapters: [{ label: "database", at }, { label: "backup +\\nreplica", at }, { label: "viral", at, end }],  // rail; end = when the rail leaves
  counter: { unit: "clicks", steps: [[t, 1], [t2, 10000], [t3, 183, "connections"]] },           // live counter at the rail's right
  avatar: { x: 240, y: 1330, w: 600, in: t, hide: [[a, b]], mode: "svg"|"png", png: { dir: "avatar" }, style: {…} },
  poses: [[t, "point_stage"], [t, "shrug"], …],   // anchor every t with at("phrase")
  wm: t,                                           // when the instagram.com/handle watermark (#wm) appears
  glyph: "<svg…>",                                 // brand glyph at the rail's left (default: bolt)
});
window.seek = t => { R.frame(t); R.speedyFrame(t); /* beats */ };
window.REEL_DURATION = R.voiceEnd() + 1.8;
```
`R.at("phrase")` matches caption DISPLAY text after `display.json` merges (case/punctuation
ignored), so write `at("10,000")`, not `at("ten thousand")`.

## 3. Helpers
| Call | Does | Cue |
|---|---|---|
| `R.card(el,t,{in,out,y,d,blur,back:[a,b]})` | focus-pull card: blur+rise in, recede when a newer card arrives, blur out | – |
| `R.note(el,t,a,b)` | footnote / any element fades in a..b | – |
| `R.sel(el,t,a,b)` · `R.hilite` | blue selection box (`.selbox` child) on a UI element | – |
| `R.press(el,t,a)` | button press flash + dip | click |
| `R.meas(el,t,a)` | dimension line draws in, label fades | – |
| `R.finger(el,t,keys)` | giant finger: `keys=[{t,x,y,press}]` fingertip positions; `keys.out = t` to leave | click |
| `R.keyboard(el,{theme,rows})` | builds an iOS keyboard (`.k[data-key]`) | – |
| `R.zone(kb,"e",t,{at,grow,glow,show,hide})` | gold hit-zone behind a key, resizing with a spring | – |
| `R.preview(kb,"e",t,a,b)` | letter preview popping above a key | pop |
| `R.matrix(el,t,{cols,rows,at,d,to,cap,from})` | connection grid filling to `to`; cells ≥ `cap` go red | – |
| `R.rack(el,t,at,{stagger})` | recap layers pop bottom-up (`at` may be an array of times) | pop |
| `R.rows(el,t,[times])` | `.rw` rows appear one per word; the card grows with each | pop |
| `R.bubbles(el,t,[times],{keep,row})` | chat bubbles spring in, thread scrolls up (el=`.thread` with `.scroll`>`.bub`s) | pop |
| `R.sheet(el,t,a,{dy,out})` | iOS bottom sheet springs up from below | whoosh |
| `R.plusone(el,t,a)` | "+1" floats up off a counter | – |
| `R.tapmark(el,t,a,b)` | circle+crosshair at a tap point (`.tapmark`) | – |
| `R.spark(el,t,a)` | gold particle dot rises off a pressed key (`.spark-dot`) | – |
| `R.zone(... {press:[t,…]})` | the hit zone flashes white-cream at each press | click |
| engine: `R.rise R.pop R.punch R.words R.count R.type R.wipe R.camera R.cursor R.draw R.marker` | see engine.js header | pop/type/click/ding |

## 4. Components (HTML)
```html
<!-- card with mac dots + title + right meta -->
<div class="sc" id="tbl" style="left:70px;top:690px;width:940px">
  <div class="hdr"><span class="dots"><i></i><i></i><i></i></span>links<span class="mut">1 row</span></div>
  <table class="tbl"><tr><th>code</th><th>long_url</th></tr><tr class="hi"><td>x7Kq2Pa</td><td>example.com/…</td></tr></table>
  <div class="selbox" id="s1" style="left:12px;top:68px;width:180px;height:70px"></div>
</div>
<!-- code card -->  <div class="sc"><div class="hdr">server.js<span class="mut">314 lines</span></div><div class="code"><span class="k">const</span> msg = <span class="n">await</span> insert(<span class="s">"…"</span>);</div></div>
<!-- pills / tags -->  <span class="pill ok">301 Moved</span> <span class="pill bad">RLS Unrestricted</span> <span class="pill blue">header</span> <span class="tag">eu-central-1</span>
<!-- footnote -->  <div class="note r" id="n1" style="top:1250px">Zones drawn visible. On a real phone they are invisible.</div>
<!-- dimension -->  <div class="meas" id="m1" style="left:150px;top:560px;width:780px"><b>320 <small>px</small></b></div>
<!-- phone (dark iMessage) -->
<div class="phone" id="ph" style="left:280px;top:640px"><div class="isl"></div><div class="stat"><span>9:41</span><span>●●● ⌔ ▮</span></div>
  <div class="top"><div class="av"></div>Sofia ›</div>
  <div class="bub them" style="top:520px">dinner tonight?</div>
  <div class="inp" style="top:640px">what ti<span class="cur"></span></div>
  <div id="kb" style="top:720px"></div>   <!-- R.keyboard("kb") -->
</div>
<!-- giant finger -->  <div class="finger" id="fg"><div class="shadow"></div><div class="skin"></div><div class="nail"></div><div class="crease" style="top:420px"></div><div class="crease" style="top:640px"></div></div>
<!-- matrix -->  <div class="sc" style="…"><div class="hdr">Postgres<span class="mut"><b id="n">0</b>/500</span></div><div class="matrix" id="mx"></div></div>
<!-- recap rack (top = outermost layer) -->
<div class="rack" id="rk" style="top:700px">
  <div class="lay">Edge Functions<span class="tag">functions</span></div>
  <div class="lay">Realtime<span class="tag">live</span></div>
  <div class="lay">Auth · RLS<span class="tag">security</span></div>
  <div class="lay">PostgREST<span class="tag">api</span></div>
  <div class="lay">EC2 · Postgres<span class="tag">server</span></div>
  <div class="lay base">AWS<span class="tag">eu-central-1</span></div>
</div>
<!-- Instagram profile / share sheet / DM: copy from index.html (#ig, #sh) and the .dm block in speedy.css -->
<!-- watermark -->  <div class="wm" id="wm">◎ instagram.com/<span class="bname">yourpage</span></div>
```
Photo + name card (credibility): a `.sc` with a 220×220 image, `<b>Name</b>` and a two-line grey
role; book: cover image + `<div class="tag">2018</div>`; patent: the real drawing inside a white
`.sc` with the header text from the patent (number, date, sheet).

## 5. Scene recipes
- **Hook**: no avatar (`avatar.in = at("<first word after the hook>")`). Hidden mechanism: a
  phone/keyboard scaled 2–3× with `R.camera`, zones glowing, finger entering, two footnotes.
  System design: a stack of 4–8 labelled layers rising (`R.rack` reversed timing) + a mono stat
  counting (`R.count`), headline "Let's design X."
- **Chapter**: card enters on the opener; each sentence adds ONE label/row/pill with `R.pop` on its
  word; `R.sel` on the thing being talked about; the counter ticks when the example advances.
- **Translator**: three stacked cards (input, machine bar, output) entering top → bottom on "turns
  every URL" / "into a SQL query".
- **Stress test**: `R.matrix` to the cap with `cap` set, header number via `R.count`, a `.pill.bad`
  error line popping at the cap, `hands_head` pose; then the pooler card in front.
- **Recap**: `R.rack` bottom-up on "So X is …", one layer per chapter, tags = rail labels.
- **CTA**: `R.card("ig")` on "Follow", `R.finger` to the Follow button with `press`, `R.press`;
  on "share/send this" the profile recedes (`out`) and the share sheet rises; the punchline
  changes the message box / shows the joke card; `wm` on.

## 6. Pitfalls
- `Reel.speedy: emphasis phrase not found` → the phrase is not in caption display text (merged
  numbers, ASR spelling). Fix `display.json` or the phrase; never silence the error.
- A card over the mouth: keep stage content above y 1330, or `avatar.hide` for that range.
- Light theme: check a light still — custom inline colours (`color:#fff`) don't flip; use
  `var(--text)`/`var(--mute)`.
- Boxed word that never appears boxed: emphasis marks the FIRST occurrence; use `word#2`.
- Rail labels longer than 10 chars wrap badly; use `\\n` in the label ("backup +\\nreplica").
- Poses anchored to the wrong occurrence: `at("the code,", 1)` is the second "the code,".
