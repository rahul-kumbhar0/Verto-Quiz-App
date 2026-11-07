# Claude Video Skills — speedy_devv-style explainer reels

A complete, self-contained system for generating viral tech-explainer reels
(the instagram.com/speedy_devv / getkeyframes.com style) with Claude Code + Remotion.

Open this folder in Claude Code and ask for a video — the skill in
`.claude/skills/speedy-explainer-reel/` loads automatically and drives the whole
workflow: beat sheet → exhibits → Indian-accent voiceover → rendered MP4.

## What's inside

| Path | What it is |
|---|---|
| `.claude/skills/speedy-explainer-reel/` | The skill: style contract, reference-reel breakdowns, animation recipes, beat-sheet format, advanced techniques (3D, pipeline bars, light mode, talking mascot) |
| `speedy-reel-template/` | The master Remotion template — copy this per video. All components + `MascotBoard` / `Studio3DDemo` reference compositions |
| `wifi-password-reel/` | Finished video #1: "Your WiFi password is never sent" (8 beats, Indian VO) |
| `tap-to-pay-reel/` | Finished video #2: the all-techniques showcase ("Tap to Pay") — 3D card turntable, NFC field arcs, pipeline bar + live counter, token panel, network gauge, light/dark beats, talking mascot |

## Component library (in every project / the template)

- `Captions` — top karaoke captions, blue selection-box keywords, `mode="light"`
- `Mascot` / `MascotSlot` — cel-shaded mascot, 14 poses, `talking` (animated mouth + head nod), `prop` in hand
- `Keyboard`, `PhoneFrame`, `Devices` (router, phone, chips, data panels)
- `Exhibits` — `PipelineBar` (stage strip + live counter), `FieldArcs`, `RGBStrip`, `CapsLabel`, `StatCard`, `Gauge`, `Wire`
- `Studio3D` — @remotion/three studio stage (amber rim light, turntable) for the "Blender look"
- `Callout`, `Footnote`, `Measure`, `ExplodedLayers`, `DottedGrid` (dark/light)

## Quick start

```bash
cd speedy-reel-template   # or any finished reel project
npm ci
npx remotion studio       # live preview
```

Voiceover (free, Indian English):

```bash
pip install edge-tts
python -m edge_tts --voice en-IN-PrabhatNeural --rate "+12%" --text "..." --write-media public/vo/b1.mp3
```

Render (low-RAM machines):

```bash
npx remotion render <CompId> out/reel.mp4 --concurrency=1 --scale=0.6667 --disallow-parallel-encoding
```

If even that OOMs, render `--sequence` (JPEG frames) in chunks and encode with system ffmpeg
— see the skill's `advanced-techniques.md` §6.

## Making a new video

1. Read `.claude/skills/speedy-explainer-reel/SKILL.md` (Claude Code does this automatically).
2. Write the beat sheet (`references/script-format.md`).
3. Copy `speedy-reel-template/` → `<topic>-reel/`, build one component per beat.
4. Generate per-beat VO, set beat durations from clip lengths, render.
