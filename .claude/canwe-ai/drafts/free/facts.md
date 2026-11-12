# FREE — Alishahryar1/free-claude-code (checked 12 Nov 2026)
- 68,932 ★ (api.ossinsight.io, 12 Nov) · AGPL-3.0 (README badge) · created 28 Jan 2026 · pushed 12 Nov 2026 · trendshift #1 this week.
- What: a local proxy ("FCC"). Your coding app (Claude Code + 11 others: Codex, Pi, OpenCode, Cline, Hermes, DeepSeek dsh, Grok, Muse, Aider, Antigravity) talks to FCC; FCC sends the request to a model from one of 61 providers (free, paid, subscription, local).
- README: "1.3B+ free tokens per month" (across providers); "Free-tier availability and limits are controlled by each provider and may change."
- Default model: NVIDIA NIM `nvidia/nemotron-3-ultra-550b-a55b` with a free key from build.nvidia.com. Others: OpenRouter free router, Groq llama-3.3-70b, Google AI Studio Gemini flash-lite, Hugging Face Qwen3-Coder, Ollama Cloud, local Ollama / LM Studio / llama.cpp.
- For Claude Code it maps Fable/Opus/Sonnet/Haiku slots to the models you choose. Keeps streaming, tool use, thinking. Retries, rate limits, fallback across models/keys.
- Install: one line, `curl -fsSL …/scripts/install.sh | sh` (Windows: PowerShell one-liner). Installer installs `uv`, then the coding apps you pick (Claude Code via claude.ai's own installer); `--dry-run` prints commands without running them. Then open "Free Claude Code" (Win/Mac) or run `fcc-server` (Linux) → Admin UI → add key → Apply.
- README: "Independent open-source project. Not affiliated with or endorsed by Anthropic."
CATCHES (must be in reel/guide):
1. The brain is NOT Claude: the Claude Code app answers with a free model (weaker on hard, long tasks).
2. Your code + prompts go to the provider you pick (their data rules; free tiers may use data) → no private/company code.
3. Free limits are each provider's, can change or end.
4. One-line installer → read it / run with --dry-run first.
5. Not from Anthropic. AGPL licence.
