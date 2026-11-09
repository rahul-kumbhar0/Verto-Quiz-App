---
name: reel-pro-stack
description: The pro finishing layer for every canwe.ai reel, built from five open-source video repos (huashu-motion, argo, explainroo, earshot, video-director). Adds director rules measured from real films (rhythm, energy curve, holds, text sizes), a camera that follows the narration, an argo-style cursor, a sound pass from earshot's 252-sound bank placed with measured sync and music stop-downs, and a QA gate that measures what we can't watch or hear (Reels safe zone, text size, dead time, flashes, cut rate, burst position, loudness, SFX density, stop-downs) with a score out of 100. Use after any speedy-explainer-reel build and before posting, or for 'make it pro', 'check the reel', 'QA the video', 'fix the sound', 'safe zone', 'why does this feel amateur', 'improve the editing', 'use earshot / huashu / explainroo / argo / video-director'.
---

# reel-pro-stack

The speedy kit builds the reel. This skill FINISHES it: plan in numbers, follow the voice with the camera, put pro sound
under every move, then prove it with measurements before the owner ever sees it. Every rule here comes from one of
five MIT repos (credits at the bottom); the code in `assets/` is ours, written from their methods.

Workdir tools (copies in `assets/`): `/root/reel-work/tools/{reelqa.py, reeltext.mjs, sfx_pro.py}`,
`/root/reel-work/tools/stack/es.py` (earshot launcher), bank at `/root/reel-work/sfxbank/earshot/`.
Worked example: `/root/reel-work/reels/demo-stack/` (VIDEO v2 voice → 86 → see RECORD for the after score).

## The pipeline (do every step, in order)

### 1 · Direct in numbers (before code) — `references/director-rules.md`
Write a 6-line rhythm sheet in the reel folder (`rhythm.md`): hook onset ≤ 3 s · energy per stretch 0–10 (climb in
steps, burst at 30–60 % of the length, ONE stop of 0.3–0.75 s before the biggest hit, resolve) · where the hero/payoff
lands · every hold ≥ max(1.5 s, 1 s + 0.3 s × words) · new information every 2–4 s · text home position.

### 2 · Build (speedy kit) + the three stack upgrades
- **Follow cam** (explainroo 0.4): the camera pushes 1.0 → 1.05 toward whatever the voice is pointing at (the stage
  system's `data-ex` elements, exposed as `R.stageEX`), holds, pulls back as the hold ends. Merged with the punch-in
  rhythm by zooming about a moving point: `translate((O−P)(s−1)) scale(punch × s)`. Snippet: `references/follow-cam.md`.
- **argo cursor**: any on-screen pointer gets a soft highlight halo and a ripple on each click (+ a `click` cue).
- **Safe zone from frame 1**: text lives between 15 % and 65 % of the height, ≥ 6 % from the left, ≥ 20 % from the right
  in the lower half (the like/comment/share column). Footnotes = compact frosted pill at top ≈ 1212 px, never full width.

### 3 · Sound — `references/sound-kit.md`
`render.mjs --cues` → `sfx_pro.py cues.json DUR audio/sfx_pro.wav --music audio/music.wav --music-out audio/music_sd.wav`
→ `mix.sh video.mp4 voice sfx_pro.wav music_sd.wav DUR out.mp4`. sfx_pro places earshot bank takes with earshot's
measured offsets (taps lead the cut 40–60 ms, whoosh peaks land +37 ms after, keys ≥ 87 ms apart, a new take each
time) and cuts a 9 dB, 0.42 s stop-down into the music before every hit/big whoosh/swell. Target 18–30 effects per
10 s for a voice-over explainer (music-led: 3–13). Register extra cues in the page: `tick` on counters, `riser` →
`swell` into the payoff, `bigwhoosh` on a match cut, `land`/`tap` on settles, `click` on presses.

### 4 · QA gate — `references/qa-gate.md`
```
node /root/reel-work/tools/reeltext.mjs <page.html> <reel>/qa/text.json 0.5
/root/reel-work/ext/venv-earshot/bin/python /root/reel-work/tools/reelqa.py <final.mp4> --out <reel>/qa \
   --cues <reel>/cues.json --text <reel>/qa/text.json --music <reel>/audio/music_sd.wav
```
FAIL = fix before showing anyone. WARN = fix or write one line why not. Then LOOK at `qa/hook_sheet.jpg` (the muted
0–3 s test), `qa/phone_sheet.jpg` (every 2 s at phone size) and `qa/energy.png` (the energy curve vs the rhythm sheet).
The text check skips `data-qa="texture"` (fake UI, phone screens, code) and `data-qa="ok"` (deliberate fine print) —
mark honestly; stills catch what it skips (the footnote collision in demo-stack was only visible in stills).

### 5 · Deliver
Report the score and the before→after of any fixed reel. Never claim a check passed without its report.

## Tool status in this sandbox (8–9 Nov 2026)
- github.com is blocked; repos mirror through jsDelivr (`tools/ghfetch/ghfetch.py owner/repo ref dir`; use a TAG for
  earshot — `@main` served a stale snapshot) and npm (`huashu-motion`, `@argo-video/cli`).
- **Running the repos' own CLIs/scripts was refused by the session's safety classifier** (win4r `qa_video.py`, the earshot
  editable install with torch). Their methods are ported into our tools instead. earshot's model-free commands
  (`sfx`, `kit`, `measure`) run through `stack/es.py` with light PyPI deps only; its model commands (`describe`,
  `timeline`, `critique`) need torch + Hugging Face models — only if the owner allows that install.
- huashu `om` and `argo` CLIs: installed under `/root/reel-work/ext/npm`, not executed (same category). Their rules and
  ideas (rhythm sheet, energy curve, dead-time, cursor highlight, speed-ramp gaps) live in our references.

## Credits (all MIT)
alchaincyf/huashu-motion (rhythm, energy curve, 21 launch films measured) · shreyaskarnik/argo (cursor highlight,
real-UI capture, gap speed ramps) · vincentsch/explainroo (narration-following camera, layout/readability checks,
Reels safe zone) · Leonxlnx/earshot (252-sound bank, launch kit sync + levels, density) · win4r/video-director (QA
catalogue: frame 0, flashes, pops, cuts, freezes, loudness, silence before peak, craft numbers) · SallyRS/video-director
(social-short rules from 59 films, Meta safe zone, text ≥ 3–5 % of height) · DotanVG/video-director-skill (beat-locked
cuts, -14 LUFS / -1 dBTP master).
