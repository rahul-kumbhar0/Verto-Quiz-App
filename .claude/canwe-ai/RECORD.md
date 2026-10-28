# canwe.ai: the running record (read this first)

Everything a new Claude session needs to continue the @canwe.ai content work. Update it at the end
of every session (reels posted, automation changes, results, decisions). Last updated: 28 Oct 2026.

## The brand
- **Instagram:** @canwe.ai (account id 17841462296118299). Also posts to YouTube Shorts.
- **Audience:** Indian students, freshers and early-career techies; AI, jobs and tech explained.
- **Logo:** the mascot (option B) is the ONLY canwe.ai logo, used everywhere: profile pics, DM avatars in
  reels, cover brand mark, guide pages, favicons. File: `.claude/skills/speedy-explainer-reel/assets/brand/canwe/`.
- **Owner's other channels:** a 100K YouTube channel (old serial-image content, unused) and a 25K gaming
  channel (unused). Both unmonetized. Decided not to post canwe.ai content there for now.

## How we make reels (house rules)
- **Script:** `.claude/skills/reel-script-writer` (10 scored hooks, archetype by goal, lint, full post
  package). **Build:** `.claude/skills/speedy-explainer-reel` (cartoon presenter, captions, 3D props).
- **Voice:** ElevenLabs **eleven_v3**, voice **Shlok** (voice_id `2i7LhYjvw41fgbcqlf3Z`), ONE take,
  `estimate_only` first, keep credits low. **Never eleven_v4.** ≈ 700 credits per 40-s reel.
- **Length:** under 60 s (Reels + Shorts). Lead reels 25–45 s. Measured pace ≈ 3.0 words/s.
- **Tone:** casual, spoken, human ("like telling a friend"), short; say "I connected Claude" style.
- **Every reel ends with** "Comment KEYWORD" → DM automation → a guide page.
- **Real logos** for every brand named on screen (`scripts/brand_logos.mjs`), never emojis.
- **3D exploded view + lens** for any "what's inside / what it makes" beat; **process steps, analogy split, zoom-through, bar chart** for how-it-works / beginner ideas / scale / numbers (table in speedy-explainer-reel references/props3d.md).
- **Pacing (always, from 28 Oct):** `tools/pace.py` after align: 4-6 hard stops (~0.55 s) + speech
  sped 1.06x; stops after the hook twist / before "But..." / after the punchline; music break over the
  biggest stop. Topic picking: CHORE x CLAUDE x FREE scored 0-6 (reel-script-writer research.md).
  Queued next: cleanyourtv TV reel (keyword TV), WhatsApp+Claude (lharries/whatsapp-mcp, 6.8k stars).
- **Presenter is auto-directed** + auto reactions (💡 ??? 💧 ✨ 💨), shades-slide gag on shocking numbers, props in hand, signature flip / double-thumbs, outfit per topic.
- **Presenter (detail)** (`poses: "auto"`): moves + expressions follow the words; pin with `{pose}` only where needed.
- **Presenter look changes per reel** (street default, classic blue for referral, purple hoodie for
  agent, orange tee for career-ops). Avoid the single-finger "one" pose on covers (reads as rude).
- **Posting:** ONE reel a day, 7–9 pm IST. Wait ~24 h after a reel that is taking off. Trial reels
  for extra posts. Share trial reels to followers once they prove themselves.
- **Ask before installing anything on the owner's machine.** No PRs unless asked.

## DM automations (DirectApply_DM MCP, account "canwe.ai")
The flow: create automation OFF on "all reels" → owner posts and says "uploaded" → lock it to the reel's
media_id (`list_reels`), dry-run test, turn ON. All use follow gate + once per user.
| # | Keyword(s) | Reel | Guide | State (27 Oct) |
|---|---|---|---|---|
| 17 | JOBS / job | freehire (media 18118709285050879) | /freehire/ | ON, locked |
| 18 | RESUME / cv | resume ATS myth (media 18191424364417334) | /resume/ | ON, locked |
| 19 | SALARY | salary bands (media 18120356209948673) | /salary/ | ON, locked |
| 20 | REFER | referral from a stranger | /refer/ | OFF (not posted yet) |
| 21 | AGENT | what is an AI agent v2 | /agent/ | OFF (not posted yet) |
| 23 | OFFER / offers | career-ops (740 jobs, 1 offer) (media 18082004081378019) | /career-ops/ | ON, locked (seen 28 Oct) |
| 24 | PROMPT / prompts | one prompt → which jobs you fit | /prompt/ | OFF (not posted yet) |
| 26 | OSS (exact) | Claude Max free for open source | /oss/ | OFF (not posted yet; on lock switch match to "any" like #17–#19) |
(#22 and #25 do not exist on this account.) Email capture is available but OFF everywhere (idea: turn on to
build a buyer list).

## Guide site (Vercel)
- Live: **https://canwe-guides.vercel.app** (project `canwe-guides`, team `team_6Xaw8O6MfjFggwU7zLunNZOO`,
  SSO protection disabled). Pages: /, /freehire/, /resume/, /salary/, /refer/, /agent/, /career-ops/, /prompt/, /oss/.
- Source: `.claude/skills/speedy-explainer-reel/assets/brand/canwe/guide-site/`.
- Deploy gotcha: every deploy must send ALL files inline (utf-8). SHA references fail with
  `missing_files`, and a redeploy via `deploymentId` drops unsent files. Verify with `web_fetch_vercel_url`.
- Web Analytics is NOT enabled (owner must click Enable in the dashboard; then add the script).

## Reels: status and results
| Reel | Keyword | Status | Results |
|---|---|---|---|
| AI interview detection | (none) | posted 25 Oct | ~1.8K in trial |
| freehire job search | JOBS | posted 26 Oct (trial → shared) | 11K day 1 → 31K day 2; 613 comments, 379 DMs, 277 unique guide clicks |
| Resume ATS myth | RESUME | posted ~27 Oct | (ask) |
| Salary bands | SALARY | posted ~27 Oct | (ask) |
| Referral from a stranger (blue look) | REFER | ready, not posted | |
| What is an AI agent v2 (hoodie, demo-first) | AGENT | ready, not posted | |
| career-ops: 740 jobs, 1 offer (orange tee, v2 auto presenter) | OFFER | posted (automation #23 is ON and locked) | (ask) |
| One prompt: which jobs you fit (green hoodie + grad cap, eyes-pop gag) | PROMPT | ready, not posted | |
| Claude Max free for open source (GitHub-dark hoodie + headset, 48 s v2 stop-and-go paced, 779 credits) | OSS | ready, not posted (post TODAY, news decays; use the v2 files) | |
Scripts/scenes for each: `.claude/skills/speedy-explainer-reel/assets/examples/<reel>/`.

## Stories
| Story | Status | Notes |
|---|---|---|
| 1,000 followers (28 Oct): thank-you counter · 4 reels coming (keywords) · "you pick the next reel" poll | made, sent to owner | link sticker → canwe-guides.vercel.app; poll: free AI tools for placements / coding interview hacks / how ChatGPT actually works / side income with AI. Files: `assets/examples/story-1k-followers/` |
Results log for learning: `.claude/skills/reel-script-writer/references/our-reels.md`.
**Rendered MP4s are NOT in git** (too big): they live in the session container and were sent to the
owner in chat. Rebuild from the example folder + a new voice take if needed.

## Money ideas (researched 27 Oct, not started)
Top pick: a Claude "Job Hunt Skill Pack" (₹199) or "AI Job Hunt Kit" (₹149), plus a ₹99 live workshop to
test demand. Payment via Topmate or Razorpay Payment Pages (owner's KYC). Avoid selling HR email lists
(privacy law risk). Full list in the chat of 27 Oct.

## Open to-dos
- Post OSS (first: time-sensitive), referral, agent, prompt; on "uploaded" lock #26 / #20 / #21 / #24.
- Ask the owner for Insights numbers (views, follows, saves) for every posted reel → our-reels.md.
- Enable Vercel Web Analytics (owner click) → add the tracking script to the guide pages.
- Decide on the first paid product.
- 1K story poll: after 24 h ask the owner for the winner → it becomes the next reel (run reel-script-writer);
  post a result slide ("You picked X. Dropping <day>.").
