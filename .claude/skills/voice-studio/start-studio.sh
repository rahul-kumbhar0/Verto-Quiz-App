#!/usr/bin/env bash
# Mac / Linux: run  bash start-studio.sh  (Mac users can double-click start-studio.command instead).
# First run installs everything (needs Python 3.10-3.13), then opens the studio in your browser.
cd "$(dirname "$0")/scripts"
PY=""
for c in python3.12 python3.13 python3.11 python3.10 python3 python; do
  if command -v $c >/dev/null 2>&1 && $c -c 'import sys; sys.exit(0 if (3,10) <= sys.version_info[:2] <= (3,13) else 1)' 2>/dev/null; then PY=$c; break; fi
done
if [ -z "$PY" ]; then
  echo "Need Python 3.10–3.13. Install Python 3.12: https://www.python.org/downloads/release/python-3128/  (Mac: or  brew install python@3.12)"
  exit 1
fi
echo "Using $($PY --version)"
if ! [ -f "$HOME/voice-studio/models/voices-v1.0.bin" ] || ! "$HOME/voice-studio/venv/bin/python" -c "import kokoro_onnx, soundfile, pocketsphinx" 2>/dev/null; then "$PY" studio.py setup || exit 1; fi
"$PY" studio.py serve
