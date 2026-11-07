# Story example: 1,000 followers (28 Oct 2026)

Three 9:16 Instagram Story slides in the house style, no voice (no ElevenLabs credits): SFX + music only.

| Slide | Length | What | Sticker the owner adds |
|---|---|---|---|
| frame1.html | 12 s | counter 0 → 1,000, confetti, eyes-pop shades gag, "Thank you" in the selection box | optional emoji slider |
| frame2.html | 10 s | the 4 ready reels with their DM keywords (OFFER, PROMPT, REFER, AGENT) | link sticker → canwe-guides.vercel.app (presenter points at it) |
| frame3.html | 8 s | "You pick the next reel", empty glowing zone | poll sticker (4 options) |

Build: copy the template's engine.js, avatar.js, props.js, props.css, speedy.css, fonts/, the canwe
logo and `logos/` (claude, linkedin) next to these files, then from `$HOME/reel-work`:
```bash
node tools/render.mjs <dir>/frameN.html <dir>/out/fN-video.mp4 auto 30 6
node tools/render.mjs <dir>/frameN.html --cues <dir>/audio/cuesN.json
python3 tools/sfx.py cuesN.json <dur> sfxN.wav
echo '{"bpm":118,"dur":<dur>,"groove_in":<hit>,"breaks":[],"fade_out":1.2,"key":"Em","seed":21}' > secN.json
python3 tools/music.py secN.json musicN.wav
bash tools/mix.sh fN-video.mp4 none sfxN.wav musicN.wav <dur> canwe-1k-story-N.mp4 0.55   # voice "none", music louder
```
Story rules learned: keep text between y ≈ 250 and 1560 (top bar / reply bar); leave an EMPTY zone
for native stickers (link, poll) and point the presenter at it; `k1.js` is a tiny manual presenter
driver (`K1(POSES, FX, BEATS)`) for pages without speedy.js. Custom classes are prefixed `k1-`.
