"""Marked script -> narration.txt + emph.json + poses.json.

usage: python3 mark_script.py script.md [outdir=.]

Markup inside the script (anything else is spoken as written; `//` lines are notes and skipped):
  [word]      the one boxed keyword of a caption page   -> emph.json "box"
  *word*      bold                                      -> emph.json "bold"
  {pose}      pin a presenter pose; it lands on the phrase just before it -> poses.json [["phrase","pose"],...]
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
pat = re.compile(r"\[([^\]]+)\]|\*([^*]+)\*|\{([a-z_]+)\}|(\S+)|\s+")
for m in pat.finditer(text):
    box, bold, pose, plain = m.groups()
    if box or bold:
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
json.dump(emph, open(os.path.join(out, "emph.json"), "w"), indent=1)
json.dump(poses, open(os.path.join(out, "poses.json"), "w"), indent=1)
words = len(spoken)
print(f"{words} words (~{words/2.6:.0f}s at 2.6 w/s) · {len(emph['box'])} boxed · {len(emph['bold'])} bold · {len(poses)} poses")
if len(emph["bold"]) > words / 3: print("note: more than one bold per 3 words — the hot-word caption system reads best at ~1 per 4")
