# Advanced techniques — from 6 more speedy_devv reels

Analyzed: touchscreen (17.6M views), tire hairs, laptop battery, Supabase, PS5 emulators, Vercel.
Context: getkeyframes.com is the creator's product — **Claude Code skill packs** that build these
videos exactly the way this skill does (beat sheet → HTML/code scenes → render). Our architecture
matches theirs; these are the techniques that raise production value.

## 1. The three exhibit tiers (pick per beat)

- **Tier 1 — UI recreation** (keyboard reel, Supabase/Vercel): pixel-faithful app/console/GitHub
  mockups. Cheap, powerful for software topics.
- **Tier 2 — diagram physics** (touchscreen): cross-sections + glowing field arcs + particles.
  CSS/SVG with heavy glow (`FieldArcs`, `RGBStrip`, `CapsLabel` components).
- **Tier 3 — studio 3D** (tires, battery molecules): photoreal turntable shots, factory
  cross-sections, molecular lattices. Use `Studio3D` (@remotion/three): dark stage, white key
  light, cool fill, AMBER RIM LIGHT from behind (the brand look), slow turntable (speed ~0.35
  rad/s), simple geometry + `meshStandardMaterial` (roughness .4–.7). One ThreeCanvas per beat max.

## 2. Structural devices discovered

- **PipelineBar** (Supabase/Vercel): persistent top strip of system stages (BUILD → DEPLOY → CDN →
  ISR → FUNCTIONS) with the active stage lit + a LIVE COUNTER (requests/messages) that ticks up
  across the whole video. It turns an architecture tour into a story with a scoreboard.
- **Light/dark alternation** (battery/Vercel): some beats switch to a warm paper-white canvas
  (`<DottedGrid mode="light">`). Use for "normal life" beats (laptop on a desk, product shots);
  return to dark for "under the hood". The flip itself is a transition beat.
- **Counters everywhere**: rolling numbers sell realism (1,043 messages, 120 scans/s, 518,027
  req/s peak on a `Gauge`, releases 24 → 257 → 408).
- **Receipts/citations as exhibits**: GitHub repo headers, README excerpts, COMPATIBILITY.md
  tables, patents (FIG. 8B), SEM micrographs with a "20 nm" scale bar, real settings screens
  (macOS/Lenovo/ASUS), YouTube gameplay cards WITH CREDIT FOOTNOTES. The style is obsessed with
  verifiable sources drawn in-world.
- **Props in the mascot's hand** (PS5 reel): he holds the AMD chip, a controller, a GAME.EXE icon,
  a phone. Use `pose="hold"` + `prop={<svg…/>}`.
- **Globe/latency beats** (Supabase/Vercel): dark world map or globe, route arcs with ms chips
  ("Frankfurt — 229 ms round trip"), anycast IP pill. Approximate with a dark circle + graticule +
  glowing arcs if no map asset.
- **Caps spec labels**: tiny white uppercase labels with hairline leader lines (WIRES, GLASS,
  CHARGE, BLADDER 350 PSI, VENT SPEW) — use `CapsLabel`. Pair with honesty footnotes ("Heat shown
  in colour", "Values illustrative", "Magnified illustration").
- **Analogy props** (tires): a real-world object appears for one beat to carry a metaphor
  (toothpaste tube = rubber flow). One prop, one beat, then back.
- **Failure shown raw** (PS5): crashes = corrupted framebuffer glitch (sliced rows, magenta noise),
  error toasts in red. Honest failure beats build trust before the payoff.

## 3. Component inventory (template)

`Exhibits.tsx`: `PipelineBar`, `FieldArcs`, `RGBStrip`, `CapsLabel`, `StatCard`, `Gauge`, `Wire`
(animated bezier with traveling pulse dot, for architecture diagrams).
`Studio3D.tsx`: `Studio3D` + `Turntable` (three.js studio stage).
`DottedGrid` now takes `mode="light"`. `theme.ts` exports `light` palette.
`MascotBoard` composition renders every pose for tuning.

## 4. Mascot v2 notes

**Talking**: pass `talking` to `Mascot`/`MascotSlot` and the mouth cycles three visemes
(closed smile → teeth → open vowel) pseudo-randomly ~8–10×/s with a subtle head nod —
turn it ON for every beat where the VO is speaking and he's on screen; it makes him the
narrator instead of a sticker. `pose="hold"` + `prop={<svg…/>}` puts an object in his hand.


Taller crop (waist + jeans hint), cel shading (side shadows on skin/shirt, hair highlights,
glasses glint), 14 poses: idle, point-up, point-side, shrug, facepalm, thumbs-up, confused
(chin-stroke), celebrate, ok-sign, wave, shock, stop, arms-crossed, hold(prop). Default width
≈500–520px at 1080p. He appears in MOST beats (tires reel: nearly every frame); hide him only for
full-frame zoom/3D beats. Wave pose auto-rocks; all poses breathe.

## 5. Voiceover — Indian English (user's default)

Default voice: **Microsoft `en-IN-PrabhatNeural`** (male) via `pip install edge-tts` — the most
natural, clearly understandable Indian English among free options (female: `en-IN-NeerjaNeural`;
Hindi: `hi-IN-MadhurNeural`).

```
python -m edge_tts --voice en-IN-PrabhatNeural --rate "+12%" --text "<line>" --write-media public/vo/bN.mp3
```

One clip per beat; beat `dur` = clip frames + 15–20; captions `spreadFrames ≈ clip frames × 0.82`.
edge-tts is free cloud TTS (not open-source); the fully open-source Indian-English alternative is
AI4Bharat **Indic Parler-TTS** (heavy torch install — avoid on low-RAM machines). Piper
(`en_US-ryan-high`) remains the offline/US fallback.

## 6. Rendering on this machine (7.3 GB RAM)

Chrome+x264 die when RAM is low. Ladder:
1. `npx remotion render <id> out.mp4 --concurrency=1 --scale=0.6667 --disallow-parallel-encoding`
   (720×1280 = the resolution the originals actually ship at). Full 1080 needs free RAM.
2. Still OOM → render JPEG sequences in chunks at beat boundaries
   (`--sequence --image-format=jpeg --frames=a-b`, one invocation per chunk = fresh Chrome),
   normalize names to `element-%04d.jpeg`, then assemble with SYSTEM ffmpeg: frames +
   per-beat VO clips via `adelay=<beat-start-ms>` + `amix=normalize=0`
   (working example: `tap-to-pay-reel/finish-render.sh`).
3. **Any beat with `Studio3D`/WebGL MUST render with `--gl=angle`** (hardware GPU).
   The default software GL silently produces a WHITE canvas under RAM pressure — the
   render "succeeds" but the 3D is blank. Always eyeball one frame of the 3D chunk.
