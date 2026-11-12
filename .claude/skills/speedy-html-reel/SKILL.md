---
name: speedy-html-reel
description: "Topic in → finished vertical explainer reel in the @speedy_devv style: a cartoon presenter at the bottom reacting to every line, one crisp UI/diagram hero object in the middle, and word-by-word captions on top with ONE keyword in a blue Figma-style selection box, dark/light chapter flips, a chapter rail with a live counter, a 'Follow + share it with the friend who…' ending. No footage needed — everything is generated (HTML scenes rendered with Playwright + voice). Presets: speedy-tool-demo-reel (default for canwe.ai: 'I connected X to Claude' → keyword DM), speedy-hidden-mechanism-reel, speedy-system-design-reel. Use for 'make a speedy_devv style reel', 'Let's design X breakdown', 'how X actually works under the hood reel', 'system design reel', 'explainer with the cartoon guy', or any request for an animated tech/product explainer Reel/Short; also when the user attaches a speedy_devv reel as the reference."
---

# Speedy explainer reel

Two reference reels were taken apart frame by frame (78 s "Every key on your iPhone keyboard is
smaller than your thumb" and 154 s "Let's design Supabase"). The result is this skill: a style
breakdown, a script formula, a tested HTML template with the presenter puppet and every stage
component, and the render/mix pipeline. Read `references/style-breakdown.md` once per session
before building anything; it is the target. Each format has its own preset skill that loads this one (pick with the table below).

The look in one line: **headline-captions (y 300–470) · one hero object (y 640–1330) ·
cartoon presenter (y 1420–1920)**, near-black canvas flipping to off-white per chapter, a blue
selection box on one keyword per phrase, a pose change every ~2 s, exact numbers, honesty
footnotes, a punchline CTA.

**Animation lessons from other creators** (`references/premium-ui-mode.md`): techniques borrowed from a
princegupta.ai reel — word-synced micro-changes on the hero object, blur dissolves, one example followed
through every step, a step tracker that ticks, the dark `"style":"pulse"` music bed. **The owner's rule
(31 Oct): we keep OUR style as it is** (presenter, big kinetic captions, selection box, dark/light flips,
rail). Borrow their *animation and explanation techniques*, never their look.

## Pick the preset FIRST (canwe.ai data, Nov 2026 — `canwe-ai/RECORD.md` snapshots)
| Topic is… | Preset | Length | Ending | Our evidence |
|---|---|---|---|---|
| a tool / repo / connector / prompt / app we can SHOW working ("I connected X to Claude") — or a list of them | **`speedy-tool-demo-reel`** | 38–48 s | Comment KEYWORD → DM → guide | JOBS 711 DMs · GROW 57 DMs in 5 h · LINK · PROMPT · OFFER · MCP |
| money / hiring myth with numbers (salary bands, ATS myth) | `speedy-tool-demo-reel` spine with a myth/number hook (reel-script-writer archetype E/F) | 40–46 s | keyword → DM | SALARY 81 likes, 28 DMs · RESUME 24 DMs |
| an invisible mechanism inside something people use (tokens, autocorrect, UPI) | `speedy-hidden-mechanism-reel` | 45–60 s (series ≤ 60) | keyword → DM (+ follow for series) | TOKENS / AGENT ≈ 0 comments → MUST hook on a job/money stake |
| how a product is built end to end (Let's design X) | `speedy-system-design-reel` | 60–90 s mini · 120–160 s full | keyword → DM | not tested yet — Season 2 / rare |
Rule from the data: a reel with no keyword gets no comments (AI-interview: 32 likes, 1 comment), and a
concept without a viewer stake gets nothing. When unsure, it is a tool-demo reel.

## House defaults (canwe.ai) — override only when the owner says so
- Voice: ElevenLabs "Shlok" (`2i7LhYjvw41fgbcqlf3Z`, eleven_v3), prompt = `narration_tts.txt` from mark_script (audio tags
  `<tag>` → `[tag]`, `^stress^` → CAPS; reel-script-writer voice.md § Sound human): `estimate_only` first, then ONE take
  (`generations_count: 1`); ≈ 3.0 words/s → 120 words ≈ 40 s. Pace with `pace.py --pause 0.16 --stop 0.55
  --tempo 1.06–1.08`. If the generate call is denied, never retry it — ask, or reuse an approved voice.
- Look: OUR style (presenter + kinetic captions + selection box + dark/light flips + rail). Techniques from
  other creators are borrowed, never their look (`references/premium-ui-mode.md` header).
- Look: `references/look.md` + `look.css` (`<body class="look">`): graphite materials, ONE terracotta accent, no candy colours.
- Real UI: whenever the script says Claude/GitHub/a terminal, show the REAL interface (`references/real-ui.md`), not a generic card.
- Editing: `references/advanced-editing.md` (HyperFrames-derived motion doctrine + fx kit), `MBLUR=3` on final renders.
- First frame (house default from 3 Nov 2026): a BIG headline on frame 0 (`<div class="headline" id="hl">` + `M.headline("hl", "I automated my|*YouTube*|with Claude.", t, {at:-0.45, out:<hero time>})`), readable with the sound off, the hero blurred behind it (`.hl-back` look), the presenter already on screen (`avatar.in:-0.5`). It exits on the first "here's how" word and the hero comes forward. Keep the hook screen to headline + hero + presenter: no rail counter, no footnote until the hero is up.
- Paper editorial mode (optional, per reel): `references/paper-editorial.md`. Same presenter + voice + real UI, on warm paper with word-pair headlines and a numbered index. Use it for list/tool reels and "anti-course" hooks.
- Motion graphics (edit level 3): `references/motion-graphics.md` + `mg.js`/`mg.css` (`R.mg`). Every reel gets the living
  dot grid on the beat, ≥ 1 morph or iris seam, a drawn connector with packets for every "X goes to Y", springs on every
  entrance, and the impact stack (shake + rays + rings + grid wave) on the ONE biggest number. Demo `assets/examples/mg-demo/`.
- Music: `music.py` `"style":"pulse"` (dark sub drone, half-time kick), hook dry until the first reveal.
- CTA: "Comment KEYWORD and I'll DM you <thing>" + the comments → DM sequence. "Follow + share with the
  friend who…" only for pure reach reels.
- Cover: `node tools/cover.mjs index.html <t> out/cover.png cover.json` from the reel folder (always pass
  cover.json; avoid the single raised index finger pose; keep text inside y 240–1680).
- Honesty: sourced numbers only, illustrations footnoted, own/partner products disclosed on screen and in
  the caption.

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
**Write the script with the `reel-script-writer` skill first** (hooks scored, archetype by goal,
lint, caption/cover/DM package); then apply the speedy-specific rules below (beat sheet visuals,
glosses, markup).
Pick the preset (table above: tool demo / hidden mechanism / system design), fill the beat sheet (every row has a line, a
stage object and a pose), then write `script.md` with the emphasis markup: `[box]` on the one
keyword per phrase, `*bold*` on 1–2 structure words, optional `{pose}` pins. Pace ≈3.4 w/s — the reference average (9 reels: 3.1–3.85); the cloned voice (generate_voiceover) lands at ~3.4 naturally.
```bash
python3 $W/tools/mark_script.py $P/script.md $P      # -> narration.txt, emph.json, poses.json
```
Write `display.json` merges for every spoken number/command that must be one caption token
(`[["ten","thousand"],"10,000"]`). Handle for the CTA: the user's real one (ask once; never
invent). Lead reels end on the keyword → DM line; reach-only reels may end on a topic punchline ("the friend
who blames autocorrect for everything").

## 3. Animatic first (free) → stills → fix
```bash
cd $P; python3 $W/tools/fake_timings.py narration.txt words.json 3.0
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
- Every explanation beat gets the matching visual from the table "Topic → which visual" in
  `references/props3d.md`: process → `R.steps`, analogy → `R.analogy`, scale → `R.zoom`,
  numbers → `R.bars`. Prefix custom CSS classes with the reel slug (reserved names listed there).
- Chapters alternate dark/light; the rail (system design) appears with chapter 1 and leaves at
  the CTA; the counter ticks when the running example advances.
- Presenter: use `poses: "auto"` (it moves and changes expression with the words: numbers on fingers,
  "never" stop, "million" arms wide, "type" typing, "offer" celebrate, questions think, CTA point + wave)
  and pin only the moments you want different with `{pose}` (`references/avatar.md`); never covered by a card.
  Auto mode also adds reactions from the words (💡 ??? 💧 ✨ 💨), the shades-slide gag on a shocking
  number, props in hand (resume, phone, chai, magnifier) and the signature flip / double-thumbs sign-off;
  pick an outfit per topic with `avatar.accessory` (grad, headset, detective).
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
back to "12,288" / "GPT-3" on screen.
**Owner's own cloned voice (preferred when the `generate_voiceover` MCP tool is available):** send the
whole spoken text in one call (`language:"en"`, `model:"multi"`, `exaggeration:0.5`), poll `get_voiceover`
until `done`, download the mp3, then align it to the known text (whisper word timings mapped onto your
tokens; needs `pip install faster-whisper`):
```bash
ffmpeg -i vo.mp3 -ar 48000 -ac 1 $P/audio/voice_raw.wav
cd $P && python3 $W/tools/align_known.py audio/voice_raw.wav narration_spoken.txt words.json   # prints matched/total, w/s, pauses
```
It lands at ~3.4 w/s with natural stops every ~4 s, so `pace.py` is not needed (worked example:
`assets/examples/touchpad-reel/`, 53 s, 168/182 words matched exactly). Otherwise the **voice-studio** skill
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
**Pace the take (stop-and-go delivery, always):** Shlok v3 speaks wall-to-wall (zero pauses >= 0.3 s),
which reads as one long breath. Write `stops.json` (`{"stops":["phrase whose LAST word gets the stop",...]}`,
RAW spoken tokens): 4-6 hard stops per reel -- after the hook's twist line, before every "But..." turn,
after the big number, after the punchline ("Real fixes, not spam."). Then:
```bash
cp words.json words_raw.json
python3 $W/tools/pace.py audio/voice.wav words_raw.json stops.json audio/voice_paced.wav words.json --pause 0.18 --stop 0.55 --tempo 1.06
```
Then the LEVEL marks from the script (`dyn.json`, see reel-script-writer voice.md § Dynamics):
```bash
python3 $W/tools/dynamics.py audio/voice_paced.wav words.json dyn.json audio/voice_dyn.wav   # voice up on the twist/payoff, down on the catch
```
and mix with `voice_dyn.wav` (same timings as words.json). It finds real silences by energy (aligner word gaps lie), trims them, injects ~0.55 s of dead air at
each stop and speeds the speech 6% (pitch kept). Mix with `voice_paced.wav`. Captions, `at()` anchors,
cues, sfx and music all re-time from the new words.json: re-run captions.py, re-export cues, re-render.
Put a music `break` across the biggest stop (the question beat) for full-silence drama.
Then re-run `captions.py` and re-still 4 frames: `at()` anchors re-time themselves, but a merged
token can throw `phrase not found` (fix `display.json`).

## 5. Render, sound, mix, QA
Final renders use real motion blur: `MBLUR=3 node tools/render.mjs …` (3× time; previews without it). Plan the edit with `references/advanced-editing.md` first.
```bash
cd $W; node tools/render.mjs $P/index.html --cues $P/cues.json
(node tools/render.mjs $P/index.html $P/video.mp4 auto 30 6 > $P/render.log 2>&1 &)      # ~1.5 min per 30 s
D=$(python3 -c "import json;w=json.load(open('$P/words.json'))['words'];print(round(w[-1]['end']+1.8,2))")   # = REEL_DURATION
python3 tools/sfx.py $P/cues.json $D $P/audio/sfx.wav
echo '{"bpm":96,"dur":'$D',"groove_in":0.4,"breaks":[],"fade_out":1.6,"key":"Dm"}' > $P/music.json; python3 tools/music.py $P/music.json $P/audio/music.wav
# premium UI mode: {"bpm":136,"dur":D,"groove_in":2.3,"breaks":[[a,b]],"fade_out":1.5,"key":"Cm","style":"pulse"}
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
- `references/props3d.md` — the 3D hero props (database stack that explodes into labelled layers, isometric server tray, rack-bar translator, WAL journal + dial, pooler fiber stream) PLUS the any-topic kit (3D box, chip, globe, packet flow), the **exploded view** (`R.xview`: layers split along an axis, numbered leader-line labels, one part pulls out and explains itself) + **detail lens** (`R.lens`: magnified circle + cone + caption) for every "what's inside X" beat, and a topic→prop recipe table; worked reproductions in `assets/examples/supabase-hook/`, `assets/examples/exploded-view-demo/` and `assets/examples/explainer-kit-demo/` (process steps, analogy split, zoom-through, bar chart)
- `references/logos.md` — real-logo rule, `scripts/brand_logos.mjs` (offline official marks + contact sheet), `R.lg` tiles/brand chips
- `references/premium-ui-mode.md` — animation/explanation techniques borrowed from a princegupta.ai reel (measured voice pace + music, `"style":"pulse"`). Apply inside our style; their no-presenter look is NOT ours
- `references/ai-broll.md` — optional AI B-roll plate (Video_Create MCP) with a cinematic camera/lens/aperture prompt recipe in our look; costs credits, footnote "AI-generated"
- `references/real-ui.md` — **real product UI** (`ui.js`/`ui.css`): exact GitHub repo page, Claude chat/home, Claude Code terminal, browser chrome; real data + dated footnote; camera framing rules
- `references/look.md` — the canwe.ai LOOK line (numbers), materials, BANNED list, data-colour rule (`assets/template/look.css`)
- `references/paper-editorial.md` — **paper editorial mode** (`<body class="look paper">`): warm paper + grid, sans + italic-serif word pairs, numbered index + ticks, kicker/footnote frame, tear / swap / underline motions, small sticker presenter; from the @mrcreates.ai read; demo `assets/examples/paper-editorial-demo/`
- `references/hook-openers.md` — **the first 1.5 s**: 14 built hook openers (topic gag, reaction + rewind, grab the proof, sidekick, thought bubble, full frame 0, big face, flash-forward, split, bright frame, script hooks, freeze frame, promise counter, loop) with how each is built; demo `assets/examples/hook-gallery/`
- `references/motion-graphics.md` — **edit level 3, motion graphics**: `mg.js` kit (springs, speed ramps, trim-path draw, packets, iris/morph seams, masked word rise, marker + strike, echo trails, shockwave rings, rays, gauges, living dot grid), the scene recipes and the per-reel checklist; demo `assets/examples/mg-demo/` (the LinkedIn reel rebuilt)
- `references/advanced-editing.md` — **edit level 2**: the 12 rules (camera never locked, cuts on beats, transition = meaning, signature shot, layered sound design, real motion blur) + the `fx.js` kit API (`R.fx.cam/whip/zoomThrough/flip/flash/leak/glitch/shake/sheen/letters/odometer/scramble/code/burst/beats`); demo `assets/examples/fx-demo/`. READ IT for every new reel
- `references/motion-spec.md` — measured animation spec: caption hot-words, the three motion-blurred transitions, finger/press feedback, pose cuts, CTA sequence; §9 = the 9-reel scan (rhythm 3.45 w/s, a beat every ~3 s, almost no hard cuts, photo plates + camera, infinite zoom, portal flips)
- `references/ref-frames/nine-reels/` — 9 more reference reels taken apart: one keyframe per beat (sheets), `KEYFRAMES-AND-MOTION.md` (numbers, 13-move catalogue with timestamps), word-timed transcripts
- `assets/examples/touchpad-reel/` — "How a laptop touchpad works": photo plates (`R.fx.plate`), infinite zoom into the sensor (`R.fx.zoomChain`), two portal flips (`R.fx.portal`), exploded Force Touch pad, owner's cloned voice + `align_known.py`
- `references/components.md` — template API, HTML snippets, scene recipes, pitfalls
- `references/avatar.md` — pose library, timing, recolouring, PNG character mode
- `references/ref-frames/` — contact sheets, key frames, pose catalogue of the references
- `assets/template/` — index.html demo (38 s URL-shortener), speedy.css/js, props.css/js (3D props),
  avatar.js, engine.js, fonts, generated captions · `assets/examples/supabase-hook/` — the reference hook rebuilt
- `scripts/` — setup.sh · brand_logos.mjs · mark_script.py · fake_timings.py · captions.py · render.mjs · align.py · align_lines.py · tts_kokoro.py ·
  sfx.py · music.py · pace.py (stop-and-go pacing) · mix.sh · clean_voice.sh · qa.sh

## Cover
`node scripts/cover.mjs index.html <t> cover.png` freezes the reel at t (pick a frame with the hero object and a clean presenter pose), hides captions and adds a 2-line headline with the keyword in the selection box plus a stamp. Keep text inside y 240-1680 (Instagram 3:4 grid crop).

## House brand: canwe.ai (always)
Reels made for the owner's account use `BRAND = { name: "canwe.ai", logo: "canwe-logo.svg" }`. Copy
`assets/brand/canwe/canwe-logo.svg` into the reel folder. The **mascot logo (option B)** is the only canwe.ai logo:
use it for every profile picture or DM-sender avatar shown in a reel, the cover brand mark (`"logo"` in cover.json),
and the header and favicon of any page made for the account. Never use the old purple "CW" logo or a plain "cw" text
circle. Details: `assets/brand/canwe/README.md`.
