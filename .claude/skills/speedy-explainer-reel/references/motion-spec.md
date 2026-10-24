# Motion spec (measured frame by frame from the reference reels)

Measured from 8–15 fps bursts around every transition in both reels. These are the curves and
durations that make the style read as "speedy_devv"; the template implements each one — the
helper名 after each item. All durations at 30 fps.

## 1. Captions (the signature micro-animation)
- Each word enters **white + bold**, blur 14 px → 0, rise ≈6 px, over ~0.2 s, exactly on its
  spoken start. (`speedyFrame` kinetic)
- When the NEXT word lands, the previous word **relaxes to grey + regular weight** over ~0.15 s —
  the white highlight travels through the sentence. Marked `bold`/`box` words never relax.
- The selection box draws with the word (border + fill scale 1.1 → 1, ~0.26 s), its two dot
  handles pop ~60 ms later with a spring. The box persists for the rest of the page.
- Page out: whole line blurs out (16 px) in ~0.14 s just before the next page's first word.
- A page is never longer than 2 lines; nothing is pre-shown.

## 2. Scene transitions (hard cuts with motion blur, 0.25–0.4 s)
Three variants, all with heavy blur on BOTH outgoing and incoming content (`R.setup` scenes
`enter:`):
- **blurzoom** — outgoing blurs to ~24 px and scales UP ~1.1; incoming starts blurred 26 px at
  scale 1.14 and settles. Used for most chapter changes and into the CTA.
- **push** — vertical slide-push: outgoing flies up ~560 px with 24 px blur, incoming flies up
  from below. Used dark→light mid-reel (journal→phone beats).
- **swing** — 3D tilt: outgoing rotates ~18° around X and lifts away; incoming tilts in from
  −24°. Used when a diagram replaces a solid object (server → schema card).
Theme flips happen INSIDE these transitions (~0.2 s crossfade of the canvas), so a chapter
change reads as one move. The headline is the only continuity across the cut.

## 3. Stage element motion
- Cards: blur 18 px + rise 40 px + scale 0.96 → 1, ease-out ~0.5 s (`R.card`). A superseded card
  recedes: blur 6, dim 60 %, scale −6 %, slides back 50 px (`back:[a,b]`).
- Schema/table rows: appear ONE PER SPOKEN WORD; the card grows taller with each row; blur-in
  8 px + rise 14 px, 0.3 s (`R.rows`). The live counter ticks with each row.
- Labels/pills: damped-spring pop from 0.4–0.8 scale (`R.pop`), never more than one per word.
- Counters: roll up over 0.6–1.4 s ease-out, never instant (`R.count`; rail counter steps).
- Chat bubbles: spring-scale from the sender's corner (origin bottom-left/right), thread scrolls
  up one row height per new bubble after 3 are visible (`R.bubbles`).
- Dimension lines: scale-X draw 0.5 s, label fades after (`R.meas`).
- Matrix cells: fill over ~1.4 s; cells beyond the cap turn red; header number rolls in sync
  (`R.matrix` + `R.count`).

## 4. The finger (hero prop)
- Slides in from the bottom-left corner, enters over ~0.5 s.
- **Motion blur while moving**: blur ≈ 0.45 px per px/frame of speed above a threshold, capped
  10 px (`R.finger` does this automatically).
- Press: dips (scale −4 %, rotate +4°) over 0.5 s; the hit zone under it **flashes white-cream**
  and fades back to gold (`R.zone … press:[t]`); a **tap mark** (circle + crosshair) blinks at
  the contact point (`R.tapmark`); a tiny gold **particle dot rises** ~90 px off the key and
  fades (`R.spark`); on a real keyboard the letter preview pops above the finger (`R.preview`,
  iOS callout shape, instant pop ≤ 2 frames).

## 5. The presenter
- Pose changes are **fast cuts**: ~0.18 s with a slight overshoot and a **motion smear** on the
  arms (1–2 frames of blur) — never slow tweens. Done automatically by the pose driver.
- Mouth: clear viseme flaps per word; head bobs ±1.6° while talking; idle sway when silent.
- Hidden during the hook and full-stage inserts; rises in from below over 0.5 s.

## 6. Hook motion (implemented by the props layer — references/props3d.md)
- Something moves within the first 0.5 s: camera push on a magnified prop, a keycap physically
  rising out of the keyboard, or a cylinder coming into focus out of a bokeh field, floor
  shockwave rings, then the stack EXPLODES into layers and labels fly in from the sides one at a
  time while the stat counter at the bottom is already rolling (878,711 → 1,000,000).
- Label leader-lines (thin white 1 px) draw from annotation text to the object.

## 7. CTA motion sequence (copy exactly)
1. Profile card blur-zooms in on "Follow"; finger slides up (motion-blurred) and **presses** the
   Follow button → button flash + text flips to "Following ▾" + a green **"+1" floats up** off
   the follower count (`R.press`, text swap, `R.plusone`).
2. The profile scrolls/recedes (blur) on "and send/share this".
3. The **share sheet springs up from the bottom** (`R.sheet`, dy ≈ 520, damped spring ~0.55 s);
   friend avatars pop in rows; one gets the blue check; Send **presses**.
4. Or a DM thread: messages pop in sequence (`R.bubbles`), the reel card slides in with a heart,
   "Seen" fades, typing dots appear, then the punchline message.
5. Watermark fades in bottom-right. Presenter: point_cam → wave → the punchline reaction.

## 8. Rhythm
- A visible change every 1–2 s (word, pose, label); a transitions every 5–10 s; the camera never
  fully still (1–2 % push). The counter/matrix roll during, not after, the sentence.
