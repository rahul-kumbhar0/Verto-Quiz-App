# YouTube × Claude — facts (checked 3 Nov 2026)
- youtube-agent-skill (github.com/Jakeschincariol/youtube-agent-skill): 4.3k ★, MIT, 11 skills: /yt-script (5 scored hooks from 21 formulas,
  retention beats), /yt-package (title + thumbnail checked together), /yt-edit (edit list from a transcript), /yt-comment, /yt-plan, /yt-viral,
  /yt-retention, /yt-shorts, /yt-seo, /yt-chapters, /yt-audit. 6 Python tools. "Nothing gets published until you do it." It does NOT connect to
  the YouTube API ("no signup, no API key, nothing to connect").
  Install: /plugin marketplace add Jakeschincariol/youtube-agent-skill → /plugin install youtube-agent (or clone + copy skills/yt-* to ~/.claude/skills/).
- Connector (the upload/manage part) = a YouTube MCP server with YOUR OWN Google Cloud OAuth. Example read: pauling-ai/youtube-mcp-server
  (MIT, ~30 ★ — small; pick + audit one before filming): Google Cloud project → enable YouTube Data API v3 (+ Analytics/Reporting optional) →
  OAuth consent screen External + add the channel-owner account as a test user → OAuth client ID type "Desktop app" → download
  client_secret.json → first run opens Google sign-in, token saved locally. Tools: upload, update metadata, thumbnail, comments, analytics.
- Quota: default 10,000 units/day; upload = 1,600 units → ~6 uploads/day (server README; matches YouTube API docs).
- YouTube API policy: videos uploaded via videos.insert from UNVERIFIED API projects created after 28 Jul 2020 are restricted to PRIVATE
  until the project passes an audit → you publish manually (fits our "Claude never presses post").
- Google OAuth: apps in "Testing" with External users get refresh tokens that expire after 7 days → re-sign-in weekly (guide FAQ).
- Trend proof (1 Nov PullRows scan): YouTube Agent Skill reel @ai.nxtlvl ~244K views, 21K comments.
- MUST BE TRUE BEFORE FILMING: the canwe.ai YouTube channel is actually connected this way (owner signs in with the channel-owner
  Google account), and the Short in the demo is really uploaded (as private) via the connector. Screens = real.
