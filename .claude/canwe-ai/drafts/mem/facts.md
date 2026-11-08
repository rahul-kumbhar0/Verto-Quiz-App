# MEM — facts (README of thedotmack/claude-mem read 8 Nov 2026; re-verify at build)
- Pain (README's own words): "Every new session, your agent starts from zero. It re-reads the same files, re-asks the same questions, and walks back into mistakes you already fixed."
- What it does: runs a SECOND agent beside Claude that takes notes while it works; the next session opens with a compact index of past observations and pulls details only when needed.
- Install: `npx claude-mem install` (interactive: picks agents, asks about disabling Claude Code native auto-memory) OR inside Claude Code: `/plugin marketplace add thedotmack/claude-mem` → `/plugin install claude-mem` → restart. ⚠️ plain `npm install -g claude-mem` = SDK only, no hooks.
- Works with: Claude Code, Codex, Cursor, OpenCode + 11 more (Copilot CLI, Goose, Roo Code, Warp = search-only).
- Memory lives locally in ~/.claude-mem; cloud sync opt-in.
- CATCHES (say honestly): (1) the note-taking agent itself consumes tokens — your Anthropic plan, your own OpenRouter/Gemini key, or their paid "claude-mem observer" (30-day free trial that asks for a payment method at checkout; sign-in via email link; skippable with --provider / CLAUDE_MEM_ONLINE_OPTIN=false). (2) anonymous usage analytics ON by default — `npx claude-mem telemetry disable` turns them off.
- Trend: GitHub weekly trending, ~+7.5K stars this week (trendshift/medium roundups, 5–7 Nov). NO total star count on screen unless read live at build (github.com + api blocked in this session).
- MUST before filming: install it for real in a test project; the before/after memory demo on screen = that run.
