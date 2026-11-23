import json, os, io, re, urllib.request, concurrent.futures as cf
from PIL import Image
hits = json.load(open("data/ninja_hits.json")); res = json.load(open("data/ninja_images.json"))
BASE = "https://assets.sharkninja.com/image/upload/f_auto,q_auto,w_1200/"
SB = "https://blqw-002.dx.commercecloud.salesforce.com/s/US-SharkNinja/%s.html"
UA = {"User-Agent": "Mozilla/5.0"}
def get(u, t=60):
    try: return urllib.request.urlopen(urllib.request.Request(u, headers=UA), timeout=t).read()
    except Exception: return None
def one(m):
    na = [x for x in hits[m] if x.startswith("SharkNinja-NA/")]
    name = None; extra = []
    base_na = next((x for x in na if x.split("/")[1] == m), na[0] if na else None)
    if base_na:
        for code in dict.fromkeys([m, base_na.split("/")[1]]):
            h = get(SB % code)
            if h:
                t = h.decode("utf-8", "replace")
                mm = re.search(r'"name"\s*:\s*"([^"]{6,140})"', t) or re.search(r'<h1[^>]*>\s*([^<]{6,140})<', t)
                if mm: name = re.sub(r"\s+", " ", mm.group(1)).strip(); break
        d = os.path.join("assets/img/ninja", m, "na"); os.makedirs(d, exist_ok=True)
        for i in range(1, 9):
            data = get(f"{BASE}{base_na}_{i:02d}.jpg")
            if not data: break
            try: im = Image.open(io.BytesIO(data)); im.load()
            except Exception: break
            ext = "png" if im.format == "PNG" else "jpg"
            fn = f"{m}_na_{i:02d}.{ext}"; open(os.path.join(d, fn), "wb").write(data)
            extra.append({"file": f"{m}/na/{fn}", "w": im.size[0], "h": im.size[1], "alpha": im.mode in ("RGBA", "LA"), "kb": len(data) // 1024})
    return m, name, extra
with cf.ThreadPoolExecutor(6) as ex:
    for m, name, extra in ex.map(one, sorted(hits)):
        res[m]["name"] = name; res[m]["extra"] = extra
        print(m, "|", name, "|", len(extra), "extra", flush=True)
json.dump(res, open("data/ninja_images.json", "w"), indent=1, ensure_ascii=False)
