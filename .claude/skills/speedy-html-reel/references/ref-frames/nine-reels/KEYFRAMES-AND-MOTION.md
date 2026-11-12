# speedy_devv reels — keyframes + motion breakdown (all 9 reels)

Second pass, 12 Nov 2026. The first pass (`REEL-STYLE-DEEP-SCAN.md`) looked at still frames; this
one measures how the reels **move**: every frame scored for scene change, dense 15 fps strips
around the biggest transitions, word-level transcripts. Everything below is measured, not guessed.

**In this folder**
- `keyframes/<reel>/kNNN.jpg` — one keyframe per visual beat (257 total), taken just after each
  change settles, timestamp burned in. `keyframes/<reel>_keyframes.jpg` = the whole reel on one sheet.
- `keyframes/keyframes.json` — the beat times per reel.
- `transcripts/<reel>.txt` — every word, one sentence per line with its start time.

## 1. The numbers (same rhythm in every reel)

| reel | length | words | words/s | pauses ≥0.3 s | visual beats | 1 beat every | hard cuts | hook (first sentence) |
|---|---|---|---|---|---|---|---|---|
| 14370 | 34 s | 128 | 3.85 | 8 | 13 | 2.6 s | 0 | Claude can now turn your single-player games into co-op. |
| 51980 | 34 s | 115 | 3.43 | 9 | 13 | 2.6 s | 0 | All of this is code written by Claude, and the videos it made for this account got 39 million views… |
| 95064 | 56 s | 183 | 3.34 | 17 | 18 | 3.1 s | 0 | Why do new tires have little hairs all over them? |
| 94110 | 79 s | 279 | 3.59 | 19 | 24 | 3.3 s | 1 | Every key on your iPhone keyboard is smaller than your thumb, and you still hit the right letter… |
| 61761 | 81 s | 269 | 3.35 | 24 | 23 | 3.5 s | 0 | How does PCA squeeze 512 dimensions into just two? |
| 14866 | 85 s | 280 | 3.35 | 16 | 33 | 2.6 s | 2 | Your phone screen reacts to the lightest brush of your finger, and ignores a pen pressed as hard as… |
| 77734 | 120 s | 373 | 3.13 | 35 | 38 | 3.2 s | 0 | Why is Sam Altman going after the RAM in your computer? |
| 9222 | 126 s | 446 | 3.57 | 32 | 46 | 2.7 s | 5 | Let's design GitHub. |
| 18413 | 137 s | 467 | 3.43 | 23 | 49 | 2.8 s | 7 | How did North Korea steal $6.3 billion from Binance in about 20 minutes? |

What that means for a clone:
- **Pace 3.1–3.85 words/s, average 3.45.** Fast, but with a real breath (≥0.3 s) every ~4 s.
  (The `speedy-html-reel` skill assumed 2.6 w/s — 25 % too slow; fixed.)
- **A new visual every 2.6–3.5 s**, i.e. one per caption phrase / sentence.
- **Almost no hard cuts.** 6 of 9 reels have zero. Peak scene-change score is only 0.10–0.30
  (a hard cut is ~0.5+). Everything is continuous motion.
- **Hooks are one of two shapes:** a *Why/How question with a hard number or object* ("Why do new
  tires have little hairs…?", "…$6.3 billion … in about 20 minutes?") or a *physical paradox*
  ("Every key … is smaller than your thumb, and you still hit the right letter"). The second line
  busts the obvious answer ("They're not there for grip, they're rubber that escaped.").

## 2. Captions (identical in all 9)
- Top band, centred, 1–2 lines, Inter-style sans.
- **Only the word being spoken is bold white. Earlier words relax to thin grey. Future words are
  not shown at all** — the line builds word by word.
- One keyword per phrase gets the **blue text-selection box with two round handles**; it stays lit
  while the rest of the line keeps building.
- Small **inline emoji** sit in the line when the emoji *is* the object (🔥 170, ⚡ electricity, 📖 book, 🐶 dogs).
- Page change = the old line blurs out in a couple of frames, the new one starts with its first word.

## 3. Transitions — the motion catalogue (where to see each one)
Timestamps = the dense strips I measured (`reel @ seconds`).

| # | Move | What happens | Seen in |
|---|---|---|---|
| 1 | **Blur slide (UI reels)** | outgoing card cluster slides up + blurs, incoming rises from soft blur, ~0.2 s, a scanline smear on the frame between | 14370 @12.2, 20.0, 30.8 |
| 2 | **Camera whip / pull-back on a 3D hero** | one photoreal object; the camera whip-pans with directional motion blur or pulls back to reveal the whole object | 95064 @3.2, 6.2 · 94110 @17.4 |
| 3 | **Object whips off, next fades up from dark** | the hero (hand + tube) streaks out sideways, the next set fades in from black | 95064 @39.5 |
| 4 | **Zoom-through** | the next scene arrives oversized + blurred and settles down into place (~0.25 s) | 14866 @72.6 |
| 5 | **Shrink into a device** | the whole current scene shrinks into a phone screen and becomes its content | 14866 @79.6 |
| 6 | **Persistent hero, content swap** | the object (gloved hand + phone) stays; only its screen crossfades | 14866 @66.7 |
| 7 | **Card push-up / sheet** | the next card slides up from the bottom over the last one; iOS share sheets spring up | 94110 @59.7, 75.4 · 77734 @118 |
| 8 | **Data morph** | the data itself is the transition: a dot cloud bursts into photo thumbnails, a bar chart dissolves into two clusters flying apart | 61761 @17.9, 46.9 |
| 9 | **Portal theme flip** | a rounded card grows until it fills the frame and the scene is now light (or dark); presenter stays on top | 9222 @30.9, 66.6, 94.0 |
| 10 | **Flash / grey dissolve** | dark↔light through a bright or grey flash, layout re-flows | 18413 @39.5, 112.8 |
| 11 | **Hard cut to a full-bleed photo + badges** | the rare real cut: to a photo (night Earth), value badges ($620M, $308M) pop around a point with motion blur | 18413 @7.8 |
| 12 | **Infinite zoom** | the camera keeps zooming into a chip through finer and finer layers | 77734 @30.4 |
| 13 | **Directional entrance smear** | bars / objects whoosh in from one side with speed lines + motion blur | 77734 @85.2 |

Rules that hold across all of them: blur on **both** sides of a move; the camera is never fully still;
a move every 2–4 s; the theme (dark/light) changes *inside* a move, never as a cut.

## 4. The presenter
- Bottom third, waist-up cut-out, never covered by a card.
- **Pose change = 1–2 frame crossfade** (fast cut with a smear), one every ~2 s, matched to the word
  (point at the stage, stop palm on "No", thumbs on a payoff, hands on head on a shocking number).
- First entrance: **slides up from the bottom edge**; sometimes sinks lower/peeks during data-heavy beats.

## 5. Other recurring pieces
Step/progress rail at the top (system-design reels) · loading bar under code cards · exact numbers
with units on pills/odometers · "Magnified illustration" footnote bottom-left · real people/books/patents
as credibility cards · CTA = comment KEYWORD (faux IG comments) or Follow + share sheet + DM.

## 6. What changed in your system
Built on your existing **`speedy-html-reel`** skill (it already had the presenter, captions, blur-zoom/
push/swing, whip, dive, morph, iris, odometer). Exact motion, your canwe.ai look (your call, 12 Nov).
Added from this scan:
- `R.fx.plate` — photoreal hero still filmed by a camera with **directional** motion blur (moves 2, 3, 13)
- `R.fx.zoomChain` — infinite zoom through nested plates (move 12)
- `R.fx.portal` — rounded card grows into the next theme (move 9)
- pace corrected to 3.4 w/s; this catalogue + keyframes added to the skill's references
- demo reel: **"How a laptop touchpad works"** built end-to-end with it (your cloned voice)
