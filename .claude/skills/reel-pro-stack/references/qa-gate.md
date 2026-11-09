# QA gate — reelqa.py + reeltext.mjs (our code; methods from win4r, huashu, explainroo, SallyRS, earshot)

## reeltext.mjs (Playwright on the page itself, every 0.5 s)
Walks every visible text node (effective opacity ≥ 0.5), measures its box in stage px and its rendered size.
- `unsafe`: outside 15 %–65 % height, < 6 % from the left, or > 80 % width in the lower half (y > 1000).
- `small`: text runs longer than 3 chars under 34 px.
- Skips `data-qa="texture"` (fake UI, code, phone screens, decorative bubbles), `data-qa="ok"` (deliberate fine
  print), phones and SVG. Mark honestly — a must-read line is never texture.
- A camera push (follow cam / punch) spreads edge elements outward: re-run after adding camera moves.

## reelqa.py (ffmpeg + numpy on the final MP4)
| check | rule | source |
|---|---|---|
| frame 0 | contrast (std) > 18: a finished picture, not black/flat | win4r, SallyRS |
| hook | first visible onset ≤ 3 s | huashu (14/21 films) |
| flashes | no single-frame flashes (frame differs from both neighbours, neighbours match) | win4r |
| pops | ≤ 6 single-frame jumps (3× both neighbours) | win4r |
| frozen | no stretch ≥ 1 s with no change | win4r |
| dead time | FAIL on ≥ 2 s under 15 % of the film's median motion | huashu |
| burst | densest 5 s window of cuts/pops at 25–65 % of length | huashu |
| cut rate | ≥ 10 detected cuts/min | huashu (21 films: 15–33) |
| loudness | −14 LUFS ± 1, true peak ≤ −1 dBTP | win4r, DotanVG |
| stop-downs | music stem dips ≥ 6 dB in the 0.33 s before ≥ 80 % of impact/bigwhoosh/swell cues | earshot, huashu |
| SFX density | 18–30 per 10 s (explainer) / 3–13 (music-led) | earshot |
| safe zone / text size | from reeltext.json | explainroo, SallyRS |
Score = (pass + ½ warn) / checks × 100. Exit 1 on any FAIL.

Outputs: `report.md/json`, `hook_sheet.jpg` (0–3 s every 0.5 s at 360 px — the muted-autoplay test),
`phone_sheet.jpg` (every 2 s at 240 px — can a phone viewer read it?), `energy.png` (motion per second + cut lines:
compare with the rhythm sheet's energy curve).

## Reading the energy curve
Look for: a step at each section boundary, the tallest stretch in the 30–60 % band, a visible dip just before the
payoff (the stop), and no plateau at the end. A flat curve = add a contrast change (shot scale, speed, density).
