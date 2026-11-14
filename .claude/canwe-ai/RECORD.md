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

## Reel: APPLY, "Placement season. Zero offers. So I let Claude apply." (FINAL rendered 3 Nov 2026)
drafts/apply + reels/apply · voice 813 cr (owner uploaded the mp3), paced 42.3 s + dynamics.py (7 level marks: +2 dB twist/form, −2.5 dB 901 aside + "stops") ·
first reel with the 3-beat opening + M.headline frame 0 · out/claude-apply.mp4 (pulse) + _nomusic + _notlikeus (song from 50.28 s, drop on "it fills the form" 24.9 s, dip on "Then it stops") · cover "Zero offers. So I let {Claude} apply." ·
automation #56 APPLY OFF → guide https://canwe-guides.vercel.app/apply/ LIVE (dpl_6FaydHsLBvAeC2kEcmuJ94cyCsL5) · hub links it ·
the careers form on screen is a recreated sample (footnoted); replace with the owner's real Playwright run before posting if possible. Playwright MCP facts in drafts/apply/post-copy.md.

## Reel: YouTube × Claude, "I automated my YouTube channel with Claude" (keyword YOUTUBE, FINAL v2 rendered 3 Nov 2026 with the big first-frame headline (M.headline), counter dropped: out/claude-youtube.mp4 + _nomusic + _notlikeus, 49.1 s, cover)
Music version (owner's song): out/claude-youtube_notlikeus.mp4 = "Not Like Us" from source 41.17 s: hook on the full beat, the song's 0.6 s silence falls after "…with Google." (28.5 s), breakdown under "make a Short… titles it", drop (75.25 s) on the upload hit "…to canwe.ai" (34.08 s), music dips on "here's the catch". Same mix settings as the LinkedIn song version.
drafts/yt + reels/yt · voice 843 cr, 48 s (owner uploaded the mp3; elevenlabsusercontent.com still blocked in this session even after allowing → needs a new session) · paced 47.4 s, 5 stops, ×1.05 · cover out/cover.png ("I automated my {YouTube}") · guide https://canwe-guides.vercel.app/youtube/ LIVE with recreated step screens (dpl_6wtmWLLn5CdyqnDTcjy8pcoy5vq3, 3 Nov; replace with real screenshots once the owner does the setup; connector step = "pick an open-source OAuth YouTube MCP, e.g. pauling-ai/youtube-mcp-server, read it first"; hub links it; the /reel/ hub line is removed until the REEL launch, re-add then) ·
scenes built (Studio flash-forward hook, real install + 11 skills, Google Cloud enable/desktop/client_secret (light), Google sign-in → connected,
Claude chat → /yt-script → render → upload_video tool chain + impact stack, Private→Public + quota meter ≈6/day, comment → DM via 2il.in) ·
no-voice preview rendered · automation #54 YOUTUBE OFF → /youtube/ (guide page still to write + deploy) · MUST be true before posting: canwe.ai channel
really connected (owner OAuth) + one Short really uploaded as private; pick/audit the connector (candidates ~30★).

## Reel: GROW part 2, "Claude made this reel" (keyword REEL, building 2 Nov 2026)
ON HOLD (owner, 3 Nov): post only when our extension + the paid "Reel Studio Pro" pack are live (plan: PRODUCT-reel-studio-pro.md). #51 stays OFF.
drafts/grow2 + reels/grow2 · automation #51 REEL OFF · guide /reel/ (written, not deployed) · 2il.in = OUR OWN DM tool (owner: promote it here, disclosed).
Voice generated (782 cr, flow 6Gd670L7iR9lec9BTrQT) but elevenlabsusercontent.com is blocked in this session → owner must allow it. Skills zip needs a host (owner upload → link).
Real numbers used: 1,135 DMs / 12 automations / 1,964 contacts (DM dashboard, 7 days to 2 Nov 2026); trends from the 1 Nov PullRows scan (PullRows connector currently disconnected).
POST #48 is live (locked to the LinkedIn reel).

## Paper editorial mode (3 Nov 2026)
From the @mrcreates.ai read (TOPICS.md): `<body class="look paper">` in look.css (warm paper + grid, ink, ONE accent --pacc default editorial blue),
editorial type (.e-pair word pairs sans + Instrument Serif italic, .e-kick/.e-rule/.e-ticks/.e-foot frame, .e-idx numbered index, .e-card paper UI, .e-swap),
mg.js motions M.pair / M.tear (the torn ₹4,999 checkout) / M.ticks / M.underline / M.swap. Presenter stays as a 360 px sticker bottom-right; captions flip to ink.
Reference: speedy-explainer-reel/references/paper-editorial.md. Demo: assets/examples/paper-editorial-demo (reels/paperdemo, 20.7 s, no voice, lofi music).
Use for list/tool reels and "anti-course" hooks (e.g. the REEL reel: "people sell this as a course; the skills are free").

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

## KITE (4 Nov 2026): Zerodha + Claude = free portfolio analyst — FINAL rendered 4 Nov
out: reels/kite/out/claude-kite.mp4 (pulse) + _nomusic + _notlikeus (song from 71.25 s, drop on "Connect it to Claude" 3.95 s, breakdown boosted under the opening, dip on "It never") + cover.png ("Your portfolio, explained. {Free.}") ·
HOOK v2 (owner: "is our hook strong?" → rated 7/10, payoff late): frame 0 now shows the PAYOFF — headline "Zerodha + Claude = a free portfolio analyst." + both logos already linked with packets, app faded behind; voice keeps the pain line (mute viewers see the promise, sound viewers hear the pain). Trial-reel idea: spoken stakes opener "Two of your mutual funds might own the same companies. You're paying twice." ·
audio: owner uploaded the mp3; "It only reads." cut at 33.22–34.34 s; TTS said "P/E ratio" so narration/script now say "P/E ratio"; paced 42.2 s (6 stops incl. "one sheet."), 5 level marks · 44 s total ·
drafts/roast (script v3, notes, post-copy) + /root/reel-work/reels/kite (index.html scenes done, previewed on fake timings) ·
voice 825 cr, 43.8 s, flow abpj0xhQSlOljPZ2hmIP (download blocked again in this session → owner uploads the mp3) ·
TRUTH FIX: the spoken "It only reads." gets cut from the audio (hosted Kite MCP may keep GTT tools; README read 4 Nov: "excludes potentially destructive trading operations");
on screen it's the prompt rule "explain · never advise" · every screen = labelled SAMPLE portfolio with generic names, footnote "not investment advice · not SEBI-registered" from the twist on ·
guide https://canwe-guides.vercel.app/kite/ LIVE (dpl_GGMk4fhRqH1ckj1ePG7KaqoK1Saf; setup via claude.ai custom connector / Desktop mcp-remote / Claude Code, Kite login, rule prompt, 4 prompts, safety) · hub links it ·
automation #60 KITE OFF (exact, all reels, follow gate) → lock to the reel + activate on "uploaded".

## VIDEO (5 Nov 2026): "Stop paying for video-editing courses. Claude makes every reel on this page." — FINAL rendered 5 Nov
out: reels/video/out/claude-video.mp4 (pulse, break on "Here's the catch") + _nomusic + _notlikeus (song from 72.52 s, drop on "Claude makes" 2.68 s, breakdown under the hook, dip on the catch) + cover.png v2 (owner: background of ALL our covers: 23 real covers tiled + tilted −9°, dimmed centre, "Claude makes my {reels}", kicker NO EDITING COURSE, character pointing up; source drafts/video/cover.html, shot with tools/shot_cover.mjs) · 41.1 s · owner uploaded the mp3; paced 39.3 s, 4 stops, 4 level marks ·
presenter = the job-search "street" character in the house outfit, auto-staged (walks to the side + points at 15 data-ex elements), depth (closer on twist/catch/CTA, back while pointing), squash/landing, wow sparkles on every "Claude" ·
guide https://canwe-guides.vercel.app/video/ LIVE, v2 DETAILED (owner, 5 Nov: "build a guide more detailed so users can create videos like these"): 15 sections — install (Mac/Windows), idea, script, voice, init --audio (Whisper word timings), storyboard-first, our look as a prompt, presenter prompt, captions (catalog/add caption-highlight), motion (registry: claude-exchange, code-terminal-run, cut-the-curve, whip-pan-cut, marker-highlight, instagram-follow; 448 items), sound (/media-use, beats), review (check/snapshot/preview + revision prompts), render + cover prompt, post checklist, troubleshooting from our test, costs (dpl_49uqYKWzTev35WHNkWRH3rM4EjAn; earlier dpl_8Jvpm1ptEotUwwebqdfqigcMdN1s; inline-sent kite/index.html WAS reusable by sha this time) · hub links it · automation #63 VIDEO OFF → lock + activate on "uploaded".
drafts/video (script v1 + Hinglish trial, hooks, post-copy, guide facts, reel.html source, hyperframes-test/) + /root/reel-work/reels/video ·
voice 753 cr, 39.4 s, flow sE8JHt3dg1Q2gyU3M7yw (history 9Pl3wXGmF3zSSijKQix4; download blocked → owner uploads) ·
HYPERFRAMES TESTED FOR REAL (5 Nov): npm hyperframes v0.9.15 (Apache-2.0, Node 22+ + FFmpeg). `npx hyperframes init canwe-test --resolution portrait --non-interactive`
also installed skills hyperframes / hyperframes-cli / hyperframes-registry / media-use into ~/.claude/skills ("Review skills before use"). check flagged: empty first frame,
nested clips, tween overlap, text occluded → fixed; render blocked loading GSAP from jsdelivr in the sandbox → local assets/gsap.min.js; render: 8.0 s 1080×1920 in 9.0 s.
There IS a paid "HyperFrames Pro" tier (templates, /reverse-any-video, /style-sampling, credits) → we say "core: free + open source". GitHub API for the repo blocked here → no live star count, so no stars on screen.
Reel scenes: frame-0 headline over a course checkout that TEARS on "courses." · giant Claude spark detonates (rays, ring, flash) · 3D wall of 15 REAL covers of posted reels ·
5-step deck slams in · 01 reel cards fly into Claude → pattern chips · 02 script types + 45 s gauge (38) · 03 live waveform + ElevenLabs / free local chips ·
04 real terminal (init) → prompt → frames fan out → phone plays the REAL HyperFrames render ("REAL RENDER" + "Render complete · 8.0 s · 9.0 s") · 05 same render continues, caption, cover flip, "you" press Share ·
catch chips · comment → DM via 2il.in. "Claude emoji" = the Claude spark: an inline spinning icon after every spoken "Claude" in the captions + a big spark pop with burst above the word (claudePop()).
guide /video/ written (not deployed yet) · hub line added · automation #63 VIDEO OFF.

## VIDEO v2 (6 Nov 2026): "I automated my reels with Claude. And you're watching one." — FINAL rendered
v1 ("Stop paying for video-editing courses", posted 5 Nov as trial) got ~1K views, 0 DMs → owner DELETED it. v2 rebuilt on OUR formula (our-reels.md § What made OUR reels go viral:
JOBS 812 / GROW 682 / YOUTUBE 402 DMs in 30 days all = "I automated my [platform] with Claude" + proof inside the reel + named free tool + catch + thing-keyword).
Proof lines: "2,000 plus followers in one week" (owner-confirmed, 6 Nov; earlier notes had 1,112 on 30 Oct) · "Over 3,000 comments" (DM dashboard: 3,268 in 30 days).
Voice 791 cr (flow M27UH1FuDTZ0bWbbeIVi; owner uploaded the mp3), paced 43.5 s, 6 stops · 45.3 s total · reels/video2/out/claude-video-v2.mp4 (pulse, break on "The catch?") + _nomusic + _notlikeus (song from 72.46 s, drop on "you're watching one") + cover.png ("2,000+ FOLLOWERS IN 1 WEEK" · "I automated my {reels}" on the all-covers wall).
Two-pass render: pass 1 → its first 8 s become the frames the phone plays ("THIS REEL"), pass 2 MBLUR final. Honesty: voice = ElevenLabs (said), our engine ≠ HyperFrames ("free tool for you"), number sources footnoted.
Automation #63 VIDEO is ON but locked to the DELETED media 18106883129645628 → re-lock to the new media id on "uploaded".
### VIDEO v2 · PEACH CREAM look (6 Nov, owner: "fresh colour, not black" → picked option C)
Theme system in reels/video2 (body[data-theme]: aurora / studio / blueprint / sunset / ocean / cream) + 3D camera tilt (cam3d wrapper) + scrolling 3D floor grid + moving glow blobs.
Cream = light gradient #FFF6EC → #FFE9DD → #F3E8FF, peach/mint/lilac glows, terracotta floor lines, captions dark (is-light), headline on a frosted cream panel, "Claude" word terracotta #C2552F.
New in the edit: our real reels as clips on an editing timeline (step 04) + a 3D ring of our real covers as "the output" (step 05, stays dimmed behind the catch).
Out: reels/video2/out/claude-video-v2-cream.mp4 (pulse) + _nomusic + _notlikeus + cover_cream.png (cream cover, terracotta pill). Phone frames re-shot from a cream pass 1.
The dark v2 render (claude-video-v2*.mp4) is kept as the alternative.
### VIDEO v2 posted 6 Nov 2026 (media 18034821182899818, instagram.com/reel/DfYt8mRzh7c/)
Owner linked #63 to it himself (still also lists the deleted v1 id 18106883129645628) and turned email capture ON.
First check (same day): #63 fired 37 DMs, 13 link clicks, 9 unique clickers (v1 got 0 DMs in its whole trial). Views: ask the owner (not readable here).
7-day context: GROW 705, YOUTUBE 445, JOBS 143, LINK 127 DMs. DM text still describes v1 ("HyperFrames … my exact prompt") → align to the v2 steps if the owner agrees.
## CRASH (7 Nov 2026): "$2.3 trillion gone in one day. So are AI jobs gone too?" — FINAL rendered 7 Nov (NEWS: post TODAY; part 2 = Nvidia earnings 17 Nov)
out: reels/crash/out/claude-crash.mp4 (pulse, break on "And honestly?") + _nomusic + _notlikeus (song from 55.43 s, drop on "So I asked Claude" 19.77 s, dip on the honesty beat) + cover.png (cream covers wall, "5 NOV · WORST DAY IN A YEAR" · "$2.3T gone. {Your job too?}", shrugging presenter) · 49.8 s · owner uploaded the mp3; aligned ("185"=5 spoken tokens), paced 48 s, 6 stops, 4 level marks.
NEWS reel (post within ~24h; part 2 = Nvidia earnings 17 Nov). drafts/crash (facts sourced NBC/Morningstar/Fool/IBTimes 5–6 Nov; "nearly 9%" because sources disagree; 10 hooks; script 135 w lint PASS; post-copy) + /root/reel-work/reels/crash (cream look + 3D world, scenes built + previewed on fake timings: $2.3T odometer + falling chart (illustrative, footnoted) → stakes card → 3 fall bars (−9*/−17/−6.3) + why chips → Claude chat → mood-vs-decision split (jitter ticker vs offer letter) → 185/153/150 bar race ("✓ checked 6 Nov") → "Did the bubble pop? Nobody knows" card → skill-up/panic chips (strike on panic) → CTA; is-light captions; footnote "educational · not investment advice" throughout).
Voice 841 cr, 47.4 s (flow AYCFYQmWqYKN9lcLEM7Z, history 0phFwDQCdDnfjrgQV06A); download blocked → owner uploads. 185-AI-skill stat = freehire facets 6 Nov (ai 185 > python 153 > sql 150, India intern+junior 7d).
Guide https://canwe-guides.vercel.app/crash/ LIVE (dpl_FM48rMd4dbFHNXcfpDfCGnMLgfW9) · hub links it · automation #70 CRASH OFF (exact, all reels, follow gate) → lock + activate on "uploaded".
Vercel NOTE: index.html, video/index.html and crash/index.html are now UPLOADED blobs (sha-reusable): index 24bf1715… (3119) · video 6fb4a683… (21026) · crash 411cf4f2… (7304).
## SuperProfile collaboration — ACCEPTED by owner (8 Nov 2026)
Terms received: 1 yr Creator Plan + 20% lifetime commission per referral; deliverables 3 non-collab reels in 1 yr, reel 1 within week 1 of onboarding, others on their team's request. Platform: Meta-verified link-in-bio paywall (auto-DMs, 1:1s, paid guides/courses, paid Discord/Telegram) with a Claude/ChatGPT agent integration (create/edit products, payment pages, auto-DM automations, reports via AI).
HOUSE RULES for the collab reels: (1) angle = "Connect Claude to SuperProfile" (our niche: AI agent runs the creator business) — NOT a DM-tool pitch, since auto-DMs compete with 2il.in (our own, disclosed in every reel); (2) every collab reel marked as partnership (IG paid-partnership tag + said in caption) — our honesty rule; (3) all claims verified in our own account before filming (same as every tool reel); (4) referral link goes in the SuperProfile guide page + DM, disclosed as "referral link, we earn 20%".
To confirm with their team before signing: exclusivity (can we keep promoting 2il.in? non-negotiable: yes), usage rights of our reels (organic repost ok, paid ads = ask first), revision rounds on scripts (we write, they review once), commission tracking dashboard + payout method/threshold, what happens to Creator Plan after year 1, "non-collab reels" = posted on @canwe.ai without the IG collab/joint-post feature (confirm that's their meaning).
Queue impact: SP reel #1 due within week 1 of onboarding → slots after CRASH posting; MEM (claude-mem repo) stays the next organic build.
## 8 Nov 2026 — Editing LEVEL 4 (pro pass) + script casual-talk layer + DEMO
- Owner: "improve our editing/motion graphics to pro level (check @speedy_devv, @nick_saraev), improve script skill, demo with an old voice." PullRows was down both servers (owner must reconnect) → studied Saraev via web teardown instead; IG frame scans still pending reconnect.
- fx.js LEVEL 4 added (template + video2 + demo-pro): F.punchS/punch (sentence punch-in rhythm), F.matchCut (live-rect FLIP morph), F.wipe (clip-path reveal, hands opacity back via dataset.wp), F.ramp (time remap), F.pop, F.vig (#fxVig overlay). Docs: speedy-explainer-reel/references/advanced-editing.md §2b.
- Script skill: our-reels.md new section "casual-talk delivery + Saraev layer" — question-opener, acted-out problem, insider catch framing, ≤12-word sentences, pivot line, DELIVERABLE-STACK CTA (≥2 named items). MEM script v2 CTA updated to stack form.
- DEMO rendered: /root/reel-work/reels/demo-pro/ = VIDEO v2 (same voice) + pro pass, cream, phone uses v1f frames (demo only, NOT for posting). out/demo-pro-final.mp4 (−14.6 LUFS) sent to owner.
- MEM reel: script v2 (casual) awaiting owner approval → then real install test, voice (estimate→1 take), build.

## 9 Nov 2026 — reel-pro-stack (5 repos combined) + demo 86 → 96
- Owner: install huashu-motion, argo-video/cli, explainroo, video-director, earshot; improve/combine skills; demo.
- Repos mirrored to /root/reel-work/ext (jsDelivr; earshot via TAG 0.4.1 since @main was stale; huashu + argo via npm). video-director = 3 repos (win4r QA, SallyRS rules, DotanVG). All MIT.
- Safety classifier REFUSED running their scripts/CLIs (win4r qa_video.py; earshot pip -e with torch). Not worked around: methods ported into OUR tools: tools/reelqa.py, tools/reeltext.mjs, tools/sfx_pro.py. earshot model-free cmds (sfx/kit/measure) run via tools/stack/es.py + venv-earshot (light deps); bank takes in /root/reel-work/sfxbank/earshot (52 wavs, 18 roles). Model listening (describe/timeline/critique) needs torch → owner must allow.
- New skill .claude/skills/reel-pro-stack (director-rules, sound-kit, qa-gate, follow-cam refs + assets). speedy template exposes R.stageEX.
- Demo /root/reel-work/reels/demo-stack/out/demo-stack-final.mp4 (VIDEO v2 voice; demo only, phone shows v1 frames). QA before (demo-pro) 86 [35 safe-zone violations, 0/5 stop-downs, 9 fx/10s] → after 96 [0 violations, 7/7 stop-downs, 27.4 fx/10s; only warn = deck subtitles 32–33px].
- Rule going forward: every reel runs the reel-pro-stack QA gate before the owner sees it; report the score.

## 9 Nov 2026 — @speedy_devv "Let's design GitHub" studied + copied (explanation, editing, mascot)
- Owner sent the speedy_devv GitHub reel (126 s): "copy their style of explanation and editing; check how the mascot responds to the text".
- Studied frame by frame (/root/reel-work/ref/v81642/: 2 fps sheets + 30 fps strips). Full grammar: speedy-explainer-reel/references/devv-github-breakdown.md (explanation · editing · mascot lexicon w/ timestamps). Script layer added to reel-script-writer/references/our-reels.md.
- Engine (template + demo): avatar hands four/five/cup/flat; poses four five ten worry mindblown measure look_far palms show offer; fixed `cross` (was arms-out bug); expr worried; props lock + hourglass (held up while the other hand points). speedy.js autoPoses: devv lexicon, numbers 1–5/10/billion, LIST COUNT on comma lists, chapter numbers always count, props end at next sentence. Tool: assets/posegallery.mjs. "listen" pose dropped (forearm can't reach the ear).
- Demo /root/reel-work/reels/demo-devv/out/demo-devv-final.mp4 (VIDEO v2 voice, demo only): reel rack hero (= GitHub's Spokes) fills 5 bays, docks lower-right, packets on wires, defocus morph swaps, odometer + crowd grid + comment wall, red rail for the catch, planted mascot on auto lexicon. QA 86/100, 0 fails, 0 safe-zone text, 24.8 fx/10 s.

## SuperProfile — REVISED offer accepted (10 Nov 2026) — replaces the 8 Nov terms
1 yr Creator Plan free · 2 promotional reels (was 3) · 40% referral commission on purchases AND renewals (they wrote "40% of 499" = ₹199.60/sale; monthly vs yearly to confirm) · retainer/fixed payout discussed after reel 1 performance. Asked in reply: price basis, tracking + payout threshold, reel-1 deadline, success metric. House rules unchanged (paid-partnership tag, script review once, non-exclusive, ads need permission).

## FABLE (11 Nov 2026): "Claude Fable 5.2 is free this week. But only if you know where to look." — FINAL rendered
- Topic: Fable 5.2 launched 9 Nov. IG viral pattern: "Fable 5.2 just dropped + free + Comment FABLE" (@adilet.fndr 3.3K comments/24 h). Only real free offer = Anthropic's: Pro + standard Team at no extra cost till 16 Nov 11:59 pm PT (billing before 9 Nov), ≤50% weekly limit + 1 reset; Free plan excluded. Dropped unverified: "$11,700 Excel clone", Artificial Analysis #1; Higgsfield "free 72h" = its own video models (misleading); free-API-key sites = warned against in the reel.
- Voice: ElevenLabs eleven_v3 Shlok, 1 take, 796 credits, flow QRJPvH9rL26xSPkrobq0. NOTE: elevenlabsusercontent.com DOWNLOADS WORK NOW (11 Nov) — no owner upload needed.
- Build /root/reel-work/reels/fable/ (devv style: model-ladder rack hero, 1,000-agent grid → OS boot, gadgets ✓✓✓, cost bars ×2, Pro card + calendar 9→16 + 50% meter + reset, red catch chapter: free plan ✕ + scam key site siphoning your prompt, final ladder: your task → Opus, hardest job → Fable). Hook fix after QA FAIL (no motion till 6.6 s): ring on "Fable", FREE THIS WEEK* stamp on "free", push-in. Gotcha: element ids b0–b3 collide with the engine → use bay0–3.
- QA 86/100, 0 fails (hook onset 2.1 s, 0 safe-zone text, 25.7 fx/10 s, -14.3 LUFS). out/claude-fable.mp4 (44.4 s) + _nomusic + cover.png.
- Automation #78 FABLE on @canwe.ai (OFF, exact, follow gate, guide /fable/ LIVE, deploy dpl_AJKGmpYPQzjYtPJAX4pn8KP9Ua7P). POST BY THU 13 NOV (offer ends Tue 17 Nov 1:29 pm IST). On "uploaded": lock #78 to media id + activate.

## SHORTS (11 Nov 2026): "I automated my YouTube with Claude. Now a free repo makes my Shorts too." — FINAL rendered (part 2 of YOUTUBE)
- Topic: JayWebtech/autoshorts (free GitHub repo, 1,494 ★, no licence, unsigned installers). Owner rules: call it a "free GitHub repo", never "app"; say "free". Facts + 6 catches in drafts/clips/facts.md; hooks.md; script.md (final).
- Voice: eleven_v3 Shlok, 1 take, 846 cr (flow ksCvpZ6Kc0F67mFUcCJe), paced 46.3 s, 6 stops.
- NEW ENGINE: world3d.js (in reels/shorts/; copy into the speedy template next) = a real 3D world: W3.box solid slabs (6 faces), W3.extrude 3D type, camera flights between stations (eased lerp per segment, expoInOut; Catmull-Rom overshot), depth-of-field + fog by camera depth, dust. Stations: YouTube + 3D "Shorts"/FREE → repo + app → transcript river (fly down it, Claude spark picks lines) → clips rise in an arc → stack → uploads (private 🔒, publish) → red catch (centre-crop window cutting a speaker, price coins, unsigned dialog, Releases card) → CTA phone + DM card.
- Gotchas: class .scene is display:none in speedy.css → use .scn; CSS filter (DOF blur) flattens preserve-3d so backfaces show mirrored → dof:false on anything that flips; mark fake UI text data-qa="texture"; keep station content inside x 65–864 and y ≤ 1248 (tighter arcs, cam y +).
- QA 93/100, 0 fails (hook 2.8 s, 0 safe-zone text, 22.5 fx/10 s, 4/4 stop-downs, -14.2 LUFS; warns: end-card hold, 10 small UI labels 27–33 px). out/claude-shorts.mp4 (47.9 s) + _nomusic + cover.png.
- Automation #79 SHORTS on @canwe.ai (OFF, exact, follow gate). Guide /shorts/ LIVE + hub line (deploy dpl_4juCQpanYjTCUkF1xQpqAMjfJfrH, reel/ still excluded). Post copy drafts/clips/post-copy.md. On "uploaded": lock #79 to media id + activate.
- Optional before posting: owner runs AutoShorts on one of our long videos and adds 2 s of the real export (UI in the reel is recreated from the README, footnoted).
- v2 (11 Nov, owner: "better VFX/motion, use India's Got Latent clips as the sample"): told owner Instagram also runs copyright checks (Rights Manager can mute or block the reel); owner chose to go ahead (IG only). YouTube blocks downloads from the cloud box (bot check, not bypassed); PullRows not connected (and it returns stills only) → WAITING for the owner to upload the Latent footage. Built with placeholder footage: foot.js + tools/foot_prep.py; step 1 player plays the clip; step 2 = editor-timeline film strip under Claude's playhead (chips, scores 92/88/95/81, 2×2 lift); step 3 = blade cuts → sides fall → 9:16 → captions burn in → fan → stack; catch uses a two-person wide shot. Text QA 0 unsafe. TODO on footage: fill foot/spec.json times, transcribe moments → real captions (FOOT_META.caps), credit "Clips: India's Got Latent (YouTube)", full MBLUR render, mix, QA, resend.
- v3 (11 Nov): owner: "suppose that long video is OUR video, cut that instead of using another video (copyright)". Built our own 60 s demo podcast (reels/shorts/longvid/index.html → foot/src/canwe_podcast_ep12.mp4): canwe.ai PODCAST set, our presenter = host, a second puppet = guest (classic look, blue tee), wide + close-up shots with push-ins, lower thirds, EP 12 tag, lines from our own reels. Cut via foot/spec.json; captions = the episode's real lines. Footnote: "Sample: our own demo podcast, made for this reel". No third-party footage. Example kept at speedy-explainer-reel/assets/examples/demo-podcast-longvid.html (reuse for any "long video → clips" demo).

## KEYFRAMES library (11 Nov 2026): our own reusable scene blocks
- Why: owner sent the speedy_devv "FOLDER" promo + getkeyframes.com (Full Visual $99 / +Character $129 / Complete $249 / Product Demo $39). Studied the promo + 5 full demo reels + 6 clips → speedy-explainer-reel/references/keyframes-study.md. Instagram scan of @speedy_devv FAILED (PullRows error) → still to do when the extension works.
- Built: speedy-explainer-reel/keyframes/ = kf.js core + kf.css + gallery.html + 10 group-A blocks, each folder block.js + demo.js + preview.jpg + README.md: cutaway-stage, tracked-labels, value-strip, field-arcs, grid-zoom, wave-cancel, point-cloud, tile-map, flow-nodes, magnifier. API: `KF.make(name, host, opts).frame(t, state)`. Gallery video rendered (49 s, /root/reel-work/ref/kf-gallery.mp4).
- Limits told to owner: stage/motion blocks are reusable; each topic's hero drawing (finger, AirPod…) is still custom; ours are simpler than theirs for now. Not yet used in a real reel, not run through the reel QA gate.
- Groups B–F built the same day → 43 folders total (41 with block.js + demo.js + preview + README; loop-back = helper KF.loopBack; world-camera + podcast-set = docs + source). B: phone-frame, article-card, repo-card, deploy-list, dashboard, world-map, calendar, folder-window, agent-log, prompt-box, product-page. C: hero-stat, multiply-field, frame-wall, thumb-wall, strike-row, before-after. D: props (badge, vault, logbook, alarm, rack, sandbox, lock, camera). E: code-reveal, light-wipe, stage-flip, blade-cut, film-strip, clip-stack, world-camera. F: captions, presenter, chapter-rail, ending-follow, ending-comment, loop-back, cover, podcast-set. manifest.js lists them; gallery.html?only= / ?group=.
- Checked: all 41 demos load + seek with 0 page errors; one frame of each reviewed by eye; full gallery rendered (193 s). NOT yet: used in a posted reel, reel QA gate, real images in thumb-wall/film-strip.
- NEXT: one short test reel built only from blocks (voice needed), then use them for the next real reel; scan @speedy_devv on Instagram when PullRows works.
- TEST REEL (11 Nov): SLOP (heydamir/unslop, 14,424★ re-checked, CC BY 4.0) built ONLY from keyframes blocks, local voice-studio `house` voice (no ElevenLabs credits), 35.6 s. QA 89/100, 0 fails (warns: 1 s CTA hold, busiest 5 s at 65 %, 3 tags 33 px). Library fixes found by the test: repo-card labels enlarged + tags wrap; starred:0 when the count must match a checked number. Files: studio/reels/slop + studio/finals/slop-test*.mp4. Not set up to post (no automation/guide; voice is the test voice). If the owner wants to post it: ElevenLabs Shlok take (estimate first, ONE take) + automation SLOP (OFF) + /slop/ guide.

## FREE (12 Nov 2026): "68,000 people starred a repo that runs Claude Code for free. Here's what's actually answering." — FINAL, Shlok voice
- Topic: Alishahryar1/free-claude-code (68,932★, AGPL; local proxy: Claude Code + 11 apps → free models, default NVIDIA Nemotron; Google/Groq/OpenRouter/HF/local). Facts drafts/free/facts.md, hooks.md, script.md, post-copy.md. Hook fixed: stars ≠ users ("starred a repo", not "people run").
- VOICE BLOCKED: ElevenLabs estimate 620 cr; the one take FAILED, not charged (612 credits left). No retry without the owner. Built on the local voice-studio `house` voice; a Shlok take drops in with align → re-render (scenes follow word times).
- Built 100% from keyframes blocks (hero-stat, flow-nodes pipeline App → Free Claude Code → NVIDIA/Google/Groq, repo-card, agent-log sample session, ₹0 stat, red catch: flow-nodes "Free model / NOT CLAUDE" + strike-row private code ✕ / practice ✓, ending-comment, loop-back). QA 96/100, 0 fails. Files studio/reels/free, studio/finals/free-scratchvoice*.mp4 + free-cover.png.
- Automation #84 FREE on @canwe.ai (OFF, exact, follow gate). Guide /free/ LIVE + hub line (dpl_Mc7siMKkqPHMR64oq5WDcExDWRRZ). FREE is a common word → lock to the media id on "uploaded", never all reels.
- Safety check blocked piping the project's installer into a shell here (correct); --dry-run confirmed from the script's own usage text instead.
- SHLOK TAKE (owner asked): tagged script tts_v2 (curious → whispers → matter of fact → excited → short pause + serious → warmly), trimmed to fit: 602 credits (≈10 left), flow BV3obUtSXxqjAKElGKpb, 31.1 s raw → paced 33.6 s (8 hard stops). Reel 35.2 s, QA 93/100, 0 fails (warns: one music dip check 2/3, one 32 px repo line). out: studio/finals/claude-free.mp4 + _nomusic + free-cover.png (scratch-voice versions deleted). ElevenLabs balance now ≈10 credits → next reel needs a top-up.
- REALISM PASS, group C (12 Nov, owner: "create realistic keyframes, start with C"): shared `keyframes/_assets/` = 24 real covers (c01–c24.jpg, 270×480, from reels/*/out/cover.png) + frames.jpg (96 real frames, 12 per reel from shorts, fable, free, crash, kite, grow3d, link, apply; `ffmpeg -ss T -i reel.mp4 -frames:v 1 -vf scale=54:96`, then `tile=12x8`). hero-stat = true odometer (digit wheels, carry only in the last unit, drop-shadow glow); multiply-field = drawn stadium/person/phone/laptop sprites with depth haze; frame-wall = real frames + one frame zooms out; thumb-wall = real covers, hot one lifts; strike-row = illustrated objects (camera, tablet, timeline, mic, laptop, card, chat) + marker stroke; before-after = glass handle. kf.js: KF.base/asset/img/covers. NEXT: same pass on D (props), E (transitions), F (endings), then A/B if the owner wants.
- ADVANCED PASS, group C (12 Nov, owner: "more realistic, advanced level, use more keyframes"): kf.js + KF.keys (multi-stage motion), KF.sparks, KF.sheen; new block `finish` (film grain 24 fps, vignette, bloom, flash, handheld drift) to put on top of every scene. hero-stat = mechanical counter housing (wheels land left→right with a click-bounce, glass sweep, sparks; look:"glow" keeps the old style). multiply-field = real 3D ground + crane camera (close on one → pull back over the field), shadows, wall height, floodlight flicker, haze. frame-wall = receding rows with focus blur + light sweep + a frame that flies out. thumb-wall = 3 depths with blur; hot cover lifts out and PLAYS (progress bar, like/comment/share, heart pop). strike-row = drop-in with squash, rough marker stroke, recoil tilt, sparks. before-after = fingertip drags the handle. 42 demos load with 0 errors. Render cost: blur filters make group C ~5× slower to render (37 s of video in 234 s). NEXT: same level for D, E, F, then A and B.
- ADVANCED PASS, group D (12 Nov): props redrawn with materials lit from the top-left (brushed steel, gold, glass, plastic sleeve, paper), floor shadow + rim light, multi-stage actions via KF.keys: vault (wheel winds back then spins, bolts slide, door swings, warm light + dust), badge (swing, 3D flip VISITOR/READ-ONLY → ACCESS/ADMIN, glint + sparks), lock (key slides up, turns, shackle pops with overshoot, glint), sandbox (robot pushes, cracks spread, glass shards fly, "breached"), alarm (LED blink, shake, shockwave rings, smoke), rack (units power on, drive LEDs, red alert pulse), logbook (red pen travels and rewrites each line), camera (shutter press, iris closes, flash + lens flare). Demo = 8 objects × 2.5 s with the finish layer. NEXT: E (transitions), F (endings), then A, B.
- ADVANCED PASS, group E (12 Nov): code-reveal = picture breaks into flipping blocks → real editor (title bar + tabs, line numbers, syntax colours incl. functions/types/numbers, current-line highlight, typing caret, RGB glitch at the turn). light-wipe = anamorphic streak: core + RGB fringe + motion smear + horizontal lens streak + flare ghosts + sparkles. stage-flip = circle with glowing rim + ripple, new mode "turn" (3D card turn, `turn(state)` for content). blade-cut = steel blades with motion trails + sparks where they bite + flash; sides tip and fall in 3D; kept piece rises with white rim + glow. film-strip = real film (celluloid, sprocket holes, frame numbers, warm tint) with our real frames, curving away with depth blur, glowing playhead, corner brackets + score on picks. clip-stack = our real covers in a 3D fan (card thickness, shadow, glass glint), bouncy stack. world-camera unchanged (engine). NEXT: F (captions, presenter, rail, endings, cover), then A, B.
- FREE v2 (13 Nov, owner: "create the FREE video using these keyframes"): same Shlok take + script, rebuilt on the advanced library: hook = mechanical counter (star icon, wheels land on "free.", sparks); light-wipe into step 1 + the existing one into step 3; ₹0 bill in glow look; catch adds a server rack (props "rack") that powers on and turns red on "your code goes to whichever company you pick", then the advanced strike-row (laptop "private code" struck with a flash, "practice projects" ticked); finish layer (grain, vignette, handheld drift) over the whole reel. Sound: 90 effects (25.6/10 s), 5 stop-downs. QA 96/100, 0 fails. studio/finals/claude-free.mp4 + _nomusic replaced; previous page kept as reels/free/index.v1-shlok.html.
- FREE _notlikeus (13 Nov, owner asked): "Not Like Us" from source 71.49 s (lipost/audio/nlu.wav) → the quiet breakdown plays under the spinning counter and the song's drop (75.2 s) lands on "free." (3.71 s) as the counter settles; music dipped to 30 % under "But here's the catch" (20.41 s); 1.4 s fade-out; sfx_pro stop-downs against the song; mix gain 0.14, -14.0 LUFS. QA 96/100, 0 fails. studio/finals/claude-free_notlikeus.mp4.
- FREE v3 REAL SCREENS (13 Nov, owner: "show the exact screens, real ss of the repo and real Claude"): new library block `real-screen` (B): real screenshot in a phone/browser/window frame with scroll, zoom-to-spot (KF.keys) and highlight boxes in image pixels (labels kept inside the safe margin). Screens: github.com repo page on a phone (Playwright, 13 Nov: repo name → 69.4k stars → scroll to the real Quick Start install line), build.nvidia.com ("Free inference with leading models"), the project's README images: Admin page "Cloud providers" (boxes on NVIDIA NIM, Gemini, Groq), Claude Code running through it ("same app", "same commands"), /model picker with the free gemma model boxed red "NOT CLAUDE: a free model". Hook counter now 69,411 (★ checked 13 Nov; voice "sixty-eight thousand" still true). NVIDIA/Groq key pages need login → public pages only. Footnotes name each source. QA 96/100, 0 fails (warn: busiest 5 s at 21 %). Finals: claude-free.mp4, _nomusic, _notlikeus replaced. Screenshots in studio/reels/free/real/.

## 13 Nov 2026 · MEME poster: Microsoft outage
- Real event: Microsoft 365 outage (Outlook, Teams, OneDrive, Copilot) from 12 Nov, still going 13 Nov (CNN, NBC; Microsoft says not a breach).
- Poster v2 `studio/reels/msmeme/poster.png` (1080×1350, HTML beside it; v1 kept as poster.v1.*). Joke: rule of three, Claude keeps offering the broken apps: check your inbox → OUTLOOK IS DOWN → "You're absolutely right! quick Teams call" → TEAMS IS ALSO DOWN → "save the fix to your OneDrive" → 💀.
- v3 (current poster.png; v2 kept as poster.v2.*): headline "Microsoft at 3 AM:", big red "🔥 everything is on fire" pill, punchline row in yellow, our mascot as the 💀 sender. Self-rating: v1 5.5, v2 8, v3 9.
- v3.1 (current poster.png; plain v3 kept as poster.v3.*): small Microsoft four-square logo before the headline, drawn in CSS. Owner asked for it. Satire label stays.
- Rule: no real CEO face or name in fake images. Microsoft logo only small, next to the word, never made to look like an official post. Post while the outage is live; delete or leave it once it has been fixed for 2+ days.

## 14 Nov 2026 · KEYFRAMES realism pass, all groups A–F (owner: "each keyframe must look real, from the laptop to everything")
- Method: pulled real photos (Openverse, CC) of each object and used our real screenshots, rendered ours beside them, listed the gaps, redrew. Web photos were too messy to paste into scenes, so they are references only (not committed). Rules + per-object checklist: `skills/speedy-explainer-reel/references/realism.md`.
- New core: `KF.device("iphone"|"macbook"|"browser"|"window")` in `kf.js` (titanium iPhone with Dynamic Island + status bar, MacBook with notch and opening lid, Chrome toolbar, macOS title bar). All screen blocks now sit on it.
- New block: `laptop-frame` (B). `real-screen` got `frame: "laptop"` and real phone/browser/window frames. Library is now 45 folders, 44 with code.
- Rebuilt to match the real product: phone-frame (iOS lock, call, settings), repo-card (GitHub), folder-window (Finder), agent-log (Claude Code), prompt-box (claude.ai), calendar (iOS Calendar), product-page (store), article-card, deploy-list, dashboard, code-reveal (VS Code), ending-follow + ending-comment (Instagram), world-map (real coastlines).
- Props: camera redrawn as a real DSLR; vault, rack, alarm, lock got real details. Finger got a nail, creases and print ridges; magnifier got a chrome rim and handle.
- Left as they are (our own brand style, no real-world original): captions, presenter, chapter-rail, cover, finish, and the abstract diagrams (arcs, waves, point cloud, tiles, flow nodes).
- Limits: text stays bigger than in real apps for phone readability; no real brand names on props; no verified badge unless the account has one; demo articles use made-up sites.
- Check tools: `scripts/kfshot.mjs`, `scripts/kfall.mjs` (all 44 blocks, 0 errors), `scripts/kfsheet.py`. Sheet of everything: `keyframes/_assets/contact-sheet.jpg`.
- Old reels are unaffected (each reel keeps its own `kf/` copy). New reels pick up the new look.
- To do: before-after's finger and the sandbox robot are still simple; world-camera and podcast-set are docs only.

## CHANNEL (14 Nov 2026): "Eleven free Claude skills that run your YouTube channel. Everyone's posting about them. Here's what they really do." — BUILT on the scratch voice, waiting for a Shlok take
- Why: Instagram scan 14 Nov (TOPICS.md): the YouTube Agent skill is behind the biggest reels in our niche (one ~1.3M est.). Owner picked it over CONNECT (next) and ULTRA. Part 3 of YOUTUBE → SHORTS.
- Topic: Jakeschincariol/youtube-agent-skill (5,838★, MIT; 11 commands /yt-script … /yt-audit + 6 Python tools). Facts, script, post copy: drafts/channel/. README + every SKILL.md read from a fresh clone. We did NOT run its tools (the session's safety check blocks running downloaded code), so the reel says what it does, never "I tested it"; the three command screens are labelled "Sample output".
- Honest catch (from the README's own "fine print"): it does not publish, it does not edit video, the hook score is a heuristic. Viral reels overclaim → our angle.
- VOICE: owner said "use ElevenLabs". Estimate 781 credits; the one take FAILED, not charged: 10 credits left of the 40,000 quota (flow f2k8ou6bmrnuH4Od0luO). No retry. Built on the local voice-studio `house` voice (44.8 s raw → paced 37.4 s, tempo 1.12, 9 stops). The owner also has a `canwe-voice` connector (his cloned voice); he stopped that take and asked for ElevenLabs instead.
- Tagged script for the Shlok take is in the flow and drafts/channel/script.md: [curious] hook → [matter of fact] steps → [excited] viral → [serious] catch → [warmly] CTA. After a top-up: one take → align → pace → `words.json` → re-render (scenes follow word times, `at("And", 3)` etc.).
- Build (first reel on the 14 Nov realistic keyframes): hook = red play tile + the 11 command chips, then three quote bubbles of what viral reels claim; real GitHub page in the new iPhone (real-screen); the link typed into the Claude chat box (prompt-box) + "✓ 11 skills installed"; three Claude Code windows (KF.device window) typing /yt-script, /yt-edit, /yt-viral with sample rows; catch = two strike-rows (edits ✕, uploads ✕ → record ✓ cut ✓ post ✓) and the README's fine print in the phone with the "heuristic, not a predictor" line boxed; ending-comment CHANNEL. Captions show "/yt-script" for the spoken "Y T script". 38.9 s, QA 92/100, 0 fails.
- Library fix: ending-comment takes `size` (use ~92 for a 7+ letter keyword).
- Files: studio/reels/channel (page, cover, words, cues, real screenshot), studio/finals/claude-channel_scratchvoice.mp4 + _nomusic + channel-cover.png.
- Automation #87 CHANNEL on @canwe.ai: OFF, exact match, follow gate, all reels → on "uploaded" lock it to the media id first (CHANNEL is a common word), then turn ON.
- Guide /channel/ LIVE + hub line (dpl_5NmykiRuAVQWc6Bz59A3bs8f1G3F): install (3 ways), voice.md first, all 11 commands, a first week for students, the fine print.
- NEXT: Shlok take after the ElevenLabs top-up (or the owner's own voice via dub.py / canwe-voice) → final render → post. Then CONNECT (5 free connectors we really use).
