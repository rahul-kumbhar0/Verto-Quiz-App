cd /root/reel-work
node tools/render.mjs reels/mcp/index.html reels/mcp/video.mp4 auto 30 6 > reels/mcp/render.log 2>&1
bash tools/mix.sh reels/mcp/video.mp4 reels/mcp/audio/voice_paced.wav reels/mcp/audio/sfx.wav reels/mcp/audio/music.wav 41.69 reels/mcp/out/mcp.mp4 0.10 > reels/mcp/mix.log 2>&1
bash tools/mix.sh reels/mcp/video.mp4 reels/mcp/audio/voice_paced.wav reels/mcp/audio/sfx.wav none 41.69 reels/mcp/out/mcp_nomusic.mp4 >> reels/mcp/mix.log 2>&1
bash tools/qa.sh reels/mcp/out/mcp.mp4 reels/mcp/qa.png >> reels/mcp/mix.log 2>&1
echo DONE >> reels/mcp/mix.log
