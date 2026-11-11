#!/usr/bin/env bash
# Clean a user's home voice recording for a reel: trim silence at both ends, remove rumble and hiss,
# gentle de-ess + compression, normalise. Output: 48 kHz mono WAV (feed it to transcription + mix.sh).
# usage: clean_voice.sh <input audio/video> <out.wav> [noise_floor_db=-28 | isolated]
#   pass "isolated" when the file already went through ElevenLabs Voice Isolator (or similar):
#   skips the noise reduction (it would make clean audio sound watery), keeps trim/EQ/levels.
set -euo pipefail
IN=$1 OUT=$2 NF=${3:--28}
DENOISE="afftdn=nf=$NF:nr=12:tn=1,"; [[ "$NF" == isolated ]] && DENOISE=""
ffmpeg -y -loglevel error -i "$IN" -vn -ac 1 -ar 48000 -af "\
silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15,\
areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.3,areverse,\
highpass=f=80,lowpass=f=14000,\
${DENOISE}\
deesser=i=0.35,\
acompressor=threshold=-21dB:ratio=3:attack=8:release=140:makeup=2.5,\
loudnorm=I=-16:TP=-1.5:LRA=9" "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT" | xargs printf "cleaned voice: %ss -> $OUT\n"
