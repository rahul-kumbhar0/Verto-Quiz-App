# Premium UI mode (no presenter, product-UI storytelling)

Source: a 48 s reel by princegupta.ai, "Day 05 · Repositories you should know about"
(Cloudflare security-audit-skill), sent by the owner as the target for editing, animation,
presenting and music. Contact sheets (2 fps): `ref-frames/premium-ui-sheet1.jpg`, `-sheet2.jpg`.
Use this mode for the **Learn AI Engineering** series and any "how it works inside" reel where
the subject is software. It is an alternative to the cartoon-presenter look, not a replacement.

## What makes it feel premium (the 10 rules)
1. **No presenter. The UI is the presenter.** Every beat is a realistic product surface (repo
   card, terminal, chat box, a phase list, a report) at ~78% width, centred, with lots of empty
   dark space around it. One hero card at a time (plus the persistent progress card, rule 4).
2. **Captions are calm, not headlines.** One line of 2–5 words at the top (y≈250), medium weight
   ~56–60 px, each word blurs in as spoken. ONE keyword per phrase in the blue selection box;
   1–2 "feeling" words per phrase (team, *fresh agent*, *prove it wrong*, *more than once*,
   *new things*) set in **serif italic** (Instrument Serif). Markup: `[box]` and `*serif*`.
   Turn on with `<body class="premium">` (template speedy.css).
3. **The card reacts to the word, not the sentence.** On "hunting" the agent icons start
   orbiting; on "prompt injection" a red tag pops on hunter-01; on "auth bugs" a route row
   turns red; on "Day 5" the tracker cell lights. Anchor every micro-change with `at("word")`.
   Target: a visible change every 0.6–1.0 s. This is where the time goes when building.
4. **A persistent progress card is the spine.** Bottom card (y≈1420–1640) stays on screen through
   the whole mechanism: title row ("security audit this codebase" + orange status pill), a
   list of phases with ✓ ticks, a thin progress bar, "phase n of 6" bottom-right. The top card
   swaps; the bottom card only ticks. The viewer always knows where they are. (Replaces the
   chapter rail of the system-design format.)
5. **Series identity card.** After the hook: avatar + handle + "DAILY SERIES" label, a huge
   serif "Day 05", the series title, and a 1–6 tracker of rounded cells (done = green dot,
   today = blue filled, future = dim). It comes back in the CTA advancing to the next cell.
6. **The big serif keyword moment.** When the subject is named, the brand logo glows (orange
   radial bloom) and the name is set HUGE (~110 px) in serif italic inside the selection box,
   then three chips slide in under it (SKILL.md · MIT license · 6 phases). Once per reel.
7. **One light chapter for "the smart part".** The canvas dissolves to off-white (#EFEEEA) exactly
   on "And here's the *smart* part" and stays light for the clever mechanism (the verifier that
   tries to prove the finding wrong → report Confirmed / Needs validation / Rejected), then
   dissolves back to dark. The light chapter = the idea viewers will repeat.
8. **Transitions are blur dissolves**, ~0.35 s: outgoing card blurs 0→16 px + fades while
   the incoming card sharpens from 16 px. No slides, no whip pans. Cards rise 12–20 px as they
   enter. Lists build row by row (80–120 ms stagger). Checkmarks pop with a spring.
9. **Data is shown, not said.** A growing bar chart for "run it more than once" (run-1/2/3 bars
   growing, the new bar in blue), a hexagon/grid of cells lighting orange for "system",
   PRO TIP card with a glowing pin icon for the tip.
10. **CTA is a UI sequence.** Profile card → cursor presses Follow (button → "Following") → series
   tracker advances → comments sheet: the keyword types into the input → send → a DM preview
   "Sent! Check your DMs" with the link card drops in above. Caption: "comment [KEYWORD] and I'll
   send the repo straight to your DMs".

## Voice + pacing (measured)
- ~180 words/min, almost no pauses (dense, confident, "friend explaining"); the hook is one
  sentence that names the payoff ("This GitHub repo sends a team of AI agents hunting for
  security holes in your app").
- For our pipeline: pace.py with small pauses (`--pause 0.10 --stop 0.30 --tempo 1.08`), and
  only 2–3 stops in the whole reel (after the hook, before the light chapter, before the CTA).

## Music (measured)
- Mix sits at about −17 LUFS integrated with a very small loudness range (LRA 1.3 LU): it is
  compressed and steady, sitting UNDER the voice.
- Bass is a single low pedal note (about C1/C2) for the whole reel. There are no chord changes
  and no melody. A half-time kick runs at about 0.88 s per hit (136 BPM half-time). Ticks are
  sparse, and a dark low-passed pad fills the background.
- The hook (first ~2 s) is nearly dry. The beat lands on the series card. There is no drop
  anywhere else, only a short dip under the light chapter.
- Generate it with `music.py` style `"pulse"`:
  `{"bpm":136,"dur":D,"groove_in":2.3,"breaks":[[light_start-0.4, light_start+1.2]],"fade_out":1.5,"key":"Cm","style":"pulse"}`
  then mix with `mix.sh ... 0.10` (same as always; the pulse bed is already sub-heavy, so
  don't raise it).

## Layout (1080×1920)
| band | y | what |
|---|---|---|
| captions | 230–330 | one line, 2–5 words |
| hero card | 560–1300 | the reacting UI card, 840 px wide max |
| progress card | 1420–1640 | persistent phases + bar ("step n of N") |
| footnotes | 1700–1760 | small grey, only when needed |
Nothing below 1760 (Instagram UI). The serif keyword moment can use 600–1100 alone.

## Card style
- Card: `#141417` fill, 1 px `rgba(255,255,255,.08)` border, radius 22, soft shadow
  `0 30px 80px rgba(0,0,0,.55)`. Light chapter: `#fff` card on `#EFEEEA`, border `#E3E1DC`.
- Inside cards: 22–26 px Inter for content, 18 px Mono for code/ids/paths, grey meta rows,
  coloured status pills (orange = running, green = done, red = finding, blue = selected).
- Accent colours: blue `#3B82F6` (selection/today), orange `#F97316` (brand glow/running),
  green `#22C55E` (done), red `#EF4444` (problem).

## Script shape that fits this mode (45–60 s)
1. Hook = the payoff in one line, over the most concrete card (repo card / chat box).
2. Series card ("This is day N of …").
3. Name the thing (logo glow + big serif keyword).
4. Mechanism as phases on the persistent card: each phase = 1–2 sentences, top card reacts per word.
5. "And here's the *smart* part" → light chapter: the one clever idea.
6. Back to dark: practical tip / proof (bars, runs, numbers that are real).
7. CTA: follow + comment KEYWORD → DM sequence.

## Pitfalls
- Don't fill the empty space: the negative space IS the premium feel. Max 2 cards on screen.
- Don't make the progress card change every line; it moves only on phase boundaries.
- Serif italic is for 1–2 words per phrase, never whole sentences, never numbers.
- Keep the selection box on nouns/the keyword; serif italic on verbs/feelings.
