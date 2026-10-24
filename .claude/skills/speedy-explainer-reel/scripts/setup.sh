#!/usr/bin/env bash
# One-time setup for the SPEEDY reel pipeline.  usage: bash setup.sh ~/reel-work
# Needs: node ≥ 18 with playwright + chromium (pre-installed in Claude cloud sessions), ffmpeg, python3.
set -euo pipefail
W=${1:-$HOME/reel-work}; SK=$(cd "$(dirname "$0")/.." && pwd)
mkdir -p "$W/tools" "$W/reels" "$W/node_modules"
cp "$SK"/scripts/*.mjs "$SK"/scripts/*.py "$SK"/scripts/*.sh "$W/tools/"
# render.mjs imports playwright relative to ITS OWN folder -> make it resolvable next to tools/
if ! node -e "require.resolve('playwright')" >/dev/null 2>&1; then (cd "$W" && npm i --silent playwright@1.49.1) ; fi
PW=$(node -e "console.log(require('path').dirname(require.resolve('playwright/package.json')))" 2>/dev/null || true)
[ -n "$PW" ] && ln -sfn "$PW" "$W/node_modules/playwright"
python3 -c "import numpy, scipy" 2>/dev/null || pip install -q numpy scipy
python3 -c "import pocketsphinx" 2>/dev/null || pip install -q pocketsphinx || echo "pocketsphinx unavailable: align.py (forced alignment) disabled; use fake_timings.py or a words.json from ElevenLabs/Whisper"
command -v ffmpeg >/dev/null || { echo "ffmpeg missing"; exit 1; }
echo "ok: tools in $W/tools · new reel: cp -r $SK/assets/template $W/reels/<slug>"
