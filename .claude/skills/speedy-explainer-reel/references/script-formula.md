# Writing a SPEEDY script (the part that decides whether the reel works)

Length: 60–160 s. Pace ≈2.6 words/s → 150–420 words. Both reference reels are long for Reels and
hold because every 2 seconds something new is said AND shown. If you cannot show it, cut it.

## 1. Pick the format
| Format | Opening | Spine | Preset skill |
|---|---|---|---|
| **Hidden mechanism** — an invisible thing inside a product people use daily | a paradox in physical terms ("Every key … is smaller than your thumb, and you still hit the right letter") | mechanism → running example → history/credibility → second trick → recap | `speedy-hidden-mechanism-reel` |
| **System design** — how a product/tool is built | "Let's design X." + what X gives you in one sentence | chapters on a rail, one per component, with a running example and a live counter | `speedy-system-design-reel` |

## 2. Beat sheet (fill every row; a row with no visual gets cut)
| # | Beat | Lines | Stage | Presenter |
|---|---|---|---|---|
| 0 | Hook (0–3 s) | the paradox / "Let's design X." | cinematic hero: magnified prop or exploded stack + one mono stat | hidden |
| 1 | Promise | "So how is that possible?" / "Let's build a chat app on it." | the running example appears (phone, app) | shrug / explain |
| 2…n | Chapters | "First, the X." "Next, the Y." "Then, Z." | ONE hero object per chapter, re-labelled per sentence | point at stage on the first sentence; a reaction on the consequence |
| n+1 | Credibility | named person + artefact (book, patent) or exact numbers | photo+role card, cover+year, patent page, dimension callouts | present / one |
| n+2 | Stress test | "Now imagine your app goes viral." | matrix filling to the cap, red error | hands on head |
| n+3 | Recap | one breath: "So X is A plus B. C does D. One journal powers E, F and G. All so you never ___." | rack stacking bottom-up | thumbs up |
| n+4 | CTA (5–6 s) | "Follow for more breakdowns, and share it with the friend who ___." | profile card + finger tap → share sheet / DM | point at camera → wave |

## 3. Sentence rules (what makes it sound like the reference)
- Second person, present tense, one idea per sentence, 6–14 words.
- Every technical noun gets a gloss of ≤6 plain words right after it, in apposition: "an EC2
  instance, a computer Amazon rents out"; "an isolate, a sealed sandbox".
- Name → what it is → what it does in the example → consequence. Never skip the consequence.
- Numbers are exact with units and appear once each: "44 pixels", "320 pixels wide", "229 ms",
  "every two minutes", "stops at 500". No "lightning fast", no "massively".
- Chapter openers are two words + a noun. Transitions are "So", "Then", "Now imagine".
- The running example has names (Sofia, Mei, #weekend-trip, "dinner tonight?") and its state
  advances: a message is sent, a photo is shared, a user in Tokyo loads the chat.
- Humour lives only in the CTA punchline and in one reaction pose; the body is dead serious.
- The last sentence before the CTA restates the hook as the answer: "Your iPhone is quietly
  guessing the key to where your thumb was about to land."

## 4. Emphasis markup (one pass, before timings exist)
Write `script.md` with `[word]` for the boxed keyword and `*word*` for bold:
- ONE `[box]` per caption page (≈ every 5–8 words): the noun/number/verb that carries the idea,
  product names on first mention, every number, the CTA verbs `Follow` / `share`.
- `*bold*` on 1–2 words per page: verbs of mechanism (checks, signs, replays), structure words
  (First, Next, Then, So), the subject noun. Everything else stays grey.
- Keep quotes on quoted tokens (`["time"]`), merge numbers in `display.json` so `10,000` is one
  token, and put an emoji inline only if it IS the object (👍 before thumb, 📘 before book).
`scripts/mark_script.py script.md` strips the markup into `narration.txt` and writes `emph.json`
(`{"box":[…],"bold":[…]}`, with `#n` suffixes for repeated words) ready for `R.speedy({emph})`.

## 5. Pose markup (optional, same file)
Add `{pose}` after a phrase to pin a presenter pose: `So how is that {shrug} possible?`
`mark_script.py` also emits `poses.json` (`[["phrase","pose"],…]`) that the template turns into
`[[at("phrase"),"pose"],…]`. Without markup, follow the table in `avatar.md`: point at the stage on
each chapter opener, a reaction on each consequence, thumbs up on each payoff, ~every 2 s.

## 6. Footnotes (the honesty line)
Every time the visual exaggerates (magnified, zones drawn visible, schema simplified, hit rate
illustrative, numbers from a public source not the vendor's own), write the footnote in the beat
sheet. Viewers of this genre notice; the footnote is part of the credibility.

## 7. Checklist before timing
- [ ] Hook names a physical paradox or "Let's design X" within the first 6 words
- [ ] A running example with a name, whose state advances at least 3 times
- [ ] Every chapter: name → gloss → example → consequence
- [ ] ≥ 4 exact numbers with units; ≥ 1 credibility artefact
- [ ] A "Now imagine" stress beat and a one-breath recap
- [ ] CTA punchline tied to the topic; handle is the user's real one
- [ ] One `[box]` per page, nothing invented, footnotes written
