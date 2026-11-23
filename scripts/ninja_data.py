#!/usr/bin/env python3
"""Generate data/ninja.json: 100 Ninja Home Kitchen motions (Royal Pars, ground floor unit 4), built without prices.
87 product motions (3 per model: J1 hero drop-in, J2 feature callouts, J3 big-SALE poster card) + 6 category grids
+ 3 brand reveals + 4 promo pieces (pre-order carousel, Royal Week brand card, gift-guide grid, 16:9 TV loop).
Features are only claims that were verified (search results / model names); everything else stays generic.
usage: python scripts/ninja_data.py"""
import json, os, re

P = json.load(open("data/ninja_products.json", encoding="utf-8"))
FEAT = {
 "AF500": ["۱۰.۴ لیتر ظرفیت", "کشوی قابل‌تقسیم", "دو سبد مستقل"],
 "AF300": ["۷.۶ لیتر ظرفیت", "دو سبد مستقل", "فناوری Dual Zone"],
 "AF400": ["دو سبد بزرگ", "ظرفیت ایکس‌ایکس‌ایکس‌ال", "فناوری Dual Zone"],
 "AF170": ["ایرفرایر تک‌سبد", "سری مکس ایکس‌ال", "پنجره‌ی EZView"],
 "AF180": ["ظرفیت ۶.۲ لیتر", "سری مکس پرو", "تک‌سبد"],
 "DZ300": ["دو سبد مستقل", "فناوری DualZone", "پخت دو غذا با هم"],
 "SL400": ["۱۰ کوارت ظرفیت", "دو سبد روی هم", "شش حالت پخت"],
 "FN101": ["نینجا کریسپی", "ظرف شیشه‌ای", "پخت قابل‌حمل"],
 "SP101": ["فر توستر برگردان", "سری فودی", "هشت حالت پخت"],
 "SFP700": ["نینجا کومبی", "مولتی‌کوکر", "چند حالت پخت"],
 "ON400": ["نینجا اسپیدی", "پخت سریع", "ایرفرایر داخلش"],
 "OL550": ["درب اسمارت‌لید", "پرشرکوکر", "ایرفرایر داخلش"],
 "OL750": ["درب اسمارت‌لید", "ظرفیت بزرگ", "پرشرکوکر و ایرفرایر"],
 "DG551": ["گریل داخلی", "ایرفرایر داخلش", "پروب دمای غذا"],
 "OG701": ["هفت حالت پخت", "دودی وودفایر", "گریل برقی"],
 "OG850": ["وودفایر ایکس‌ال", "پروب دمای داخلی", "گریل و دودی برقی"],
 "OG901": ["Pro Connect", "هفت حالت پخت", "اتصال به اپلیکیشن"],
 "BN750": ["پروفشنال پلاس", "تیغه‌ی Total Crushing", "پارچ بزرگ"],
 "BN800": ["مخلوط‌کن + غذاساز", "پروفشنال پلاس", "چند تیغه"],
 "BN801": ["۴ مدل تیغه", "برنامه‌های Auto-iQ", "۱۴۰۰ وات پیک"],
 "TB301": ["فناوری BlendSense", "پارچ ۷۲ اونس", "۱۸۰۰ وات پیک"],
 "TB401": ["مخلوط‌کن + غذاساز", "فناوری BlendSense", "۱۸۰۰ وات پیک"],
 "BC151": ["مخلوط‌کن شخصی", "۱۸ اونس", "قابل‌حمل"],
 "BC251": ["مخلوط‌کن بی‌سیم", "قابل‌حمل", "بلست مکس"],
 "JC151": ["پرس سرد", "فناوری NeverClog", "آبمیوه‌ی طبیعی"],
 "NC701": ["بستنی نرم", "کریمی سویرل", "سافت‌سرو در خانه"],
 "FS301": ["نوشیدنی یخی", "اسلاش خانگی", "نینجا اسلاشی"],
 "ES501": ["لوکس کافه اسنشال", "اسپرسوساز", "بخار دستی"],
 "ES601": ["۳ در ۱: اسپرسو، دریپ، کلدبرو", "آسیاب ۲۵ درجه", "فادر هندزفری"],
}
ORDER = ["AF500", "AF400", "AF300", "AF180", "AF170", "DZ300", "SL400", "FN101", "BN801", "BN800", "BN750", "TB401", "TB301", "BC251", "BC151",
         "OG901", "OG850", "OG701", "DG551", "SFP700", "ON400", "OL750", "OL550", "SP101", "NC701", "FS301", "ES601", "ES501", "JC151"]
assert set(ORDER) == set(P) == set(FEAT), set(ORDER) ^ set(P)
short = lambda m: re.sub(r"\s*\(.*\)", "", P[m]["name_fa"]).strip()

def audio(style, p, d):
    b, bed = [], ["bright_pad", .5]
    if style == "J1": b = [["whoosh", .15, .45], ["thump", .58, .65], ["pop_soft", 1.1, .4], ["shimmer", 1.25, .35]]
    elif style == "J2": b = [["impact_soft", .3, .5]] + [["pop", round(1.15 + i * .9, 2), .5] for i in range(3)] + [["shimmer", 3.9, .35]]
    elif style == "J3": bed = ["rw_beat", .55]; b = [["impact", .15, .6], ["impact", .35, .55], ["thump", .75, .5], ["swish", 1.0, .5], ["pop", 1.3, .45]]
    elif style == "J4": b = [["pop", round(.55 + i * .22, 2), .45] for i in range(len(p["items"]))] + [["shimmer", round(.8 + len(p["items"]) * .22, 2), .35]]
    elif style == "J5": b = [["whoosh", round(.6 + i * ((d - 3) / len(p["items"])), 2), .4] for i in range(len(p["items"]))] + [["pop", .85, .5]]
    elif style == "K": bed = ["lux_pad", .55]; b = [["impact_soft", .35, .6], ["shimmer", .7, .5]]
    else: return None
    b.append(["whoosh_soft", round(d - 2.0, 2), .3])
    return {"bed": bed, "cues": [c for c in b if c[1] < d - .05]}

rows = []
def add(style, d, grp="v", **p):
    i = len(rows) + 1; tag = f"NJ{i:03d}"
    p.update(id=tag, style=style)
    rows.append({"tag": tag, "grp": grp, "duration": d, "params": p, "audio": audio(style, p, d)})

for m in ORDER:
    pr = P[m]; base = dict(code=m, hero=pr["hero"], title=short(m) if len(short(m)) < 40 else pr["name_fa"], feat=FEAT[m], cat=pr["category"])
    add("J1", 6, theme="white", **base)
    add("J2", 8, theme="dark" if pr["hero_alpha"] else "white", **base)
    add("J3", 6, theme="white", **base)

def items(codes): return [{"code": c, "hero": P[c]["hero"], "name": short(c)} for c in codes]
GROUPS = [
 ("همه‌ی ایرفرایرهای نینجا", ["AF500", "AF400", "AF300", "AF180", "AF170", "DZ300", "SL400", "FN101"]),
 ("مخلوط‌کن‌های نینجا", ["BN801", "BN800", "BN750", "TB401", "TB301", "BC251", "BC151"]),
 ("پخت و پز هوشمند نینجا", ["SFP700", "ON400", "OL750", "OL550", "SP101"]),
 ("گریل‌های نینجا", ["OG901", "OG850", "OG701", "DG551"]),
 ("نوشیدنی، بستنی و قهوه", ["NC701", "FS301", "ES601", "ES501", "JC151"]),
 ("نینجا هوم در رویال پارس", ["AF500", "BN801", "OG701", "ES601", "NC701", "FS301", "SFP700", "AF300", "DG551"]),
]
for t, cs in GROUPS:
    add("J4", 9, theme="white", title=t, items=items(cs))
for k, th in ((1, "red"), (2, "white"), (3, "dark")):
    add("K", 6, theme=th, k=k, l1="غرفه‌ی نینجا هوم", l2="همکف، واحد ۴ — مرکز خرید رویال پارس")
add("J5", 9, theme="white", box="پیش‌خرید رویالی", items=items(["AF500", "ES601", "BN801", "OG701", "NC701"]))
add("K", 7, theme="ry", k=3, l1="نینجا هوم در رویال ویک", l2="۳ تا ۹ آذر — همکف، واحد ۴", pill="رویال ویک")
add("J4", 8, theme="dark", title="هدیه‌ی آشپزخانه", items=items(["AF300", "ES601", "BN801", "NC701", "FS301", "OG701"]))
add("J6", 20, grp="tv", theme="white", title="نینجا هوم — رویال پارس", items=items(ORDER[:12]))
assert len(rows) == 100, len(rows)
json.dump(rows, open("data/ninja.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(rows), "motions ->", "data/ninja.json", "| v:", sum(r["grp"] == "v" for r in rows), "tv:", sum(r["grp"] == "tv" for r in rows))
