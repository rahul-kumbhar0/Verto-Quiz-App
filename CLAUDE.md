# Video Agent — repo instructions for Claude Code

This repo IS a video-production agent. When the user asks for a video in any wording —
"create a video about X", "make a reel on X", "video banao X pe", or just gives a topic —
do NOT ask clarifying questions. Invoke the `video-agent` skill and run the full pipeline
autonomously until a rendered MP4 exists. The user's topic is the only input you need.

## Standing defaults (do not re-ask)

- Format: 9:16 vertical, 1080×1920 composition, 30fps, 35–80s, speedy_devv style.
- Voiceover: Indian English, edge-tts `en-IN-PrabhatNeural`, rate +12%, one mp3 per beat.
- Mascot: ON, `talking` in every beat where he's visible while VO speaks.
- Style decisions (which techniques fit the topic): decided automatically via
  `.claude/skills/video-agent/references/topic-matrix.md` — never ask the user.
- Render: low-RAM ladder (direct → chunked → jpeg-sequence + system ffmpeg). Final file
  lands in `<project>/out/`. 720×1280 output is acceptable (the originals ship at 720).
- Each video = its own folder `<topic-slug>-reel/` copied from `speedy-reel-template/`.

## Division of labor between the skills

- `video-agent` = the orchestrator: topic → archetype + ENGINE pick → script → build →
  audio → verify stills → render → deliver/publish. Start here for every video request.
- `reel-script-writer` = the script brain (ALWAYS runs before building): scored hooks,
  goal-driven archetypes, lint, full post package. Battle-tested on @canwe.ai.
- Three build engines (video-agent/references/engines.md picks automatically):
  - `speedy-explainer-reel` — Remotion/React engine (default; 3D, talking mascot)
  - `speedy-html-reel` — HTML+Playwright engine (production-proven; align/pace/music/sfx/
    mix/cover/logo scripts; keyword→DM presets; read `.claude/canwe-ai/RECORD.md` first)
  - `speedy-devv-visual` — 20–30s music-only motion-graphics engine
- Boosters for 1–2 beats max (video-agent/references/advanced-tools.md): Manim, Blender
  headless, Studio3D, HyperFrames packs, AI b-roll (Video Create MCP / Higgsfield manual).
- Publishing: `publishing/youtube/` (YouTube Data API uploader); IG via connectors.
- `.claude/canwe-ai/` = the brand's running record: house rules, posted-reel results,
  topics backlog. When the topic is for @canwe.ai, obey it (keyword→DM endings, audience).

## Hard rules

- Verify visually before final render: render stills at each beat midpoint and LOOK at them.
- Facts in the narration must be real and shown on screen with honesty footnotes; if a
  number can't be verified quickly, use a defensible phrasing ("about", "typical") and an
  "Illustrative." footnote.
- Never ship a beat where captions/labels are unreadable against the background
  (light-mode beats need `mode="light"` captions and `onLight` CapsLabels).
- Report the final MP4's absolute path and a one-line summary per beat when done.
