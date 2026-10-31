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
| 27 | TV (exact) | cleanyourtv: delete your TV's ads | /tv/ | OFF (not posted yet; same lock flow) |
| 29 | GROW (exact) | Claude runs my Instagram (skills pack) | /grow/ | OFF (not posted yet; same lock flow) |
| 35 | LINK (exact) | Learn AI Engineering · Day 1: every word AI writes is a guess — FINAL = 3D rebuild (reels/ai01v4: v1 voice + script, 3D token slab/laser split, number skyline, isometric next-token bars, pulse music; 47 s, no new credits) | TOKENS | ready, not posted — SERIES pilot | |
| Claude can now order Zomato: 5 apps on MCP (hoodie Claude-orange, 41.7 s, 3D cubes + packet flows, per-app chat demos labelled "sample", USB-port analogy, 625 credits) | MCP | ready, not posted | |
| Docxify: 4 MB photo vs 20 KB form (hoodie indigo, 49.8 s, 3D press + exploded teardown, 665 credits) | PDF | ready, not posted — FIRST OWN-PRODUCT reel (installs loop); disclosure spoken + on screen | |
| Claude + LinkedIn (linkedin-mcp) | /link/ | OFF (not posted yet; same lock flow) |
| 38 | PDF (exact) | Docxify — OUR OWN app (exam sizes + resume <200 KB) | /pdf/ | OFF (not posted yet; same lock flow) |
| 42 | TOKENS (exact) | Learn AI Engineering · Day 1 (tokens → numbers → next-token prediction) | /ai/day-1/ | OFF (not posted yet; same lock flow) |
| 41 | MCP (exact) | "Claude can now order Zomato" — 5 apps on MCP (Zomato, Swiggy, Zerodha, MoSPI, Gmail) | /mcp/ | OFF (not posted yet; same lock flow) |
(#22, #25, #28 and #30-34 do not exist on this account.) Email capture is available but OFF everywhere (idea: turn on to
build a buyer list).

## Guide site (Vercel)
- Live: **https://canwe-guides.vercel.app** (project `canwe-guides`, team `team_6Xaw8O6MfjFggwU7zLunNZOO`,
  SSO protection disabled). Pages: /, /freehire/, /resume/, /salary/, /refer/, /agent/, /career-ops/, /prompt/, /oss/, /tv/, /grow/, /link/, /pdf/, /mcp/, /ai/ (series hub), /ai/day-1/.
- Source: `.claude/skills/speedy-explainer-reel/assets/brand/canwe/guide-site/`.
- **Our-apps promo (live 31 Oct, all pages):** a block injected by `copy.js` above the follow card
  (styles: `.apps` in `style.css`), promoting the owner's own Android apps by CanWe.tech:
  **Docxify: 300+ PDF Tool Offline** (`com.docxify.app` — resume <200 KB, exam-form photo/signature
  sizes, 500+ conversions, offline/private, ads+IAP ₹199–2,999) and **8XDL: Secure Download Manager**
  (`com.codex.torrentx` — private browser + download manager + media player, 4.8★, 5K+ downloads,
  ads+IAP ₹100–500). One edit in copy.js updates every current and future page. Real Play Store app icons (user-provided)
  live at `/apps/docxify.png` + `/apps/8xdl.png` (source `guide-site/apps/`, quantized small PNGs;
  titles match the store listings exactly). Labeled honestly
  ("OUR APPS · MADE BY THE SAME TEAM" + ads/IAP note). Docxify is a 6/6 formula topic for its own
  reel later (first own-product monetization loop; could pair with Stirling-PDF topic #2).
- Deploy gotcha: every deploy must carry ALL files. Two working ways per file: inline
  (`{"file","encoding":"utf-8","data"}`; binary needs base64 and is easy to corrupt in a tool call) or
  `upload_file` (base64 + `xVercelDigest` sha1 + `contentLength`; server VERIFIES the sha, so corruption
  is caught) then reference `{"file","sha","size"}` in create_deployment. Both forms can be mixed in one
  deploy. Files sent inline in an earlier deploy are NOT reusable by sha (missing_files); only
  upload_file'd blobs are. Uploaded so far (reusable by sha): style.css, copy.js, logo.svg, apps/*.png, index, pdf, prompt, mcp, link, grow, tv, ai, ai/day-1 (always re-upload index.html after editing it; its sha changes). Still inline each deploy: oss, freehire, resume, salary, refer, agent, career-ops. A redeploy via `deploymentId` drops unsent files. vercel.app is
  network-blocked for curl in-session; verify with `web_fetch_vercel_url`.
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
| Claude Max free for open source (GitHub-dark hoodie + headset, 48 s v2 stop-and-go paced, 779 credits) | OSS | ready, not posted (use the v2 files) | |
| cleanyourtv: TV ads deleted by Claude (dark-red tee, 46 s paced, 736 credits; topic bank #1, 6/6) | TV | ready, not posted (post FIRST: wave decays) | |
| Claude runs my Instagram (IG-magenta classic look, 49 s paced, 789 credits; meta reel, topic #6 + instagram-agent-skill 3.6k ⭐) | GROW | ready, not posted (post next) | |
| Learn AI Engineering · Day 1: every word AI writes is a guess — FINAL = 3D rebuild (reels/ai01v4: v1 voice + script, 3D token slab/laser split, number skyline, isometric next-token bars, pulse music; 47 s, no new credits) | TOKENS | ready, not posted — SERIES pilot | |
| Claude can now order Zomato: 5 apps on MCP (hoodie Claude-orange, 41.7 s, 3D cubes + packet flows, per-app chat demos labelled "sample", USB-port analogy, 625 credits) | MCP | ready, not posted | |
| Docxify: 4 MB photo vs 20 KB form (hoodie indigo, 49.8 s, 3D press + exploded teardown, 665 credits) | PDF | ready, not posted — FIRST OWN-PRODUCT reel (installs loop); disclosure spoken + on screen | |
| Claude + LinkedIn (LinkedIn-blue street look, 46 s paced, 710 credits; linkedin-mcp-server 4.1k ⭐; honesty = ban warning + zero-risk export option) | LINK | ready, not posted | |
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
- Status 30 Oct: TV/OSS/PROMPT/career-ops posted (owner locked #27/#26/#24 himself; #23 earlier). 1,112 followers, 60.8K views/30d.
- Posting order now: GROW -> LINK -> referral / agent; on "uploaded" lock #29 / #35 / #20 / #21. ONE reel/day 7-9pm.
- 29 Oct: career-ops creator (santifer) commented on our OFFER reel; pinned + replied; relationship open.
- 30 Oct: declined Jiocoder sponsorship (offered Rs 200; floor Rs 1,500 = production cost). Policy: tiered menu, 50% advance, ASCI label, no paid-entry contests.
- Jiocoder sponsorship DM (29 Oct): holding reply sent; no hackathon found anywhere, jiocoder.com NOT Reliance-affiliated; price only if they verify (anchor Rs 10-12K incl. ad rights, 50% advance, ASCI label). Policy: verify organizer, free entry, disclosure, we keep creative control.
- Topic bank with verified repos: `.claude/canwe-ai/TOPICS.md` (CHORE x CLAUDE x FREE, scored).
- Ask the owner for Insights numbers (views, follows, saves) for every posted reel → our-reels.md.
- Enable Vercel Web Analytics (owner click) → add the tracking script to the guide pages.
- Decide on the first paid product.
- 1K story poll: after 24 h ask the owner for the winner → it becomes the next reel (run reel-script-writer);
  post a result slide ("You picked X. Dropping <day>.").

## Learn AI Engineering series (started 31 Oct 2026)
Owner's idea: a daily explainer series so the audience AND the owner learn AI engineering.
- Format: OUR speedy style as it is (grad-cap presenter, big captions, selection box, dark/light flips, rail)
  + the `speedy-hidden-mechanism-reel` spine, 55–70 s, with STRONGER 3D explanation and animation: one running
  example prompt through every step, 3D props per step, word-synced changes, blur dissolves, step rail ticks,
  music `"style":"pulse"`. Owner, 31 Oct: "keep our style as it is, just improve the 3D explanation and
  animation" — a no-presenter "premium UI" build copying princegupta.ai was REJECTED (only borrow techniques).
  Worked example of the approved look: `speedy-explainer-reel/assets/examples/ai-day1-3d-reel/` (3D box helper, laser split, skyline, isometric bars).
- Each day: own keyword (topic word, e.g. TOKENS) → DM → /ai/day-N/ page = plain-words idea + 15-min exercise
  (+ a "for builders" code snippet) + vocabulary. Hub page /ai/ lists all days (add a row per day).
- Owner's CTA rule: comment KEYWORD + "follow for the full series". Do NOT tease the next day's topic.
- Mix: ~3 tool/chore reels + 2 series episodes a week; compare after 5 episodes (series earns saves/follows,
  tool reels earn comments).
- Accuracy: every number sourced; illustrative probabilities/vectors footnoted; never show unverifiable
  token IDs (tiktoken/npm tokenizer downloads are blocked in-session).
- Season 1 plan: Day 1 tokens/next-token (FINAL = 3D rebuild ai01v4 on the v1 voice; a 70 s 'France' script v3 exists, voice not generated — ElevenLabs call was denied) · hallucinations · context window · temperature ·
  embeddings · training vs fine-tuning vs prompting. Season 2: prompting, first API call, RAG, vector DBs,
  tool use, MCP, agents, evals, cost. Season 3: careers (AI eng vs ML eng vs DS, roadmap, portfolio, salaries).
