#!/usr/bin/env python3
"""Helper: create models/<ID>-<slug>/meta.json from a one-line spec (dev convenience).
usage: python scripts/newmodel.py B02 hex-gate "درِ شش‌ضلعی" lux 1.2 [intro=5] [outro=7] [aspects=9x16,4x5,16x9]
"""
import json, os, sys
mid, slug, title, preset, hit = sys.argv[1:6]
kw = dict(a.split("=", 1) for a in sys.argv[6:])
d = os.path.join("models", f"{mid}-{slug}")
os.makedirs(d, exist_ok=True)
hits = [float(h) for h in hit.split(",")]
meta = {"id": mid, "slug": slug, "title": title, "group": "brand", "theme": "brand",
        "modes": {"intro": float(kw.get("intro", 5)), "outro": float(kw.get("outro", 7))},
        "audio": {"preset": preset, "hit": hits if len(hits) > 1 else hits[0]}}
if "aspects" in kw: meta["aspects"] = kw["aspects"].split(",")
with open(os.path.join(d, "meta.json"), "w", encoding="utf8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=1)
print(d)
