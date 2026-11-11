# usage: python3 -I ghfetch.py owner/repo ref outdir  — mirrors a GitHub repo via jsDelivr (github.com is blocked here)
import sys, json, os, urllib.request
repo, ref, out = sys.argv[1], sys.argv[2], sys.argv[3]
meta = json.load(urllib.request.urlopen(f"https://data.jsdelivr.com/v1/packages/gh/{repo}@{ref}?structure=flat"))
n = 0
for f in meta["files"]:
    p = f["name"].lstrip("/")
    if f.get("size", 0) > 15_000_000: print("skip big", p); continue
    dst = os.path.join(out, p); os.makedirs(os.path.dirname(dst), exist_ok=True)
    urllib.request.urlretrieve(f"https://cdn.jsdelivr.net/gh/{repo}@{ref}/{p}", dst); n += 1
print(repo, n, "files")
