# props

Realistic metaphor objects, each with its own multi-stage action. Materials are lit from the top-left (brushed steel, gold, glass, plastic, paper), every object stands on a soft floor shadow and gets a rim light.

![preview](preview.jpg)

Details copied from real objects: the vault has studs, a combination dial, hinge barrels and a rating plate; the rack has mounting rails, U numbers and patch cables; the alarm has moulded ring text and a screw; the padlock has brushed brass grain, stamped text, rivets and a chrome cylinder. Labels are ours (`opts.text`, `text2`, `brand`, `model`, `lens`), never a real brand.

- kinds and what p (0..1) does:
  - badge    lanyard + ID card in a plastic sleeve: swings in, flips over (READ-ONLY → ADMIN), gold glint + sparks
  - vault    steel door with bolts: wheel winds back then spins, bolts slide out, door swings open, warm light + dust spill out
  - logbook  open notebook: a red pen travels along the lines and rewrites them, ink dries
  - alarm    smoke detector: LED starts blinking, it shakes, shockwave rings, smoke rises
  - rack     server rack: units power on top to bottom (LEDs, drive lights), then a red alert pulse
  - sandbox  glass box with a robot inside: robot pushes, cracks spread, glass shatters, robot steps out
  - lock     gold padlock: key slides in, turns, shackle pops up with a bounce, glint
  - camera   DSLR drawn after real ones (grip, pentaprism hump with pop-up flash, mode dial, ribbed lens rings, engraved front ring, coated glass): shutter press, aperture blades close and open, flash burst + lens flare
- `opts`: { kind, size: px (default 420), x, y (centre; default middle of the host), text, text2 (badge labels), label (badge name) }
- `state`: { p: 0..1 the action, show: 0..1 (object rises in) } · api: frame(t, state)

Use: `const b = KF.make("props", hostElement, { kind: "vault" });` then `b.frame(t, { p })` on every seek.
Working example: `demo.js` (watch it with `../gallery.html?only=props`).
