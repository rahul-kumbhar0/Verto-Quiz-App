# SLOP test reel (11 Nov 2026): first reel built only from keyframes blocks
Topic: heydamir/unslop (14,424 ★ checked 11 Nov, CC BY 4.0). Voice: local voice-studio `house` (free, no ElevenLabs credits). 35.6 s.
Blocks used: captions, presenter, chapter-rail, stage-flip, light-wipe, before-after, tracked-labels, repo-card, agent-log, article-card, strike-row (×3), props (lock), ending-comment, KF.loopBack.
Rebuild: copy `speedy-explainer-reel/keyframes/*` + `assets/template/avatar.js` into `kf/`, fonts into `assets/template/fonts`, then `node tools/render.mjs index.html --cues cues.json` → sfx_pro → `MBLUR=3 node tools/render.mjs index.html out/video.mp4 auto 30 6` → mix.sh. QA 89/100, 0 fails.
Not a post yet: no automation / guide page, voice is the local test voice.
