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

## Division of labor between the two skills

- `video-agent` = the orchestrator: topic → archetype → beat sheet → build → VO → verify
  stills → render → deliver. Start here for every video request.
- `speedy-explainer-reel` = the style bible: exact colors, typography, motion recipes,
  component contracts. The agent consults it while building; load it when writing beats.

## Hard rules

- Verify visually before final render: render stills at each beat midpoint and LOOK at them.
- Facts in the narration must be real and shown on screen with honesty footnotes; if a
  number can't be verified quickly, use a defensible phrasing ("about", "typical") and an
  "Illustrative." footnote.
- Never ship a beat where captions/labels are unreadable against the background
  (light-mode beats need `mode="light"` captions and `onLight` CapsLabels).
- Report the final MP4's absolute path and a one-line summary per beat when done.
