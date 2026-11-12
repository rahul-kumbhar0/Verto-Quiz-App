# props

Realistic metaphor objects, each with its own multi-stage action. Materials are lit from the top-left (brushed steel, gold, glass, plastic, paper), every object stands on a soft floor shadow and gets a rim light.

![preview](preview.jpg)

- kinds and what p (0..1) does:
  - badge    lanyard + ID card in a plastic sleeve: swings in, flips over (READ-ONLY → ADMIN), gold glint + sparks
  - vault    steel door with bolts: wheel winds back then spins, bolts slide out, door swings open, warm light + dust spill out
  - logbook  open notebook: a red pen travels along the lines and rewrites them, ink dries
  - alarm    smoke detector: LED starts blinking, it shakes, shockwave rings, smoke rises
  - rack     server rack: units power on top to bottom (LEDs, drive lights), then a red alert pulse
  - sandbox  glass box with a robot inside: robot pushes, cracks spread, glass shatters, robot steps out
  - lock     gold padlock: key slides in, turns, shackle pops up with a bounce, glint
  - camera   DSLR: shutter press, aperture iris closes and opens, flash burst + lens flare
- `opts`: { kind, size: px (default 420), x, y (centre; default middle of the host), text, text2 (badge labels), label (badge name) }
- `state`: { p: 0..1 the action, show: 0..1 (object rises in) } · api: frame(t, state)

Use: `const b = KF.make("props", hostElement, { kind: "vault" });` then `b.frame(t, { p })` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=props`).
