# Sound kit — earshot bank + measured sync (Leonxlnx/earshot 0.4.1, kits/launch.json)

## One-time: render the bank takes (already done in /root/reel-work/sfxbank/earshot/)
```
E="/root/reel-work/ext/venv-earshot/bin/python /root/reel-work/tools/stack/es.py"
$E sfx list                                   # 252 sounds, model-free
$E sfx render ui_pop/soft --seed 108 -o pop_1.wav   # a new seed = a new take; name files <role>_<n>.wav
```
Roles we render (role ← bank id, takes): pop ← ui_pop/soft ×4 · land ← pro_pop_in/round ×4 · tap ← tap/finger ×3 ·
tock ← knock/wood ×3 · hit ← cut_hit/punch ×2 · drop ← cut_hit/kick ×2 · whoosh ← whoosh_fast/crisp ×3 ·
swish ← swish/bright ×3 · whooshbig ← whoosh_big/thump ×2 · riser ← riser/dark · swell ← reverse_swell/dark ·
key ← typing_key/clicky ×12 · keyret ×2 · click ← fit/click/floss_lid ×2 · ding ← notify/mid_tine ·
snap ← shutter/dslr ×2 · tick ← pro_hover_tick/ping ×3 · glitch ← glitch/mid ×2.

## Sync and level (sfx_pro.py ROLE table = earshot launch kit medians)
| role | level dB | aligned on | offset vs the cue | min gap |
|---|---|---|---|---|
| tap | −10 | onset | −60 ms (leads) | 115 ms |
| tock (knock) | −1.5 | onset | −40 ms | 100 ms |
| click | 0 | onset | −11 ms | 85 ms |
| pop | −8 | onset | +4 ms | 114 ms |
| land (pop-in thump) | −5.5 | onset | +30 ms | 159 ms |
| key | −1 | onset | +8 ms | 87 ms (new take per key) |
| whoosh / swish | −5.5 / −6 | PEAK | +37 ms | 200 ms |
| big whoosh | −6.5 | PEAK | +3 ms | 400 ms |
| riser | −3.5 | PEAK | −23 ms (≤ 2 a film) | — |
| swell | −5.5 | PEAK | +42 ms (≤ 1 a film) | — |
| hit + drop | −9 / −8.5 | onset | 0 | 300 ms |
| tick | 0 | onset | 0 | 66 ms |

Our engine cue → roles: pop→pop · swish→swish · whoosh→whoosh · impact→hit+drop · type (t..t2)→a key every
87–120 ms + a return key at t2 · click→click · ding→ding · shutter→snap · glitch→glitch · riser→riser ·
tick/tap/land/tock/swell/bigwhoosh→themselves. `{soft:true}` = −4 dB.

## Mix rules
- ONE gesture at a time: the music STEPS DOWN 6–12 dB for 0.3–0.5 s before a hit, drop, big whoosh or swell and
  comes back ON the hit. Nothing ducks under the effects (the voice sidechain in mix.sh stays).
- Density per 10 s: voice-over explainer 18–30 · music-led 3–13 · effects-led 30–38.
- Master −14 LUFS integrated, true peak ≤ −1 dBTP (mix.sh does it; reelqa checks it).
- Our ears are measurements: earshot `measure` (model-free) on any WAV/MP4 gives LUFS, peaks, envelope and bands.
  Model-based listening (`describe`, `timeline`, `critique` against 7 pro launch films) needs torch — ask first.
