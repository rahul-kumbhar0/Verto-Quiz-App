---
name: speedy-explainer-reel
description: "Topic in → finished vertical explainer reel in the @speedy_devv style: a cartoon presenter at the bottom reacting to every line, one crisp UI/diagram hero object in the middle, and word-by-word captions on top with ONE keyword in a blue Figma-style selection box, dark/light chapter flips, a chapter rail with a live counter, a 'Follow + share it with the friend who…' ending. No footage needed — everything is generated (HTML scenes rendered with Playwright + voice). Use for 'make a speedy_devv style reel', 'Let's design X breakdown', 'how X actually works under the hood reel', 'system design reel', 'explainer with the cartoon guy', or any request for an animated tech/product explainer Reel/Short; also when the user attaches a speedy_devv reel as the reference."
---

# Speedy explainer reel

Two reference reels were taken apart frame by frame (78 s "Every key on your iPhone keyboard is
smaller than your thumb" and 154 s "Let's design Supabase"). The result is this skill: a style
breakdown, a script formula, a tested HTML template with the presenter puppet and every stage
component, and the render/mix pipeline. Read `references/style-breakdown.md` once per session
before building anything; it is the target. The two formats have their own preset skills
(`speedy-system-design-reel`, `speedy-hidden-mechanism-reel`) that load this one.

The look in one line: **headline-captions (y 300–470) · one hero object (y 640–1330) ·
cartoon presenter (y 1420–1920)**, near-black canvas flipping to off-white per chapter, a blue
selection box on one keyword per phrase, a pose change every ~2 s, exact numbers, honesty
footnotes, a punchline CTA.

## 0. Setup (once per session, ~1 min)
```bash
SK=<this skill's folder>; W=$HOME/reel-work; bash $SK/scripts/setup.sh $W
P=$W/reels/<slug>; cp -r $SK/assets/template $P; mkdir -p $P/{img,audio,out}
```
`render.mjs` must run from `$W` (Playwright resolves next to `$W/tools`). Chromium is
pre-installed in Claude cloud sessions; Hugging Face and most stock hosts are blocked, GitHub/npm/
PyPI work; bundled fonts are Inter + JetBrains Mono (never add a web font).

## 1. Research (facts first)
Nothing on screen may be invented: every number, name, year, region, port, limit is from a
source you read (official docs, the repo, a book, a patent, a published post). Collect:
the product's real components and what each one is (for the glosses), 4+ exact numbers with
units, one credibility artefact (named engineer + role, book + year, patent number, launch year),
and real UI details for the mocks (field names, table columns, error strings). Write
`facts.md` with a source per claim. **Real logos (always):** every real company/product/tool/
publication shown on screen uses its official logo, never an emoji or a letter circle:
`node $W/tools/brand_logos.mjs $P/logos --scan $P/script.md <extra names>` then READ
`logos/sheet.png`; render them with `R.lg(slug)` (`references/logos.md`). If a visual will exaggerate (magnified, zones drawn visible,
schema simplified), note the footnote now.

## 2. Script — `references/script-formula.md`, examples in `references/example-scripts.md`
Pick the format (hidden mechanism / system design), fill the beat sheet (every row has a line, a
stage object and a pose), then write `script.md` with the emphasis markup: `[box]` on the one
keyword per phrase, `*bold*` on 1–2 structure words, optional `{pose}` pins. Pace ≈2.6 w/s.
```bash
python3 $W/tools/mark_script.py $P/script.md $P      # -> narration.txt, emph.json, poses.json
```
Write `display.json` merges for every spoken number/command that must be one caption token
(`[["ten","thousand"],"10,000"]`). Handle for the CTA: the user's real one (ask once; never
invent). The CTA punchline must be about the topic ("the friend who blames autocorrect for
everything").

## 3. Animatic first (free) → stills → fix
```bash
cd $P; python3 $W/tools/fake_timings.py narration.txt words.json 2.6
python3 $W/tools/captions.py words.json captions.js captions.srt display.json --max 5
```
Author `index.html` from the template (keep the skeleton, layers, script order, `R.frame(t);
R.speedyFrame(t)`): one `<section class="scene">` per chapter, components from
`references/components.md`, `R.speedy({light, emph, chapters, counter, avatar, poses})` with every
time taken from `at("phrase")`. Rules that make it read as the reference (motion curves and durations: `references/motion-spec.md` — read it before authoring):
- One hero object per beat; labels/rows/pills pop ON the spoken word; nothing before it is said.
- Any named real brand on screen = its real logo (`R.lg`), never an emoji. Any "what's inside /
  how it's built / which part does what" beat = an exploded view with a pull-out per explained
  part and a lens for the smallest detail (`references/props3d.md`), not a flat list.
- Chapters alternate dark/light; the rail (system design) appears with chapter 1 and leaves at
  the CTA; the counter ticks when the running example advances.
- Presenter hidden during the hook, then a pose per phrase (`references/avatar.md`); comedy poses
  at most twice; never covered by a card.
- Footnote on every exaggerated visual; exact numbers via `R.count`/`R.meas`, never typed static.
- CTA ≥ 5 s: profile card + finger tap on Follow → share sheet or DM with the punchline → watermark.
```bash
cd $W; node tools/render.mjs $P/index.html --stills $P/stills 1 3 6 9 12 15 18 21 24 27 30 33 36
ffmpeg -y -loglevel error -pattern_type glob -i "$P/stills/t*.png" -vf "scale=300:-1,tile=7x2:padding=6:color=gray" -frames:v 1 $P/sheet.png
```
READ `sheet.png` beside `references/ref-frames/key-frames.jpg`. Look for: a caption page with two
boxes or none, text over the presenter's mouth, an empty stage, a light-theme card with dark text
missing, a rail label wrapping, a pose that points at nothing, a `phrase not found` page error
(→ fix spelling/display.json). Fix, re-still, repeat; two passes is normal.

## 4. Voice → real timings
Write `narration_spoken.txt`: ONE SENTENCE PER LINE, numbers and acronyms spelled the way they
are said ("twelve thousand two hundred eighty-eight", "G P T three"); `display.json` merges them
back to "12,288" / "GPT-3" on screen. Default route, no questions — the **voice-studio** skill
(local, offline, no credits; voice `house` = the brand narrator):
```bash
VS=<voice-studio skill folder>
python3 $VS/scripts/studio.py setup                      # once per machine/session
python3 $VS/scripts/studio.py narrate $P/narration_spoken.txt -v house -o $P/audio/voice.wav --words $P/words.json
```
It prints `N/N lines force-aligned`; fix a fallback line by adding the missing word to
`voices/dict.txt`. Other voices: `house-bright`, `house-uk`, `house-female`, `house-hindi`, any
built-in, or an inline blend (`-v "am_michael:0.6,am_puck:0.4"`). Use ElevenLabs only if the user
asks for a specific ElevenLabs voice; check credits with `estimate_only` first, then align its audio
the same way (`studio.py narrate` needs the text; for external audio use `tools/align_lines.py`).
Then re-run `captions.py` and re-still 4 frames: `at()` anchors re-time themselves, but a merged
token can throw `phrase not found` (fix `display.json`).

## 5. Render, sound, mix, QA
```bash
cd $W; node tools/render.mjs $P/index.html --cues $P/cues.json
(node tools/render.mjs $P/index.html $P/video.mp4 auto 30 6 > $P/render.log 2>&1 &)      # ~1.5 min per 30 s
D=$(python3 -c "import json;w=json.load(open('$P/words.json'))['words'];print(round(w[-1]['end']+1.8,2))")   # = REEL_DURATION
python3 tools/sfx.py $P/cues.json $D $P/audio/sfx.wav
echo '{"bpm":96,"dur":'$D',"groove_in":0.4,"breaks":[],"fade_out":1.6,"key":"Dm"}' > $P/music.json; python3 tools/music.py $P/music.json $P/audio/music.wav
while pgrep -f "render.mjs $P/index.html $P/video.mp4" >/dev/null; do sleep 5; done
bash tools/mix.sh $P/video.mp4 $P/audio/voice.wav $P/audio/sfx.wav $P/audio/music.wav $D $P/out/<slug>.mp4 0.10
bash tools/mix.sh $P/video.mp4 $P/audio/voice.wav $P/audio/sfx.wav none $D $P/out/<slug>_nomusic.mp4
bash tools/qa.sh $P/out/<slug>.mp4 $P/qa.png     # then READ qa.png
```
QA: 1080×1920 h264+aac, −14 LUFS, every chapter present, headline readable on both canvases,
presenter's mouth never covered, CTA ≥ 5 s with the real handle, no clipped text, footnotes on.

## 6. Deliver
Cover = the hook still (`--stills` at 1.0) → `out/cover.png`. Send (SendUserFile, attach): reel
with music, reel without music, cover, `captions.srt`, `out/caption.txt` (hook line + 2 lines +
"Follow for more breakdowns"). Reply in 4–6 lines: format, length, chapters, voice route used,
what the CTA punchline is, and that re-edits are cheap (project folder kept; changing a card =
edit index.html + re-render). Offer the PNG-character upgrade (`references/avatar.md`) if the
stock puppet was used.

## Files
- `references/style-breakdown.md` — the research: bands, caption system, stage components,
  presenter, themes/rail/counter, hook/credibility/CTA, rhythm, what it is NOT
- `references/example-scripts.md` — both reference scripts word-for-word with emphasis marks and
  the shared formula · `references/script-formula.md` — beat sheet + sentence rules + markup
- `references/props3d.md` — the 3D hero props (database stack that explodes into labelled layers, isometric server tray, rack-bar translator, WAL journal + dial, pooler fiber stream) PLUS the any-topic kit (3D box, chip, globe, packet flow), the **exploded view** (`R.xview`: layers split along an axis, numbered leader-line labels, one part pulls out and explains itself) + **detail lens** (`R.lens`: magnified circle + cone + caption) for every "what's inside X" beat, and a topic→prop recipe table; worked reproductions in `assets/examples/supabase-hook/` and `assets/examples/exploded-view-demo/`
- `references/logos.md` — real-logo rule, `scripts/brand_logos.mjs` (offline official marks + contact sheet), `R.lg` tiles/brand chips
- `references/motion-spec.md` — measured animation spec: caption hot-words, the three motion-blurred transitions, finger/press feedback, pose cuts, CTA sequence
- `references/components.md` — template API, HTML snippets, scene recipes, pitfalls
- `references/avatar.md` — pose library, timing, recolouring, PNG character mode
- `references/ref-frames/` — contact sheets, key frames, pose catalogue of the references
- `assets/template/` — index.html demo (38 s URL-shortener), speedy.css/js, props.css/js (3D props),
  avatar.js, engine.js, fonts, generated captions · `assets/examples/supabase-hook/` — the reference hook rebuilt
- `scripts/` — setup.sh · brand_logos.mjs · mark_script.py · fake_timings.py · captions.py · render.mjs · align.py · align_lines.py · tts_kokoro.py ·
  sfx.py · music.py · mix.sh · clean_voice.sh · qa.sh

## Cover
`node scripts/cover.mjs index.html <t> cover.png` freezes the reel at t (pick a frame with the hero object and a clean presenter pose), hides captions and adds a 2-line headline with the keyword in the selection box plus a stamp. Keep text inside y 240-1680 (Instagram 3:4 grid crop).

## House brand: canwe.ai (always)
Reels made for the owner's account use `BRAND = { name: "canwe.ai", logo: "canwe-logo.svg" }`. Copy
`assets/brand/canwe/canwe-logo.svg` into the reel folder. The **mascot logo (option B)** is the only canwe.ai logo:
use it for every profile picture or DM-sender avatar shown in a reel, the cover brand mark (`"logo"` in cover.json),
and the header and favicon of any page made for the account. Never use the old purple "CW" logo or a plain "cw" text
circle. Details: `assets/brand/canwe/README.md`.
