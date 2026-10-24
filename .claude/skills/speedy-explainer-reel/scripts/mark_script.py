"""Marked script -> narration.txt + emph.json (+ poses.json).

usage: python3 mark_script.py script.md [outdir=.]

Markup inside the script (anything else is spoken as written; `//` lines are notes and skipped):
  [word]      the one boxed keyword of a caption page   -> emph.json "box"
  *word*      bold                                      -> emph.json "bold"
  {pose}      pin a presenter pose after the preceding phrase -> poses.json [["phrase","pose"],...]
Repeated words get a "#n" suffix so R.speedy marks the right occurrence. Numbers you want as one
caption token (10,000 / 44 px) must also be merged in display.json; the emph entries use the
display spelling, so write them in the script the way they should appear on screen.
"""
import json, re, sys, os
from collections import Counter

src = open(sys.argv[1]).read()
out = sys.argv[2] if len(sys.argv) > 2 else "."
lines = [l for l in src.splitlines() if not l.strip().startswith("//")]
text = " ".join(lines)
poses = []
def take_pose(m):
    before = text[: m.start()].strip()
    words = re.sub(r"[\[\]\*]", "", before).split()
    poses.append([" ".join(words[-3:]), m.group(1)])
    return " "
for m in list(re.finditer(r"\{([a-z_]+)\}", text)): pass
text_np = re.sub(r"\{([a-z_]+)\}", take_pose, text)
box = re.findall(r"\[([^\]]+)\]", text_np)
bold = re.findall(r"\*([^*]+)\*", text_np)
spoken = re.sub(r"[\[\]\*]", "", text_np)
spoken = re.sub(r"\s+", " ", spoken).strip()
norm = lambda s: re.sub(r"[^\w]", "", s).lower()
tokens = [norm(w) for w in spoken.split()]

def with_nth(phrases):
    """add #n for a phrase whose normalised first token repeats earlier in the script"""
    seen = Counter(); res = []
    for p in phrases:
        key = norm(p.split()[0]); n = 0
        # count occurrences of the phrase before this one in the whole script
        total = sum(1 for i in range(len(tokens)) if "".join(tokens[i:i+len(p.split())]) == norm(p))
        seen[norm(p)] += 1
        res.append(p if total <= 1 else f"{p}#{seen[norm(p)]}")
    return res

os.makedirs(out, exist_ok=True)
open(os.path.join(out, "narration.txt"), "w").write(spoken + "\n")
json.dump({"box": with_nth(box), "bold": with_nth(bold)}, open(os.path.join(out, "emph.json"), "w"), indent=1)
json.dump(poses, open(os.path.join(out, "poses.json"), "w"), indent=1)
words = len(spoken.split())
print(f"{words} words (~{words/2.6:.0f}s at 2.6 w/s) · {len(box)} boxed · {len(bold)} bold · {len(poses)} poses")
pages = max(1, words // 4)
if len(box) > pages * 1.1: print("warning: more than one box per ~4-word page; thin them out")
if words < 150: print("note: under 60 s — fine for a single-mechanism reel, short for a system design")
