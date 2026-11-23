#!/usr/bin/env python3
"""Download official Ninja product images (assets.sharkninja.com) for the listed models into assets/img/ninja/<MODEL>/.
Prefers the EU/UK listing (230 V, what the Iran/ME market gets), falls back to NA. Max 8 images per model, width 1400 px."""
import json, os, io, urllib.request, concurrent.futures as cf
from PIL import Image
BASE = "https://assets.sharkninja.com/image/upload/f_auto,q_auto,w_1400/"
hits = json.load(open("data/ninja_hits.json"))
OUT = "assets/img/ninja"
def pick(h):
    pref = [x for x in h if x.endswith("EU") and "/" in x]
    pref += [x for x in h if x.endswith("UK") and x not in pref]
    pref += [x for x in h if x.startswith("SharkNinja-NA/") and not x.rstrip("0123456789").endswith(("BK", "BL", "GY", "WH", "SL", "CY")) and x not in pref]
    pref += [x for x in h if x not in pref]
    return pref[0]
def get(url):
    try:
        r = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}), timeout=60)
        return r.read(), r.headers.get("content-type", "")
    except Exception as e:
        return None, getattr(e, "code", 0)
def one(model):
    src = pick(hits[model])
    d = os.path.join(OUT, model); os.makedirs(d, exist_ok=True)
    got = []
    for i in range(1, 9):
        data, ct = get(f"{BASE}{src}_{i:02d}.jpg")
        if not data: break
        try:
            im = Image.open(io.BytesIO(data)); im.load()
        except Exception:
            break
        alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
        ext = "png" if im.format == "PNG" else "jpg"
        fn = f"{model}_{i:02d}.{ext}"
        open(os.path.join(d, fn), "wb").write(data)
        got.append({"file": f"{model}/{fn}", "w": im.size[0], "h": im.size[1], "alpha": bool(alpha), "kb": len(data) // 1024})
    return model, src, got
res = {}
with cf.ThreadPoolExecutor(8) as ex:
    for model, src, got in ex.map(one, sorted(hits)):
        res[model] = {"source": src, "images": got}
        print(model, src, len(got), "imgs", sum(g["kb"] for g in got), "KB", "alpha" if any(g["alpha"] for g in got) else "", flush=True)
json.dump(res, open("data/ninja_images.json", "w"), indent=1)
