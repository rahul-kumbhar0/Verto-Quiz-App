# Style guide — exact visual DNA (from frame analysis of reel DeZ-ddqMWFE)

Source: 720×1280, 30fps, 78.7s. Render ours at **1080×1920, 30fps** (same aspect).

## Canvas

- Background: `#0C0C0C` (near-black, slightly warm).
- Texture: faint dotted/plus grid, ~64px cells at 1080p, dots `rgba(255,255,255,0.04)`. Visible only on close inspection — it stops the frame from feeling empty.
- Subtle vignette is acceptable; nothing else decorates the canvas.

## Layout zones (1080×1920)

| Zone | Y range | Content |
|---|---|---|
| Captions | 160–420 | karaoke words, centered, can wrap to 2 lines |
| Exhibit stage | 460–1500 | one visual idea, usually centered, generous padding |
| Mascot | 1380–1920 | ~420–520px tall, bottom-center (x≈center, sometimes offset right) |

Zoom-in beats break the zones: the exhibit fills the whole frame, captions stay on top of it, mascot hidden or peeking from a corner.

## Typography

- Family: Inter (closest free match to the SF Pro look used). Tight tracking (-0.02em).
- Captions: ~64–72px at 1080p, centered.
  - Muted words: `#8E8E93` (iOS systemGray), weight 500.
  - Emphasis words: `#FFFFFF`, weight 700.
  - Selection-box words: white bold inside a rounded-1px-border box, border `#3B82F6`, padding ~4px 10px, border-radius 6px, plus 4 tiny square handles (6px, blue, white border) at the corners — exactly like selected text in Figma. Slight blue glow `0 0 24px rgba(59,130,246,.35)`.
- Two-line captions: first line can be muted lead-in ("about what"), second line carries emphasis ("comes **next,**").
- Callout labels: 30–34px, weight 700 white (e.g. "what you see", "hit region").
- Footnotes: 24–26px, `#6E6E73`, line-height 1.4, two lines max ("Zones drawn visible." / "On a real iPhone they are invisible."). Bold the first line occasionally.
- Data callouts: number bold white + unit muted ("**13** characters, **13** maps"), explanation beneath in muted gray.

## Color tokens

```ts
bg: '#0C0C0C'
gridDot: 'rgba(255,255,255,0.04)'
captionMuted: '#8E8E93'
captionBright: '#FFFFFF'
selectBlue: '#3B82F6'
keyGray: '#6B6B6F'        // iOS dark key fill (approx #5A5A5E–#6B6B6F)
keyDark: '#3A3A3C'        // special keys (123, return, shift)
keyText: '#FFFFFF'
kbBg: '#2B2B2D'           // keyboard panel bg (rounded 24px when floating)
zoneAmber: '#E8A33D'      // touch-zone fill
zoneAmberHi: '#F5C563'    // zone glow / stroke
zoneGlow: 'rgba(232,163,61,0.55)'
footnote: '#6E6E73'
accentRed: '#E53935'      // mascot shirt + rare "wrong" highlights (10×44=440px in red)
sendBlue: '#0A84FF'       // iMessage send button
```

## The exhibit catalogue (recreate these, swap content per topic)

1. **Floating UI panel**: the UI (keyboard/message box) on a rounded-corner dark panel, slight 3D tilt (`rotateX(35–50deg)` perspective 1200), floating with a 4px slow bob.
2. **Exploded layers**: two copies of the UI stacked with `translateZ`/y-offset; top = "what you see" (normal), bottom = "what you touch" (amber zones). Thin 1px vertical connector lines between corresponding keys during the separation moment. Each layer labeled via Callout.
3. **Touch-zone overlay**: amber rounded-rect zones drawn OVER or AS the keys, irregular widths (zones ≠ key bounds), soft glow. Zones morph (width/position tween) as "the model" updates. One zone can swell ("e 96%") while neighbors shrink ("w 0%") — show the % inside keys.
4. **Macro zoom + giant finger**: keyboard at 300–450% scale so 5–6 keys fill the width; a giant photoreal finger (soft shadow) slides in from a bottom corner and taps; on tap the key pops (scale 1.12, brighten) and a character-preview balloon appears above it.
5. **Measurement beat**: static device straight-on; dimension lines (thin white, end ticks) with px labels animate out; arithmetic appears as a stacked callout ("10 × 44" / "= **440** px" with the wrong total in red).
6. **Data panel**: dark rounded panel mocked as a search/terminal: query row ("time|"), rows of results with counts right-aligned, matched substring bold-white while rest muted; a footnote cites the source.
7. **Grid of mini-boards**: the same widget repeated small (5 per row) each showing a different state, one label under each — used for "it changes for every key you type".
8. **Person/source card**: square photo (desaturated, dark bg), name bold 44px below, role in 2 muted lines; optional second exhibit (book cover, device) beside it; year label.
9. **Phone-in-frame**: full iPhone mockup (dark titanium rounded body, Dynamic Island) with a real-looking iMessage thread; typing happens live in the input bar, keys flash as they're "pressed".
10. **End card**: creator profile header recreation (avatar, stats row, follow button) then a DM thread mockup where the CTA plays out as messages.

## Mascot

Flat 2D cartoon, slightly textured shading: young guy, swept brown hair, green-to-blue gradient wrap sunglasses, light stubble/mustache, red crew-neck tee, no outlines on the body. No legs needed (cropped at waist by frame bottom). ~8–10 poses; swap pose per beat with a 6-frame pop (scale 0.9→1). Poses seen in the reference: idle, point-up, point-side, shrug (both palms out), facepalm, head-scratch, thumbs-up, ok-sign, fist-pump celebrate, peek (only eyes above bottom edge), hands-on-head (shock), stop-palm, counting-fingers, muscle-flex.

Implement as a parameterized SVG component (one `<Mascot pose="..."/>`) so it's topic-independent.

## Audio

- VO: energetic young male, fast (~165–180 wpm), conversational, slight smile in the voice. Short sentences. No music in the reference (original audio = just VO); optionally add a very quiet dark synth pad.
- Key moments can carry subtle UI sfx: soft key-click on taps, whoosh on explode.
