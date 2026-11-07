# Build engines — pick ONE per video

The repo ships three proven engines plus external boosters. The agent picks automatically;
the user never has to choose.

## 1. `speedy-explainer-reel` — Remotion/React engine (DEFAULT)

React components, frame-perfect `interpolate()` animation, true 3D via `Studio3D`
(@remotion/three), talking cel-shaded mascot, per-beat VO clips.
**Pick when**: the topic needs rich interactive-looking exhibits, 3D beats, or heavy
component reuse; and for every topic that doesn't clearly fit the others.
**Projects**: copy `speedy-reel-template/`. Canonical example: `tap-to-pay-reel/src/Reel.tsx`.

## 2. `speedy-html-reel` — HTML + Playwright engine (production-proven on @canwe.ai)

One big HTML file per reel rendered frame-by-frame with Playwright; comes with a complete
audio toolchain in `scripts/`: `align.py` (word timestamps), `pace.py` (hard stops + 1.06×
speed — the retention trick), `music.py`/`sfx.py` (synthesized bed + UI sounds), `mix.sh`,
`captions.py`, `brand_logos.mjs` (real logos, never emojis), `cover.mjs` (cover image),
`qa.sh`. Presets: tool-demo (keyword→DM), hidden-mechanism, system-design.
**Pick when**: the goal is leads/comments (keyword→DM ending), the topic is a tool demo or
"I connected X to Claude", or the full audio polish (pacing, music, sfx, cover, post copy)
matters more than exhibit complexity. Read `.claude/canwe-ai/RECORD.md` first — it has the
house rules and real performance numbers.

## 3. `speedy-devv-visual` — music-only motion-graphics engine

No voiceover, no presenter: typed /command intro, isometric exploded plate stack, rolling
counters, permanent camera drift, synthesized dark track (`tools/music.py`), 20–30s.
**Pick when**: a quick 20–30s architecture/tool flex where VO adds nothing, or the user
asks for "no voice" / music-only.

## Script layer (ALWAYS, before any engine)

`reel-script-writer` skill: 10 scored hooks, archetype by GOAL (reach/follow/leads/sale),
retention spine, lint, full post package (caption, hashtags, cover text, pinned comment,
YouTube title). Its `[box]` / `*bold*` / `{pose}` markup drops into every engine.
Hard-won data from `references/our-reels.md`: pure explainers with no job/money stake got
~0 comments; comment-gated keyword endings got 711 DMs. Hooks must carry a stake.

## Publishing layer (after render)

- **YouTube Shorts**: `publishing/youtube/` — YouTube Data API v3 OAuth setup + `upload.js`
  (see its README; one-time ~10 min setup, refresh-token scripts included).
- **Instagram**: the DirectApply DM / PostEverywhere-style connectors in claude.ai sessions,
  or manual post; DM automations answer the keyword comments.
