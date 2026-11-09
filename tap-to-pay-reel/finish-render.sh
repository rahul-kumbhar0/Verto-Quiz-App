#!/bin/bash
# Finish the tap-to-pay showcase render. Run from tap-to-pay-reel/ AFTER freeing RAM
# (close Chrome tabs/apps; you want 1.5 GB+ free). Safe to re-run: skips finished chunks.
set -e
mkdir -p out/fr
for r in 0-204 205-420 421-702 703-921 922-1267 1268-1432; do
  if [ -d "out/fr/c$r" ] && [ "$(ls out/fr/c$r 2>/dev/null | wc -l)" -ge "$(( ${r#*-} - ${r%-*} ))" ]; then
    echo "chunk $r done"; continue
  fi
  echo "rendering $r …"
  GL=""; [ "$r" = "0-204" ] && GL="--gl=angle"   # WebGL beat needs hardware GL (software GL silently renders white)
  npx remotion render TapToPay "out/fr/c$r" --sequence --image-format=jpeg --jpeg-quality=90 \
    --frames=$r --concurrency=1 --scale=0.6667 $GL --log=error
done

# merge frames, normalizing to 4-digit padding (chunks mix padded/unpadded names)
mkdir -p out/fr/all
for d in out/fr/c*/; do
  for f in "$d"element-*.jpeg; do
    n=${f##*element-}; n=${n%.jpeg}; n=$((10#$n))
    cp -n "$f" "out/fr/all/$(printf 'element-%04d.jpeg' $n)" 2>/dev/null || true
  done
done
N=$(ls out/fr/all | wc -l); echo "frames: $N (expect 1433)"

# assemble: video from frames + the 8 VO clips delayed to their beat starts
# beat starts (frames): 0 205 421 553 703 922 1098 1268  -> ms at 30fps
ffmpeg -y -framerate 30 -i out/fr/all/element-%04d.jpeg \
  -i public/vo/b1.mp3 -i public/vo/b2.mp3 -i public/vo/b3.mp3 -i public/vo/b4.mp3 \
  -i public/vo/b5.mp3 -i public/vo/b6.mp3 -i public/vo/b7.mp3 -i public/vo/b8.mp3 \
  -filter_complex "\
[1:a]adelay=0|0[a1];[2:a]adelay=6833|6833[a2];[3:a]adelay=14033|14033[a3];\
[4:a]adelay=18433|18433[a4];[5:a]adelay=23433|23433[a5];[6:a]adelay=30733|30733[a6];\
[7:a]adelay=36600|36600[a7];[8:a]adelay=42267|42267[a8];\
[a1][a2][a3][a4][a5][a6][a7][a8]amix=inputs=8:normalize=0[aout]" \
  -map 0:v -map "[aout]" -c:v libx264 -crf 18 -pix_fmt yuv420p -c:a aac -b:a 192k \
  -t 47.77 out/tap-to-pay-showcase.mp4
echo "DONE: out/tap-to-pay-showcase.mp4"
