# Voice Studio — step-by-step setup (your own computer)

Everything runs offline after step 4. Total time: about 10 minutes, mostly downloads.

## Step 1 — Install Python 3.12
The voice engine needs Python **3.10 to 3.13**. The newest Python (3.14) does NOT work yet.
- **Windows:** download https://www.python.org/downloads/release/python-3128/ → "Windows installer (64-bit)".
  On the first installer screen tick **"Add python.exe to PATH"**, then Install Now.
- **Mac:** same page → "macOS 64-bit universal2 installer", or in Terminal: `brew install python@3.12`.
Check: open a new Command Prompt / Terminal and run `py -3.12 --version` (Windows) or `python3.12 --version` (Mac).

## Step 2 — (optional) Install ffmpeg
Only needed for the pitch slider and .mp3 export.
- Windows: `winget install ffmpeg`   · Mac: `brew install ffmpeg`

## Step 3 — Get the files
Unzip `speedy-devv-skills.zip` somewhere permanent, e.g. `Documents/claude-skills/`.
You get four folders; the studio is `voice-studio/`.
(Or clone the repo and use `.claude/skills/voice-studio/`.)

## Step 4 — First launch (installs itself)
- **Windows:** double-click `voice-studio/start-studio.bat`.
- **Mac:** double-click `voice-studio/start-studio.command`
  (first time macOS may block it: right-click → Open → Open). Or in Terminal: `bash start-studio.sh`.
First run: creates a private environment in `~/voice-studio/venv`, installs the engine, downloads
the model (~120 MB) into `~/voice-studio/models`. It never touches your system Python.
When you see `Voice Studio on http://localhost:7860`, your browser opens the studio.

## Step 5 — Make your first voice clip
Type a line → pick a voice → press **Generate** → it plays. **Download WAV** saves it.

## Step 6 — Pick your house voice
Unzip `voice-auditions.zip`, open `index.html`, listen to all of them on the same sentence.
In the studio: set Voice A + Voice B + Blend + Speed until you love it → type `house` → **Save**.
That becomes the voice every reel uses.

## Step 7 — Use it from Claude Code (optional)
Copy the four skill folders into `~/.claude/skills/` (or keep them in a project's `.claude/skills/`).
Then just ask Claude: "make a speedy reel about <topic>". It narrates with your `house` voice
through this studio automatically.

## Every day after that
Double-click the launcher → studio opens in seconds. To stop it: close the window / Ctrl+C.

## If something goes wrong
| You see | Fix |
|---|---|
| "Python was not found" / "Need Python 3.10–3.13" | Step 1 (and tick "Add to PATH" on Windows) |
| "could not create the environment" (Linux) | `sudo apt install python3-venv`, launch again |
| Download stalls | check internet, launch again — it resumes what's missing |
| Pitch slider does nothing | Step 2 (ffmpeg) |
| Browser didn't open | open http://localhost:7860 yourself |
| Start over cleanly | delete the folder `~/voice-studio` and launch again |
