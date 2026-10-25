#!/usr/bin/env python3
"""Voice Studio — local, offline text-to-speech for the reel pipeline (no ElevenLabs, no API keys).

Engine: Kokoro-82M (ONNX, int8, ~92 MB) + 54 built-in voices in 9 languages (English US/UK, Hindi,
Spanish, French, Italian, Portuguese, Japanese, Chinese). Runs on CPU on Mac, Windows and Linux.

  python studio.py setup                         install deps + download the model once (~120 MB)
  python studio.py voices                        list built-in + your designed voices
  python studio.py say "text" -v house -o a.wav  speak one line
  python studio.py design NAME --mix am_michael:0.65,am_fenrir:0.35 [--speed 1.1 --pitch 0 --lang en-us]
                                                 create a NEW voice by blending voices; saved to voices/NAME.json
  python studio.py audition -o auditions/        render one sample per voice + an index.html to compare
  python studio.py narrate script.txt -v house -o voice.wav [--words words.json]
                                                 one sentence per line -> voice + per-word timings for captions
  python studio.py serve [--port 7860]           browser studio: type, pick/blend voices, play, save

Voice names accepted everywhere: a built-in id (am_michael), a designed voice (house), or an inline
mix "am_michael:0.6,am_puck:0.4". Designed voices are tiny JSON recipes, so commit and share them.
"""
import argparse, io, json, os, re, shutil, subprocess, sys, tempfile, urllib.request, wave

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL = os.path.dirname(HERE)
HOME = os.environ.get("VOICE_STUDIO_HOME", os.path.join(os.path.expanduser("~"), "voice-studio"))
MODELS = os.path.join(HOME, "models")
VOICES_DIRS = [os.path.join(SKILL, "voices"), os.path.join(HOME, "voices")]
MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/"
MODEL_FILES = ["kokoro-v1.0.int8.onnx", "voices-v1.0.bin"]
LANG_OF_PREFIX = {"a": "en-us", "b": "en-gb", "h": "hi", "e": "es", "f": "fr-fr", "i": "it", "p": "pt-br", "j": "ja", "z": "cmn"}
SAMPLE = {"en-us": "Every answer ChatGPT gives you is written one piece at a time, and each piece is a guess.",
          "en-gb": "Every answer ChatGPT gives you is written one piece at a time, and each piece is a guess.",
          "hi": "चैटजीपीटी का हर जवाब एक-एक टुकड़ा करके लिखा जाता है, और हर टुकड़ा एक अनुमान होता है।"}

# ---------------------------------------------------------------- private environment
# Everything installs into ~/voice-studio/venv, never into the system Python (which Ubuntu and
# Homebrew lock against pip). Any command run with another Python re-launches itself in the venv.
VENV = os.path.join(HOME, "venv")
VENV_PY = os.path.join(VENV, "Scripts", "python.exe") if os.name == "nt" else os.path.join(VENV, "bin", "python")
def in_venv(): return os.path.abspath(sys.prefix) == os.path.abspath(VENV)
def relaunch_in_venv():
    if not in_venv() and os.path.exists(VENV_PY):
        r = subprocess.call([VENV_PY, os.path.abspath(__file__), *sys.argv[1:]]); sys.exit(r)

# ---------------------------------------------------------------- setup
def cmd_setup(a):
    if not ((3, 10) <= sys.version_info[:2] <= (3, 13)):
        sys.exit(f"Python {sys.version.split()[0]} found, but the voice engine needs Python 3.10–3.13.\n"
                 "Install Python 3.12 from https://www.python.org/downloads/release/python-3128/ and run this again.")
    if not in_venv():
        if not os.path.exists(VENV_PY):
            print("creating private Python environment:", VENV)
            r = subprocess.run([sys.executable, "-m", "venv", VENV])
            if r.returncode != 0 or not os.path.exists(VENV_PY):
                sys.exit("could not create the environment. Ubuntu/Debian: sudo apt install python3-venv  — then run setup again.")
        r = subprocess.call([VENV_PY, os.path.abspath(__file__), "setup"]); sys.exit(r)
    pkgs = ["kokoro-onnx", "soundfile", "numpy", "pocketsphinx"]
    print("installing into", VENV, ":", " ".join(pkgs))
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", "--upgrade", "pip"], check=False)
    subprocess.run([sys.executable, "-m", "pip", "install", "-q", *pkgs], check=True)
    os.makedirs(MODELS, exist_ok=True); os.makedirs(VOICES_DIRS[1], exist_ok=True)
    for f in MODEL_FILES:
        dst = os.path.join(MODELS, f)
        if os.path.exists(dst) and os.path.getsize(dst) > 1_000_000: print("have", f); continue
        print("downloading", f, "…"); urllib.request.urlretrieve(MODEL_URL + f, dst + ".part"); os.replace(dst + ".part", dst)
    if not shutil.which("ffmpeg"): print("note: ffmpeg not found — needed only for --pitch and mp3 output (brew/apt/winget install ffmpeg)")
    print("ready:", MODELS); print('try: python studio.py say "Hello from your voice studio" -v house -o hello.wav')

# ---------------------------------------------------------------- engine
_K = None
def engine():
    global _K
    if _K is None:
        try:
            from kokoro_onnx import Kokoro
        except ImportError:
            sys.exit("missing packages — run: python studio.py setup")
        m = [os.path.join(MODELS, f) for f in MODEL_FILES]
        if not all(os.path.exists(x) for x in m): sys.exit("model not downloaded — run: python studio.py setup")
        _K = Kokoro(*m)
    return _K

def designed():
    out = {}
    for d in VOICES_DIRS:
        if os.path.isdir(d):
            for f in sorted(os.listdir(d)):
                if f.endswith(".json"):
                    r = json.load(open(os.path.join(d, f))); r["file"] = os.path.join(d, f); out[f[:-5]] = r
    return out

def parse_mix(s):
    mix = []
    for part in s.split(","):
        n, _, w = part.strip().partition(":")
        mix.append([n.strip(), float(w) if w else 1.0])
    tot = sum(w for _, w in mix) or 1.0
    return [[n, w / tot] for n, w in mix]

def resolve(voice, speed=None, pitch=None, lang=None):
    """-> (style_vector_or_id, speed, pitch, lang, label)"""
    k = engine(); recipe = designed().get(voice)
    if recipe: mix, sp, pt, lg = recipe["mix"], recipe.get("speed", 1.0), recipe.get("pitch", 0), recipe.get("lang")
    elif ":" in voice or "," in voice: mix, sp, pt, lg = parse_mix(voice), 1.0, 0, None
    else: mix, sp, pt, lg = [[voice, 1.0]], 1.0, 0, None
    known = set(k.get_voices())
    for n, _ in mix:
        if n not in known: sys.exit(f"unknown voice '{n}'. run: python studio.py voices")
    style = mix[0][0] if len(mix) == 1 else sum(w * k.get_voice_style(n) for n, w in mix)
    lg = lang or lg or LANG_OF_PREFIX.get(mix[0][0][0], "en-us")
    return style, speed if speed is not None else sp, pitch if pitch is not None else pt, lg, voice

def synth(text, voice, speed=None, pitch=None, lang=None):
    import numpy as np
    style, sp, pt, lg, _ = resolve(voice, speed, pitch, lang)
    audio, sr = engine().create(text, voice=style, speed=sp, lang=lg)
    if pt: audio = pitch_shift(audio, sr, pt)
    return audio.astype(np.float32), sr

def pitch_shift(audio, sr, semis):
    import numpy as np, soundfile as sf
    if not shutil.which("ffmpeg"): print("warning: ffmpeg missing, pitch ignored"); return audio
    with tempfile.TemporaryDirectory() as d:
        i, o = os.path.join(d, "i.wav"), os.path.join(d, "o.wav"); sf.write(i, audio, sr)
        f = 2 ** (semis / 12)
        flt = f"rubberband=pitch={f:.5f}" if b"rubberband" in subprocess.run(["ffmpeg", "-hide_banner", "-filters"], capture_output=True).stdout \
              else f"asetrate={int(sr * f)},aresample={sr},atempo={1 / f:.5f}"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", i, "-af", flt, o], check=True)
        return sf.read(o, dtype="float32")[0]

def write_audio(path, audio, sr):
    import soundfile as sf
    if path.lower().endswith(".mp3"):
        with tempfile.TemporaryDirectory() as d:
            w = os.path.join(d, "a.wav"); sf.write(w, audio, sr)
            subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", w, "-b:a", "192k", path], check=True)
    else: sf.write(path, audio, sr)

# ---------------------------------------------------------------- commands
def cmd_voices(a):
    k = engine(); v = k.get_voices()
    names = {"a": "American English", "b": "British English", "h": "Hindi", "e": "Spanish", "f": "French", "i": "Italian", "p": "Portuguese (BR)", "j": "Japanese", "z": "Mandarin"}
    print("BUILT-IN (prefix: language + f/m = female/male)")
    for p, n in names.items():
        row = [x for x in v if x[0] == p]
        if row: print(f"  {n:18s} " + "  ".join(row))
    print("\nDESIGNED")
    for n, r in designed().items():
        print(f"  {n:12s} {', '.join(f'{x}:{w:.2f}' for x, w in r['mix'])}  speed {r.get('speed', 1.0)}  pitch {r.get('pitch', 0)}  {r.get('lang', '')}  — {r.get('note', '')}")

def cmd_say(a):
    audio, sr = synth(a.text, a.voice, a.speed, a.pitch, a.lang); write_audio(a.out, audio, sr)
    print(f"wrote {a.out} ({len(audio) / sr:.1f}s)")

def cmd_design(a):
    mix = parse_mix(a.mix)
    for n, _ in mix:
        if n not in engine().get_voices(): sys.exit(f"unknown voice '{n}'")
    lang = a.lang or LANG_OF_PREFIX.get(mix[0][0][0], "en-us")
    r = {"mix": [[n, round(w, 4)] for n, w in mix], "speed": a.speed, "pitch": a.pitch, "lang": lang, "note": a.note or ""}
    d = VOICES_DIRS[0] if a.shared else VOICES_DIRS[1]; os.makedirs(d, exist_ok=True)
    path = os.path.join(d, a.name + ".json"); json.dump(r, open(path, "w"), indent=1)
    print("saved", path)
    sample = a.sample or SAMPLE.get(lang, SAMPLE["en-us"])
    audio, sr = synth(sample, a.name); out = a.out or os.path.join(d, a.name + "_sample.wav"); write_audio(out, audio, sr)
    print("sample:", out)

def cmd_audition(a):
    os.makedirs(a.out, exist_ok=True)
    vs = a.voices.split(",") if a.voices else list(designed()) + [x for x in engine().get_voices() if x[:2] in ("am", "af", "bm", "bf", "hm", "hf")]
    rows = []
    for v in vs:
        lang = resolve(v)[3]; text = a.text or SAMPLE.get(lang, SAMPLE["en-us"])
        audio, sr = synth(text, v); f = re.sub(r"[^\w.-]", "_", v) + ".wav"; write_audio(os.path.join(a.out, f), audio, sr)
        rows.append((v, f, len(audio) / sr)); print(f"  {v:28s} {len(audio) / sr:5.1f}s")
    html = "".join(f"<tr><td><b>{v}</b></td><td><audio controls preload=none src='{f}'></audio></td><td>{d:.1f}s</td></tr>" for v, f, d in rows)
    open(os.path.join(a.out, "index.html"), "w").write(f"<!doctype html><meta charset=utf-8><title>Voice auditions</title><body style='font:16px system-ui;background:#111;color:#eee;padding:24px'><h2>Voice auditions</h2><table cellpadding=8>{html}</table>")
    print("open", os.path.join(a.out, "index.html"))

def split_lines(text):
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    if len(lines) == 1:  # a paragraph: split into sentences
        lines = [s.strip() for s in re.split(r"(?<=[.?!:])\s+", lines[0]) if s.strip()]
    return lines

def cmd_narrate(a):
    import numpy as np
    lines = split_lines(open(a.script, encoding="utf-8").read())
    out, t, spans, sr = [], 0.15, [], 24000
    for l in lines:
        audio, sr = synth(l, a.voice, a.speed, a.pitch, a.lang)
        idx = np.where(np.abs(audio) > 0.01)[0]; audio = audio[max(0, idx[0] - 240): idx[-1] + 480] if len(idx) else audio
        pause = a.pause * (0.55 if l.endswith(",") else 1.0)
        spans.append({"line": l, "start": round(t, 3), "end": round(t + len(audio) / sr, 3)})
        out += [audio, np.zeros(int(pause * sr), dtype=np.float32)]; t += len(audio) / sr + pause
        print(f"  {spans[-1]['start']:6.2f}  {l[:70]}")
    full = np.concatenate([np.zeros(int(0.15 * sr), dtype=np.float32)] + out)
    write_audio(a.out, full, sr)
    sp = os.path.splitext(a.out)[0] + "_lines.json"; json.dump(spans, open(sp, "w"), indent=1)
    print(f"wrote {a.out} ({len(full) / sr:.1f}s, {len(lines)} lines) + {sp}")
    if a.words: align(a.out, spans, a.words)

# ---------------------------------------------------------------- alignment (English, pocketsphinx)
# Pronunciations for words the CMU dictionary lacks (ARPAbet). Add your own in voices/dict.txt:
#   one per line, "word  PH ON EM ES"  e.g.  "supabase  S UW P AH B EY S"
TECH_DICT = {
    "chatbot": "CH AE T B AA T", "chatbots": "CH AE T B AA T S", "breakdowns": "B R EY K D AW N Z", "chatgpt": "CH AE T JH IY P IY T IY",
    "llm": "EH L EH L EH M", "llms": "EH L EH L EH M Z", "api": "EY P IY AY", "apis": "EY P IY AY Z", "url": "Y UW AA R EH L",
    "github": "G IH T HH AH B", "postgres": "P OW S T G R EH S", "supabase": "S UW P AH B EY S", "vercel": "V ER S EH L",
    "openai": "OW P AH N EY AY", "anthropic": "AE N TH R AA P IH K", "claude": "K L AO D", "kubernetes": "K UW B ER N EH T IY Z",
    "docker": "D AA K ER", "javascript": "JH AA V AH S K R IH P T", "typescript": "T AY P S K R IH P T", "nodejs": "N OW D JH EY EH S",
    "backend": "B AE K EH N D", "frontend": "F R AH N T EH N D", "app": "AE P", "apps": "AE P S", "ui": "Y UW AY", "ai": "EY AY",
    "repo": "R IY P OW", "repos": "R IY P OW Z", "devs": "D EH V Z", "dev": "D EH V", "signup": "S AY N AH P", "login": "L AO G IH N",
    "logins": "L AO G IH N Z", "serverless": "S ER V ER L AH S", "pooler": "P UW L ER", "hinglish": "HH IH NG G L IH SH",
}
def load_dict():
    d = dict(TECH_DICT)
    for vd in VOICES_DIRS:
        f = os.path.join(vd, "dict.txt")
        if os.path.exists(f):
            for line in open(f, encoding="utf-8"):
                w, _, ph = line.strip().partition(" ")
                if w and ph.strip() and not w.startswith("#"): d[w.lower()] = ph.strip()
    return d

def align(wav, spans, out):
    try:
        from pocketsphinx import Decoder
    except ImportError:
        sys.exit("pocketsphinx missing — run: python studio.py setup")
    import numpy as np, soundfile as sf
    audio, sr = sf.read(wav, dtype="float32")
    if sr != 16000:  # simple resample via numpy interp (speech-grade, avoids extra deps)
        n = int(len(audio) * 16000 / sr); audio = np.interp(np.linspace(0, len(audio) - 1, n), np.arange(len(audio)), audio); sr = 16000
    pcm = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
    words, fails, EXTRA = [], 0, load_dict()
    for s in spans:
        toks = s["line"].replace("-", " ").split()
        norm = [re.sub(r"[^a-z']", "", w.lower()) for w in toks]
        keep = [(o, n) for o, n in zip(toks, norm) if n]
        a0, b0 = max(0.0, s["start"] - 0.06), s["end"] + 0.06
        seg = pcm[int(a0 * sr): int(b0 * sr)].tobytes(); ok = False
        try:
            d = Decoder(samprate=16000, bestpath=False, beam=1e-80, wbeam=1e-60, pbeam=1e-80)
            for o, n in keep:
                if d.lookup_word(n) is None:
                    if n in EXTRA: d.add_word(n, EXTRA[n], True)
                    else: raise ValueError(f"'{n}' not in the speech dictionary — add it to voices/dict.txt")
            d.set_align_text(" ".join(n for _, n in keep))
            d.start_utt(); d.process_raw(seg, full_utt=True); d.end_utt()
            segs = [(x.start_frame * 0.01, (x.end_frame + 1) * 0.01) for x in d.seg() if x.word not in ("<s>", "</s>", "<sil>") and not x.word.startswith(("[", "+"))]
            if d.hyp() is not None and len(segs) == len(keep):
                words += [{"text": o, "type": "word", "start": round(st + a0, 3), "end": round(en + a0, 3)} for (o, _), (st, en) in zip(keep, segs)]; ok = True
        except Exception as e:
            why = str(e)
        else:
            why = "acoustic match failed"
        if not ok:  # proportional fallback inside the line's exact span
            print(f"  approx timing for: {s['line'][:60]}…  ({why})")
            fails += 1; wts = [0.55 + 0.11 * len(n) for _, n in keep]; tot = sum(wts) or 1; t = s["start"]
            for (o, _), wt in zip(keep, wts):
                dd = (s["end"] - s["start"]) * wt / tot; words.append({"text": o, "type": "word", "start": round(t, 3), "end": round(t + dd * 0.92, 3)}); t += dd
    json.dump({"words": words, "aligned": "voice-studio"}, open(out, "w"))
    print(f"timings: {out} ({len(words)} words, {len(spans) - fails}/{len(spans)} lines force-aligned)")

# ---------------------------------------------------------------- web studio
def cmd_serve(a):
    from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
    import soundfile as sf
    page = open(os.path.join(HERE, "studio.html"), encoding="utf-8").read()
    engine()
    class H(BaseHTTPRequestHandler):
        def log_message(self, *x): pass
        def send(self, code, body, ctype):
            self.send_response(code); self.send_header("Content-Type", ctype); self.send_header("Content-Length", str(len(body))); self.end_headers(); self.wfile.write(body)
        def do_GET(self):
            if self.path == "/api/voices":
                return self.send(200, json.dumps({"builtin": engine().get_voices(), "designed": {k: {x: v for x, v in r.items() if x != "file"} for k, r in designed().items()}}).encode(), "application/json")
            self.send(200, page.encode(), "text/html; charset=utf-8")
        def do_POST(self):
            q = json.loads(self.rfile.read(int(self.headers.get("Content-Length", 0))) or b"{}")
            try:
                if self.path == "/api/say":
                    audio, sr = synth(q["text"], q["voice"], float(q.get("speed", 1.0)), float(q.get("pitch", 0)), q.get("lang") or None)
                    buf = io.BytesIO(); sf.write(buf, audio, sr, format="WAV"); return self.send(200, buf.getvalue(), "audio/wav")
                if self.path == "/api/save":
                    name = re.sub(r"[^\w-]", "", q["name"]) or "voice"
                    mix = parse_mix(q["voice"]); d = VOICES_DIRS[1]; os.makedirs(d, exist_ok=True)
                    r = {"mix": [[n, round(w, 4)] for n, w in mix], "speed": float(q.get("speed", 1.0)), "pitch": float(q.get("pitch", 0)),
                         "lang": q.get("lang") or LANG_OF_PREFIX.get(mix[0][0][0], "en-us"), "note": q.get("note", "designed in the web studio")}
                    json.dump(r, open(os.path.join(d, name + ".json"), "w"), indent=1)
                    return self.send(200, json.dumps({"saved": name}).encode(), "application/json")
            except SystemExit as e: return self.send(400, json.dumps({"error": str(e)}).encode(), "application/json")
            except Exception as e: return self.send(500, json.dumps({"error": repr(e)}).encode(), "application/json")
            self.send(404, b"{}", "application/json")
    print(f"Voice Studio on http://localhost:{a.port}  (Ctrl+C to stop)")
    if not a.no_browser:
        try:
            import threading, webbrowser; threading.Timer(1.0, lambda: webbrowser.open(f"http://localhost:{a.port}")).start()
        except Exception: pass
    ThreadingHTTPServer(("127.0.0.1", a.port), H).serve_forever()

# ---------------------------------------------------------------- cli
def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    s = p.add_subparsers(dest="cmd", required=True)
    s.add_parser("setup").set_defaults(f=cmd_setup)
    s.add_parser("voices").set_defaults(f=cmd_voices)
    def tune(x): x.add_argument("--speed", type=float); x.add_argument("--pitch", type=float, help="semitones"); x.add_argument("--lang")
    x = s.add_parser("say"); x.add_argument("text"); x.add_argument("-v", "--voice", default="house"); x.add_argument("-o", "--out", default="say.wav"); tune(x); x.set_defaults(f=cmd_say)
    x = s.add_parser("design"); x.add_argument("name"); x.add_argument("--mix", required=True); x.add_argument("--speed", type=float, default=1.0)
    x.add_argument("--pitch", type=float, default=0); x.add_argument("--lang"); x.add_argument("--note"); x.add_argument("--sample"); x.add_argument("-o", "--out")
    x.add_argument("--shared", action="store_true", help="save into the skill's voices/ (commit + share) instead of ~/voice-studio/voices"); x.set_defaults(f=cmd_design)
    x = s.add_parser("audition"); x.add_argument("-o", "--out", default="auditions"); x.add_argument("--voices"); x.add_argument("--text"); x.set_defaults(f=cmd_audition)
    x = s.add_parser("narrate"); x.add_argument("script"); x.add_argument("-v", "--voice", default="house"); x.add_argument("-o", "--out", default="voice.wav")
    x.add_argument("--words", help="also write per-word timings (English) for captions"); x.add_argument("--pause", type=float, default=0.42); tune(x); x.set_defaults(f=cmd_narrate)
    x = s.add_parser("serve"); x.add_argument("--port", type=int, default=7860); x.add_argument("--no-browser", action="store_true"); x.set_defaults(f=cmd_serve)
    a = p.parse_args()
    if a.cmd != "setup": relaunch_in_venv()
    a.f(a)

if __name__ == "__main__":
    main()
