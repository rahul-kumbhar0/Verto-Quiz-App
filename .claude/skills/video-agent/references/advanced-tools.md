# Advanced tool arsenal — for extraordinary beats

Boosters that raise single beats to cinema level. Use at most 1–2 boosted beats per video;
the style lives on UI recreations, not spectacle. Everything here outputs a video/image
that embeds into a beat via `<Video>`/`<CanvasImage>` (Remotion) or `<video>`/`<img>` (HTML engine).

## Already in-repo

| Tool | What for | How |
|---|---|---|
| `Studio3D` (@remotion/three) | studio turntables, simple photoreal 3D | one WebGL beat max; amber rim light |
| `tools` of speedy-html-reel | align, pace, music, sfx, mix, covers, logos, QA | engine 2 scripts, reusable from any engine |
| `speedy-devv-visual/tools/music.py` | synthesized dark-ambient BGM (numpy, no samples) | `python music.py <dur_s> out.wav [bpm]` — add under VO at −22 dB |
| edge-tts / Piper / Kokoro (`tts_kokoro.py`) | free VO (Indian default: en-IN-PrabhatNeural) | per-beat clips |

## Open-source boosters (install on demand)

### Manim CE — 3Blue1Brown-grade math/diagram animation
`pip install manim` (needs no GPU). Perfect for: graphs being drawn, equations morphing,
geometric proofs, flow fields. Render a transparent-bg snippet and embed:
```bash
manim -qh --format mov --transparent scene.py MyScene   # → .mov with alpha
```
Then `<Video src={staticFile('manim/scene.mov')}/>` inside a beat. Style it to brand: black
bg config, gold `#F5C563` strokes, Inter font.

### Blender headless — true photoreal 3D (the real tires-reel look)
`winget install BlenderFoundation.Blender`. Use for: detailed product models (GLTF from
Sketchfab/Polyhaven CC0), factory cross-sections, cloth/fluid. Render PNG sequence headless:
```bash
blender -b scene.blend -o //frames/f_#### -F PNG -s 1 -e 90 -a
```
Embed the sequence or ffmpeg it to mp4. NOTE: heavy on low-RAM machines — render at 720p,
32 samples, Eevee. A `.blend` studio-stage template (dark floor + key/amber rim lights)
mirrors `Studio3D` so 3D beats match across engines.

### HyperFrames (HeyGen) — HTML/GSAP composition packs + cloud render
Local skills: `npx skills add heygen-com/hyperframes` → `/hyperframes` (compose),
`/hyperframes-cli` (init/lint/preview/render), `/hyperframes-media` (TTS, transcribe,
background removal). Use its GSAP composition patterns for kinetic-type beats, and
`remove-background` to cut out product photos for exhibits. In claude.ai sessions the
"HyperFrames by HeyGen" MCP can also cloud-render a project (returns a shareable project).

### GLTF/asset sources (CC0)
Poly Haven, Kenney, Sketchfab-CC0 for models/HDRIs; use in Studio3D (`useGLTF` via drei) or Blender.

## AI-generated b-roll (optional, closed/cloud — use when available)

- **Video Create MCP** (Gemini Omni / Google Flow) — available in claude.ai sessions:
  `generate_image` (first frame from a product shot) → `start_video` → poll `get_video`.
  9:16 default. Use for: one cinematic hook shot (macro hands, environments) that UI
  recreation can't fake. Always add an "AI footage" honesty footnote.
- **HyperFrames MCP compose/render** — programmable HTML video projects in the cloud.
- **Higgsfield** — cinematic AI video SaaS (camera-move presets). No API integration here:
  if the user has an account, they generate the shot manually and drop the mp4 into
  `public/broll/`; the agent embeds it. Treat like any other b-roll with a footnote.

## Rules for boosted beats

1. Booster output must sit INSIDE the style frame (captions on top, footnote, grid canvas)
   — never a raw full-screen AI clip with no graphic language.
2. Keep gold = invisible-made-visible; booster colors must obey the palette.
3. One booster beat renders BEFORE the main render (pre-render to mp4/png-sequence into
   `public/`), so the Remotion/Playwright pass stays light.
4. Credit/honesty footnotes: "AI footage", "Simulation", "Model: CC0 Poly Haven".
