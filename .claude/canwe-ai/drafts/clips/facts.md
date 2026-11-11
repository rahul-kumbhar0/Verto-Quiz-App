# CLIPS — JayWebtech/autoshorts (checked 11 Nov 2026; owner screenshot from an IG reel)
- What: local-first DESKTOP app (Tauri 2 + React + Rust + SQLite): import a long video/podcast → transcribe → AI ranks "viral moments" → cuts 9:16 clips, center-crop, captions via ffmpeg.
- Live: 1,494 ★ · 276 forks · created 22 Jun 2026 · last push 10 Nov 2026 (active). Installers on GitHub Releases: macOS .dmg (Apple Silicon / Intel), Windows .msi/.exe, Linux .deb/.AppImage.
- AI: two modes — (A) fully offline: Ollama (llama3.2 3B / qwen2.5 3B/7B) + local Whisper; (B) cloud keys: Deepgram (transcription) + DeepSeek (default, "<$0.001/transcript") or Claude ("$0.01–0.05 per run", README's own numbers).
- README's own honesty: local 3B/7B models "generally not recommended for viral moment detection" (too-short fragments) → the free offline mode is the weak one.
CATCHES (must be in any reel):
1. NO LICENSE on the repo (OSSInsight: license None) → code visible ≠ open source; don't call it "open source".
2. UNSIGNED builds: README tells you to bypass macOS Gatekeeper (xattr -cr) and Windows SmartScreen "Run anyway" → only install from the official Releases page.
3. Needs FFmpeg installed + API keys (Deepgram + DeepSeek/Claude) for good results; "free" = free app, small API cost.
4. Crop = CENTER crop (not face tracking) → speaker can be cut off if not centered.
5. "Viral moment ranking" = an AI guess, not a promise.
6. Only DeepSeek/Claude/Ollama — sends transcripts to whichever cloud you pick.
Fit: our VIDEO formula winners (I automated my reels / YouTube). Competes with paid clip tools (Opus Clip etc. — price NOT verified, don't quote).
MUST before filming: real test on the owner's laptop with one of our long videos (sandbox can't run a desktop GUI; downloaded-app execution also blocked here).
