#!/usr/bin/env python3
"""Bundle rendered stories for the page admin: day folders + a Persian publishing guide.
usage: python3 scripts/stories_pack.py <outDir> <packDir>"""
import json, os, shutil, sys, glob

OUT, PACK = sys.argv[1], sys.argv[2]
rows = {r["tag"]: r for r in json.load(open("data/stories.json", encoding="utf8"))}

# publishing calendar (ROYAL_WEEK_100_STORIES_PLAN.md §5) — weekdays checked for 1405
CAL = [
    ("01_شنبه-۳۰-آبان", ["A01", "M20"]),
    ("02_یکشنبه-۱-آذر", ["A02", "A03", "A04", "A05", "M01"]),
    ("03_دوشنبه-۲-آذر", ["A06", "A07", "A08", "A09", "A10", "M14", "M09"]),
    ("04_سه‌شنبه-۳-آذر_افتتاح", ["B01", "B02", "B03", "B04", "B05", "B06", "I01", "E01", "E02", "E05", "F01", "D01", "C02", "C22", "M10", "M19"]),
    ("05_چهارشنبه-۴-آذر", ["I02", "E03", "E04", "E06", "F02", "G01", "H01", "D02", "D03", "D04", "C01", "C03", "C04", "J01", "M02", "M04"]),
    ("06_پنجشنبه-۵-آذر", ["I03", "E07", "G02", "G06", "F04", "H02", "H03", "D05", "D06", "D07", "C05", "C06", "C07", "C08", "J04", "M03", "M18"]),
    ("07_جمعه-۶-آذر_رویال-فرایدی", ["H04", "H05", "H06", "H07", "H08", "H09", "H10", "I04", "E08", "G03", "G05", "C10", "C13", "C19", "C20", "J06", "M15", "M12"]),
    ("08_شنبه-۷-آذر", ["I05", "E09", "G04", "F03", "C09", "C11", "C12", "J02", "K01", "K03", "M05", "M06"]),
    ("09_یکشنبه-۸-آذر", ["I06", "E10", "E12", "L01", "C14", "C15", "C16", "C17", "J03", "K02", "K04", "M07", "M08"]),
    ("10_دوشنبه-۹-آذر_روز-آخر", ["I07", "E11", "L02", "L03", "C18", "C21", "J05", "K05", "M11", "M13"]),
    ("11_سه‌شنبه-۱۰-آذر", ["L04", "L05", "M16", "M17"]),
]
SLOT = {"M": "۱۳:۰۰", "I": "۱۰:۰۰", "B": "۱۰:۰۰", "A": "۱۸:۰۰", "C": "۱۳:۰۰", "D": "۱۳:۰۰", "E": "۱۸:۰۰", "F": "۱۸:۰۰", "G": "۲۰:۳۰", "H": "۲۰:۳۰", "J": "۱۸:۰۰", "K": "۱۳:۰۰", "L": "۲۰:۳۰"}
STICKER = {"poll": "استیکر نظرسنجی (Poll)", "quiz": "استیکر کوئیز (Quiz)", "countdown": "استیکر شمارش معکوس (Countdown)", "slider": "استیکر اسلایدر ایموجی", "question": "استیکر سؤال (Question)"}

vids = {}
for f in glob.glob(os.path.join(OUT, "**", "*.mp4"), recursive=True):
    b = os.path.basename(f)
    if "-story-" in b: vids[b.split("-story-")[1].split("__")[0]] = f
shutil.rmtree(PACK, ignore_errors=True); os.makedirs(PACK)
lines = ["راهنمای انتشار ۱۲۰ موشن‌استوری رویال ویک (۱۰۰ طراحی + ۲۰ با عکس فروشگاه‌ها)", "کمپین: ۳ تا ۹ آذر ۱۴۰۵ — اوج: جمعه ۶ آذر (Royal Friday)", "",
         "• هر پوشه = یک روز. داخل هر پوشه فایل‌ها به ترتیب انتشار شماره خورده‌اند.",
         "• ساعت‌های پیشنهادی: ۱۰ صبح خبر روز، ۱۳ برندها، ۱۸ بازی و جایزه، ۲۰:۳۰ شب‌ها و فوریت.",
         "• استوری‌هایی که «استیکر» دارند: جای خالی پایین کادر را با همان استیکر اینستاگرام پر کنید.",
         "• درصد برندها از نظرسنجی است؛ اگر برندی عدد دیگری اعلام کرد، قبل از انتشار خبر بدهید.", ""]
missing = []
for folder, ids in CAL:
    d = os.path.join(PACK, folder); os.makedirs(d)
    lines.append("— " + folder.replace("_", " ").replace("-", " "))
    for i, sid in enumerate(ids, 1):
        p = rows[sid]["params"]
        name = f"{i:02d}_{sid}.mp4"
        if sid in vids: shutil.copy(vids[sid], os.path.join(d, name))
        else: missing.append(sid)
        txt = (p.get("title") or p.get("big") or "").replace("[[", "").replace("]]", "").replace("|", " ")
        extra = ("  ← " + STICKER[p["sticker"]]) if p.get("sticker") else ""
        lines.append(f"   {i:02d}. {sid}  ساعت {SLOT.get(sid[0], '۱۳:۰۰')}  «{txt}»{extra}")
    lines.append("")
if missing: lines.append("رندر نشده: " + ", ".join(missing))
open(os.path.join(PACK, "راهنمای-انتشار.txt"), "w", encoding="utf8").write("﻿" + "\n".join(lines))
print(f"pack: {sum(len(i) for _, i in CAL) - len(missing)} stories, missing {missing}")
