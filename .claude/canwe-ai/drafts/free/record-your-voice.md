# FREE reel: record your own voice (dub onto the finished video, no re-render)
Play `claude-free_novoice.mp4` (music + effects, captions on screen) and speak along with the captions, like karaoke. Upload the recording; `tools/dub.py` cleans it, matches every phrase to the original timing (speed 0.86–1.18×, pitch kept), adds the up/down per line and it is mixed onto the existing video.

| # | Starts | Ends | Line | How |
|---|---|---|---|---|
| 1 | 0.00 | 4.00 | Sixty-eight thousand people starred a repo that runs Claude Code for free. | ↑ excited, hit "free" |
| 2 | 4.49 | 6.07 | Here's what's actually answering. | ↓ quiet, like a secret |
| 3 | 6.51 | 10.68 | Step one. Install a free GitHub repo, Free Claude Code. | steady |
| 4 | 10.68 | 15.08 | Step two. Grab a free key from NVIDIA, Google or Groq. | steady, name each one |
| 5 | 15.08 | 19.42 | Step three. Open Claude Code. Same app, same commands, zero bill! | ↑ excited |
| 6 | 19.42 | 20.79 | But here's the catch. | ↓ slow, serious |
| 7 | 20.79 | 25.20 | The brain isn't Claude. It's a free model, so hard tasks come out weaker. | ↓ serious |
| 8 | 25.62 | 30.35 | And your code goes to whichever company you pick. Keep private projects off it. | ↓ firm |
| 9 | 30.35 | 33.60 | Comment FREE, I'll DM you the setup and the exact settings. | ↑ warm, smiling |
Run: `python3 tools/dub.py reels/free my_voice.m4a audio/voice_dub.wav --gains "1:1.5,2:-1.5,5:1.5,6:-1,7:-0.5,9:1"` then `mix.sh out/video.mp4 audio/voice_dub.wav audio/sfx_nlu.wav audio/nlu_sd.wav 35.2 out/claude-free_myvoice.mp4 0.14`.
