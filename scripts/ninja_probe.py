#!/usr/bin/env python3
"""Probe the official SharkNinja image CDN (assets.sharkninja.com) for the Ninja models the user listed."""
import itertools, json, sys, urllib.request, concurrent.futures as cf
BASE = "https://assets.sharkninja.com/image/upload/f_auto/q_auto/"
MODELS = """AF500 AF170 AF180 AF300 AF400 SL400 SFP700 DG551 OL750 OL550 TB401 TB301 OG901 OG850 OG701 JC151 NC701 FS301 FN101 BN801 BN800 BN750 ES601 ES501 SP101 DZ300 BC251 BC151 ON400""".split()
REGIONS = ["SharkNinja-NA", "SharkNinja-EU", "SharkNinja-UK", "SharkNinja-ANZ", "SharkNinja-AU", "SharkNinja-ME"]
SUF = ["", "UK", "EU", "EUUK", "ANZ", "ME", "EUME", "MEPR", "BK", "SL", "CY", "GY", "BL", "WH", "C", "ZZ", "UKBK", "EUBK"]

def head(url):
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, method="HEAD", headers={"User-Agent": "Mozilla/5.0"}), timeout=25)
        return r.status
    except Exception as e:
        return getattr(e, "code", 0)

def probe(args):
    m, reg, suf = args
    u = f"{BASE}{reg}/{m}{suf}_01.jpg"
    return (m, reg, suf, head(u))

jobs = [(m, r, s) for m in MODELS for r in REGIONS for s in SUF]
print(len(jobs), "probes", flush=True)
hits = {}
with cf.ThreadPoolExecutor(24) as ex:
    for m, reg, suf, st in ex.map(probe, jobs):
        if st == 200:
            hits.setdefault(m, []).append(f"{reg}/{m}{suf}")
json.dump(hits, open("data/ninja_hits.json", "w"), indent=1)
for m in MODELS:
    print(m, hits.get(m, "NONE"))
