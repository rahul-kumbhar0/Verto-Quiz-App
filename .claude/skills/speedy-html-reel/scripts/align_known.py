"""Word timings for KNOWN text: whisper hears the audio, difflib maps its timings onto the script tokens.
usage: python -I align_known.py audio.mp3 narration_spoken.txt words.json
words.json = ElevenLabs shape {"words":[{text,start,end,type:"word"}], "text": ...} (what captions.py / pace.py read).
Unmatched script tokens get times interpolated by character length inside the gap they fall in.
"""
import json, re, sys, subprocess, difflib
import numpy as np
from faster_whisper import WhisperModel

audio, txt, out = sys.argv[1:4]
raw = subprocess.run(["ffmpeg", "-nostdin", "-v", "error", "-i", audio, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
                     capture_output=True, check=True).stdout
pcm = np.frombuffer(raw, dtype=np.float32)
model = WhisperModel("small.en", device="cpu", compute_type="int8")
segs, _ = model.transcribe(pcm, word_timestamps=True, beam_size=5)
heard = [{"t": w.word.strip(), "s": w.start, "e": w.end} for s in segs for w in (s.words or [])]

nrm = lambda s: re.sub(r"[^a-z0-9]", "", s.lower())
script = open(txt).read().split()
# expand heard tokens that whisper merged ("1/960th") only via matching; compare normalized streams
A, B = [nrm(w) for w in script], [nrm(h["t"]) for h in heard]
times = [None] * len(script)
for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes():
    if tag == "equal":
        for k in range(i2 - i1): times[i1 + k] = (heard[j1 + k]["s"], heard[j1 + k]["e"])
    elif tag == "replace" and j2 > j1:   # spread the heard span over the script span by char length
        s0, e0 = heard[j1]["s"], heard[j2 - 1]["e"]; L = [max(1, len(A[k])) for k in range(i1, i2)]; tot = sum(L); acc = 0
        for k, l in zip(range(i1, i2), L):
            times[k] = (s0 + (e0 - s0) * acc / tot, s0 + (e0 - s0) * (acc + l) / tot); acc += l
# fill remaining gaps (deleted/inserted) by interpolation between known neighbours
i = 0
while i < len(times):
    if times[i] is None:
        j = i
        while j < len(times) and times[j] is None: j += 1
        a = times[i - 1][1] if i > 0 else 0.0
        b = times[j][0] if j < len(times) else a + 0.3 * (j - i)
        L = [max(1, len(A[k])) for k in range(i, j)]; tot = sum(L); acc = 0
        for k, l in zip(range(i, j), L):
            times[k] = (a + (b - a) * acc / tot, a + (b - a) * (acc + l) / tot); acc += l
        i = j
    else:
        i += 1
words = [{"text": w, "start": round(s, 3), "end": round(e, 3), "type": "word"} for w, (s, e) in zip(script, times)]
json.dump({"words": words, "text": " ".join(script)}, open(out, "w"), indent=1)
matched = sum(1 for tag, i1, i2, *_ in difflib.SequenceMatcher(None, A, B, autojunk=False).get_opcodes() if tag == "equal" for _ in range(i2 - i1))
gaps = [b["start"] - a["end"] for a, b in zip(words, words[1:])]
print(f"{len(words)} words, {matched} matched exactly, ends {words[-1]['end']:.2f}s, {len(words)/(words[-1]['end']-words[0]['start']):.2f} w/s, pauses>=0.3s: {sum(g>=0.3 for g in gaps)}")
