#!/usr/bin/env python3
"""Generate data/notices.json: 20 «ساعت کاری» (working-hours) announcement motions for Royal Week.
Text of the notice: مرکز خرید رویال پارس، از سوم تا نهم آذر، به صورت یکسره از ۱۰:۳۰ صبح تا ۲۳:۰۰.
Rendered by stories/engine.js (styles N1 clock, N3 day bar, N4 door sign, N5 week list + S1/S3/S4/S6).
usage: python scripts/notices_data.py"""
import json, os

FOOT = ["مرکز خرید رویال پارس", "کیان‌پارس — بلوار چمران"]
PILL = "۳ تا ۹ آذر"
ITEMS = ["شروع ۱۰:۳۰ صبح", "پایان ۲۳:۰۰", "یکسره"]


def audio(st, p, d):
    b = []
    if st == "N1":
        bed = ["bright_pad", .5]; b += [["impact_soft", .25, .5]] + [["tick", round(1.0 + i * .5, 2), .4] for i in range(int((d - 3.4) / .5))] + [["beep_hi", round(d - 2.5, 2), .5], ["shimmer", round(d - 2.4, 2), .4]]
    elif st == "N3":
        bed = ["bright_pad", .5]; b += [["whoosh", .75, .45]] + [["tick", round(1.0 + i * .4, 2), .35] for i in range(int((d - 3.4) / .4))] + [["pop", round(d - 2.4, 2), .5]]
    elif st == "N4":
        bed = ["bright_pad", .5]; b += [["thump", .78, .7], ["pop", 1.2, .4], ["shimmer", 1.4, .4]]
    elif st == "N5":
        bed = ["bright_pad", .5]; b += [["pop_soft", round(.95 + i * .2, 2), .5] for i in range(7)] + [["shimmer", round(.95 + 7 * .2, 2), .4]]
    elif st == "S1":
        bed = ["tension", .45]; b += [["riser_soft", 0, .4], ["impact_soft", .5, .6], ["shimmer", .55, .5]]
    elif st == "S3":
        bed = ["rw_beat", .6]; o = .3 + (.35 if p.get("big") else 0)
        b += [["kick", round(o + i * .235, 3), .55] for i in range(len(p["title"].replace("[[", "").replace("]]", "").replace("|", " ").split()))]
    elif st == "S4":
        bed = ["rw_beat", .6]; b += [["swish", .05, .6], ["swish", .15, .5], ["impact", .6, .75], ["glitch", .62, .3]]
    else:  # S6 split-flap
        bed = ["rw_beat", .5]; b += [["flap", .5, .7], ["flap", 1.1, .6], ["thump", .15, .4]]
        if p.get("red"): b += [["tick", round(x * .5 + 1.5, 2), .35] for x in range(int((d - 2) / .5))]
    b.append(["whoosh_soft", round(d - 2.0, 2), .3])
    return {"bed": bed, "cues": [c for c in b if c[1] < d - .05]}


rows = []
def N(i, style, d, **p):
    tag = f"NT{i:02d}"
    p.update(id=tag, style=style, series="N", pill=PILL, foot=FOOT)
    rows.append({"tag": tag, "series": "N", "duration": d, "params": p, "audio": audio(style, p, d)})

# --- clock (analog + live digital time sweeping 10:30 -> 23:00)
N(1, "N1", 9, theme="dark", kicker="اطلاعیه ساعت کاری", title="مرکز خرید|[[رویال پارس]]", sub="از سوم تا نهم آذر", items=ITEMS)
N(2, "N1", 9, theme="yellow", kicker="اطلاعیه", title="[[ساعت کاری]]|رویال پارس", sub="از ۳ تا ۹ آذر — هر روز", items=ITEMS)
N(3, "N1", 9, theme="red", kicker="اطلاعیه ساعت کاری", title="رویال ویک|[[یکسره]] باز است", sub="۱۰:۳۰ صبح تا ۲۳:۰۰", items=["۷ روز", "بدون تعطیلی", "یکسره"])
# --- day bar (sun -> moon, 10:30 -> 23:00)
N(4, "N3", 9, theme="dark", kicker="اطلاعیه ساعت کاری", title="از [[صبح]] تا [[شب]]|یکسره", sub="مرکز خرید رویال پارس", items=["۳ تا ۹ آذر", "بدون وقفه"])
N(5, "N3", 9, theme="yellow", kicker="اطلاعیه", title="[[بدون وقفه]]|۷ روز", sub="مرکز خرید رویال پارس", items=["۳ تا ۹ آذر", "تا ساعت ۲۳:۰۰"])
N(6, "N3", 9, theme="red", kicker="اطلاعیه ساعت کاری", title="ساعت کاری|[[رویال ویک]]", sub="از سوم تا نهم آذر", items=["یکسره", "۱۰:۳۰ تا ۲۳:۰۰"])
# --- hanging door sign
N(7, "N4", 8, theme="dark", open="OPEN", head="یکسره باز است", hours="۱۰:۳۰ صبح تا ۲۳:۰۰", note="۳ تا ۹ آذر — مرکز خرید رویال پارس")
N(8, "N4", 8, theme="yellow", open="OPEN", head="رویال پارس باز است", hours="۱۰:۳۰ صبح تا ۲۳:۰۰", note="اطلاعیه ساعت کاری — ۳ تا ۹ آذر")
N(9, "N4", 8, theme="red", open="OPEN", head="ساعت کاری ویژه", hours="۱۰:۳۰ تا ۲۳:۰۰", note="یکسره — ۳ تا ۹ آذر")
# --- week list (7 days)
N(10, "N5", 9, theme="dark", kicker="اطلاعیه", title="[[ساعت کاری]] هفته‌ی رویالی")
N(11, "N5", 9, theme="yellow", kicker="اطلاعیه ساعت کاری", title="هر روز، [[یکسره]]")
N(12, "N5", 9, theme="red", kicker="مرکز خرید رویال پارس", title="۷ روز [[باز]] هستیم", hours="۱۰:۳۰ تا ۲۳:۰۰")
# --- spotlight / type / tape / flap (existing styles)
N(13, "S1", 7, kicker="اطلاعیه ساعت کاری", big="۱۰:۳۰ تا ۲۳:۰۰", title="[[یکسره]]، ۷ روز", sub="مرکز خرید رویال پارس — ۳ تا ۹ آذر")
N(14, "S1", 7, kicker="تا ساعت", big="۲۳:۰۰", title="شب‌ها هم [[بمانید]]", sub="اطلاعیه ساعت کاری — ۳ تا ۹ آذر")
N(15, "S3", 8, kicker="اطلاعیه ساعت کاری", title="هفته‌ی رویالی|[[یکسره]] باز است", sub="۱۰:۳۰ صبح تا ۲۳:۰۰", items=ITEMS[:2])
N(16, "S3", 8, kicker="مرکز خرید رویال پارس", title="از [[۱۰:۳۰]] صبح|تا [[۲۳:۰۰]] شب", sub="از سوم تا نهم آذر")
N(17, "S4", 7, tape="OPEN NON-STOP", tape2="ROYAL WEEK", title="[[یکسره]]|۱۰:۳۰ تا ۲۳:۰۰", sub="اطلاعیه ساعت کاری — ۳ تا ۹ آذر")
N(18, "S4", 7, tape="10:30 AM - 11:00 PM", tape2="WORKING HOURS", title="ساعت کاری|[[رویال ویک]]", sub="از سوم تا نهم آذر")
N(19, "S6", 8, title="[[ساعت کاری]]", items=["۳ تا ۹ آذر", "۱۰:۳۰ صبح تا ۲۳:۰۰", "یکسره — بدون تعطیلی"])
N(20, "S6", 8, red=True, title="[[اطلاعیه]] ساعت کاری", items=["مرکز خرید رویال پارس", "هر روز از ۱۰:۳۰ تا ۲۳:۰۰", "این هفته رویالیه"])

os.makedirs("data", exist_ok=True)
json.dump(rows, open("data/notices.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(rows), "notices ->", "data/notices.json")
