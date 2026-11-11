# canwe.ai reel studio: backup of /root/reel-work (11 Nov 2026)

The cloud container is temporary. Everything needed to rebuild or re-render the reels is here.

| Folder | What | Restore to |
|---|---|---|
| `tools/` | the pipeline: render.mjs, align/pace/dynamics/captions, music.py, mix.sh, sfx_pro.py, reelqa.py, reeltext.mjs, foot_prep.py, cover/shot helpers, stack/es.py | `/root/reel-work/tools` (then `bash setup.sh`) |
| `reels/<name>/` | every reel project's source: index.html, engine/speedy/avatar/world3d/foot js+css, script.md, words.json, captions, cues, music.json, voice*.mp3 (paid ElevenLabs takes), img/, logos/, foot/ frame sets | `/root/reel-work/reels/<name>` (fonts come from the skill template) |
| `sfxbank/` | earshot sound-effect bank (MIT), used by sfx_pro.py | `/root/reel-work/sfxbank` |
| `finals/` | rendered reels still waiting to be posted: SHORTS (+ no-music, cover), FABLE (+ no-music, cover) | — |

Not backed up (regenerable or too big): rendered frames + out/*.mp4 of already-posted reels (re-render with `MBLUR=3 node tools/render.mjs reels/<name>/index.html out.mp4 auto 30 6`), audio/*.wav (rebuilt from voice.mp3 by the pipeline), `ext/` (the 5 open-source repos, re-fetch per reel-pro-stack SKILL.md), `ref/` `stories/` `logo-src/` `hf-test/` (reference downloads).
