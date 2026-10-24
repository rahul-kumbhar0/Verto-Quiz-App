"""Estimate word timings from the narration text so the reel can be previewed (animatic)
BEFORE spending voice credits. Output has the same shape as the ElevenLabs words.json.

usage: python3 fake_timings.py narration.txt words.json [words_per_second=2.35]
"""
import json, re, sys

text = open(sys.argv[1]).read()
wps = float(sys.argv[3]) if len(sys.argv) > 3 else 2.35
raw = [w for w in re.sub(r"\[[^\]]*\]", " ", text).split() if w.strip()]
# relative length ~ letters, pauses after punctuation
weights = [0.55 + 0.11 * len(re.sub(r"\W", "", w)) for w in raw]
pauses = [0.38 if re.search(r"[.?!:]$", w) else 0.16 if w.endswith(",") else 0.0 for w in raw]
scale = (len(raw) / wps - sum(pauses)) / sum(weights)
t, out = 0.15, []
for w, k, p in zip(raw, weights, pauses):
    d = k * scale
    out.append({"text": w, "type": "word", "start": round(t, 3), "end": round(t + d * 0.9, 3)})
    t += d + p
json.dump({"words": out, "estimated": True}, open(sys.argv[2], "w"))
print(f"{len(raw)} words -> ~{t:.1f}s at {wps} words/s (estimate)")
