# podcast-set

Our own 60-second "long video": a two-person podcast on a canwe.ai studio set (host = our presenter, guest = a second character), with wide shots, close-ups, name captions and lines from our own reels. Use it whenever a reel needs sample footage (clipping tools, caption tools, editors) so we never borrow someone else's video.

- Source: `podcast.html` (same file as `../../assets/examples/demo-podcast-longvid.html`; it loads `avatar.js` and `fonts/` from its own folder, so copy those next to it before rendering).
- Render: `node tools/render.mjs podcast.html full.mp4 60 15`, then `ffmpeg -i full.mp4 -vf crop=1080:608:0:0,scale=1280:720 podcast.mp4`.
- Cut it into frame sets for a reel with `scripts/foot_prep.py` (see `../../references/world3d.md`, "Real footage inside the world").
- Change the conversation by editing the `S` array at the top of the script: `[start, end, who, shot, pose, line]`.
