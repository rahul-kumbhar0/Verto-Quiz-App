---
name: reel-script-writer
description: "Writes the script for an Instagram Reel / YouTube Short that is built to win: picks the archetype for the goal (reach, followers, comment→DM leads, sales), writes 10 hooks from proven formulas and scores them, builds a retention spine, writes the spoken lines in a casual human voice, picks one ending/CTA, lints it (length, hook speed, banned AI-isms, CTA keyword), and packages script + 3 trial-reel hook variants + on-screen hook text + cover text + caption + hashtags + pinned comment + YouTube title. Grounded in an analysis of 40 top-performing 2026 reels (#aitools, #claudeai, #jobsearch, #techexplained) and our own results. Use for 'write a reel script', 'script for this topic', 'make the hook better', 'improve this script', 'what should the CTA be', 'caption for this reel', before any speedy-explainer-reel build, or when the user approves a topic and wants the script."
---

# Reel script writer

The script decides the reel. This skill turns a topic into an approved, lint-clean script and the
whole post package. It is format-neutral, but its output drops straight into
`speedy-explainer-reel` (same `[box]` / `*bold*` / `{pose}` markup).

Read once per session: `references/research.md` (what the winners do, with numbers),
`references/hooks.md` (the formula library), `references/structures.md` (beat sheets),
`references/endings.md`, `references/voice.md`. `references/our-reels.md` is the log of what
worked on OUR page; it outranks general research when they disagree.

## 0. Brief (ask nothing you can infer; ask once for what you can't)
Fill this in `brief.md` before writing a word:
- **Topic + the one thing the viewer should walk away with** (one sentence).
- **Goal** (pick ONE): `reach` (views + shares from non-followers) · `follow` (followers) ·
  `leads` (comments → DM → guide; the default for canwe.ai) · `sale` (paid product).
- **Audience**: default canwe.ai = Indian students, freshers and early-career techies, AI-curious,
  English with an Indian ear. Note if Hinglish.
- **Freebie + keyword** (goal leads/sale): what the DM gives, the ONE keyword (short, on-topic,
  CAPS: JOBS, AGENT, SALARY), and the guide URL.
- **Proof asset**: what we can SHOW (a demo, a screen recording, a number, a repo, a news source).
  No proof → no "I did X" claim.
- **Facts** with sources (`facts.md`): every number, name, date. Nothing invented.

## 1. Pick the archetype (`references/structures.md`)
| Goal | Best archetype | Why (research.md) |
|---|---|---|
| leads | **A. Demo → keyword** ("I turned Claude into…", show it working, Comment X) | comment-gated reels get comments ≈ 0.3–2× likes |
| leads | **C. Resource list → keyword** ("5 free Claude plugins…", Comment X for links) | top #aitools format, 3–7M views |
| reach / follow | **B. Curiosity explainer** (paradox → mechanism → payoff → question) | #techexplained winners: 1–8M views, saves/shares |
| reach | **D. News + what it means** ("OpenAI just…" / "Someone just open-sourced…") | freshest winners (≤ 7 days) |
| follow | **E. Myth-buster** ("Bots don't reject your resume. Here's what does.") | contrarian + useful |
| leads | **F. Result story** ("10 days. 3 offers. No referrals. Here's the message.") | proof first, copy-paste value |
Hybrid is our house style: a B/E body (explainer) with an A/C ending (keyword → DM).

## 2. Hook lab (the first 1.5 seconds)
Write **10 hooks** using **at least 5 different formulas** from `references/hooks.md`. For each,
write the spoken line AND the frame-1 on-screen text (≤ 7 words; can differ from the spoken line).
Score each 0–2 on six criteria (max 12) in a table:
1. **Specific** (a number, a name, a tool, a place; not "this AI tool")
2. **Stakes for THIS viewer** (job, money, time, marks, career; "you/your")
3. **Curiosity gap** (opens a question the next 5 s answers; never closes it in the hook)
4. **Fast** (spoken ≤ 12 words / ≈ 3 s; the payoff noun in the first 6 words)
5. **Showable** (frame 1 can SHOW it: a demo, an object, a number in a box)
6. **True** (we can prove it on screen; no fake "I got 12 interviews")
Pick the top scorer for the main reel and the next 2 (different formulas) as **trial-reel
variants**. Any hook scoring 0 on "True" is deleted, whatever its total.

## 3. Spine (retention)
Fill the archetype's beat sheet from `structures.md` with timings. Rules that hold everywhere:
- **Value by second 5**: the demo starts, the first item lands, or the paradox is stated.
- **A new beat every 2–3 s**, something said AND shown; an **open loop** or pattern interrupt every
  ~8 s ("but here's the catch", "and that's not even the crazy part", a theme flip).
- **One idea per sentence, 6–14 words**; the payoff restates the hook as the answer.
- **Proof before the ask**: the keyword CTA comes only after the viewer has seen it work.
- Length by goal: leads 25–45 s, reach 30–60 s, explainers ≤ 75 s. Pace: our ElevenLabs v3 voice
  (Shlok) measures ≈ 3.0 words/s (125 words = 41.5 s); the local voice-studio ≈ 2.6. Words =
  seconds × pace. Under 60 s for Reels + Shorts unless the user asks.

## 4. Write the lines (`references/voice.md`)
Casual, spoken, human: like telling a friend over chai, not a presenter reading. Contractions,
"so", "honestly", "basically" (sparingly), "you". Indian English rhythm is fine; no slang that
needs a dictionary. Each technical noun gets a ≤ 6-word plain gloss right after it. Exact numbers
with units. No AI-isms (banned list in voice.md). Read it aloud in your head at ~3 words/s: if a
sentence makes you breathe in the middle, split it.

## 5. Ending (`references/endings.md`)
ONE primary CTA, chosen by goal, in the last 4–6 s:
- leads/sale: **"Comment KEYWORD and I'll DM you the <specific thing>."** (+ "follow so the DM
  lands" only if the automation has the follow gate on)
- reach: an easy comment question ("Which one surprised you? Drop the number.") or a
  save-for-a-moment line ("Save this for your next interview.")
- follow: series promise ("Part 2 tomorrow: …") or a share line naming a specific friend.
The keyword appears in: the spoken CTA, frame text at the end, caption line 1, pinned comment,
and the DM automation. Nowhere else may a second keyword compete.

## 6. Lint (must pass)
```bash
python3 <this skill>/scripts/script_lint.py script.md --goal leads --keyword JOBS --max 45   # --wps 2.6 for voice-studio
```
Calibration: our proven scripts (freehire, agent v2, salary, referral) pass; a 15-word hook or a
46 s lead reel fails.
Checks: estimated duration, hook length and payoff position, sentence lengths, banned phrases,
vague words, numbers present, "you" vs "I" balance, CTA keyword present once in the CTA, one CTA
only, markup balance for the speedy pipeline. Fix every ERROR; justify any WARN you keep.

## 7. Package (deliver in one message, then wait for approval)
Write `post-copy.md` (template in `references/endings.md` § Package):
1. `script.md` in speedy markup (`[box]` one per ~6 words, `*bold*`, `{pose}`)
2. Hook table (10 scored) + the chosen hook + 2 trial-reel variants (spoken + frame-1 text)
3. Cover text (≤ 6 words, keyword in the selection box), frame-1 on-screen text
4. Instagram caption: line 1 = hook or "Comment KEYWORD…", 60–120 words, numbered value,
   honesty/credit line, a `[keywords: …]` search block, 3–5 hashtags; pinned comment
5. YouTube Shorts title (≤ 60 chars, curiosity + keyword) + description + pinned comment
6. DM keyword + what the DM sends (for the DirectApply automation) 
Show the user: the chosen hook, the 2 variants, the script, and the estimated length. Iterate on
feedback ("shorter", "more casual", "say I connected Claude") by editing lines, re-linting, and
re-showing only what changed.

## 8. Learn (after posting)
When the user shares results (views, comments, follows, shares, DMs, avg watch time), add a row to
`references/our-reels.md` with the archetype, hook formula and numbers, and one lesson. Before
writing the next script, read that table: repeat what beat the page average, drop what didn't.

## Files
- `references/research.md` — 40 top reels analysed (Oct 2026): archetypes, hook types, comment
  ratios, caption patterns, endings, with links
- `references/hooks.md` — 18 hook formulas with real examples, when to use, our adaptation
- `references/structures.md` — beat sheets for archetypes A–F with second-by-second timings
- `references/endings.md` — CTA library by goal, keyword rules, loop endings, the package template
- `references/voice.md` — canwe.ai voice, gloss rule, banned AI-isms, Hinglish notes
- `references/our-reels.md` — our scripts and results (the learning loop)
- `scripts/script_lint.py` — the linter (no dependencies)
- `examples/career-ops/` — a complete worked run (brief, 10 scored hooks, script, caption, YouTube, DM)
