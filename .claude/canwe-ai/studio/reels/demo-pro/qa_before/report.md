# reelqa: demo-pro-final.mp4
1080x1920 30 fps 45.3 s · **score 86/100** (11 pass, 2 warn, 1 fail)

| | check | measured |
|---|---|---|
| PASS | frame 0 is a finished picture | contrast 96.8 |
| PASS | hook: visible change within 3 s | first onset 0.03s |
| PASS | no single-frame flashes | [] |
| PASS | few single-frame pops | 0: [] |
| PASS | no frozen stretches >= 1 s | [] |
| PASS | no dead time >= 2 s (huashu: nothing new for 2 bars) | [] |
| PASS | densest 5 s burst sits at 30-60 % of length | 16.13s = 36% |
| PASS | cut rate >= 10/min (21 launch films: 15-33) | 34 cuts = 45.0/min |
| PASS | loudness -14 LUFS ±1 | -14.6 LUFS |
| PASS | true peak <= -1 dBTP | -1.4 dBTP |
| WARN | music steps down >= 6 dB before each hit (earshot/huashu) | 0/5 hits: [] |
| PASS | SFX density 18-30 per 10 s (earshot launch kit, explainer) | 94 effects from 41 cues = 20.8/10 s |
| FAIL | text inside the Reels safe zone (top 15 %, bottom 35 %, right 20 %, left 6 %) | 35 violations: 0s 'Covers of reels already post' bottom; 7s '✓ every frame' left; 8s 'Followers: Instagram, first ' bottom+right; 10s '1,863' right; 10.5s '2,976' right; 11s '3,000+' right |
| WARN | readable text >= 3 % of frame height (58 px), hook >= 4 % | 68 small: 0s 'Covers of reels already ' 18px; 4.5s '✓ the script' 30px; 5s '✓ the captions' 31px; 6s '✓ every frame' 31px; 8s 'in 1 week' 26px; 8s 'Followers: Instagram, fi' 18px |

energy per second: [np.float64(2.18), np.float64(1.56), np.float64(5.07), np.float64(2.03), np.float64(1.21), np.float64(3.62), np.float64(3.97), np.float64(3.23), np.float64(4.22), np.float64(1.4), np.float64(4.32), np.float64(2.14), np.float64(2.81), np.float64(1.38), np.float64(4.42), np.float64(5.14), np.float64(1.7), np.float64(2.79), np.float64(3.68), np.float64(1.47), np.float64(2.95), np.float64(1.53), np.float64(4.07), np.float64(3.54), np.float64(1.87), np.float64(3.89), np.float64(3.19), np.float64(1.78), np.float64(5.65), np.float64(4.51), np.float64(0.83), np.float64(3.42), np.float64(7.51), np.float64(2.13), np.float64(7.65), np.float64(7.13), np.float64(4.19), np.float64(3.02), np.float64(3.7), np.float64(4.59), np.float64(0.77), np.float64(2.55), np.float64(2.66), np.float64(0.69), np.float64(0.47), np.float64(0.54)]
cuts: [6.53, 6.57, 7.87, 9.93, 9.97, 11.97, 14.4, 14.43, 14.47, 14.5, 14.53, 14.57, 16.83, 16.87, 18.43, 18.47, 18.53, 18.57, 18.6, 22.27, 22.3, 22.33, 22.37, 25.83, 31.7, 32.37, 32.4, 32.47, 32.5, 32.53, 32.57, 39.47, 41.13, 41.17]