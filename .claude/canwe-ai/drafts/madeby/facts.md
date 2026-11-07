# "Claude made this reel" — facts (our real pipeline, verified in this repo)
- Scenes = HTML pages (speedy template) rendered frame by frame with Playwright/Chromium (tools/render.mjs), 30 fps.
- Real render logs: Day 1 3D = "1411 frames in 188s"; GROW 3D = "1469 frames in 169s". ~47 s × 30 fps ≈ 1,400 frames → "about fourteen hundred" (replace with THIS reel's exact count from render.log at build).
- Voice = ElevenLabs v3 "Shlok" reading Claude's script (NOT Claude's voice — say "an AI voice"). Captions aligned word by word (align.py, pocketsphinx) → captions.js.
- Music = tools/music.py, synthesized from code, no samples ("pulse" style). SFX = tools/sfx.py from cues the page registers.
- Hook scoring = reel-script-writer skill (10 hooks scored /12, script_lint.py).
- Trend research = PullRows trends_find + our insights (TOPICS.md).
- Human step: owner reads everything and posts (Claude never presses post).
- Hook WARN (no number in first 6 words) kept on purpose: frame 1 SHOWS the proof (the reel flipping to its code).
