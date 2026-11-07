import json, re, subprocess, sys, tempfile, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
VOICE, SPEED = sys.argv[1], float(sys.argv[2])
K = Kokoro(os.path.expanduser("~/reel-work/kokoro/kokoro-v1.0.int8.onnx"), os.path.expanduser("~/reel-work/kokoro/voices-v1.0.bin"))
DISP = open("narration.txt").read().split()
# split display tokens into sentences
lines, cur = [], []
for t in DISP:
    cur.append(t)
    if t.endswith((".", "?")) and t not in ("canwe.ai.x",): lines.append(cur); cur = []
if cur: lines.append(cur)
TTS = {"4,300": "forty-three hundred", "SEO.": "S E O.", "API.": "A P I.", "canwe.ai.": "can we dot A I.", "DM": "D M", "YOUTUBE": "YouTube"}
ALN = {"4,300": "forty three hundred", "SEO.": "s e o", "API.": "a p i", "canwe.ai.": "can we dot a i", "DM": "d m",
       "YOUTUBE": "you tube", "YouTube": "you tube", "GitHub.": "git hub", "Claude": "clawed", "Claude,": "clawed", "Claude.": "clawed"}
def norm(t): return re.sub(r"[^a-z' ]", "", t.lower())
sr = 24000; out = [np.zeros(int(0.15*sr), dtype=np.float32)]; t = 0.15; words = []; fails = 0
for i, toks in enumerate(lines):
    tts = " ".join(TTS.get(x, x) for x in toks)
    a, sr = K.create(tts, voice=VOICE, speed=SPEED, lang="en-us")
    idx = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, idx[0]-240): idx[-1]+480]
    st, en = t, t + len(a)/sr
    groups = [(x, norm(ALN.get(x, x)).split()) for x in toks]
    flat = [w for _, g in groups for w in g]
    with tempfile.TemporaryDirectory() as d:
        sf.write(f"{d}/s.wav", a, sr); subprocess.run(["ffmpeg","-y","-v","error","-i",f"{d}/s.wav","-ar","16000","-ac","1",f"{d}/s16.wav"],check=True)
        open(f"{d}/s.txt","w").write(" ".join(flat))
        r = subprocess.run([sys.executable, "-I", os.path.expanduser("~/reel-work/tools/align.py"), f"{d}/s16.wav", f"{d}/s.txt", f"{d}/w.json", "clawed K L AO D"], capture_output=True, text=True)
        aw = json.load(open(f"{d}/w.json"))["words"] if r.returncode == 0 and os.path.exists(f"{d}/w.json") else []
    if len(aw) == len(flat):
        k = 0
        for x, g in groups:
            seg = aw[k:k+len(g)]; k += len(g)
            words.append({"text": x, "type": "word", "start": round(st+seg[0]["start"],3), "end": round(st+seg[-1]["end"],3)})
    else:
        fails += 1; print("fallback line", i, len(aw), len(flat), r.stderr[-200:])
        wts = [0.55+0.11*len(re.sub(r"\W","",x)) for x in toks]; tot = sum(wts); tt = st
        for x, w in zip(toks, wts):
            dd = (en-st)*w/tot; words.append({"text": x, "type": "word", "start": round(tt,3), "end": round(tt+dd*0.92,3)}); tt += dd
    pause = 0.38 if toks[-1].endswith((".", "?")) else 0.22
    out += [a.astype(np.float32), np.zeros(int(pause*sr), dtype=np.float32)]; t = en + pause
sf.write("audio/voice.wav", np.concatenate(out), sr)
json.dump({"words": words}, open("words_raw.json", "w"))
print(len(lines), "lines", len(words), "words", fails, "fallbacks", round(t,2), "s")
