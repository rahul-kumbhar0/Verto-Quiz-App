---
name: speedy-devv-visual
description: >
  Edit a reel in the @speedy_devv style: a fully animated, music-only motion-graphics
  explainer (NO voiceover, NO talking head). Dark canvas, typed /command intro, serif+sans
  headline with one boxed keyword, an isometric exploded stack of labeled plates that builds
  beat by beat, rolling counters, permanent camera drift, "Save this if…" end card.
  Use for: explaining a tool, repo, model, architecture or product in 20–30 s.
---

# speedy-devv-visual

Read `ANALYSIS.md` first — it is the ground truth of the style. The rules below are how to
reproduce it with this folder's self-contained renderer (Playwright + ffmpeg, no engine needed).

## What goes in

- A topic and 4–6 hard facts (layers of the stack, numbers, one install command / URL).
  Everything on screen must be true and sourced from the user's material — nothing invented.
- No clip, no voice. The only audio is one slowed dark track (`tools/music.py` generates an
  original one, or the user supplies a licensed track).

## Recipe

1. Copy `template/index.html` to a work folder. Rewrite ONLY the `CONFIG` object at the top:
   - `cmd` — the typed slash-command hook (`/full-visual <what this reel explains>`).
   - `headline` — serif part + ONE subject word that gets the outline box.
   - `layers[]` — 4–6 plates, narrative order, each `{label, sub}`; label ≤ 2 words,
     sub = monospace fact (route, license, size…).
   - `stats[]` — 2–3 feature chips; `counter` — the one number that deserves a roll-up.
   - `cta` — "Save this if you …" + real URL or COMMENT keyword. Never invent a handle.
2. Stills first, always:
   `node tools/render.mjs <work>/index.html --stills <work>/stills 1 3 5 8 11 14 17 20 23 25`
   then tile with ffmpeg and READ the sheet. Check: nothing overlaps, labels readable,
   one idea per beat, keyword box lands on a beat, end card ≥ 3 s.
3. Render + audio + mix:
   ```
   node tools/render.mjs <work>/index.html <work>/video.mp4 30
   python3 tools/music.py 26 <work>/music.wav
   ffmpeg -i <work>/video.mp4 -i <work>/music.wav -c:v copy -c:a aac -b:a 192k \
          -af "loudnorm=I=-14:TP=-1.5" -shortest <work>/out.mp4
   ```
4. QA: 1080×1920, every beat lands, no static frame anywhere (drift never stops),
   text never clipped. Deliver reel + cover still + caption written in his voice:
   one-sentence claim, `>` fact bullets, "Save this if you …".

## Style rules that make it look right

- One idea per ~2 beats (84 BPM → a beat every 0.71 s, a plate every 2.1 s).
- Plates fly in with overshoot, connector line DRAWS, label TYPES. Order = story.
- Numbers roll up, never pop. The whole stage drifts at all times.
- White + grey + ONE accent. Serif italic for emotion, heavy sans for the subject,
  monospace for every piece of data.
- NOT: voiceover, talking head, stock footage, gradients, emoji, caption karaoke.
