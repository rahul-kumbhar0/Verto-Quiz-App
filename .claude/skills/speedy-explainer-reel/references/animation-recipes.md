# Animation recipes (Remotion)

All motion uses `useCurrentFrame()` + `interpolate()` with `Easing.bezier(0.16, 1, 0.3, 1)` ("easeOutExpo-ish") unless noted. 30fps. `clamp` both sides always.

## 1. Caption word pop (karaoke)

Each word gets a start frame (from VO timestamps or even spacing). On its start:
- opacity 0→1 over 4f, scale 0.92→1 over 6f, translateY 6px→0.
Words already shown stay. On beat change the whole caption block cuts (no exit animation — hard swap, matching the reference).

Selection box: draw the box+handles as part of the word's markup; animate the box in 2f AFTER the word appears (border opacity 0→1, slight scale 1.06→1), so it reads as "the word got selected".

## 2. Beat entrance

New exhibit: opacity 0→1 (8f) + scale 0.96→1 (10f) + translateY 24→0. Mascot pose swap: scale 0.9→1 pop (6f). Hard cut out of the previous beat (opacity 1→0 in 3f max, or instant).

## 3. Idle life (never let a frame be static)

- Floating panels: `translateY: 4*Math.sin(frame/22)`, `rotateX: base + 1.5*Math.sin(frame/35)`.
- Glow pulsing on amber zones: shadow blur 24→34 with `sin(frame/18)`.
- Finger drift: ±3px wander while "hovering".

## 4. 3D tilt + exploded layers

Wrapper: `perspective: 1200px`. Panel: `rotateX(42deg) rotateZ(-2deg)`.
Explode: animate `gap` between the two layer copies 0→260px over 20f; simultaneously fade in 1px vertical connector lines (one per key column, `scaleY` 0→1 from the top layer) and the two Callout labels. Collapse = reverse.

## 5. Touch-zone morph

Zones are absolutely-positioned rounded rects over the key grid. Keep zone geometry in state-A and state-B arrays; interpolate x/width/height per zone over 12f with the standard easing. Add `filter: drop-shadow(0 0 18px zoneGlow)`. For the "e swells" beat: target zone scales to ~2.2× key width with a blobby border-radius (40%) and brightness 1.2; neighbors compress accordingly.

## 6. Giant finger tap

Finger = pre-made PNG/SVG (photoreal shading, soft drop shadow 40px). Slide in from bottom-right: translate (300,500)→(0,0) over 12f. Tap: 6f down (translateY +14, scale 0.99) then 8f up; at contact frame, the key under it: scale 1→1.14→1 (8f), background brightens, char-preview balloon (gray rounded callout with the letter, 2× key size, tail) pops above: scale 0→1.05→1 over 7f.

## 7. Measurement lines

Dimension line = 1px white line with 8px end ticks + label chip. Animate `scaleX` 0→1 from center (10f), label fades in after. For arithmetic reveals, stack lines of text appearing one per 8f; render the "wrong" result in `accentRed` and pop it harder (scale 1.15→1).

## 8. Live typing

Message input text grows one char every 4–6f with a blinking caret (`opacity: frame % 30 < 15 ? 1 : 0`). The corresponding key flashes (brighten 4f) in sync. Suggestion bar words swap with a 3f crossfade on every char.

## 9. Data panel rows

Panel slides up 16px + fades (10f). Rows stagger in, 3f apart. The matched substring in each row is white-bold; counts right-aligned muted. A highlighted row gets a subtle white 4% background.

## 10. Grid of mini-boards

Boards appear in reading order, 2f stagger, each with scale 0.9→1. The "current" board pulses its amber zone; a label fades in beneath.

## 11. Zoom beats (full-frame)

To go macro: animate the SAME keyboard component's wrapper scale 1→3.6 and translate so the target key centers, over 14f — a camera move, not a new scene. Hide mascot during; captions remain on top (add slight text shadow for contrast).

## 12. End card

Profile header: avatar circle, bold stats row ("246 | 68K | 209"), blue Follow button — all iOS-styled. Then cut to DM thread; messages pop in like recipe 2 with iMessage bubble styling (incoming `#26262A`, outgoing `#0A84FF`), typing-indicator (3 bouncing dots) before the reply.

## Timing cheat-sheet

| thing | frames @30fps |
|---|---|
| word pop | 4–6 |
| beat entrance | 8–12 |
| pose swap | 6 |
| explode/collapse | 20 |
| zone morph | 12 |
| finger tap down/up | 6/8 |
| camera zoom | 14 |
| hard cut-out | 0–3 |
