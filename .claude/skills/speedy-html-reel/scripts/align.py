"""Offline forced alignment of a known script to a voice recording (pocketsphinx, bundled model).
usage: python3 align.py voice16k.wav script.txt words.json [extra_dict 'word PH ON ES' ...]
Writes ElevenLabs-style {"words":[{text,type,start,end}]} using the ORIGINAL script tokens."""
import json, re, sys, wave
from pocketsphinx import Decoder
wav, txt, out = sys.argv[1:4]
extra = [l.split(None, 1) for l in sys.argv[4:]]
text = re.sub(r"\[[^\]]*\]", " ", open(txt).read())
orig = text.split()
norm = [re.sub(r"[^a-z']", "", w.lower()) for w in orig]
keep = [i for i, n in enumerate(norm) if n]; orig = [orig[i] for i in keep]; norm = [norm[i] for i in keep]
d = Decoder(samprate=16000, bestpath=False, beam=1e-80, wbeam=1e-60, pbeam=1e-80)
for w, ph in extra:
    if d.lookup_word(w) is None:
        d.add_word(w, ph, True)
missing = [w for w in set(n for n in norm if n) if d.lookup_word(w) is None]
if missing: sys.exit(f"words missing from the dictionary, pass pronunciations: {missing}")
d.set_align_text(" ".join(norm))
data = wave.open(wav, "rb").readframes(10**9)
d.start_utt(); d.process_raw(data, full_utt=True); d.end_utt()
hyp = d.hyp()
if hyp is None: sys.exit("alignment failed: the recording probably doesn't match the text (check for extra/missing sentences)")
segs = [(re.sub(r"\(\d+\)$", "", s.word), s.start_frame * 0.01, (s.end_frame + 1) * 0.01) for s in d.seg() if s.word not in ("<s>", "</s>", "<sil>") and not s.word.startswith("[") and not s.word.startswith("+")]
print("score", hyp.score if hyp else None, "aligned", len(segs), "/", len(norm))
words = []
if [n for n, _, _ in segs] != norm: print("WARNING: aligned words differ from script", len(segs), len(norm))
for o, (name, a, b) in zip(orig, segs):
    words.append({"text": o, "type": "word", "start": round(a, 3), "end": round(b, 3)})
json.dump({"words": words, "aligned": "pocketsphinx"}, open(out, "w"))
for wd in words[:8] + words[-6:]: print(f"{wd['start']:6.2f}-{wd['end']:6.2f} {wd['text']}")
