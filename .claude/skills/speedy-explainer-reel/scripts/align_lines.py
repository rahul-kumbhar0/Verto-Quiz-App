"""Per-line forced alignment: each synthesized line is aligned separately inside its known span
(robust: one bad line can't derail the rest; failure -> proportional fallback for that line)."""
import json, re, subprocess, sys, os, tempfile
wav16, lines_json, align_py, out = sys.argv[1:5]
extra = ["chatbot CH AE T B AA T", "breakdowns B R EY K D AW N Z"]
spans = json.load(open(lines_json)); words = []; fails = 0
for i, s in enumerate(spans):
    text = s["line"].replace("ChatGPT", "Chat G P T").replace("-", " ")
    toks = text.split()
    a, b = max(0, s["start"] - 0.06), s["end"] + 0.06
    with tempfile.TemporaryDirectory() as d:
        seg, txt, wj = f"{d}/s.wav", f"{d}/s.txt", f"{d}/w.json"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", str(a), "-to", str(b), "-i", wav16, "-ar", "16000", "-ac", "1", seg], check=True)
        open(txt, "w").write(text)
        r = subprocess.run([sys.executable, "-I", align_py, seg, txt, wj] + extra, capture_output=True, text=True)
        ok = r.returncode == 0 and os.path.exists(wj) and len(json.load(open(wj))["words"]) == len([t for t in toks if re.sub(r"[^a-z']", "", t.lower())])
        if ok:
            for w in json.load(open(wj))["words"]:
                words.append({"text": w["text"], "type": "word", "start": round(w["start"] + a, 3), "end": round(w["end"] + a, 3)})
        else:
            fails += 1
            wts = [0.55 + 0.11 * len(re.sub(r"\W", "", t)) for t in toks]; tot = sum(wts); t = s["start"]
            for tok, wt in zip(toks, wts):
                d_ = (s["end"] - s["start"]) * wt / tot
                words.append({"text": tok, "type": "word", "start": round(t, 3), "end": round(t + d_ * 0.92, 3)}); t += d_
            print("fallback line", i, (r.stderr or r.stdout)[-160:].strip())
json.dump({"words": words, "aligned": "pocketsphinx-per-line"}, open(out, "w"))
print(f"{len(words)} words, {len(spans) - fails}/{len(spans)} lines force-aligned")
