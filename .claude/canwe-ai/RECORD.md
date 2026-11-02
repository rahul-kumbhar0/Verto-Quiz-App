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
| Claude runs my Instagram (IG-magenta classic look, 49 s paced, 789 credits; meta reel, topic #6 + instagram-agent-skill 3.6k ⭐) — FINAL = 3D rebuild 1 Nov (reels/grow3d: 3D phone, exploded reel layers, pedestals, station belt + packet, 3D Post key, 13 skill cubes; pulse music; same voice) | GROW | ready, posting 1 Nov | |
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

## Performance snapshot — 31 Oct 2026 (likes/comments via PullRows post_details; DMs/clicks via DirectApply 90-day analytics)
Views/reach/saves/shares are NOT readable from here (Instagram hides them from scraping; only the owner's Insights app has them).
| Reel (posted) | Likes | Comments | DMs fired | Unique link clickers |
|---|---|---|---|---|
| JOBS — automated job search with freehire + Claude (27 Oct) | 572 | 1,521 | 693 | 542 |
| SALARY — same degree ₹3.5L vs ₹21L (27 Oct) | 81 | 54 | 28 | 25 |
| OFFER — career-ops 740 jobs → 1 offer (28 Oct) | 57 | 61 | 21 | 14 |
| PROMPT — which jobs you actually fit (30 Oct) | 52 | 47 | 19 | 15 |
| LINK — Claude on LinkedIn (31 Oct, same day) | 45 | 54 | 20 | 15 |
| RESUME — 75% ATS myth (28 Oct) | 23 | 30 | 24 | 22 |
| TV — cleanyourtv (29 Oct) | 31 | 20 | 7 | 7 |
| OSS — Claude Max free for open source (30 Oct) | 30 | 20 | 9 | 6 |
| Coding interview cheating (25 Oct, no keyword) | 32 | 1 | – | – |
| AGENT — what is an AI agent (30 Oct) | 3 | 0 | 0 | 0 |
| TOKENS — Learn AI Eng Day 1 (31 Oct, hours old) | 7 | 0 | 0 | 0 |
Read: the account wins on **fresher job-hunt outcome + free tool/prompt + Claude** (JOBS ≫ everything; LINK/PROMPT/OFFER
next) and on **money** (SALARY). Pure AI-concept explainers (AGENT, TOKENS so far) get almost nothing. Plan: make the
next reels JOBS-shaped; tie every Learn-AI episode to a job/career payoff in the hook, or slow the series down.

## Performance snapshot — 1 Nov 2026 (~10:00 UTC)
| Reel (posted, IST) | Likes | Comments* | DMs | Unique clickers |
|---|---|---|---|---|
| JOBS freehire (27 Oct 07:27) | 575 | 1,556 | 711 | 554 |
| GROW Claude runs my Instagram (1 Nov 10:08, ~5 h old) | 75 | 175 | 57 | 50 |
| LINK Claude + LinkedIn (31 Oct 15:11) | 61 | 95 | 35 | 27 |
| SALARY bands (27 Oct 15:35) | 81 | 54 | 28 | 25 |
| OFFER career-ops (28 Oct 17:33) | 60 | 66 | 22 | 15 |
| PROMPT which jobs you fit (30 Oct 20:23) | 54 | 47 | 19 | 15 |
| RESUME ATS myth (28 Oct 09:53) | 24 | 30 | 24 | 22 |
| TV cleanyourtv (29 Oct 12:13) | 31 | 20 | 7 | 7 |
| OSS Claude Max free (30 Oct 08:35) | 31 | 20 | 9 | 6 |
| AI interview (25 Oct, no keyword) | 32 | 1 | – | – |
| TOKENS Day 1 (31 Oct 18:12) | 10 | 0 | 0 | 0 |
| AGENT (30 Oct 18:38, 3rd post that day) | 3 | 0 | 0 | 0 |
*comments include our automation's public replies (≈ half).
Lessons: first-person "I did X with Claude" hooks + job/money payoff win; concept explainers die; 3 posts/day killed
AGENT; GROW proves the meta angle. Unposted: MCP (#41), PDF (#38), REFER (#20).

## Editing level 2 (1 Nov 2026)
Owner asked for advanced editing before the next build. Added `fx.js`/`fx.css` (camera, whip, zoom-through, 3D flip, flash, leak, glitch, shake, sheen, letters, odometer, scramble, code typing, particles, beat sync), new SFX (swish, impact, riser, glitch, shutter), real motion blur (`MBLUR=3`), and `references/advanced-editing.md` (12 rules). Demo: `speedy-explainer-reel/assets/examples/fx-demo/`. Every new reel loads fx.js from the template.

## Reel: GROW part 2, "Claude made this reel" (keyword REEL, building 2 Nov 2026)
drafts/grow2 + reels/grow2 · automation #51 REEL OFF · guide /reel/ (written, not deployed) · 2il.in = OUR OWN DM tool (owner: promote it here, disclosed).
Voice generated (782 cr, flow 6Gd670L7iR9lec9BTrQT) but elevenlabsusercontent.com is blocked in this session → owner must allow it. Skills zip needs a host (owner upload → link).
Real numbers used: 1,135 DMs / 12 automations / 1,964 contacts (DM dashboard, 7 days to 2 Nov 2026); trends from the 1 Nov PullRows scan (PullRows connector currently disconnected).
POST #48 is live (locked to the LinkedIn reel).

## Motion graphics level 3 (2 Nov 2026)
Owner: "improve the motion graphics to the extra level". Added `mg.js`/`mg.css` (R.mg) + references/motion-graphics.md (8 laws, API, recipes, checklist), wired into the template.
Demo = the LinkedIn posts reel rebuilt with it (reels/lipost-mg → skill example mg-demo), with the same voice and the "Not Like Us" mix:
logo tile morphs into the composer; iris seam from the Claude chip; a connector draws from the skills folder and the chips fly out on springs with echo trails; a 21-tile → 3-picked formula strip;
humanizer marker + drawn strike + spring-in fixes; a gauge (sample 78/100, footnoted illustrative); a week line drawn; the lock/press rings; the drop stack (shake + rays + double ring + grid wave) on "3,000"; a comment → DM packet path; a beat-pulsing dot grid (136.5 BPM, off in the breakdown).

## Real product UI (1 Nov 2026)
Owner: show the EXACT Claude / GitHub UI when we talk about them. Added `ui.js`/`ui.css` (GitHub repo page, Claude chat + home, Claude Code terminal, browser chrome) from live screenshots, Primer Octicons (MIT), Source Serif 4 (OFL). Rule: real data + dated footnote; chat answers from real runs. Demo: `speedy-explainer-reel/assets/examples/real-ui-demo/` (freehire repo 3.5k★ → Claude finds 37 real Python internships in Bangalore).

## Reel: Claude writes my LinkedIn posts (built 1 Nov 2026)
reels/lipost · keyword POST (exact) · automation #48 OFF (lock + activate after upload) · guide https://canwe-guides.vercel.app/post/ (live, linked from hub) ·
first reel with ElevenLabs v3 audio tags (580 credits) + real-UI kit (LinkedIn composer, real GitHub page 3k★, Claude Code terminal) + new look/fx.
Owner must run /li-post once on his own LinkedIn before posting (hook is first-person). Running the pack's own humanizer scripts was blocked
by the permission classifier (third-party code); the reel shows real slop.json replacements, no invented score.
Vercel: the last deploy referenced EVERY file by sha and succeeded (dpl_FjbRi9Mv9Bdxy2YLtgtXF77BMWqs) — all current pages are reusable by sha now;
shas: index 2b5e5192… (2584) · post 66b5cdd5… (6062) · oss f744d285… · freehire 42e21325… · resume c7c58193… · salary 176488f1… · refer 6031500b… · agent c8ab1401… · career-ops 64aa45ae….
Music version (owner's request): out/claude-linkedin-posts_notlikeus.mp4 = Kendrick Lamar "Not Like Us" instrumental (owner's mp3), source 6.34 → 41.53 s.
Sync: riff under the hook, the beat enters at 2.36 s, the song's breakdown (27.7–32.4 s) sits under "it never posts by itself… I press post", and the drop (32.44 s) lands on "3,000" (video 26.10 s).
Mix: music ×0.21, −3 dB at 2.5 kHz, sidechain ratio 3 / thr 0.05 (≈12–13 dB under the voice), +10 dB during the hook riff, +7.6 dB during the breakdown, −14.1 LUFS, −1.5 dBTP.
COPYRIGHT: a commercial song can get the reel muted or blocked on IG/YouTube. Safe route = the _nomusic file + the same song from Instagram's music library (start the clip at the drop).
How-to for any song: find the drop/beat entry by RMS (50 ms windows), offset = drop_src − payoff_word_time, and duck gently (ratio 3), not mix.sh's ratio 6, which buries a full song about 20 dB down.
