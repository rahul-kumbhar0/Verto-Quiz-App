---
name: speedy-system-design-reel
description: "Preset of speedy-explainer-reel for the 'Let's design X' format: a 2–3 minute architecture walkthrough of a product/tool (Supabase, Vercel, Stripe, Redis, your own app) as chapters on a progress rail (SERVER · API · SECURITY · STORAGE · LIVE · BACKUP · FUNCTIONS · VIRAL), a running example app whose live counter ticks, dark/light chapter flips, a 'now imagine it goes viral' stress test, a recap rack and 'share it with the friend whose… has no RLS'. Use for 'let's design X reel', 'system design breakdown', 'how X is built under the hood', 'architecture explainer reel', 'speedy devv supabase style'."
---

# /speedy-system-design-reel

Load and follow `speedy-explainer-reel` (setup → research → script → animatic → voice → render →
deliver) with these format rules. Reference: `references/example-scripts.md` §B and
`references/ref-frames/supabase-reel-contact-sheet-*.jpg` in that skill.

## Story spine (8–10 chapters, 120–160 s, ≈2.8 w/s)
1. **Hook (0–2.5 s, no presenter, dark)**: "Let's design X." over the product's exploded stack —
   build it with `R.stack` + `R.rays` + `R.rings` + `R.callout` + `R.bolt` (references/props3d.md;
   copy assets/examples/supabase-hook/): bokeh backdrop, discs rise and SPLIT into labelled
   layers, the brand glyph pops with a glow, ONE sourced mono stat counts up during the hook.
2. **What it is (light, 1 sentence)**: "X gives you A, B and C without D." + "Underneath it's
   <provider>, with X's own software on top." Then the promise: "Let's build a <running example>
   on it."
3. **Chapters on the rail**, each: two-word opener ("First, the database." "Next, the API."
   "Then, security.") → the component's real name → gloss in ≤6 words → what it does for the
   running example → consequence. The hero object is the SAME box/server re-labelled, or one
   card per component. The example's state advances (a message sent, a photo shared, a user far
   away loads it) and the **live counter** ticks on that word.
4. **Credibility**: the real languages/vendors in passing ("a small Go server", "written in
   Elixir", "WAL-G copies it to S3 every two minutes") — exact, sourced, never praised.
5. **Stress test (dark)**: "Now imagine your app goes viral." — the connection matrix fills to
   the real limit, goes red with the real error string, then the component that solves it.
6. **Recap (dark)**: the rack stacks bottom-up while one breath lists every chapter: "So X is
   <provider> plus its own layer. A runs B and C writes the API. D and E guard every row. One
   journal powers F, G and H. All so you never write a backend."
7. **CTA (light, 5–6 s)**: "Follow for more breakdowns, and share it with the friend who
   <topic-specific flaw>." Profile card → finger taps Follow → share sheet with one friend
   selected → the joke card in the message (`users · 2,184 rows · RLS Unrestricted`) → Send.

## Template configuration
```js
chapters: [{label:"server",at:T.server},{label:"api",at:T.api},{label:"security",at:T.sec},{label:"storage",at:T.files},
           {label:"live",at:T.live},{label:"backup +\\nreplica",at:T.backup},{label:"functions",at:T.fn},{label:"viral",at:T.viral,end:T.cta}],
counter: {unit:"messages", steps:[[at("returns your messages"),1042],[at("sends a chat photo"),1045],[at("each new message"),1047],[at("goes viral"),183,"connections"]]},
light: [[T.what,T.server],[T.api,T.sec],[T.live,T.backup],[T.replica,T.fn],[T.cta,999]],   // alternate; the stress test + recap stay dark
```
Stage components per chapter (3D props: `references/props3d.md` + copy `assets/examples/supabase-hook/`; flat cards: `references/components.md`): server box + chip card; code card
"what you'd normally write" (file name + line count); translator pipe URL → SQL; sign-in phone →
Auth card → token segments → filtered rows; bucket card + object row + signed-link pill with
expiry; journal pad + table + fan-out to phones; globe/latency table; function cards (push /
charge / AI) with sandbox labels; matrix + pooler ring + user scatter; rack; IG CTA.

## Checks specific to this format
- Every rail label is spoken as a chapter opener and appears in the recap.
- The counter's unit changes at most once (messages → connections) and every tick is on a word.
- The product's own terms are used exactly (PostgREST, RLS, write-ahead log, isolate, pooler);
  each gets its gloss the first time only.
- Footnote when a limit is a default, not a hard cap ("500 = Postgres default max_connections").

## Brand
For the canwe.ai account, follow "House brand: canwe.ai" in `speedy-explainer-reel/SKILL.md` (mascot logo everywhere).
