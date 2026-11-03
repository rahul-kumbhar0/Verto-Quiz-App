# Paper editorial mode (3 Nov 2026) — the @mrcreates.ai techniques, in our kit

Where it comes from: a competitor read (`canwe-ai/TOPICS.md`, 3 Nov 2026). His reels are 60 s typography
motion graphics on warm paper: no face, no voice, black sans + blue italic serif word pairs, white UI mock-ups
(a ₹497 checkout torn in half), a numbered index with progress ticks, kicker labels and footnotes, a tiny line-art
avatar that reacts. His EDITOR reel: ~425K views, 12.9K comments. We borrow the techniques; we keep our
presenter, our voice and our REAL UI proofs (his screens are illustrations, and he labels them so).

## Turn it on
```html
<body class="look paper">            <!-- look.css: paper tokens + editorial type -->
R.speedy({ light: [[0, 1e9]], rail: false, avatar: { x: 690, y: 1380, w: 360 } })   <!-- ink captions, small sticker presenter -->
```
Tokens: `--pg` paper `#FBFAF7` with a 60 px grid at 7.5 %, ink `#111114`, `--pacc` the ONE accent (default
editorial blue `#2F55E6`; set `--pacc:#D97757` on body for our terracotta). Grain multiplies at 5 %.
Demo: `assets/examples/paper-editorial-demo/` (20 s, five chapters).

## Type and layout (look.css)
| class | what |
|---|---|
| `.e-pair` (+ `.sm`) | the hero word pair: `.e-a` Inter 800 118 px + `.e-b` Instrument Serif italic 112 px in the accent |
| `.e-kick` | Mono 19 px +3 px tracking, uppercase, quiet ink; top-left = series / topic, top-right = episode / date |
| `.e-rule`, `.e-ticks` | hairline under the kickers; chapter ticks that fill in the accent |
| `.e-idx` | numbered index row: accent `01` + glyph tile + name + one-line sub; `.dim` for not-yet rows |
| `.e-card`, `.e-btn`, `.e-in`, `.e-tag` | white paper UI (checkout, DM, comment) with hairlines and a long soft shadow |
| `.e-sub` | 30–44 px support line; `<b>` ink, `<i>` serif accent |
| `.e-swap` | `.was` (serif, struck) + `.now` (sans accent, springs in) |
| `.e-foot` | bottom footnote row: left = honesty/illustration note, right = handle |

## Motions (mg.js)
| call | what |
|---|---|
| `M.pair(el, "Stop paying.", "for *tutorials.*", t, at, {out})` | both lines masked-rise, serif line 0.22 s later; `*word*` = accent |
| `M.tear(el, t, at, {d, jag, n})` | the card rips down a jagged centre line, halves fall + rotate + fade (the "₹4,999 course" beat) |
| `M.ticks(el, t, [t1, t2, …])` | chapter ticks fill at those times |
| `M.underline(el, t, at)` | accent underline draws under a word |
| `M.swap(el, t, at)` | strike the `.was`, spring in the `.now` ("hours." → "minutes.") |
| plus the level-3 kit | `M.fly` for rows and cards, `M.ring` (cool) on the tear and the swap, `F.code` in a paper card, `F.sheen` on the DM |

## Rules
1. One word pair per chapter; it is the headline, the voice says it, the kinetic caption still runs on top (ours).
2. The presenter stays, as a 360 px sticker bottom-right, reacting (shrug → stop on the tear, counting on the index).
3. Real UI stays real; illustrated cards get the footnote "screens recreated / illustration".
4. One accent. Blue reads "editorial", terracotta reads "canwe"; pick per reel, never both.
5. Cuts go UP (`F.cutCurve … dir:"up", travel:160`), page-like; the rack-focus is the one soft cut.
6. Sound: cool rings on the tear and the swap, impact soft; music lofi or pulse at low gain.
