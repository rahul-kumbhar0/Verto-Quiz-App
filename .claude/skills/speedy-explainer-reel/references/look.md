# The canwe.ai LOOK (owner, 1 Nov 2026: "don't use these colours, it looks like cheap editing")

Method borrowed from HyperFrames (`skills/hyperframes/references/look.md`, Apache-2.0): the look is set
as NUMBERS before the first scene, the ground and the hero come from a MATERIAL (not from effects), and a
BANNED line keeps generated defaults out. Tokens live in `assets/template/look.css` (`<body class="look">`).

## LOOK line
Era/medium: a late-night developer's desk — graphite hardware, warm ember light, terminal text, paper notes.
- Ground `#111216` solid (deep `#0B0C0E`), ONE local radial glow of the accent at 10–14% behind the hero.
  Never a full-screen linear gradient on dark (bands in H.264).
- Ink `#F3F1EC` (warm white) · secondary `#B9B6AF` · quiet `#7D7A74`.
- Accent: Claude terracotta `#D97757` (hi `#F0A585`, lo `#7A3A26`). ONE accent; it marks the meaning
  (the keyword, the winning bar, the result, the focal block). At full saturation only on the focal element;
  15–25 % for atmosphere (5 % vanishes in compression).
- Counterweight (second data series / "the other option"): desaturated cool `#8FA3BF` / `#3A4556`.
- Sets of N items: the graphite tonal set `--t1…--t5` (#2B2E35 → #50545F) + accent on the ONE that matters.
- Status only: ok `#7CC4A0`, bad `#E07A6F`.
- Light chapter: paper `#EEEBE5`, cards `#FBFAF7`, hairline `#DDD8CE`, ink `#16171A`.
- Materials: `.m-card` graphite (tonal fill, 1.5 px hairline, top inner highlight, long soft shadow),
  `.m-glass` (overlays), `.m-acc` (the focal pill/button), `.m-paper`, `.m-chip`, `.m-box` (lit 3D faces:
  top lighter, side darker, front ramp + edge light), `.m-floor` (warm contact glow under 3D props).
- Type: Inter 900 hero (−4 px tracking, 4–9 % of frame height, one or two lines), JetBrains Mono kickers
  (24 px, +4 px tracking, quiet ink). One highlighted word per line in the accent.
- Brand logos keep their real colours; everything around them stays in the look.

## BANNED
Candy flat fills (pure `#E11D48 #F59E0B #10B981 #3B82F6 #8B5CF6` blocks, rainbow sets) · more than one
saturated hue per scene · full-screen linear gradients on dark · neon glows on everything · pure white
`#FFF` cards on the dark canvas · drop shadows under text · idle breathing/pulsing/floating props · emoji as
icons when a real logo or a drawn glyph exists · Comic/rounded display faces.

## Data colour rule
A chart/list has ONE answer: that bar/row/block is the accent material; all others are graphite tones. A
comparison gets accent vs cool. Never colour-code more than 2 series in a reel.
