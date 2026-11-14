# LEARN: facts (14 Nov 2026)
- Trend: @igao.ia "Claude now learns from YouTube" ~380K / 8 d, 14.9K comments; @champmack "Claude can now watch YouTube videos for you and learn any skill" ~273K / 9 d, 11.9K comments (keyword LEARN). Neither names the tool in the caption.
- Tool: github.com/bradautomates/claude-video, the "Watch" plugin (`/watch`). 20,780★, 2,207 forks, MIT (ossinsight, 14 Nov). README read 14 Nov.
- What it does: "a URL or local file becomes timestamped frames and a transcript". Native captions first; optional local WhisperX or Groq/OpenAI for videos without captions. Optional Gemini engine (free Google AI Studio key): the whole video goes to Google's video model.
- Install: Claude Desktop → Customize → Plugins → Add → Add marketplace → Add from a repository → paste https://github.com/bradautomates/claude-video → Sync → install Watch → start a Code session. Terminal: `/plugin marketplace add bradautomates/claude-video` then `/plugin install watch@claude-video`.
- Needs: Python 3.10+, FFmpeg, current yt-dlp (it helps install them).
- LIMIT (their README): works in Claude Code only (Code session in Claude Desktop, VS Code, terminal). "Watch does not work in Claude Chat or Cowork."
- "Turn it into a skill" is NOT a button in Watch: it is a prompt you give after it watches; Claude writes a SKILL.md into ~/.claude/skills/. Our reel says "Then say: turn this into a skill".
- Catches we add: Claude Code needs a paid plan; the skill copies whatever the video says, including mistakes → read it; don't turn paid courses you have no right to into shared skills; Gemini path uploads the video to Google.
- We did NOT run it (session rule). Screens in the reel are samples and labelled.
