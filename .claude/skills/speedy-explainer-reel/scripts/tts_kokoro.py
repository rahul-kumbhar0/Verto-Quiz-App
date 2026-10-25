# Offline neural TTS, one line per sentence, with exact line spans for alignment.
# usage: python3 -I tts_kokoro.py <model_dir> narration_spoken.txt audio/voice.wav <voice=am_michael> <speed=1.1>
# model_dir needs kokoro-v1.0.int8.onnx + voices-v1.0.bin from
#   https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/  (pip install kokoro-onnx soundfile)
import sys, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
k = Kokoro(sys.argv[1] + "/kokoro-v1.0.int8.onnx", sys.argv[1] + "/voices-v1.0.bin")
lines = [l.strip() for l in open(sys.argv[2]) if l.strip()]
voice, speed = sys.argv[4], float(sys.argv[5])
out, sr, t, spans = [], 24000, 0.0, []
for i, l in enumerate(lines):
    tts = l.replace("ChatGPT", "Chat G P T")
    a, sr = k.create(tts, voice=voice, speed=speed, lang="en-us")
    # trim leading/trailing silence
    idx = np.where(np.abs(a) > 0.01)[0]; a = a[max(0, idx[0]-240): idx[-1]+480] if len(idx) else a
    pause = 0.22 if l.endswith(",") else (0.42 if l.endswith((".", "?", ":")) else 0.3)
    spans.append({"line": l, "start": round(t, 3), "end": round(t + len(a)/sr, 3)})
    out += [a, np.zeros(int(pause*sr), dtype=a.dtype)]; t += len(a)/sr + pause
sf.write(sys.argv[3], np.concatenate([np.zeros(int(0.15*sr), dtype=out[0].dtype)] + out), sr)
for s in spans: s["start"] += 0.15; s["end"] += 0.15
json.dump(spans, open(sys.argv[3].replace(".wav", "_lines.json"), "w"), indent=1)
print(f"{len(lines)} lines, {t+0.15:.1f}s")
