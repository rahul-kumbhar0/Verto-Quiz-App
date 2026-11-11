#!/usr/bin/env python3
"""Cut footage into JPG frame sets for seek(t)-rendered reels.
usage: foot_prep.py spec.json outdir
spec: {"fps":15,"w":640,"title":"latent_ep7.mp4","length":"50:07",
       "sets":{"wide":{"src":"a.mp4","start":12.0,"dur":3},
               "strip":{"src":"a.mp4","stills":[30,200,...]},
               "m0":{"src":"a.mp4","start":61.5,"dur":2.6}, ...}}
writes outdir/<set>/0001.jpg … and outdir/manifest.js (window.FOOT_SETS = {...})"""
import json, subprocess, sys, os, shutil
spec = json.load(open(sys.argv[1])); out = sys.argv[2]; fps = spec.get("fps", 15); W = spec.get("w", 640)
os.makedirs(out, exist_ok=True); man = {}
for name, s in spec["sets"].items():
    d = os.path.join(out, name); shutil.rmtree(d, ignore_errors=True); os.makedirs(d)
    vf = f"scale={W}:-2:flags=lanczos,eq=contrast=1.04:saturation=1.08"
    if "stills" in s:
        for i, t in enumerate(s["stills"]):
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(t), "-i", s["src"], "-frames:v", "1", "-vf", vf, "-q:v", "3", f"{d}/{i+1:04d}.jpg"], check=True)
    else:
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-ss", str(s["start"]), "-t", str(s["dur"]), "-i", s["src"], "-vf", f"fps={fps},{vf}", "-q:v", "3", f"{d}/%04d.jpg"], check=True)
    man[name] = {"n": len(os.listdir(d))}
json.dump(man, sys.stdout); print()
open(os.path.join(out, "manifest.js"), "w").write(
    "window.FOOT_META=" + json.dumps({k: spec.get(k) for k in ("title", "length", "credit")}) + ";\nwindow.FOOT_SETS=" + json.dumps(man) + ";\n")
