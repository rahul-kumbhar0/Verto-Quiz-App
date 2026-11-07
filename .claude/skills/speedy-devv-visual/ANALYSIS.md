# @speedy_devv — style analysis

Source: instagram.com/speedy_devv (191k followers, 290 posts), profile grid + reel pages read
through the user's Chrome on 2026-11-03, full captions of ~35 reels, post metadata of 3 reels
(DaDHL4vMsDt "Ornith-1.0", DZ9qoijMYnE "Qwythos 9B", DZyIee_sIoF "Vercel eve").
Bio: "I edit all my videos using my own tool" → getkeyframes.com (his private editor).

## The format

**Fully animated motion-graphics explainers. There is NO voiceover and NO talking head.**
Every reel checked uses a licensed music track ("INSONAMIA - Slowed" — Ronald Figo,
`original_audio: no`) — the same slowed, dark ambient track reused across reels, which makes the
whole account read as one product. All information is carried by on-screen text and diagrams,
staged beat by beat. The "voice" of the account is therefore typographic, not spoken.

## Canvas and layout bands (1080×1920)

- Background: near-black (#050608-ish), subtle vignette, fine film grain; occasionally a faint
  dot/particle field. Never a gradient, never a photo backdrop (photos appear only as cut-in
  product shots, e.g. a PS5 controller, with particles).
- y ≈ 120–330 — **command line**: a typed terminal prompt in monospace, e.g.
  `/full-visual explain how PS5 games run on a PC`, with a block cursor. His own tool's slash
  command is part of the aesthetic ("✳ Animating with /full-visual" appears on covers).
- y ≈ 330–560 — **headline**: large white type mixing a light serif (often italic, with a final
  period: "Let's design *Stripe*.") and heavy sans. ONE keyword gets a thin white outline box
  ("Take [10,000] photos") or an accent.
- y ≈ 560–1450 — **the stage**: the diagram. Signature piece: an isometric *exploded stack* of
  dark plates (AWS Card vault / Idempotency keys / Radar / Ledger / Redis / DocDB-MongoDB in the
  Stripe reel), each plate wired by a thin 1px line to a small monospace label on the side.
  Variants: 3D scatter clouds (PCA reel), dot-matrix/particle reveals, UI-card mockups.
- y ≈ 1500–1800 — **footer**: product logo or URL in monospace, later the CTA.

## Typography

- Serif (Georgia-like), light/italic for the emotive part of the headline.
- Heavy sans for the subject word.
- Monospace everywhere data lives: labels, commands, URLs, install one-liners
  (`ollama run hf.co/...`, `npx eve@latest init my-agent`).
- Color: white + 60% grey; ONE accent used sparingly; brand logos keep their own color.

## Motion grammar (the editing)

- Everything is keyframed to the music's beat (~84 BPM slowed): one idea lands per 2 beats.
- Plates of the stack fly in one at a time from below with an overshoot ease; the connector line
  *draws* outward, then the mono label *types* in. Build order = narrative order.
- Numbers never just appear: counters roll up ("82.4 SWE-Bench", "1,048,576 tokens").
- A slow permanent camera drift/float on the whole stage (nothing is ever static — his own
  anime.js reel: "You can spot an AI-built website in two seconds. It never moves.").
- Punch-ins on the keyword beat; keyword box pops on the beat.
- End card ≥ 3 s: "Save this if you …" + the link / COMMENT "KEYWORD" hook.

## Writing voice (captions and on-screen text)

- Hook = a strong claim in one sentence ("Vercel built Next.js for AI agents.").
- Body = `>`-bulleted hard facts: numbers, benchmarks, licenses, one-line install commands.
- CTA = "Save this if you …" or `COMMENT "X" to get the link`.

## What it is NOT

No voiceover, no talking head, no stock footage, no caption karaoke, no colorful gradients,
no emoji confetti, no more than one accent color, nothing that sits still.
