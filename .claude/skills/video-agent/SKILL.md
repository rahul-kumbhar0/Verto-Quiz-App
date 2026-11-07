---
name: video-agent
description: Autonomous video-production agent. Given only a topic ("create a video about X", "/video X", "make a reel on quantum computers"), it classifies the topic, picks the best technique combination automatically, writes the beat sheet, builds a Remotion project from the template, generates Indian-accent voiceover, verifies stills, and renders the final MP4 — no questions asked. Use for ANY request to create a video/reel/short in this repo.
---

# Video Agent

You are the orchestrator. Input = a topic. Output = a rendered MP4 + per-beat summary.
Run every phase without asking the user anything (the repo CLAUDE.md fixes all defaults).

## Phase 0 — Classify (30 seconds of thinking, no tools)

Open [references/topic-matrix.md](references/topic-matrix.md). Assign the topic a PRIMARY
and SECONDARY archetype (A–E) and take their technique sets. This decides the whole look.

## Phase 1 — Facts

Collect 3–5 concrete, verifiable anchors for the narration: one surprising claim for the
hook, 1–2 numbers (a size, a speed, a count), one authority/receipt (a person, patent,
repo, standard, year). Use WebSearch only if the facts aren't common knowledge; prefer
defensible approximations with honesty footnotes over invented precision.

## Phase 2 — Beat sheet

Load the `speedy-explainer-reel` skill (style bible) if not already loaded. Write 8–10
beats using the structure template of the PRIMARY archetype from topic-matrix.md. For each
beat: narration line (short, 2nd person, punchy), caption words with `bold`/`box` marks,
exhibit (ONE idea, from the archetype's technique set), mascot pose (+ `talking`), footnote.
Spell out digits/acronyms for TTS.

## Phase 3 — Project

```bash
mkdir <slug>-reel && cd speedy-reel-template && cp -r src public package.json package-lock.json tsconfig.json remotion.config.ts eslint.config.mjs ../<slug>-reel/ && cd ../<slug>-reel && npm ci
```
Rename the composition id in `src/Root.tsx`. Remove demo compositions you won't use.

## Phase 4 — Voiceover (before building beats — durations drive everything)

```bash
python -m edge_tts --voice en-IN-PrabhatNeural --rate "+12%" --text "<line>" --write-media public/vo/b<N>.mp3
```
Measure each with ffprobe. Beat `dur` = ceil(seconds×30) + 15–20 (more for typing/end
beats). Captions `spreadFrames` ≈ clip frames × 0.82. `<Audio src={staticFile('vo/bN.mp3')}/>`
inside each beat's `<Sequence>`.

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

## Phase 8 — Deliver

Report: absolute MP4 path, duration, one line per beat (what it shows), which techniques
were used, and any approximated facts with their footnotes.
