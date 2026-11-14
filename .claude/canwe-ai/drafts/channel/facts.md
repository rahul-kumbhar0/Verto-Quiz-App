# CHANNEL: facts (checked 14 Nov 2026)

Source: github.com/Jakeschincariol/youtube-agent-skill (README + SKILL.md files read in full from a fresh clone, commit a2feb21 of 16 Sep 2026). Stars via api.ossinsight.io: 5,838★, 1,668 forks. Licence MIT.

- "Eleven Claude skills that run a YouTube channel. Free, MIT, no signup, no API key, nothing to connect." (README line 1)
- Install: paste the repo link into Claude + "Install this skill, then confirm /yt-script works." Or `git clone` + copy `skills/yt-*` to `~/.claude/skills/`. Or `/plugin marketplace add Jakeschincariol/youtube-agent-skill` → `/plugin install youtube-agent`.
- The eleven: /yt-script (5 hooks off 21 formulas, scored, then the spoken script) · /yt-package (title + thumbnail as one pairing) · /yt-edit (transcript → edit decision list: dead air, filler, retakes, timecodes) · /yt-comment · /yt-plan (one anchor, one cheap one, three Shorts) · /yt-viral (niche videos ranked by multiple over each channel's own median) · /yt-retention (reads YOUR retention export) · /yt-shorts · /yt-seo · /yt-chapters · /yt-audit (ends in ONE fix).
- Six Python tools, no dependencies (hookscore.py, title.py, deadair.py, chapters.py, retention.py, swipe.py).
- Fine print (README's own words): "It does not publish." · "hookscore.py is a heuristic, not a predictor" (built on 74 hooks; "separates a given creator's hits from their own misses barely at all") · "/yt-viral reads, it does not scrape" · "Tags barely matter" · "Nothing invents a number."
- No Claude Code? Paste one SKILL.md into a chat; you lose the six Python tools.
- voice.md: fill it in (or give Claude three of your videos) so scripts sound like you.

What we can and cannot claim:
- We did NOT run its tools (the session's safety check blocked running downloaded code). So: no "I tested it" line; demo screens are labelled "sample".
- "Everyone's posting about them": true, Instagram scan 14 Nov found 8+ reels on this repo in 3 weeks (largest ~1.3M est. views).
- It does NOT edit video and does NOT upload. Some viral reels say it does (one adds a separate paid-style connector for posting; not part of this repo).
