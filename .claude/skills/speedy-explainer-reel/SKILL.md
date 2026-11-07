---
name: speedy-explainer-reel
description: Create a 9:16 tech-explainer reel in the speedy_devv / getkeyframes.com style — dark dotted-grid canvas, word-synced karaoke captions at top with blue selection-box keyword highlights, a center "exhibit" stage of pixel-perfect UI recreations (device mockups, exploded 3D layers, gold touch-zones, giant finger cursor, thin annotation callouts), and a red-shirt cartoon mascot reacting at the bottom. Use when the user asks for a video "like speedy_devv", a keyboard-reel-style explainer, or an "under the hood" tech reel on any topic.
---

# Speedy Explainer Reel

Recreates the exact style of instagram.com/speedy_devv reels (e.g. reel DeZ-ddqMWFE, "How does your phone's keyboard really work under the hood?"). The original creator renders HTML/CSS scenes to video with his own tool (getkeyframes.com); we replicate this 1:1 with **Remotion** — code-driven React video.

## What the style IS (the contract)

A 78-second reel in this style is a sequence of ~12–20 **beats**. Every frame has exactly three vertical zones on a near-black canvas:

1. **TOP — karaoke captions** (~18% of height): the words currently being spoken, 2–6 words at a time, centered. Function words in muted gray, the payload word in **bold white**, and 1–2 "money words" per beat wrapped in a **blue selection box** (thin blue outline + tiny corner handles, like selected text in a design tool).
2. **MIDDLE — the exhibit** (~55%): ONE visual idea per beat. A pixel-faithful recreation of real UI (iOS keyboard, iMessage, a phone), manipulated in ways real UI can't be: tilted in 3D, exploded into "what you see" / "what you touch" layers, zoomed 400% with a giant photoreal finger, overlaid with glowing **amber/gold touch zones**, annotated with thin 1px lines to small labels, measured with dimension callouts (320 px, 44 px), or backed by data panels (frequency tables, percentages on keys).
3. **BOTTOM — the mascot** (~25%): a flat-cartoon guy (red t-shirt, brown hair, green wrap sunglasses) who reacts to each beat with a new pose: pointing up, shrugging, facepalm, thumbs-up, confused head-scratch, celebrating, peeking. He is the emotional laugh-track. He gets hidden only when the exhibit needs the full frame (zoom-in beats).

Tiny gray *footnote disclaimers* sit near exhibits when honesty requires it ("Zones drawn visible. On a real iPhone they are invisible.").

Full visual spec (exact colors, sizes, timings): [references/style-guide.md](references/style-guide.md)
Scene-by-scene breakdown of the reference reel: [references/reference-breakdown.md](references/reference-breakdown.md)
Motion recipes (how each animation is made): [references/animation-recipes.md](references/animation-recipes.md)
How to write the script/beat sheet + voiceover pipeline: [references/script-format.md](references/script-format.md)
Advanced techniques from 6 more reels (3D studio shots, pipeline bars, light-mode beats, counters, props, citations): [references/advanced-techniques.md](references/advanced-techniques.md)

## Workflow to make a new video on any topic

1. **Load Remotion guidance**: invoke `remotion:remotion-best-practices` / `remotion-markup` skills before writing components.
2. **Write the beat sheet first** (see script-format.md): narration split into beats; per beat: caption words + emphasis + selection-box words, exhibit description, mascot pose, duration in frames. The topic must be explained *visually* — every claim in the narration must be SHOWN in the exhibit (this is the soul of the style: "don't say it, demonstrate it on a real-looking UI").
3. **Copy the template project** `speedy-reel-template/` (sibling of this skill's project root) into a new folder for the video. It contains the whole component library:
   - `src/theme.ts` — colors, fonts, layout constants
   - `src/components/Captions.tsx` — karaoke captions + SelectionBox highlight
   - `src/components/Mascot.tsx` — SVG mascot with poses (`point-up, shrug, facepalm, thumbs-up, idle, confused, celebrate, peek, ok-sign, wave`)
   - `src/components/Keyboard.tsx` — iOS dark keyboard (keys, suggestion bar, touch-zone overlay mode)
   - `src/components/PhoneFrame.tsx` — iPhone mockup with message thread + input bar
   - `src/components/Finger.tsx` — photoreal-ish giant finger cursor that slides and taps
   - `src/components/Callout.tsx` — thin-line annotation label; `Footnote.tsx`; `Measure.tsx` (dimension lines)
   - `src/components/ExplodedLayers.tsx` — 3D tilt + layer separation ("what you see / what you touch")
   - `src/components/DottedGrid.tsx` — the background
   - `src/beats.ts` — beat-sheet timing engine (`beatsToSequences`)
4. **Build one React component per beat**, composed in `src/Reel.tsx` with `<Sequence>` per beat. Keep each exhibit to ONE idea.
5. **Voiceover**: default is Indian English — `edge-tts`, voice `en-IN-PrabhatNeural`, rate +12%, one mp3 per beat (full pipeline in script-format.md). Align each beat's duration and caption spread to its clip. ElevenLabs (paid) only if the user asks.
6. **Preview** with `npx remotion studio`, **verify stills** by rendering frames at each beat midpoint, then render with `npx remotion render` (1080×1920, 30fps).

## Hard rules (what makes it look "exact")

- Background is never pure black: `#0C0C0C` with a faint dotted grid.
- Captions at TOP, never bottom. Max ~6 words on screen. Words pop in as spoken (opacity+scale 0.95→1, ~4 frames).
- Amber/gold (`#E8A33D`→`#F5C563` glow) is reserved for "the invisible made visible" (touch zones, hit regions). Blue (`#3B82F6`) is reserved for caption selection boxes and send buttons.
- Exhibits are built from real UI metrics (correct iOS key spacing, SF-style font) — the credibility comes from looking REAL, then doing something impossible (exploding, measuring, X-raying).
- Mascot changes pose every beat; poses must match the emotion of the line (claim→point, problem→facepalm/confused, reveal→celebrate/thumbs-up).
- Motion is punchy: beat entrances 8–12 frames, `Easing.bezier(0.16, 1, 0.3, 1)`, slight overshoot on scale. Cuts (not crossfades) between beats; within a beat, elements animate continuously (idle float/breath on exhibits, finger drifts).
- End card: the creator's profile card + a DM/chat mockup for the CTA, in the same UI-recreation style.
