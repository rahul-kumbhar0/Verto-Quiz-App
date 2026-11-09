# Director rules — measured, merged (huashu-motion · win4r · SallyRS · DotanVG · explainroo)

Every number is a default you break on purpose. Source in brackets.

## Hook and frame 0
- Frame 0 is a finished picture with the hook line already placed: never a fade-in, title card or logo. [SallyRS]
- A visible onset (motion, hit, first cut) inside 3 s — 14 of 21 measured launch films. Not a frantic open: most
  opened 6–20 dB under their peak. [huashu]
- The hook text is legible by 3 s at phone size: check `qa/hook_sheet.jpg`. [win4r]

## Energy curve (write it before building: 0–10 per stretch of a few seconds) [huashu rhythm.md]
- Climb in STEPS you can name (the kick enters, the camera starts travelling, cuts double), not a slope.
- Burst near the middle: the densest 5 s sat at ~37 % of the length (30–60 % typical), 5–8 events, ~1 per beat,
  framed by 1.5–4 s shots. Accelerate inside it: 2 beats per shot → 1 → ½ → stop.
- Hero on the strongest musical point, usually after the burst.
- ONE stop before the biggest hit: near-silence 0.5–1.6 s, then picture and sound slam in on the same frame.
- Resolve: one idea held ≥ 1.5 s.
- Boring = flat 3–5 with a hit at the end · a slope that peaks in the last 2 s · same energy every scene.
- Change ≥ 2 of these at every section boundary (all of them at the drop): shot scale · speed · ease family ·
  camera (still/travel/whip) · density (1 object ↔ grid of 9) · colour/ground · music texture.

## Density and holds [win4r craft.md, huashu]
- New information every 2–4 s; never > ~1 s fully dead outside a designed hold; no stretch > 2 bars without
  something new (our QA fails ≥ 2 s of near-zero motion).
- Hold text max(1.5 s, 1.0 s + 0.3 s × words) counted from when it FINISHED arriving; title card 2.5–4 s; anything
  information-bearing ≥ 1 s still before a cut; comparison items ≥ 2.5 s in frame before the verdict.
- Subtitles ≤ 3.5 words/s; with continuous VO chunk by phrase, each cue runs until the next starts.
- Emphasis budget: the lead section gets ~35–40 % of runtime.
- Narrated launch arc: problem 8–10 % → agitate 8–10 % → thesis 5 % → product 30–35 % → proof 20–25 % → contrast
  10 % → CTA 8–10 %. (Our tool-demo reels map onto it 1:1.)

## Easing [win4r]
| role | curve | duration (1080 canvas) |
|---|---|---|
| entrance | cubic-bezier(0.16,1,0.3,1) (≈ expoOut) | UI 0.25–0.4 s · words/lines 0.5–0.8 s |
| exit | cubic-bezier(0.6,0,0.9,0.35) | 40–60 % of the entrance |
| move between states | cubic-bezier(0.65,0,0.35,1) | 0.6–1.1 s |
| value that lands | cubic-bezier(0.55,0,0.2,1.12) or a spring (f 1.5–3 Hz) | |
Entrances need opacity PLUS 10–28 px travel (or 0.86–0.99 scale) — opacity alone reads as a template.
A value with several targets = the SUM of one spring per change (stays a pure function of t).

## Text [SallyRS social-short, measured on 59 films]
- Must-read text ≥ 3 % of frame height (58 px on 1920), hook 4–5 % (77–96 px); heavier weight; on a pill/plate or
  with shadow over busy ground. At short durations shorten the words, never shrink the type. (Our checker warns
  under 34 px for secondary labels; captions/headlines must clear 58 px.)
- One fixed text home position for the whole short; only the content changes.
- Words arrive in the order spoken.

## Safe zone 9:16 [SallyRS: Meta specs · explainroo formats]
Keep text, faces, logos and product between ~15 % and ~65 % of the height and ≥ 6 % from the left; in the lower
half also ≥ 20 % from the right (like/comment/share column). Backgrounds and full-bleed pictures may fill the frame.

## Cuts [huashu, DotanVG]
- Launch films cut 10+ times a minute (music-driven: median shot 1.2–2.2 s). Inside a burst every cut lands on the
  beat (±1 frame at 30 fps); outside it cut on phrases and information.
- Hard cuts or match cuts are the transition; no crossfades. [SallyRS]
- Fast-cut grammars that hold: an ANCHOR locked in place while the world behind changes · a step cut on one framing
  (12 → 200 mm, a label per step, 0.3 s each) · a spec label slammed in with each shot.

## Camera [explainroo 0.4]
Each scene is filmed: the camera moves in on what the voice talks about when there is time, and pulls back at the
end so the last frame shows the whole idea. Cards and labels are never cut in half while a shot holds.

## Real UI [argo]
Real product UI recorded with Playwright beats a mock: pseudo-cursor with highlight ring + click ripple, gaps between
scenes speed-ramped (×2), 2× supersample then downscale. Where we rebuild UI in HTML, keep the cursor grammar.
