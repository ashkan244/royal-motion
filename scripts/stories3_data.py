#!/usr/bin/env python3
"""Generate data/stories3.json — v3 stories (ROYAL_STORIES_v3_PLAN.md) + Persian voice-over lines for 50 of them.
usage: python scripts/stories3_data.py"""
import json, os

rows = []
def S(id, grp, d, audio, vo=None, **p):
    p.update(id=id)
    r = {"tag": id, "grp": grp, "duration": d, "params": p, "audio": audio}
    if vo: r["vo"] = vo; r["vg"] = "V" + str(1 + (sum(1 for x in rows if x.get("vo")) // 10))
    rows.append(r)

def A(bed, *cues, g=.5):
    return {"bed": [bed, g] if bed else None, "cues": [list(c) for c in cues]}
chip = lambda *c: A("chip_bed", *c, g=.45)

# ---------------- X: «رویال آرکید» pixel (25) ----------------
S("X01", "X1", 9, chip(["chip_blip", .3, .6], ["chip_type", .7, .4], ["chip_type", 1.5, .4], ["chip_type", 2.3, .4], ["chip_power", 5.1, .7], ["chip_coin", 6.3, .5]),
  vo="سیستم رویالی روشن شد… رویال ویک، آماده‌ست!")
S("X02", "X1", 7, chip(["chip_coin", 2.3, .8], ["chip_power", 2.5, .6], ["chip_blip", 3.6, .4]), vo="یه سکه بنداز… بازی رویال ویک شروع می‌شه!")
S("X03", "X1", 9, chip(*[["chip_blip", round(.6 + i * .62, 2), .45] for i in range(7)], ["chip_power", 5.2, .6]), vo="طبقه به طبقه بیا بالا… همه‌ی طبقه‌ها رویالیه!")
S("X04", "X1", 8, chip(["chip_jump", 1.0, .6], ["chip_coin", 1.3, .5], ["chip_jump", 2.1, .6], ["chip_coin", 2.5, .5], ["chip_jump", 3.3, .6], ["chip_coin", 3.6, .5], ["chip_jump", 4.6, .6], ["chip_power", 4.95, .8]),
  vo="بپر، سکه جمع کن… و پاور آپ پنجاه درصدی رو بگیر!")
S("X05", "X1", 8, chip(*[["chip_explode", round(1.0 + i * .28, 2), .35] for i in range(15)], ["chip_power", 5.4, .6]), vo="قیمت‌های بالا حمله کردن… ولی رویال ویک همه رو نابود کرد!")
S("X06", "X1", 8, chip(*[["chip_blip", round(.3 + i * .44, 2), .35] for i in range(10)], ["chip_power", 6.0, .6]))
S("X07", "X1", 8, chip(["chip_blip", .2, .4], ["chip_blip", 1.2, .4], ["chip_power", 2.2, .5], ["chip_coin", 4.6, .7]), vo="چنگک رفت پایین… و یه هدیه گرفت! خریدت هدیه داره.")
S("X08", "X1", 7, chip(["chip_type", .2, .4], ["chip_blip", 1.8, .5], ["chip_power", 2.6, .7]), brand="کالکشن", offer="تا ۵۰٪")
S("X09", "X1", 8, chip(*[["chip_type", round(.6 + i * .28, 2), .35] for i in range(8)], ["chip_blip", 4.4, .4], ["chip_blip", 5.0, .4], ["chip_power", 5.6, .6]),
  vo="سلام رویالی! امروز چی لازم داری؟ تخفیف؟ هدیه؟ یا بازی؟")
S("X10", "X1", 7, chip(*[["chip_blip", round(i * .3, 2), .35] for i in range(7)], ["chip_power", 3.0, .5]), today=3, vo="مرحله‌ی سه از هفت… و جمعه، مرحله‌ی رئیسه!")
S("X11", "X1", 9, chip(["chip_explode", 1.7, .6], ["chip_explode", 2.7, .6], ["chip_explode", 3.7, .7], ["chip_over", 4.6, .5], ["chip_power", 5.2, .8]),
  vo="رئیس آخر: قیمت‌های گرون! با تخفیف، هدیه و امتیاز دوبرابر… ناک‌اوت! رویال فرایدی، جمعه شش آذر.")
S("X12", "X1", 8, chip(*[["chip_blip", round(.8 + i * .75, 2), .4] for i in range(6)]))
S("X13", "X1", 7, chip(*[["chip_power", round(.4 + i * 1.1, 2), .5] for i in range(4)]))
S("X14", "X2", 7, chip(["chip_blip", .3, .6], ["chip_blip", 1.5, .6], ["chip_blip", 2.7, .7], ["chip_explode", 1.2, .4], ["chip_explode", 2.4, .4], ["chip_explode", 3.6, .5], ["chip_power", 3.9, .8]),
  vo="سه… دو… یک… رویال ویک شروع شد!")
S("X15", "X2", 7, chip(["chip_over", .1, .7], *[["chip_blip", round(1.6 + i * .25, 2), .3] for i in range(8)], ["chip_power", 3.8, .7]), vo="گیم اور؟ نه! ادامه می‌دی… امروز آخرین روز رویال ویکه!")
S("X16", "X2", 6, chip(*[["chip_blip", round(.4 + i * .35, 2), .35] for i in range(5)], ["chip_coin", 2.6, .5]))
S("X17", "X2", 8, A("lux_pad", ["shimmer_low", 2.2, .4], ["chip_power", 4.0, .5], g=.5), vo="اهواز که شب می‌شه… رویال پارس می‌درخشه. شب‌های رویالی!")
S("X18", "X2", 7, A("rw_drums", g=.8), vo="اجرای زنده‌ی درام… پنجشنبه، جمعه و شنبه شب!")
S("X19", "X2", 8, chip(["engine", .2, .7], ["chip_power", 4.6, .7]), vo="جایزه‌ی بزرگ: موتورسیکلت! قرعه‌کشی تا یلدا ادامه داره.")
S("X20", "X2", 7, A("rw_beat", ["glitch", .2, .3], ["glitch", 1.2, .3], ["glitch", 2.2, .3], ["impact_soft", 3.0, .6], g=.5), photo="shops/s12", preload=["shops/s12"])
S("X21", "X2", 7, chip(["chip_power", .2, .5], ["chip_blip", 2.0, .5], ["chip_blip", 3.2, .5]))
S("X22", "X2", 7, chip(["chip_type", .2, .3], ["chip_blip", 2.4, .4], ["chip_explode", 4.4, .8], ["chip_power", 4.7, .8]), vo="در حال بارگذاری… نود و نه درصد… جمعه رسید!")
S("X23", "X2", 7, chip(*[["chip_coin", round(t * .11, 2), .45] for t in [8, 16, 24, 33, 42]], ["chip_power", 5.0, .5]))
S("X24", "X2", 7, A("bright_pad", ["whoosh", .2, .5], ["impact_soft", 3.2, .6], ["shimmer", 3.3, .5], g=.55),
  preload=["shops/s01", "shops/s07", "shops/s12", "shops/s14", "shops/s20", "shops/s24", "shops/s25", "shops/s29", "shops/s31", "shops/s05"])
S("X25", "X2", 7, A("rw_beat", ["glitch", .2, .4], ["chip_type", 1.0, .3], ["whoosh", 2.6, .5], ["impact", 4.2, .6], g=.5), photo="shops/s28", preload=["shops/s28"])

# ---------------- CI: cinematic (10) ----------------
S("CI1", "CI", 8, A("tension", ["boom", 0, .6], ["impact", 1.05, .6], ["impact", 2.75, .6], ["impact", 4.45, .6], ["boom", 5.1, .8], ["shimmer", 5.2, .5], g=.5),
  vo="در شهری که همه منتظرن… یک هفته… یک جمعه… این جمعه، رویالیه.")
S("CI2", "CI", 8, A("lux_pad", ["impact_soft", .3, .5], ["shimmer", 1.3, .5], g=.55), photo="p3", vo="رویال ویک؛ رویالی‌ترین هفته‌ی سال. با بازی هجده برند.")
S("CI3", "CI", 6, A("tension", ["whoosh", .2, .6], ["shimmer", .9, .6], g=.45))
S("CI4", "CI", 7, A("lux_pad", ["whoosh_soft", 1.6, .5], ["impact_soft", 2.6, .5], g=.55))
S("CI5", "CI", 7, A("tension", ["riser_long", .3, .5], ["impact", 3.3, .7], g=.45))
S("CI6", "CI", 7, A("lux_pad", ["printer", .1, .3], ["whoosh", 2.4, .5], ["impact_soft", 2.6, .5], g=.5))
S("CI7", "CI", 6, A("rw_beat", ["thump", 1.36, .9], ["impact", 1.4, .6], g=.5), photo="shops/s18", vo="صحنه‌ی شش، برداشت یک: رویال فرایدی… اکشن! خرید!")
S("CI8", "CI", 7, A("lux_pad", ["shimmer_low", .3, .4], ["impact_soft", 3.2, .6], g=.55), vo="مرکز خرید رویال پارس تقدیم می‌کند: رویال ویک. سه تا نه آذر.")
S("CI9", "CI", 7, A("lux_pad", ["riser_soft", 0, .4], ["shimmer", 1.0, .5], g=.55))
S("CI10", "CI", 6, A("tension", ["impact_soft", 2.4, .6], g=.45), vo="پایان؟ نه… شروع! این داستان تا یلدا ادامه داره.")

# ---------------- D3: 3D (10) ----------------
d3 = lambda *c: A("bright_pad", *c, g=.55)
S("D3-1", "D3", 7, d3(["whoosh", .3, .4], ["whoosh", 1.4, .4], ["whoosh", 2.5, .4], ["whoosh", 3.6, .4], ["impact_soft", 5.0, .6]), vo="از هر طرف نگاهش کنی… رویالیه!")
S("D3-2", "D3", 8, d3(["whoosh_soft", .2, .5], ["shimmer", 6.0, .4]), vo="هجده برند، دور تا دور تو.")
S("D3-3", "D3", 8, d3(["whoosh_rev", .8, .6], ["impact_soft", 2.0, .5]), vo="هر طبقه، یه تخفیف. از همکف تا طبقه‌ی پنج.")
S("D3-4", "D3", 7, A("lux_pad", ["whoosh", .2, .5], ["shimmer", 1.6, .5], g=.55))
S("D3-5", "D3", 8, A("tension", ["riser_long", .2, .5], ["impact", 5.6, .6], g=.45))
S("D3-6", "D3", 7, d3(["swish", .5, .4], ["swish", 2.0, .4], ["swish", 3.5, .4]))
S("D3-7", "D3", 7, d3(["whoosh", .4, .6], ["pop", 1.5, .5]))
S("D3-8", "D3", 7, A("lux_pad", ["thump", 1.3, .6], ["whoosh_rev", 1.4, .5], ["shimmer", 1.8, .7], g=.55), vo="جعبه رو باز کن… خریدت هدیه داره!")
S("D3-9", "D3", 7, d3(*[["paper", round(.8 + i * 1.05, 2), .6] for i in range(4)]), vo="کاتالوگ رویال: کومار، کالکشن، بارگلو، لیان… ورق بزن!")
S("D3-10", "D3", 7, A("rw_beat", ["shimmer", .8, .5], g=.6))

# ---------------- U: app UI (10) ----------------
ui = lambda *c: A("bright_pad", *c, g=.5)
S("U1", "U", 7, ui(["pop_soft", .5, .5], ["pop_soft", 1.5, .4], ["pop_soft", 2.5, .5], ["pop_soft", 3.5, .5], ["pop", 4.6, .5]), vo="بلک‌فرایدی کجا بریم؟ معلومه… رویال پارس!")
S("U2", "U", 6, ui(*[["tick", round(.5 + i * .45, 2), .5] for i in range(3)], ["pop", 3.0, .5]), vo="بلک فرایدی اهواز… نتیجه‌ی اول: رویال پارس.")
S("U3", "U", 7, ui(["whoosh_soft", .4, .4], ["pop", 2.6, .6], ["shimmer", 3.2, .4]), vo="مسیریابی تموم شد. رسیدی به رویال پارس!")
S("U4", "U", 7, ui(["pop_soft", .3, .4], ["pop_soft", .6, .4], ["pop_soft", .9, .4], ["cash", 1.8, .6], ["impact", 2.8, .6]), vo="کد تخفیف زدیم… قیمت‌ها خط خورد. خرید رویالی!")
S("U5", "U", 6, ui(["whoosh", .2, .5], ["pop", 2.4, .6]))
S("U6", "U", 6, ui(["pop", .4, .5], ["shimmer", 1.2, .3]), vo="پیش‌بینی هوای اهواز برای جمعه: بارش شدید تخفیف!")
S("U7", "U", 6, ui(["riser_soft", .3, .4], ["impact", 2.6, .6]), vo="شاخص رویالی امروز: پنجاه درصد صعود!")
S("U8", "U", 7, A("rw_beat", g=.75))
S("U9", "U", 6, ui(*[["pop_soft", round(.3 + i * .5, 2), .5] for i in range(4)]), photo="shops/s12")
S("U10", "U", 6, ui(["whoosh", .1, .5], ["pop", 2.0, .7], ["shimmer", 2.1, .5]), vo="رویال پارس رو دنبال کن… تا هیچ تخفیفی رو از دست ندی.")

# ---------------- H: handmade (10) ----------------
hm = lambda *c: A("bright_pad", *c, g=.55)
S("H1", "H", 7, hm(*[["paper", round(.3 + i * .6, 2), .5] for i in range(4)], ["pop", 3.0, .5]))
S("H2", "H", 6, hm(["paper", .55, .9], ["whoosh", .6, .5], ["impact_soft", 1.1, .6]), vo="پاره‌ش کن… این جمعه رویالیه!")
S("H3", "H", 6, hm(["scratch", .5, .5], ["scratch", 1.3, .4], ["pop", 1.9, .5]), photo="shops/s20")
S("H4", "H", 7, A("rw_beat", ["impact", .3, .6], ["pop_soft", .9, .4], ["pop_soft", 1.2, .4], ["pop_soft", 1.5, .4], g=.55), photo="p6", vo="رویال‌مگ این هفته: هجده برند، جمعه‌ی طلایی، و پادشاه هفته!")
S("H5", "H", 6, hm(*[["thump", round(.4 + i * .4, 2), .6] for i in range(4)]))
S("H6", "H", 7, hm(["whoosh", .2, .4], *[["scratch", round(.9 + i * .35, 2), .3] for i in range(4)], ["pop", 1.4, .4]), photo="p2", vo="لیست خرید جمعه: کفش، کیف، یه هدیه برای مامان… تیک، تیک، تیک!")
S("H7", "H", 7, hm(*[["pop", round(.2 + i * .28, 2), .4] for i in range(12)]))
S("H8", "H", 7, hm(*[["scratch", round(.5 + i * .7, 2), .4] for i in range(4)], ["scratch", 3.4, .5]), vo="برنامه‌ی هفته: سه‌شنبه شروع، پنجشنبه شب اجرا، جمعه رویال فرایدی، دوشنبه روز آخر.")
S("H9", "H", 6, hm(*[["paper", round(.4 + i * .4, 2), .5] for i in range(4)]))
S("H10", "H", 6, hm(["thump", .78, .9], ["impact_soft", .8, .5]), vo="مهر شد: هفته‌ی رویالی، تأیید شد!")

# ---------------- T: typography (10) ----------------
ty = lambda *c: A("rw_beat", *c, g=.55)
S("T1", "T", 6, ty(["whoosh", .2, .5], ["impact_soft", 1.8, .5]), photo="p3")
S("T2", "T", 6, A("lux_pad", ["shimmer", .3, .5], g=.55))
S("T3", "T", 7, ty(["whoosh", .1, .4], ["whoosh_rev", 2.0, .5], ["impact", 2.9, .6]), vo="رویالی، رویالی، رویالی… این هفته رویالیه!")
S("T4", "T", 6, A("bright_pad", ["whoosh_soft", .3, .4], ["whoosh_soft", 1.6, .4], ["shimmer", 2.9, .5], g=.55))
S("T5", "T", 6, ty(["reel", .2, .5], ["impact", 1.6, .6]), vo="هر کلمه‌ای که بخوای… ولی آخرش: این جمعه رویالیه!")
S("T6", "T", 7, ty(*[["kick", round(.2 + i * .5, 2), .5] for i in range(8)]), vo="این هفته، همه‌چیز، توی رویال پارس، رویالیه!")
S("T7", "T", 6, A("lux_pad", ["impact_soft", .8, .6], g=.55))
S("T8", "T", 7, ty(*[["swish", round(.5 + i * .6, 2), .4] for i in range(5)]), vo="این هفته تخفیف داره، هدیه داره، بازی داره… و یه جمعه‌ی طلایی!")
S("T9", "T", 7, ty(*[["scratch", round(.65 + i * 1.0, 2), .4] for i in range(3)], *[["impact", round(.9 + i * 1.0, 2), .5] for i in range(3)]), vo="قیمت عادی؟ نه! قیمت رویالی. یه جمعه‌ی معمولی؟ نه! این جمعه رویالیه.")
S("T10", "T", 6, ty(["whoosh", .1, .5]))

# ---------------- DA: data (5) ----------------
S("DA1", "DA", 7, A("bright_pad", *[["tick", round(.5 + i * .8, 2), .5] for i in range(5)], g=.5), vo="رویال ویک به عدد: هجده برند، شش طبقه، هفت روز، سه شب اجرا، و یک موتورسیکلت!")
S("DA2", "DA", 7, A("rw_beat", ["riser_soft", .3, .4], ["impact", 1.8, .6], g=.5), vo="مسابقه‌ی تخفیف‌ها… کالکشن تا پنجاه درصد، اوله!")
S("DA3", "DA", 6, A("bright_pad", ["riser_soft", .5, .5], ["impact", 2.4, .6], g=.5))
S("DA4", "DA", 9, A("bright_pad", *[["whoosh", round(i * 1.72, 2), .4] for i in range(5)], g=.6), vo="رویال ویک تموم شد… ولی چه هفته‌ای! هفت روز، هجده برند، سه شب اجرا. ممنون که رویالی بودید.")
S("DA5", "DA", 7, A("rw_beat", *[["pop_soft", round(.4 + i * .15, 2), .4] for i in range(6)], g=.5))

# ---------------- SH: shaders (10) ----------------
S("SH1", "SH", 6, A("lux_pad", ["shimmer", .4, .5], g=.55))
S("SH2", "SH", 6, A("lux_pad", ["shimmer", .3, .5], ["shimmer", 2.0, .4], g=.55), vo="کارت عضویت رویالی… تو رویالی هستی.")
S("SH3", "SH", 6, A("rw_drums", g=.6))
S("SH4", "SH", 6, A("rw_beat", ["glitch", 1.25, .5], ["glitch", 2.75, .5], ["impact", 3.5, .5], g=.55), photo=["shops/s01", "shops/s20", "shops/s29"])
S("SH5", "SH", 6, A("lux_pad", ["whoosh_soft", .2, .5], g=.55), preload=["shops/s25"])
S("SH6", "SH", 7, A("bright_pad", ["whoosh", 1.0, .5], ["shimmer", 2.4, .4], g=.55), preload=["shops/s14", "shops/s29"])
S("SH7", "SH", 6, A("tension", ["riser_soft", .2, .4], g=.5))
S("SH8", "SH", 7, A("lux_pad", ["whoosh_soft", 1.0, .5], ["shimmer", 2.6, .4], g=.55), preload=["shops/s05", "shops/s31"])
S("SH9", "SH", 6, A("lux_pad", ["riser_soft", 0, .4], ["shimmer", .6, .5], g=.55), vo="مرکز خرید رویال پارس… یک خانواده، یک خانه.")
S("SH10", "SH", 6, A("lux_pad", ["shimmer", 1.4, .6], g=.55))

# ---------------- PH: photo effects (10) ----------------
S("PH1", "PH", 7, A("lux_pad", ["shimmer_low", .6, .4], g=.55), photo="shops/s25")
S("PH2", "PH", 7, A("rw_beat", ["whoosh", .8, .6], ["impact_soft", 2.4, .5], g=.5), preload=["shops/s12", "shops/s28"])
S("PH3", "PH", 7, A("bright_pad", ["shimmer", 3.0, .5], g=.55), photo="shops/s29", preload=["shops/s29"])
S("PH4", "PH", 6, A("rw_beat", ["impact", 0, .5], ["impact", .94, .5], ["impact", 1.88, .5], g=.6))
S("PH5", "PH", 6, A("rw_beat", ["glitch", .8, .4], ["boom", .9, .8], g=.5), photo="shops/s31")
S("PH6", "PH", 6, A("lux_pad", ["whoosh_soft", .1, .5], g=.55), photo="p6")
S("PH7", "PH", 7, A("bright_pad", ["swish", .6, .4], ["swish", 1.6, .4], ["impact_soft", 3.0, .5], g=.55), photo="shops/s12", vo="قبل… و بعدِ رویال ویک! فرقش رو ببین.")
S("PH8", "PH", 8, A("rw_beat", ["beep", .1, .4], g=.6), vo="ضبط زنده از رویال پارس… شلوغه، خوش می‌گذره، بیا!")
S("PH9", "PH", 7, A("lux_pad", ["printer", .1, .3], ["shimmer", 2.4, .4], g=.55), photo="p5", vo="یه یادگاری رویالی… که آروم‌آروم ظاهر می‌شه.")
S("PH10", "PH", 7, A("bright_pad", ["whoosh_soft", .2, .4], g=.55))

assert len(rows) == 100, len(rows)
vo = [r for r in rows if r.get("vo")]
assert len(vo) == 50, len(vo)
os.makedirs("data", exist_ok=True)
json.dump(rows, open("data/stories3.json", "w", encoding="utf8"), ensure_ascii=False, indent=1)
from collections import Counter
print("stories:", len(rows), dict(Counter(r["grp"] for r in rows)), "voiced:", len(vo), dict(Counter(r["vg"] for r in vo)))
