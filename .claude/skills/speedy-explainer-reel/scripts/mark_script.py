"""Marked script -> narration.txt + emph.json + poses.json.

usage: python3 mark_script.py script.md [outdir=.]

Markup inside the script (anything else is spoken as written; `//` lines are notes and skipped):
  [word]      the one boxed keyword of a caption page   -> emph.json "box"
  *word*      bold                                      -> emph.json "bold"
  {pose}      pin a presenter pose; it lands on the phrase just before it -> poses.json [["phrase","pose"],...]
  <tag>       ElevenLabs v3 AUDIO TAG (delivery, not shown/aligned): <excited> <curious> <chuckles> <short pause>
              -> narration_tts.txt gets "[tag]" (square brackets = audio tags on v3, so [box] marks are removed there)
  ^word^      vocal stress: spoken in CAPS in narration_tts.txt, normal case in captions
Outputs: narration.txt (what is SAID, for captions/alignment) + narration_tts.txt (the exact ElevenLabs prompt).
Every emphasis entry carries "#n" = which occurrence of that phrase in the spoken text it is, counted
from the mark's real position, so R.speedy marks the right one even when the word repeats. Write
numbers/merged tokens the way they appear on screen (12,288 / GPT-3) and merge them in display.json.
"""
import json, re, sys, os

src = open(sys.argv[1]).read()
out = sys.argv[2] if len(sys.argv) > 2 else "."
text = re.sub(r"\s+", " ", " ".join(l for l in src.splitlines() if not l.strip().startswith("//"))).strip()
norm = lambda s: re.sub(r"[^\w]", "", s).lower()

# walk the marked text once, emitting spoken tokens and remembering where each mark starts
spoken, marks, poses = [], [], []
i = 0
pat = re.compile(r"\[([^\]]+)\]|\*([^*]+)\*|\{([a-z_]+)\}|<([a-z][a-z ]*)>|(\S+)|\s+")
tags = []
for m in pat.finditer(text):
    box, bold, pose, tag, plain = m.groups()
    if tag:
        tags.append(tag); continue
    if plain: plain = plain.replace("^", "")
    if box or bold:
        box = box.replace("^", "") if box else box; bold = bold.replace("^", "") if bold else bold
        words = (box or bold).split()
        marks.append(("box" if box else "bold", " ".join(words), len(spoken)))
        spoken += words
    elif pose:
        tail = spoken[-3:]
        poses.append([" ".join(tail), pose])
    elif plain:
        spoken.append(plain)

ntok = [norm(w) for w in spoken]
def nth(phrase, pos):
    q = [norm(w) for w in phrase.split()]
    count = sum(1 for k in range(pos + 1) if ntok[k:k + len(q)] == q)
    total = sum(1 for k in range(len(ntok)) if ntok[k:k + len(q)] == q)
    return phrase if total <= 1 else f"{phrase}#{count}"

emph = {"box": [], "bold": []}
for kind, phrase, pos in marks:
    emph[kind].append(nth(phrase, pos))
os.makedirs(out, exist_ok=True)
open(os.path.join(out, "narration.txt"), "w").write(" ".join(spoken) + "\n")
# the ElevenLabs v3 prompt: one script line per line, markup removed, <tag> -> [tag], ^word^ -> WORD
def tts_line(l):
    l = re.sub(r"\{[a-z_]+\}", "", l)
    l = re.sub(r"\^([^^]+)\^", lambda m: m.group(1).upper(), l)
    l = re.sub(r"\[([^\]]+)\]", r"\1", l).replace("*", "")
    l = re.sub(r"<([a-z][a-z ]*)>", r"[\1]", l)
    return re.sub(r"\s+", " ", l).strip()
tts = "\n".join(tts_line(l) for l in src.splitlines() if l.strip() and not l.strip().startswith("//"))
open(os.path.join(out, "narration_tts.txt"), "w").write(tts + "\n")
KNOWN = {"excited","happy","curious","surprised","sarcastic","warmly","softly","whispers","cautiously","dramatically","mischievously",
         "laughs","laughs softly","chuckles","giggles","sighs","exhales","gasps","short pause","pause","long pause","jumping in","nervous",
         "tired","serious","confident","impressed","amused","relieved","matter of fact","playful","thoughtful","slowly","quickly"}
unknown = [t for t in tags if t not in KNOWN]
if unknown: print("check audio tags (describe HOW it is said, not actions):", sorted(set(unknown)))
print(f"{len(tags)} audio tags -> narration_tts.txt")
json.dump(emph, open(os.path.join(out, "emph.json"), "w"), indent=1)
json.dump(poses, open(os.path.join(out, "poses.json"), "w"), indent=1)
words = len(spoken)
print(f"{words} words (~{words/2.6:.0f}s at 2.6 w/s) · {len(emph['box'])} boxed · {len(emph['bold'])} bold · {len(poses)} poses")
if len(emph["bold"]) > words / 3: print("note: more than one bold per 3 words — the hot-word caption system reads best at ~1 per 4")
