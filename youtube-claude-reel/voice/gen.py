import json, re, subprocess, sys, tempfile, os, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
K = Kokoro(os.path.expanduser("~/reel-work/kokoro/kokoro-v1.0.int8.onnx"), os.path.expanduser("~/reel-work/kokoro/voices-v1.0.bin"))
ALN = {"11":"eleven","4,300":"forty three hundred","SEO.":"s e o","API,":"a p i","YouTube":"you tube","YOUTUBE":"you tube","GitHub.":"git hub","DM":"d m","Claude":"clawed","Claude.":"clawed","Shorts.":"shorts","I'll":"i'll","it's":"it's"}
def norm(t): return re.sub(r"[^a-z' ]", "", t.lower())
B = json.load(open("voice/beats.json")); sr = 24000; out = {}
for b in B:
    sents = re.split(r"(?<=[.?:])\s+", b["tts"])
    parts = []
    for s in sents:
        a, sr = K.create(s, voice="hm_omega", speed=1.12, lang="en-us")
        idx = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, idx[0]-240): idx[-1]+480]
        parts += [a.astype(np.float32), np.zeros(int(0.16*sr), np.float32)]
    a = np.concatenate(parts[:-1]); sf.write(f"public/vo/{b['id']}.wav", a, sr)
    toks = b["cap"].split(); groups = [(x, norm(ALN.get(x, x)).split()) for x in toks]; flat = [w for _, g in groups for w in g]
    with tempfile.TemporaryDirectory() as d:
        subprocess.run(["ffmpeg","-y","-v","error","-i",f"public/vo/{b['id']}.wav","-ar","16000","-ac","1",f"{d}/s.wav"],check=True)
        open(f"{d}/s.txt","w").write(" ".join(flat))
        r = subprocess.run([sys.executable,"-I",os.path.expanduser("~/reel-work/tools/align.py"),f"{d}/s.wav",f"{d}/s.txt",f"{d}/w.json","clawed K L AO D"],capture_output=True,text=True)
        aw = json.load(open(f"{d}/w.json"))["words"] if os.path.exists(f"{d}/w.json") else []
    words = []
    if len(aw) == len(flat):
        k = 0
        for x, g in groups: words.append([x, round(aw[k]["start"], 3)]); k += len(g)
    else:
        print("FALLBACK", b["id"], len(aw), len(flat), r.stderr[-200:]); dur = len(a)/sr; tt = 0
        wts = [0.55+0.11*len(x) for x in toks]; tot = sum(wts)
        for x, wv in zip(toks, wts): words.append([x, round(tt, 3)]); tt += dur*wv/tot
    out[b["id"]] = {"dur": round(len(a)/sr, 3), "words": words}
    print(b["id"], out[b["id"]]["dur"])
json.dump(out, open("src/vo.json", "w"), indent=0)
