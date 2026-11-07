# Speedy Reel Template

Remotion template implementing the **speedy_devv / getkeyframes.com** explainer-reel style
(reference: instagram.com/reel/DeZ-ddqMWFE — "How your phone's keyboard really works").

This project is the working companion of the Claude skill at
`../.claude/skills/speedy-explainer-reel/` — read that skill's `SKILL.md` and
`references/` for the full style contract, the reference reel's scene-by-scene
breakdown, animation recipes, and the beat-sheet writing rules.

## Layout

- `src/theme.ts` — color tokens, fonts, canvas size (1080×1920 @ 30fps), standard easing
- `src/components/`
  - `DottedGrid.tsx` — near-black dotted-grid canvas + vignette
  - `Captions.tsx` — top karaoke captions; word styles `muted | bold | box` (blue selection box with corner handles)
  - `Keyboard.tsx` — parametric iOS dark keyboard: `mode` normal/zones/ghost, amber `zoneOverlay` with per-key `zoneState` (scale + % label), suggestions bar, key highlight
  - `Mascot.tsx` — SVG reaction mascot (red tee, green wrap shades), 11 poses; `MascotSlot` pins him bottom-center
  - `Finger.tsx` — giant photoreal finger cursor; slides in, hovers, taps
  - `Callout.tsx` — `Callout` (thin-line annotations), `Footnote` (honesty disclaimers), `Measure` (dimension lines)
  - `ExplodedLayers.tsx` — 3D-tilted "what you see / what you touch" layer separation + `FloatingPanel`
  - `PhoneFrame.tsx` — iPhone mockup, iMessage `Bubble`, live-typing `InputBar`
  - `Exhibits.tsx` — `PipelineBar` (top stage strip + live counter), `FieldArcs` (glowing field lines), `RGBStrip`, `CapsLabel` (spec labels), `StatCard`, `Gauge` (speedometer), `Wire` (animated diagram wires)
  - `Studio3D.tsx` — @remotion/three studio stage (amber rim light, turntable) for photoreal 3D beats
- `src/Reel.tsx` — demo composition: 6 beats recreating the reference reel's signature moments (hook, explode, zone-morph, finger tap, measurement, DM end-card), plus the `BEATS` timeline pattern
- `src/MascotBoard.tsx` / `Studio3DDemo` — reference boards for mascot poses and the 3D stage
- `DottedGrid` accepts `mode="light"` for paper-white beats (alternate dark ↔ light for rhythm)

## Use

```bash
npm i                # if not yet installed
npx remotion studio  # live preview
npx remotion render SpeedyReel out/reel.mp4
```

## Making a new video on a different topic

1. Write a beat sheet per `references/script-format.md` in the skill.
2. Duplicate this project, replace the beat components in `Reel.tsx` (keep the
   caption/mascot/footnote structure; swap the exhibit in each beat).
3. For non-keyboard topics, build a new exhibit component with the same
   design language: real-looking UI, amber = invisible-made-visible,
   thin white callouts, gray footnotes.
4. Add voiceover: `public/vo.mp3` + `<Audio>` in `Reel.tsx`, align word `at`
   timings to the VO (see skill reference docs).
