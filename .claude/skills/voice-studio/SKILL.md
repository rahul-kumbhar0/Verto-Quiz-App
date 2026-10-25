---
name: voice-studio
description: "Local, offline voice studio (no ElevenLabs, no API keys, no credits): text-to-speech with 54 built-in voices in 9 languages incl. Hindi, a voice DESIGNER that blends voices into your own named house voice, pitch/speed tuning, an audition page, a browser studio UI, and narration with per-word timings for captions. Use whenever a reel/video/podcast needs a voiceover, when ElevenLabs is out of credits or blocked, or when the user says 'make the voice', 'local voice', 'voice studio', 'create a voice', 'house voice', 'TTS', 'voiceover', 'narrate this'. The speedy-explainer-reel skill uses it as its default voice route."
---

# Voice Studio (local)

Everything runs on the user's own machine or in a Claude session: Kokoro-82M (ONNX int8, ~92 MB)
on CPU, about real-time or faster. One tool, `scripts/studio.py`; voices are tiny JSON recipes in
`voices/`. Install once, use forever, nothing leaves the computer.

## Setup (once per machine or session, ~1 min)
```bash
VS=<this skill's folder>
python3 $VS/scripts/studio.py setup      # pip installs kokoro-onnx soundfile numpy pocketsphinx + downloads the model to ~/voice-studio/models
```
Setup creates a private environment `~/voice-studio/venv` (system Pythons on Ubuntu/Homebrew refuse
pip installs); every later command re-launches itself inside it, so `python3 studio.py …` always works.
Needs Python **3.10–3.13** (3.14 not supported by the engine yet); ffmpeg only for `--pitch`/`.mp3`.
User-facing one-click: `start-studio.bat` (Windows), `start-studio.command` (Mac double-click) or
`start-studio.sh`; first run installs, then opens http://localhost:7860. Walk a user through
`SETUP.md` step by step when they set it up on their own machine. In Claude cloud sessions the model downloads from GitHub releases,
which is allowed; Hugging Face is not needed.

## The house voices (in `voices/`, shared through the repo)
| Name | Recipe | Use |
|---|---|---|
| `house` (default) | am_michael 65% + am_fenrir 35%, 1.10× | the reel narrator: calm, clear, slightly deeper |
| `house-bright` | am_michael 60% + am_puck 40%, 1.12× | hype / energetic topics |
| `house-uk` | bm_george 60% + bm_lewis 40%, 1.08× | British narrator |
| `house-female` | af_heart 70% + af_bella 30%, 1.08× | female narrator |
| `house-hindi` | hm_omega 70% + hm_psi 30%, 1.00× | Hindi / Hinglish reels |
Change the brand voice with one command (overwrites the recipe; every reel picks it up):
`python3 $VS/scripts/studio.py design house --mix am_michael:0.5,am_onyx:0.5 --speed 1.1 --shared`

## Commands
```bash
S="python3 $VS/scripts/studio.py"
$S voices                                         # list built-in + designed
$S say "Hello" -v house -o hello.wav              # one line (.wav or .mp3)
$S say "Hello" -v "am_michael:0.6,bm_george:0.4" --pitch -1 --speed 1.05 -o x.wav   # inline blend, no save
$S design NAME --mix a:0.6,b:0.4 [--speed --pitch --lang --note --shared]   # new named voice + sample
$S audition -o auditions/ [--voices house,am_onyx,…] [--text "…"]           # one file per voice + index.html
$S narrate narration_spoken.txt -v house -o audio/voice.wav --words words.json
$S serve                                          # browser studio (blend sliders, play, download, save)
```

## Narration for reels (what the speedy reel skills call)
1. `narration_spoken.txt`: ONE SENTENCE PER LINE, numbers/acronyms spelled as spoken ("twelve
   thousand two hundred eighty-eight", "G P T three"). A single paragraph is auto-split at . ? ! :
2. `narrate … --words words.json` writes the voice, `voice_lines.json` (exact line spans) and
   per-word timings via per-line forced alignment (pocketsphinx). It prints `N/N lines
   force-aligned`; a line it can't align gets proportional timing inside its exact span and the
   reason is printed — usually a word missing from the dictionary: add it to `voices/dict.txt`
   (`word  PH ON EM ES`, ARPAbet). Common tech words (chatbot, LLM, API, Supabase, GitHub…) are built in.
3. Captions then come from `captions.py words.json … display.json` in the reel skill.
Word timings are English-only; for Hindi narration use `fake_timings.py`-style proportional timing
from the line spans (the spans themselves are exact).

## Choosing / designing a voice (do this with the user once)
Run `audition` over the house voices plus 4–6 built-ins, send `auditions/index.html` and the wavs
(SendUserFile), ask which one or which blend. Blends of two voices of the same language and gender
sound most natural; keep the main voice ≥ 55 %. Pitch beyond ±2 semitones starts to sound processed.
Speed 1.05–1.12 matches the reference reels' 2.6–2.8 words/s.

## Limits (say so when relevant)
- No cloning of a real person's voice: built-in voices and blends only. Cloning the user's own voice
  needs a heavier model (e.g. F5-TTS / Chatterbox from Hugging Face) on their machine.
- Emotion tags like [excited] are not supported; shape delivery with punctuation and sentence length.
