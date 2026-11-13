#!/usr/bin/env python3
"""Dub a new voice recording onto a finished reel WITHOUT re-rendering it.
usage: dub.py reel_dir recording.(m4a|mp3|wav) out.wav [--gains "1:+1.5,2:-1,5:+1.5,..."]
Needs in reel_dir: align_text.txt (one spoken line per line), line_spans.json (target [start,end] per line from the original voice).
Steps: clean (high-pass, denoise, de-hum, de-ess, warm EQ, compression) → align words → cut each line → stretch/squeeze it to the
original line's length (phrase by phrase, atempo 0.86–1.18 so it never sounds dragged or rushed; pauses stay natural silence) → per-line gain (the "up and down") →
place every line at its original start → voice track the same length as the reel."""
import json, subprocess, sys, os, tempfile, wave, numpy as np
reel, rec, out = sys.argv[1:4]; gains = {}
if "--gains" in sys.argv: gains = {int(k): float(v) for k, v in (x.split(":") for x in sys.argv[sys.argv.index("--gains") + 1].split(","))}
T = os.path.dirname(os.path.abspath(__file__)); tmp = tempfile.mkdtemp(); sh = lambda *a: subprocess.run(a, check=True, capture_output=True)
lines = [l.strip() for l in open(f"{reel}/align_text.txt") if l.strip()]; spans = json.load(open(f"{reel}/line_spans.json"))
# 1. clean + polish at 48 kHz mono
CLEAN = ("highpass=f=80,lowpass=f=15000,afftdn=nf=-28:nt=w:om=o,anlmdn=s=4:p=0.002:r=0.006,"
         "equalizer=f=50:t=q:w=1:g=-3,equalizer=f=250:t=q:w=1.2:g=-2,equalizer=f=3200:t=q:w=1:g=2.5,equalizer=f=9000:t=h:w=0.7:g=1.5,"
         "deesser=i=0.45:m=0.5:f=0.5,acompressor=threshold=-22dB:ratio=3.5:attack=4:release=90:makeup=3,alimiter=limit=0.95")
sh("ffmpeg", "-y", "-loglevel", "error", "-i", rec, "-ac", "1", "-ar", "48000", "-af", CLEAN, f"{tmp}/clean.wav")
sh("ffmpeg", "-y", "-loglevel", "error", "-i", f"{tmp}/clean.wav", "-ar", "16000", f"{tmp}/v16.wav")
# 2. align the recording to the script (retakes: the aligner keeps the LAST good take of a repeated line when the script is matched in order)
open(f"{tmp}/text.txt", "w").write("\n".join(lines))
extra = ["sixtyeight S IH K S T IY EY T", "groq G R AA K", "nvidia EH N V IH D IY AH", "dm D IY EH M"]
sh("python3", f"{T}/align.py", f"{tmp}/v16.wav", f"{tmp}/text.txt", f"{tmp}/w.json", *extra)
W = json.load(open(f"{tmp}/w.json")); W = W["words"] if isinstance(W, dict) else W; W = [w for w in W if w.get("type", "word") == "word"]
def read(p):
    with wave.open(p) as f: return np.frombuffer(f.readframes(f.getnframes()), np.int16).astype(np.float32) / 32768, f.getframerate()
x, sr = read(f"{tmp}/clean.wav"); W0 = json.load(open(f"{reel}/words.json")); W0 = [w for w in (W0["words"] if isinstance(W0, dict) else W0) if w.get("type", "word") == "word"]
total = max(s["end"] for s in spans) + 2.0; track = np.zeros(int(total * sr), np.float32); report = []; cursor = 0
# phrases = runs of words ending in , . ! ? — each phrase starts exactly where the original one did (the captions are timed to it)
line_of = []; [line_of.extend([k] * len(L.split())) for k, L in enumerate(lines, 1)]
ph, cur = [], []
for j, w in enumerate(W0):
    cur.append(j)
    if w["text"][-1:] in ",.!?" or j == len(W0) - 1: ph.append(cur); cur = []
for n, idx in enumerate(ph):
    a0, a1 = W[idx[0]]["start"] - 0.03, W[idx[-1]]["end"] + 0.05; t0, t1 = W0[idx[0]]["start"], W0[idx[-1]]["end"] + 0.05
    clip = x[int(max(0, a0) * sr):int(a1 * sr)]; ratio = (len(clip) / sr) / max(0.1, t1 - t0 + 0.03); r = min(1.3 if ratio > 1.18 else 1.18, max(0.86, ratio)); k = line_of[idx[0]]; g = gains.get(k, 0.0)
    p, q = f"{tmp}/p{n}.wav", f"{tmp}/q{n}.wav"
    with wave.open(p, "w") as f: f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes((np.clip(clip, -1, 1) * 32767).astype(np.int16).tobytes())
    sh("ffmpeg", "-y", "-loglevel", "error", "-i", p, "-af", f"atempo={r:.4f},volume={g}dB,afade=t=in:d=0.012", q)
    y, _ = read(q); st = max(int(max(0, t0 - 0.03) * sr), cursor); late = (st - int(max(0, t0 - 0.03) * sr)) / sr; cursor = st + len(y)
    if len(y) > int(0.03 * sr): y[-int(0.03 * sr):] *= np.linspace(1, 0, int(0.03 * sr))
    track[st:st + len(y)] += y[:max(0, len(track) - st)]; report.append(f"{' '.join(W0[j]['text'] for j in idx)[:38]:38s} ×{r:.2f}{' (capped)' if r != ratio else ''} {g:+.1f} dB" + (f'  ⚠ {late:.2f}s late' if late > 0.01 else ''))
with wave.open(out, "w") as f: f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr); f.writeframes((np.clip(track, -1, 1) * 32767).astype(np.int16).tobytes())
print("\n".join(report)); print("wrote", out)
