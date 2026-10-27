---
name: speedy-hidden-mechanism-reel
description: "Preset of speedy-explainer-reel for the 'invisible thing inside a product you use every day' format (60–90 s): a physical paradox hook, a magnified prop (keyboard, finger, sensor, chip) with the hidden mechanism drawn visible, a running everyday example, a history/credibility chapter in a light section (the engineer, the book, the patent, the exact pixel numbers), a 'second trick', a recap that answers the hook, and 'send this to the friend who blames autocorrect for everything'. Use for 'how does X actually work reel', 'why your phone/car/app does Y', 'hidden mechanism explainer', 'speedy devv keyboard style', or any 'you never noticed this' tech explainer."
---

# /speedy-hidden-mechanism-reel

Load and follow `speedy-explainer-reel` with these format rules. Reference:
`references/example-scripts.md` §A and `references/ref-frames/keyboard-reel-contact-sheet.jpg`.

## Story spine (60–90 s, ≈2.6 w/s, dark canvas with ONE light chapter)
1. **Hook (0–3 s, no presenter)**: a paradox in physical terms — "Every key on your iPhone
   keyboard is smaller than your thumb, and you still hit the right letter almost every time."
   Stage: the prop magnified 2–3× (`R.camera` push on a phone/keyboard), the hidden mechanism
   already glowing (zones), the giant finger entering. Two footnotes: "Magnified illustration" ·
   "Zones drawn visible. On a real <device> they are invisible."
2. **Pivot**: "So how is that possible?" (presenter rises in, shrug).
3. **Mechanism (dark)**: the rule in two sentences ("the keys you see are not the keys you
   touch…"), then the mechanism drawn on the prop (`R.zone` grow/shrink, `R.sel` on the thing).
   When the mechanism is a physical part, show it as an exploded view (`R.xview`): the device
   splits into layers, the part that does the trick pulls out and explains itself, and a
   `R.lens` zooms into the smallest detail (props3d.md "Exploded view"). The device's and every
   named brand's real logo via `R.lg` (references/logos.md).
4. **Running example (dark)**: a named everyday moment ("texting a friend: dinner tonight? →
   what ti…"); walk one step at a time (T, I → the E zone grows, the W shrinks → a tap halfway
   goes to E → every letter, every zone changes again). Each step is one phrase and one visual
   change; the presenter counts (one/two), pinches (a little off), thumbs up (gives it to the E).
5. **History / credibility (LIGHT chapter)**: who built it and when, with the real artefacts:
   the first device render with dimension callouts (`R.meas` 44 px / 320 px), the engineer's
   photo + role card, the book cover + year, the patent page with its number. Numbers exact.
6. **Second trick (dark)**: one more hidden behaviour the viewer has seen but never understood
   (the letter preview popping above the finger — `R.preview`), explained in 3 sentences.
7. **Recap**: restate the hook as the answer in one sentence ("Your iPhone is quietly guessing the
   key to where your thumb was about to land.").
8. **CTA (dark, 5–6 s)**: "Follow me, and send this to the friend who <blames the mechanism>."
   Profile card + finger tap → DM thread where the friend's two messages make the joke
   ("autocorrect again" / "ok so it was never autocorrect") → watermark.

## Template configuration
No rail: delete `#rail`, omit `chapters`/`counter`. `light: [[T.history, T.secondTrick]]`.
Stage band is 500–1330 (taller — the phone mock can be 2× scale). Components: `.phone` +
`R.keyboard` + `R.zone` + `R.preview`, `.finger` + `R.finger`, `.meas`, photo/name card, cover +
year tag, patent `.sc`, `.note` footnotes, `.dm` CTA block.

## Checks specific to this format
- The hook sentence contains a size/number/time comparison a viewer can feel in their hand.
- The mechanism is shown BEFORE it is explained (the hook already glows) and explained BEFORE the
  example uses it.
- Everything drawn visible that is invisible in reality carries a footnote; model-derived numbers
  say where they come from ("Zone sizes from English word counts, not Apple's own model").
- The credibility chapter is the only light section; it names a real person, artefact and year.
- The recap sentence answers the hook literally; the CTA punchline blames the mechanism.

## Brand
For the canwe.ai account, follow "House brand: canwe.ai" in `speedy-explainer-reel/SKILL.md` (mascot logo everywhere).
