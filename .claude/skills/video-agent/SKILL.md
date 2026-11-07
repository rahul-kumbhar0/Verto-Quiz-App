---
name: video-agent
description: Autonomous end-to-end video-production agent. Given only a topic ("create a video about X", "/video X", "make a reel on quantum computers"), it classifies the topic, picks the best engine (Remotion / HTML-Playwright / music-only visual) and technique combination automatically, writes a scored script via reel-script-writer, builds the project, generates Indian-accent voiceover + synthesized music, optionally pre-renders boosted beats (Manim / Blender / Studio3D / AI b-roll), verifies stills, renders the final MP4, and can publish to YouTube. No questions asked. Use for ANY request to create a video/reel/short in this repo.
---

# Video Agent

You are the orchestrator. Input = a topic. Output = a rendered MP4 (+ post package) and a
per-beat summary. Run every phase without asking the user anything (the repo CLAUDE.md
fixes all defaults).

## Phase 0 — Classify & pick the engine (thinking only, no tools)

1. [references/topic-matrix.md](references/topic-matrix.md): assign PRIMARY + SECONDARY
   archetype (A–E) → technique set.
2. [references/engines.md](references/engines.md): pick the build engine — Remotion
   (default), `speedy-html-reel` (leads/tool-demo goals, full audio polish), or
   `speedy-devv-visual` (20–30s music-only). Also decide the GOAL (reach/follow/leads)
   — for canwe.ai topics the default is leads (keyword → DM ending).
3. [references/advanced-tools.md](references/advanced-tools.md): decide if 1–2 beats earn a
   booster (Manim diagram, Blender/Studio3D photoreal shot, AI b-roll hook).

## Phase 1 — Facts

Collect 3–5 concrete, verifiable anchors: one surprising hook claim, 1–2 numbers, one
authority/receipt (person, patent, repo, standard, year). WebSearch only if not common
knowledge; prefer defensible approximations with honesty footnotes over invented precision.

## Phase 2 — Script + beat sheet

Run the `reel-script-writer` skill (hook lab: 10 scored hooks, retention spine, lint, post
package). Then load the engine's style skill (`speedy-explainer-reel` for Remotion) and
expand the script into 8–10 beats: narration line, caption words with `bold`/`box` marks,
exhibit (ONE idea from the archetype's set), mascot pose (+ `talking`), footnote. Spell out
digits/acronyms for TTS. Hooks MUST carry a stake (job/money/time) — pure curiosity
explainers measurably die (see reel-script-writer references/our-reels.md).

## Phase 3 — Project

```bash
mkdir <slug>-reel && cd speedy-reel-template && cp -r src public package.json package-lock.json tsconfig.json remotion.config.ts eslint.config.mjs ../<slug>-reel/ && cd ../<slug>-reel && npm ci
```
Rename the composition id in `src/Root.tsx`. Remove demo compositions you won't use.

## Phase 4 — Audio (before building beats — durations drive everything)

VO: `python -m edge_tts --voice en-IN-PrabhatNeural --rate "+12%" --text "<line>"
--write-media public/vo/b<N>.mp3` (one per beat). Measure with ffprobe. Beat `dur` =
ceil(seconds×30) + 15–20 (more for typing/end beats). Captions `spreadFrames` ≈ clip
frames × 0.82. `<Audio src={staticFile('vo/bN.mp3')}/>` inside each beat's `<Sequence>`.

Music bed (optional but recommended): `python .claude/skills/speedy-devv-visual/tools/music.py
<total_s> public/bgm.wav 84` → `<Audio src={staticFile('bgm.wav')} volume={0.14}/>` at root.
On the HTML engine use its own `scripts/music.py` + `pace.py` + `mix.sh` instead.

## Phase 4.5 — Boosted beats (only if Phase 0 chose any)

Pre-render each booster NOW into `public/` (Manim mov, Blender/AI mp4, background-removed
product png) per advanced-tools.md, so the main render stays light.

## Phase 5 — Build

One React component per beat in `src/Reel.tsx`, composed with the `BEATS` array pattern
(see `tap-to-pay-reel/src/Reel.tsx` for the canonical example using every component).
Respect the style bible. Max ONE `Studio3D` beat per video (WebGL memory). Alternate
dark/light when the archetype calls for it.

## Phase 6 — Verify (mandatory)

`npx tsc --noEmit`, then render a still at each beat's midpoint
(`npx remotion still <Id> out/s_<f>.png --frame=<f> --scale=0.6667`), hstack them with
ffmpeg, and LOOK at the strip. Fix clipped labels, unreadable text, overlapping elements,
off-screen props. Re-verify changed beats.

## Phase 7 — Render (low-RAM ladder, try in order)

1. `npx remotion render <Id> out/<slug>.mp4 --concurrency=1 --scale=0.6667 --disallow-parallel-encoding`
2. If OOM: render in chunks at beat boundaries (`--frames=a-b`, one invocation each), then
   concat: `ffmpeg -f concat -safe 0 -i list.txt -c copy out/<slug>.mp4` (re-encode with
   `-c:v libx264 -crf 18 -pix_fmt yuv420p` if copy complains).
3. If a chunk's embedded encoder still OOMs: render that range with `--sequence
   --image-format=jpeg --jpeg-quality=90` into `out/fr/c<range>/`, then assemble with
   SYSTEM ffmpeg: video from the merged numbered jpegs (`-framerate 30 -i element-%d.jpeg`,
   scale pad to uniform size), audio by delaying each vo clip to its beat start
   (`adelay=<ms>|<ms>` per input, `amix=inputs=N:normalize=0`), `-shortest` off, exact `-t`.
4. Verify the file: ffprobe (duration, video+audio streams), volumedetect (mean around
   −20 dB), and one last tile strip from the MP4 itself.

## Phase 8 — Deliver (+ optional publish)

Report: absolute MP4 path, duration, one line per beat (what it shows), which engine +
techniques were used, any approximated facts with their footnotes, and the post package
from reel-script-writer (caption, hashtags, cover text, pinned comment, YouTube title).

If the user asked to publish: YouTube Shorts via `publishing/youtube/upload.js` (OAuth
setup in its README — first run needs the user's one-time token). Instagram: posting
connector or manual; the keyword→DM automation handles comments.
