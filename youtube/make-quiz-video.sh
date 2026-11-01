#!/usr/bin/env bash
# Render a quiz Short (1080x1920, ~16s) locally with ffmpeg.
# Usage: ./make-quiz-video.sh "Question?" "A) .." "B) .." "C) .." "D) .." "B" out.mp4
set -euo pipefail

Q="${1:?question}"; A="${2:?opt a}"; B="${3:?opt b}"; C="${4:?opt c}"; D="${5:?opt d}"
ANSWER_LETTER="${6:?answer letter e.g. B}"; OUT="${7:-quiz-short.mp4}"

FONT_BOLD=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf
FONT=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf

# Pick the answer option text for the reveal
case "$ANSWER_LETTER" in
  A) ANS_TEXT="$A";; B) ANS_TEXT="$B";; C) ANS_TEXT="$C";; D) ANS_TEXT="$D";;
  *) echo "answer letter must be A-D"; exit 1;;
esac

esc() { printf '%s' "$1" | sed "s/'/’/g; s/:/\\\\:/g; s/%/\\\\%/g"; }

# Wrap question into two lines near the middle
if [ ${#Q} -gt 28 ]; then
  MID=$(( ${#Q} / 2 ))
  HEAD="${Q:0:$MID}"; REST="${Q:$MID}"
  TAIL_OF_HEAD="${HEAD##* }"
  Q1="${HEAD% *}"; Q2="${TAIL_OF_HEAD}${REST}"
else
  Q1="$Q"; Q2=""
fi
Q1e=$(esc "$Q1"); Q2e=$(esc "$Q2")
Ae=$(esc "$A"); Be=$(esc "$B"); Ce=$(esc "$C"); De=$(esc "$D"); ANSe=$(esc "$ANS_TEXT")

ffmpeg -y -f lavfi -i "color=c=0x0b1026:s=1080x1920:d=16" \
  -f lavfi -i "anullsrc=channel_layout=stereo:sample_rate=44100:duration=16" \
  -filter_complex "
[0:v]
drawtext=fontfile=$FONT_BOLD:text='QUIZ TIME!':fontcolor=0xFFD54A:fontsize=120:x=(w-text_w)/2:y=260+20*sin(2*PI*t):enable='gte(t,0.3)',
drawtext=fontfile=$FONT:text='Can you answer before the time runs out?':fontcolor=white@0.85:fontsize=44:x=(w-text_w)/2:y=430:enable='between(t,0.8,15.5)',
drawbox=x=90:y=560:w=900:h=260:color=0x1b2447@0.95:t=fill:enable='gte(t,1.2)',
drawtext=fontfile=$FONT_BOLD:text='$Q1e':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=615:enable='gte(t,1.4)',
drawtext=fontfile=$FONT_BOLD:text='$Q2e':fontcolor=white:fontsize=52:x=(w-text_w)/2:y=690:enable='gte(t,1.4)',
drawbox=x=140:y=940:w=800:h=120:color=0xff8c42@0.9:t=fill:enable='gte(t,2.2)',
drawtext=fontfile=$FONT_BOLD:text='$Ae':fontcolor=white:fontsize=52:x=190:y=975:enable='gte(t,2.3)',
drawbox=x=140:y=1110:w=800:h=120:color=0xe63946@0.9:t=fill:enable='gte(t,2.8)',
drawtext=fontfile=$FONT_BOLD:text='$Be':fontcolor=white:fontsize=52:x=190:y=1145:enable='gte(t,2.9)',
drawbox=x=140:y=1280:w=800:h=120:color=0x457b9d@0.9:t=fill:enable='gte(t,3.4)',
drawtext=fontfile=$FONT_BOLD:text='$Ce':fontcolor=white:fontsize=52:x=190:y=1315:enable='gte(t,3.5)',
drawbox=x=140:y=1450:w=800:h=120:color=0x8d5bd4@0.9:t=fill:enable='gte(t,4.0)',
drawtext=fontfile=$FONT_BOLD:text='$De':fontcolor=white:fontsize=52:x=190:y=1485:enable='gte(t,4.1)',
drawtext=fontfile=$FONT_BOLD:text='%{eif\:max(0,10-(t-5))\:d}':fontcolor=0xFFD54A:fontsize=110:x=(w-text_w)/2:y=1680:enable='between(t,5,15)',
drawbox=x=90:y=1640:w=900:h=180:color=0x00c853@0.92:t=fill:enable='gte(t,15)',
drawtext=fontfile=$FONT_BOLD:text='Answer\: $ANSe':fontcolor=white:fontsize=60:x=(w-text_w)/2:y=1700:enable='gte(t,15)'
[v]" \
  -map "[v]" -map 1:a -c:v libx264 -pix_fmt yuv420p -r 30 -t 16 -c:a aac "$OUT"
echo "Rendered: $OUT"
