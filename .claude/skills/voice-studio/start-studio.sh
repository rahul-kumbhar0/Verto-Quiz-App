#!/usr/bin/env bash
# Mac / Linux: double-click (Mac: rename to .command) or run ./start-studio.sh — installs once, then opens the studio.
cd "$(dirname "$0")/scripts"
PY=$(command -v python3 || command -v python)
[ -z "$PY" ] && { echo "Install Python 3.10+ first: https://www.python.org/downloads/"; exit 1; }
[ -f "$HOME/voice-studio/models/voices-v1.0.bin" ] || "$PY" studio.py setup
"$PY" studio.py serve
