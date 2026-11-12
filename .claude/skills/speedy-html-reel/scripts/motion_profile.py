"""Frame-by-frame motion profile of a reel (hero band y 30–72 %), to compare smoothness.
usage: python -I motion_profile.py out.json video1.mp4 [video2.mp4 ...]
Per frame: diff = mean |Δpixel| (0-255), med = median optical-flow px/frame (camera / whole-scene
motion), p90 = 90th-pct flow (the moving object). All at 270x480 analysis size.
Summary:
  dead%     frames where nothing moves (p90 < 0.12 px and diff < 0.5)
  cam%      frames where the whole band drifts (med > 0.08 px)
  pops/min  one-frame jumps: diff > 6 and > 5x the median of the 4 frames around it (a snap, no motion lead-in)
  jerk      mean |Δ² p90| / mean p90 over moving frames (lower = smoother acceleration)
  trans     moves = runs of >= 3 frames with p90 > 3 px; median run length (frames) and median peak px/frame
"""
import json, subprocess, sys
import numpy as np, cv2

W, H = 270, 480
def frames(path):
    p = subprocess.Popen(["ffmpeg", "-nostdin", "-v", "error", "-i", path, "-vf", f"scale={W}:{H},format=gray",
                          "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    n = W * H
    while True:
        b = p.stdout.read(n)
        if len(b) < n: break
        yield np.frombuffer(b, np.uint8).reshape(H, W)

out, vids = sys.argv[1], sys.argv[2:]
res = {}
y0, y1 = int(H * 0.30), int(H * 0.72)
for v in vids:
    name = v.replace("\\", "/").split("/")[-1].rsplit(".", 1)[0]
    prev, rows = None, []
    for f in frames(v):
        band = f[y0:y1]
        if prev is not None:
            d = float(np.mean(cv2.absdiff(band, prev)))
            fl = cv2.calcOpticalFlowFarneback(prev, band, None, 0.5, 3, 15, 3, 5, 1.2, 0)
            m = np.hypot(fl[..., 0], fl[..., 1]).ravel()
            rows.append((d, float(np.median(m)), float(np.percentile(m, 90))))
        prev = band
    A = np.array(rows); d, med, p90 = A[:, 0], A[:, 1], A[:, 2]; N = len(A)
    dead = np.mean((p90 < 0.12) & (d < 0.5)) * 100
    cam = np.mean(med > 0.08) * 100
    pops = 0
    for i in range(2, N - 2):
        nb = np.median(np.r_[d[i - 2:i], d[i + 1:i + 3]])
        if d[i] > 6 and d[i] > 5 * max(nb, 0.2): pops += 1
    mv = p90 > 0.3
    jerk = float(np.mean(np.abs(np.diff(p90, 2))[mv[1:-1]]) / max(1e-6, np.mean(p90[mv]))) if mv.sum() > 10 else 0
    runs, i = [], 0
    while i < N:
        if p90[i] > 3:
            j = i
            while j < N and p90[j] > 3: j += 1
            if j - i >= 3: runs.append((j - i, float(p90[i:j].max())))
            i = j
        else: i += 1
    dur = N / 30
    res[name] = {"seconds": round(dur, 1), "dead_pct": round(dead, 1), "cam_pct": round(cam, 1),
                 "pops_per_min": round(pops / dur * 60, 1), "jerk": round(jerk, 3),
                 "moves_per_min": round(len(runs) / dur * 60, 1),
                 "move_len_frames": int(np.median([r[0] for r in runs])) if runs else 0,
                 "move_peak_px": round(float(np.median([r[1] for r in runs])), 1) if runs else 0,
                 "series": {"d": [round(x, 2) for x in d], "med": [round(x, 3) for x in med], "p90": [round(x, 2) for x in p90]}}
    r = res[name]
    print(f"{name:28} dead {r['dead_pct']:5.1f}%  cam {r['cam_pct']:5.1f}%  pops/min {r['pops_per_min']:5.1f}  jerk {r['jerk']:.3f}  "
          f"moves/min {r['moves_per_min']:5.1f}  move {r['move_len_frames']:3d}f  peak {r['move_peak_px']:5.1f}px", flush=True)
json.dump(res, open(out, "w"))
