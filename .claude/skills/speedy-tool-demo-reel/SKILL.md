---
name: speedy-tool-demo-reel
description: "Preset of speedy-explainer-reel for canwe.ai's BEST-performing format: 'I connected / automated / gave Claude X' — a first-person tool demo (repo, connector, MCP, prompt, app) for Indian students and freshers that ends in 'Comment KEYWORD and I'll DM you the setup'. 38–48 s, proof in the first 3 s, 3–4 rapid proofs with real numbers, an honest catch, a keyword → DM → guide page funnel. Also covers the LIST variant ('5 apps that plug into Claude'). Use for 'I automated my X with Claude', 'connect X to Claude', 'free repo/tool reel', 'MCP reel', 'prompt reel', 'JOBS/LINK/GROW style reel', or any tool/resource reel meant to get comments and DMs."
---

# /speedy-tool-demo-reel

Load and follow `speedy-explainer-reel` (setup → research → script → animatic → voice → render → deliver)
with these format rules. This is the format behind our top reels (Oct–Nov 2026, `canwe-ai/RECORD.md`):
JOBS freehire (711 DMs, 554 guide clicks), GROW (57 DMs in 5 h), LINK, PROMPT, OFFER, SALARY.
Pure concept explainers (AGENT, TOKENS) got ~0 comments: if the topic has no tool or result, use a
different preset or give it a job/money stake.

## Story spine (38–48 s, ElevenLabs Shlok ≈ 3.0 w/s → 110–135 words)
1. **Hook (0–3 s): first person + the result, payoff noun in the first 6 words.**
   "I automated my entire job search." · "I connected Claude to my LinkedIn. Don't copy me yet."
   · "I asked Claude which ONE skill gets me the most jobs." Frame 1 already SHOWS the proof (the tool
   running, the number, the result card) — no logo intro, no "hey guys". Never "Okay so…" (RESUME lost
   its first seconds to that).
2. **The input line (3–8 s):** the exact thing you typed/did ("find me Python internships in
   Bangalore") on a 3D chat/terminal card. Specific > clever.
3. **3–4 rapid proofs (8–30 s), each = one phrase + one visual change + one real number:**
   "3.3 million live jobs" · "same job on three sites shows up once" · "ghost jobs flagged". Whip pan
   between proofs (`R.fx.whip`), odometer on every number (`R.fx.odometer`), sheen on each card.
4. **The held-back wow (≈ 30 s):** the best feature last ("and when I open one, it fills the form")
   — zoom-through into it (`R.fx.zoomThrough`) + flash on the payoff word.
5. **The honest catch (5–7 words) + trust line:** "It never hits submit. You review it." · "LinkedIn
   bans automation, so here's the zero-risk way." · "Open source. Not sponsored." Own products and
   partner tools are DISCLOSED here ("our own app", "DirectApply = our DM tool"). On LINK the catch
   WAS the hook and it outperformed — use it as a hook when the risk is real.
6. **CTA (last 5–6 s, house sequence):** "Comment KEYWORD and I'll DM you <the exact thing>." →
   comments sheet, keyword typed, posted → DM drops in ("Sent! Check your DMs") → end card.
   Keyword = one CAPS word naming the payoff (JOBS, SKILL, LINK, PROMPT, NQT, REEL). Add "follow" only
   when the automation has the follow gate on.

**LIST variant** ("5 apps that plug into Claude", MCP reel): hook = the most surprising item
("Claude can now order Zomato."), then 3–5 items × (logo + 1-line what + ≤5-word catch), whip between
items, counter "3/5" on the rail, the CTA promises the setup for ALL items.

## Edit plan (references/advanced-editing.md — read it)
- Signature shot in 0–3 s = the proof itself in 3D (the job list streaming, the DM firing, the
  number rolling) with the camera pushing in (`R.fx.cam`, drift on).
- Transitions: whip between proofs, zoom-through into the held-back wow, flip for "but here's the
  catch" (front = the shiny result, back = the catch), flash + shake on the biggest number.
- Persistent running example: the user's input stays pinned (strip under the rail) while proofs
  change below it.
- Music `"style":"pulse"`, hook dry until the first proof lands; `MBLUR=3` final render.
- Rail chapters = HOOK · SETUP · PROOF · CATCH (or the list items); counter = the headline number.

## Funnel checklist (do ALL before saying "done")
1. Guide page `canwe-guides.vercel.app/<slug>/` (setup steps, copy buttons, the catch, FAQ) — deploy
   by the Vercel upload method in RECORD.md, verify with web_fetch.
2. DirectApply automation: keyword (any), DM text with {name}, button, 5 public replies, follow gate as
   the reel promised, created **OFF** and with `reels: all` until posted → on "uploaded" lock it to the
   media id and switch it on.
3. `post-copy.md`: caption line 1 = "Comment KEYWORD and I'll DM you…", numbered value, honesty line,
   `[keywords: …]` block, 3–5 hashtags, pinned comment, YouTube title/description/pinned link.
4. RECORD.md row + `reel-script-writer/references/our-reels.md` row (fill numbers after posting).

## Checks specific to this format
- The hook is something only WE can say truthfully ("I did X") or a sourced number — never a fake
  personal result (hooks scoring 0 on "True" are deleted).
- Every proof number is sourced in `facts.md` (repo README, live API pull with date, official docs).
- The catch is spoken, not only in the caption.
- One keyword only; it appears in the spoken CTA, end card, caption line 1, pinned comment, automation.
- Length ≤ 48 s; the keyword is said before 45 s.

## Brand
canwe.ai house brand (mascot logo, our presenter looks: classic magenta for meta/Instagram reels, Claude
orange hoodie for Claude tools, grad cap only for the Learn AI series).
