cd /root/reel-work
node tools/render.mjs reels/ai01/index.html reels/ai01/video.mp4 auto 30 6 > reels/ai01/render.log 2>&1
bash tools/mix.sh reels/ai01/video.mp4 reels/ai01/audio/voice_paced.wav reels/ai01/audio/sfx.wav reels/ai01/audio/music.wav 47.03 reels/ai01/out/ai-day1.mp4 0.10 > reels/ai01/mix.log 2>&1
bash tools/mix.sh reels/ai01/video.mp4 reels/ai01/audio/voice_paced.wav reels/ai01/audio/sfx.wav none 47.03 reels/ai01/out/ai-day1_nomusic.mp4 >> reels/ai01/mix.log 2>&1
bash tools/qa.sh reels/ai01/out/ai-day1.mp4 reels/ai01/qa.png >> reels/ai01/mix.log 2>&1
echo DONE >> reels/ai01/mix.log
