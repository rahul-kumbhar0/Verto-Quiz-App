# @speedy_devv "Let's design GitHub" — the full grammar (studied frame by frame, 9 Nov 2026)

Source: owner-supplied reel (126 s, 720×1280, 30 fps). Frames at 2 fps + 30 fps strips in
`/root/reel-work/ref/v81642/` (sheet_00–10.jpg, cap_*.jpg, hero_*.jpg). This is THE reference for how we explain,
edit and direct the mascot. Worked demo on our VIDEO v2 voice: `/root/reel-work/reels/demo-devv/`.

## 1 · How it EXPLAINS (script grammar)
1. **Open on the thing itself + "Let's design X."** Frame 0 = the hero object (3D GitHub stack) with its parts already
   labelled around it (load balancers, babeld, Spokes, Kafka, Actions). The viewer sees the whole map before the tour.
2. **Scale in three numbers, each with a mass visual.** "a billion repositories · 225 million developers · 124 million
   Actions jobs a day" — odometer scramble → the number lands with a mono label under it → a MASS shows it (a grid of
   hundreds of faces, a wall of job cards). Never a number alone.
3. **"Let's follow one ___."** ONE running example carries the whole film: Ines Okafor's commit `a3f9c1e` "Fix
   double-booked seats on the 7:40 ferry" on `kestrelferry/booking-api`. It appears in EVERY chapter (pushed → auth'd
   → stored ×5 → fanned out → tested), so the system is learned through one concrete journey.
4. **Chapters on a rail** (FRONT DOOR · STORAGE · APP · ACTIONS · AGENTS). Each opens with "First, / Next, / Then,"
   and the rail labels grow sub-labels as you go (checks · stores · reacts · tests).
5. **Each part is named, then shown doing its job to the running example**, in the order a request travels:
   "It hits the load balancers, then HAProxy, then babeld, GitHub's git proxy. babeld asks gitauth…"
6. **A live stat in the rail's corner** changes per chapter: 1 copy → 5 copies → 60+ jobs → 52 incidents → 40%+ →
   17.9 billion → 25 ms. The corner number IS the chapter's takeaway.
7. **The twist chapter** ("But this year it keeps going down") — dark, rail turns RED, a real data chart (52 incidents
   Jan–Sep), then today's news (agents open 40% of PRs, 17.9 B pushes > 2024+2025 combined).
8. **Callback**: "Remember the lock?" — a prop/idea from 60 s earlier returns to explain the problem. Then the fix
   ("So GitHub is rebuilding Spokes with one lock per branch") resolves it.
9. **Recap = the system stacked**: every chapter's hero shrinks into one vertical stack as the voice summarises
   "a front door that checks, five copies that vote on every push, one app that fans it out, a fresh machine for every job".
10. **CTA = follow + share with a SPECIFIC dev**: "Follow for more breakdowns, and share it with the dev whose Actions
    are stuck in the queue." — shows the IG UI of THIS reel, the share sheet, a friend's avatar tapped, hourglass prop.
Sentence rhythm: short, concrete, present tense; numbers spoken plainly; every sentence moves the example forward.

## 2 · How it EDITS (picture grammar)
- **Layout never moves**: captions (top ~7–12 %) · rail (~17 %) · hero (35–68 %) · mascot waist-up (72–100 %).
- **Captions**: words arrive out of BLUR (sharp in ~2 frames); spoken words dim grey; the current/key word bold;
  the keyword gets the blue selection box — corner HANDLES appear first, then the box. One or two lines max.
- **Hero = ONE realistic object per chapter that ACCUMULATES**: the rack gains rows as each part is named (load
  balancers → HAProxy ×4 → babeld → gitauth), drive bays get the commit hash, status chips tick ✓, "3 of 5" counts.
  State changes on the SAME object beat cutting to a new one.
- **Hero swap = defocus morph**: the old object blurs + goes grey + fades; the new one arrives grey/soft and sharpens
  into colour (~0.25–0.35 s). Plus a light sheen glinting across new hardware.
- **Flow = packets on wires**: circuit lines around the hero with green dots travelling; the running example is a white
  RING moving along the path ("your push").
- **Light/dark flips by chapter** (front door dark, storage light, app dark, actions light, twist dark).
- **Real UI everywhere** (GitHub PR page, Actions runs, webhook deliveries, terminal), always showing the running example.

## 3 · How the MASCOT responds (the gesture says the word)
Planted centre-bottom, never walks; the GESTURE does the pointing. Observed lexicon (time · word → gesture):
| word / idea | gesture | our pose |
|---|---|---|
| "225 million", "60 jobs have to react" (big crowd) | arms open wide | `big` |
| "124 million", a name/term | index finger up | `point_up` / `one` |
| "load balancers, then HAProxy, then babeld" | counts on fingers, 3 → 4 | LIST COUNT (auto) |
| "five different machines" | five fingers | `five` |
| "two of the five copies" | V / two fingers | `two` |
| "before anything else", "never" | stop palm | `stop` |
| "GitHub has to know it's you" | points at camera | `point_cam` |
| "if you have push access" | thumbs up | `thumbs` |
| "enforces the repository's rules", "nothing carries over" | arms crossed | `cross` |
| "a disk can die at any moment" | shrug | `shrug` |
| "the whole repository is locked" | holds a PADLOCK, points at it | `show` + prop `lock` |
| "nearly two million lines" | hands measuring | `measure` |
| "thrown away" | palms together / brush | `palms` |
| "inside a small open-source program" | peeks through finger-ring | (pinch) |
| "52 incidents" | hand on chin, worried | `worry` |
| "40% of PRs start with an agent" | hands on head | `hands_head` |
| "17.9 billion" | jazz hands, mind blown | `mindblown` |
| "every turn takes longer" | facepalm | `facepalm` |
| "will stop waiting" | shading eyes, looking far | `look_far` |
| "whose Actions are stuck in the queue" | holds an HOURGLASS | `show` + prop `hourglass` |
| "Remember the lock?" | the padlock returns | same prop = callback |
Implemented: `avatar.js` (hands four/five/cup/flat; poses four five ten worry mindblown measure look_far palms show
offer; fixed `cross`; expr `worried`; props lock + hourglass) and `speedy.js` `R.autoPoses` (lexicon above, numbers
1–5/10/billion, LIST COUNT on comma lists ≥ 3 items). Check poses with `assets/posegallery.mjs`.
Rule: the gesture lands ~0.12 s BEFORE its word; one gesture per 0.9–1.5 s; comedy/emotion poses ≤ 3 a reel.
