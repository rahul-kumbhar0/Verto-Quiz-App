# Voice: how canwe.ai sounds

**Casual, spoken, a friend who just found something useful.** Not a presenter, not a teacher,
not a LinkedIn post. The owner's own feedback that shaped this: "like human casual spoken, suppose
you are connected and you're just talking casually about this"; "reduce the script"; "say I
connected my Claude".

## Rules
- Spoken grammar: contractions (it's, I'll, don't), sentence fragments are fine ("Fully open
  source." "Honestly, crazy."), starters like "So", "Okay so", "And", "Now".
- One idea per sentence, 6–14 words. If you'd breathe mid-sentence, split it.
- "You" more than "I", except in a personal demo (A/F), where "I did → you can" is the arc.
- Every technical noun gets a ≤ 6-word plain gloss right after it: "an agent, AI that uses tools";
  "ATS, the software companies screen resumes with".
- Exact numbers with units, said the way people say them ("three million live jobs",
  "₹3.5 lakh"); `display.json` turns them into "3 million" / "₹3.5L" on screen.
- Indian context by default: lakh/LPA, TCS/Infosys/Wipro, NQT, Naukri/LinkedIn, Bangalore/Pune,
  placements, freshers, 2026 batch.
- Filler words ("basically", "literally", "honestly") max 2 per script; they make it human, more
  makes it noise.
- Humour: one line max, usually the reaction or the CTA's friend line.

## Pacing: fast, with hard stops (the "stop and speak" delivery)
Viral delivery = dense speech + sudden silence, not uniform speed. The winners talk fast and then
STOP for half a second on the turn. Write for it, then build it (`pace.py` in speedy-explainer-reel):
- **Burst sentences.** 3-8 words each around the stops. The line before a stop must land a punch
  ("One offer." / "$1,200 worth." / "Real fixes, not spam."), never trail off.
- **Where the stops go (4-6 per reel):** after the hook's twist / before every "But..." or "Then..."
  turn / after the biggest number / after the punchline / never inside an explanation.
- **Mark them in the package:** list the stop phrases in post-copy.md (they become `stops.json`).
- The voice take itself is sped ~6% and de-breathed in the build; don't write slower to compensate.

## Banned (the linter flags these)
AI-isms and presenter clichés: delve, unlock, unleash, elevate, harness, leverage, game-changer,
game changer, revolutionize, cutting-edge, seamless, robust, in today's video, in this video,
let's dive in, dive into, buckle up, without further ado, hey guys, what's up guys, welcome back,
smash that, don't forget to like, in conclusion, it's important to note, navigate the landscape,
the world of, realm, tapestry, testament, supercharge, 10x your, mind-blowing, insane (as filler),
you won't believe, secret hack, nobody is talking about this.
Vague intensifiers to replace with numbers: very, really (as intensifier), super, tons of, lots
of, huge, massive, amazing, incredible.

## Hinglish version (for a second post / Indian reach)
Keep English tech nouns and numbers, switch the connective tissue: "Bhai, maine apna poora job
search automate kar diya. Ek free GitHub repo se." Keep it natural Hinglish (how a Bangalore
fresher talks), not translated Hindi. Same keyword in English. The voice model must be one that
handles Hinglish; generate a separate take.
