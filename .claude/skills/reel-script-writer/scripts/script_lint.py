#!/usr/bin/env python3
"""Lint a reel script before voice/render.

usage: python3 script_lint.py script.md [--goal leads|reach|follow|sale] [--keyword JOBS] [--max SECONDS] [--wps 3.0]
--wps: measured speaking rate. ElevenLabs v3 "Shlok" (our house voice) ≈ 3.0 words/s; local voice-studio ≈ 2.6.
Accepts plain text or speedy markup ([box], *bold*, {pose}). Prints ERROR/WARN/OK lines and exits 1 on any ERROR.
"""
import argparse, re, sys

BANNED = ["delve", "unlock", "unleash", "elevate", "harness", "leverage", "game-changer", "game changer",
          "revolutionize", "revolutionise", "cutting-edge", "cutting edge", "seamless", "robust", "in today's video",
          "in this video", "let's dive in", "dive into", "buckle up", "without further ado", "hey guys",
          "what's up guys", "welcome back", "smash that", "don't forget to like", "in conclusion",
          "it's important to note", "navigate the landscape", "the world of", "realm", "tapestry", "testament",
          "supercharge", "10x your", "mind-blowing", "mind blowing", "you won't believe", "secret hack",
          "nobody is talking about this"]
VAGUE = ["very", "super", "tons of", "lots of", "huge", "massive", "amazing", "incredible", "awesome"]
FILLER = ["basically", "literally", "honestly", "actually"]
BAD_OPENERS = ["hey", "hi ", "hello", "so today", "today i", "in this", "have you ever", "welcome", "did you know"]
CTA_VERBS = ["comment", "follow", "share", "save", "like", "subscribe", "dm me", "send this", "tag"]
NUMWORDS = r"\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|hundred|thousand|million|billion|lakh|crore|percent)\b"
DEFAULT_MAX = {"leads": 45, "sale": 45, "reach": 60, "follow": 50}


def strip(md):
    lines = [l for l in md.splitlines() if l.strip() and not l.lstrip().startswith("#")]
    raw = " ".join(lines)
    return raw, re.sub(r"\s+", " ", re.sub(r"\{[^}]*\}|[\[\]*]", "", raw)).strip()


def sentences(text):
    return [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if s.strip()]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("file"); ap.add_argument("--goal", default="leads", choices=list(DEFAULT_MAX))
    ap.add_argument("--keyword"); ap.add_argument("--max", type=float); ap.add_argument("--wps", type=float, default=3.0)
    a = ap.parse_args()
    raw, text = strip(open(a.file, encoding="utf-8").read())
    low = text.lower(); words = re.findall(r"[\w₹'’-]+", text); n = len(words)
    sents = sentences(text); out = []; errs = 0

    def say(level, msg):
        nonlocal errs
        out.append(f"{level:5} {msg}"); errs += level == "ERROR"

    # length
    secs = n / a.wps; mx = a.max or DEFAULT_MAX[a.goal]
    say("ERROR" if secs > mx else "WARN" if secs < 18 else "OK", f"length: {n} words ≈ {secs:.0f} s at {a.wps} w/s (goal {a.goal}: ≤ {mx:.0f} s)")
    # hook
    hook = sents[0] if sents else ""
    if len(hook.split()) < 5 and len(sents) > 1: hook += " " + sents[1]   # "Watch this." + what follows = the hook unit
    hw = len(hook.split())
    say("ERROR" if hw > 14 else "WARN" if hw > 12 else "OK", f"hook: {hw} words → \"{hook[:90]}\"")
    if any(hook.lower().startswith(b) for b in BAD_OPENERS):
        say("ERROR", "hook opens with a greeting / 'in this video' / a vague question: start on the payoff")
    first6 = " ".join(hook.split()[:6])
    if not re.search(r"\d|" + NUMWORDS + r"|\b[A-Z][a-zA-Z]+[A-Z]?\w*", first6[1:] if first6 else ""):
        say("WARN", f"hook: no number/name in the first 6 words (\"{first6}\"): make it specific")
    # sentences
    long = [s for s in sents if len(s.split()) > 18]
    for s in long:
        say("ERROR" if len(s.split()) > 24 else "WARN", f"long sentence ({len(s.split())} words): \"{s[:80]}…\" → split it")
    # banned / vague / filler
    for b in BANNED:
        if re.search(r"(?<!\w)" + re.escape(b) + r"(?!\w)", low): say("ERROR", f"banned phrase: \"{b}\"")
    vague = [v for v in VAGUE if re.search(r"\b" + re.escape(v) + r"\b", low)]
    if vague: say("WARN", f"vague words (use a number instead): {', '.join(vague)}")
    fill = sum(len(re.findall(r"\b" + f + r"\b", low)) for f in FILLER)
    if fill > 2: say("WARN", f"{fill} filler words (basically/literally/honestly/actually): keep ≤ 2")
    # numbers
    nums = len(re.findall(r"\d", text)) and len(re.findall(r"\d[\d,.]*", text)) + len(re.findall(NUMWORDS, low))
    nums = nums or len(re.findall(NUMWORDS, low))
    say("WARN" if nums < 2 else "OK", f"numbers: {nums} (aim for ≥ 3 exact numbers with units)")
    # you vs I
    you = len(re.findall(r"\byou(r|'ll|'re|rself)?\b", low)); me = len(re.findall(r"\b(i|i'm|i'll|i've|my|me)\b", low))
    say("OK", f"voice: you={you} · I/my={me}" + ("  (personal demo: fine)" if me > you else ""))
    # CTA
    tail = " ".join(sents[-2:]).lower() if sents else ""
    verbs = [v for v in CTA_VERBS if re.search(r"\b" + v + r"\b", tail)]
    if a.goal in ("leads", "sale"):
        if "comment" not in tail: say("ERROR", "goal is leads/sale but the last 2 sentences have no 'Comment KEYWORD'")
    if len(verbs) > 2: say("WARN", f"more than 2 CTA verbs at the end ({', '.join(verbs)}): one primary CTA")
    if a.keyword:
        k = a.keyword.lower(); total = len(re.findall(r"\b" + re.escape(k) + r"\b", low)); in_tail = len(re.findall(r"\b" + re.escape(k) + r"\b", tail))
        if in_tail == 0: say("ERROR", f"keyword {a.keyword} is not in the CTA")
        else: say("OK", f"keyword {a.keyword} is in the CTA")
    # markup (speedy pipeline)
    if raw.count("[") != raw.count("]"): say("ERROR", "unbalanced [box] brackets")
    if raw.count("{") != raw.count("}"): say("ERROR", "unbalanced {pose} braces")
    if raw.count("*") % 2: say("ERROR", "odd number of * (bold markers)")
    boxes = len(re.findall(r"\[[^\]]+\]", raw))
    if boxes:
        per = n / boxes
        say("WARN" if per > 9 or per < 3 else "OK", f"boxes: {boxes} ([box] every {per:.1f} words; aim 4–8)")
    print("\n".join(out))
    print(f"\n{'FAIL' if errs else 'PASS'}: {errs} error(s)")
    sys.exit(1 if errs else 0)


if __name__ == "__main__":
    main()
