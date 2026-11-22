/* v3 stories: cinematic (CI), 3D (D3), app UI (U), handmade (H) */
(function () {
  const def = (id, fn) => S3.def(id, fn);
  const darkBottom = (c, z) => c.layer({ zIndex: z || 6, background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 48%, rgba(0,0,0,.88) 100%)" });
  const kb = (c, e, from, to) => c.tl.fromTo(e, from || { scale: 1.12, x: -20 }, Object.assign({ duration: c.D, ease: "none" }, to || { scale: 1, x: 20 }), 0);
  const titleAt = (c, text, top, bot, t, o) => { const col = c.col(top, bot); const tt = c.title(col, text, o); c.rise(tt.words, t); return { col, tt }; };

  /* ============ CINEMATIC ============ */
  def("CI1", (c) => {   // trailer
    c.layer({ background: "#000" });
    const cards = c.S.cards || ["در شهری که همه منتظرن…", "یک هفته…", "یک جمعه…"], ph = c.S.photo || ["shops/s01", "shops/s14", "shops/s29"];
    const bar = (top) => c.el("div", null, null, null, { position: "absolute", left: 0, right: 0, height: "230px", background: "#000", zIndex: 60, [top ? "top" : "bottom"]: 0 });
    bar(true); bar(false);
    cards.forEach((txt, i) => {
      const t0 = i * 1.7, L = c.scene(t0, t0 + 1.05, { zIndex: 10, background: "#000", display: "flex", alignItems: "center", justifyContent: "center" });
      const e = c.el("div", "s3-t", L, txt, { color: "#e9e2cf", fontSize: "80px" }); c.fit(e, 860, null, 84);
      c.tl.fromTo(e, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.5 }, t0);
      const P = c.scene(t0 + 1.05, t0 + 1.7, { zIndex: 11 }); const im = c.img(ph[i % ph.length], P); c.tl.fromTo(im, { scale: 1.2 }, { scale: 1.05, duration: 0.65, ease: "none" }, t0 + 1.05);
      c.flash(t0 + 1.05, "#fff", 0.6);
    });
    const tEnd = cards.length * 1.7, F = c.scene(tEnd, null, { zIndex: 20, background: "#000" });
    const col = c.col(560, 1300, { zIndex: 25 }); const tt = c.title(col, c.S.title || "این جمعه|[[رویالیه]]", { px: 170, color: "#e9e2cf" }); c.win(col, tEnd);
    c.rise(tt.words, tEnd + 0.1, 0.12); const sub = c.el("div", "s3-b", col, c.S.sub || "به‌زودی در رویال پارس", { fontSize: "46px", color: c.Y }); c.fadeUp(sub, tEnd + 0.7);
    c.frame({ footT: tEnd + 0.9 });
  });
  def("CI2", (c) => {   // animated movie poster
    const im = c.img(c.S.photo || "p3"); kb(c, im, { scale: 1.15, y: 30 }, { scale: 1.02, y: 0 });
    darkBottom(c);
    const stars = c.el("div", "s3-en", null, "★★★★★", { position: "absolute", top: "360px", left: 0, right: 0, textAlign: "center", fontSize: "60px", color: c.Y, zIndex: 20 }); c.fadeUp(stars, 0.6);
    const q = c.el("div", "s3-b", null, "«رویالی‌ترین هفته‌ی سال»", { position: "absolute", top: "450px", left: 0, right: 0, textAlign: "center", fontSize: "44px", color: "#fff", zIndex: 20 }); c.fadeUp(q, 0.9);
    titleAt(c, "[[رویال ویک]]", 1000, 1220, 1.3, { px: 190 });
    const cr = c.el("div", "s3-b", null, "با بازی: ۱۸ برند — ۶ طبقه — یک جمعه طلایی", { position: "absolute", top: "1250px", left: "90px", right: "90px", textAlign: "center", fontSize: "34px", color: "rgba(255,255,255,.75)", zIndex: 20 }); c.fadeUp(cr, 1.9);
    c.frame({ footT: 2.2 });
  });
  def("CI3", (c) => {   // anamorphic flare
    c.layer({ background: "radial-gradient(ellipse at 50% 50%, #101a33 0%, #030509 70%)" }); c.dust(30, "#9fd3ff");
    const fl = c.el("div", null, null, null, { position: "absolute", left: "-20%", width: "140%", top: "760px", height: "16px", zIndex: 40, borderRadius: "50%",
      background: "linear-gradient(90deg, transparent, rgba(110,190,255,.9) 35%, #fff 50%, rgba(110,190,255,.9) 65%, transparent)", boxShadow: "0 0 60px 20px rgba(80,160,255,.5)" });
    c.tl.fromTo(fl, { x: -1200, scaleY: 0.4 }, { x: 1200, scaleY: 1, duration: 1.4, ease: "power2.inOut" }, 0.2);
    const col = c.col(620, 1100); const tt = c.title(col, c.S.title || "[[Royal Friday]]".replace("[[Royal Friday]]", "جمعه [[رویالی]]"), { px: 180, color: "#F3D27A", key: "#fff" });
    c.tl.fromTo(col, { opacity: 0, filter: "blur(20px)" }, { opacity: 1, filter: "blur(0px)", duration: 0.8 }, 0.9);
    c.frame({ footT: 1.6 });
  });
  def("CI4", (c) => {   // rack focus between two photos
    const a = c.img(c.S.photo ? c.S.photo[0] : "shops/s24", null, { zIndex: 2 }), b = c.img(c.S.photo ? c.S.photo[1] : "shops/s27", null, { zIndex: 3 });
    c.tl.fromTo(a, { filter: "blur(0px)" }, { filter: "blur(16px)", duration: 0.9, ease: "power2.inOut" }, 1.6);
    c.tl.fromTo(b, { opacity: 0, filter: "blur(18px)" }, { opacity: 1, filter: "blur(0px)", duration: 1.0, ease: "power2.inOut" }, 1.7);
    kb(c, a); kb(c, b, { scale: 1.08 }, { scale: 1 }); darkBottom(c, 6);
    titleAt(c, c.S.title || "از نزدیک|[[ببین]]", 1020, 1320, 2.6, { px: 150 }); c.frame({ footT: 3 });
  });
  def("CI5", (c) => {   // dolly zoom
    const L1 = c.layer({ zIndex: 2, overflow: "hidden" }), L2 = c.layer({ zIndex: 3, clipPath: "circle(30% at 50% 45%)" });
    const a = c.img(c.S.photo || "shops/s28", L1), b = c.img(c.S.photo || "shops/s28", L2);
    c.tl.fromTo(a, { scale: 1 }, { scale: 1.7, duration: 3, ease: "power1.inOut" }, 0.3); c.tl.fromTo(b, { scale: 1.5 }, { scale: 1, duration: 3, ease: "power1.inOut" }, 0.3);
    c.tl.to(L2, { clipPath: "circle(80% at 50% 45%)", duration: 0.8, ease: "power2.in" }, 3.0); darkBottom(c, 6);
    titleAt(c, "[[رویال ویک]]|نزدیکه!", 1000, 1320, 3.4, { px: 150 }); c.frame({ footT: 3.8 });
  });
  def("CI6", (c) => {   // film strip
    c.layer({ background: "#0b0b0b" });
    const strip = c.el("div", null, null, null, { position: "absolute", left: "190px", width: "700px", top: 0, zIndex: 5, background: "#111", borderLeft: "40px dashed #e8e0c8", borderRight: "40px dashed #e8e0c8", padding: "0 20px" });
    const ph = c.S.photo || ["shops/s12", "shops/s20", "shops/s25", "shops/s29", "shops/s05", "shops/s14", "shops/s01"];
    ph.forEach((p, i) => { const f = c.el("div", null, strip, null, { position: "relative", height: "430px", margin: "26px 0", overflow: "hidden" }); const im = c.img(p, f); im.style.filter = i === 3 ? "" : "grayscale(1) contrast(1.2)"; f.id = "cf" + i; });
    c.tl.fromTo(strip, { y: 400 }, { y: -1440, duration: 2.4, ease: "power3.inOut" }, 0.1);
    const hero = c.layer({ zIndex: 20, overflow: "hidden" }); const hi = c.img(ph[3], hero); c.win(hero, 2.5);
    c.tl.fromTo(hero, { clipPath: "inset(36% 22% 36% 22%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "power3.inOut", immediateRender: false }, 2.5);
    darkBottom(c, 21); titleAt(c, c.S.title || "قاب [[رویالی]]", 1040, 1320, 3.0, { px: 150 }); c.frame({ footT: 3.2 });
  });
  def("CI7", (c) => {   // clapperboard
    c.layer({ background: "#111" });
    const board = c.el("div", null, null, null, { position: "absolute", left: "140px", width: "800px", top: "640px", height: "520px", background: "#151515", border: "6px solid #eee", zIndex: 10, borderRadius: "10px" });
    const top = c.el("div", null, null, null, { position: "absolute", left: "140px", width: "800px", top: "540px", height: "100px", zIndex: 11, transformOrigin: "0% 100%",
      background: "repeating-linear-gradient(-45deg, #f2f2f2 0 60px, #111 60px 120px)", border: "6px solid #eee", borderRadius: "10px" });
    [["صحنه", "۶"], ["برداشت", "۱"], ["فیلم", "رویال فرایدی"]].forEach(([k, v], i) => c.el("div", "s3-t", board, `${k}: ${v}`, { position: "absolute", right: "50px", top: 60 + i * 140 + "px", fontSize: "70px", color: i === 2 ? c.Y : "#eee" }));
    c.tl.fromTo(top, { rotation: -28 }, { rotation: 0, duration: 0.18, ease: "power4.in" }, 1.2); c.flash(1.38, "#fff", 0.8); c.shake(1.38, 10);
    const P = c.scene(1.5, null, { zIndex: 30 }); const im = c.img(c.S.photo || "shops/s18", P); kb(c, im); const dk = darkBottom(c, 31); c.win(dk, 1.5);
    const r = titleAt(c, "اکشن… [[خرید!]]", 1050, 1320, 1.7, { px: 140 }); r.col.style.zIndex = 40; c.frame({ footT: 2.2 });
  });
  def("CI8", (c) => {   // opening credits
    c.layer({ background: "radial-gradient(ellipse at 50% 45%, #1a1408 0%, #050403 70%)" }); c.grain(0.08);
    const seq = c.S.seq || [["رویال پارس", 0.3], ["تقدیم می‌کند", 1.6]];
    seq.forEach(([txt, t], i) => { const e = c.el("div", "s3-t", null, txt, { position: "absolute", left: 0, right: 0, top: 780 + i * 0 + "px", textAlign: "center", fontSize: i ? "60px" : "96px", color: i ? "#d8cfb8" : "#F3D27A", zIndex: 10 });
      c.tl.fromTo(e, { opacity: 0, letterSpacing: 0 }, { opacity: 1, duration: 0.7 }, t); c.tl.to(e, { opacity: 0, duration: 0.5 }, t + 1.1); });
    titleAt(c, c.S.title || "[[رویال ویک]]|۳ تا ۹ آذر", 620, 1200, 3.2, { px: 170, color: "#F3D27A", key: "#fff" }); c.frame({ footT: 3.8 });
  });
  def("CI9", (c) => {   // god rays through the entrance
    const im = c.img(c.S.photo || "shops/s27"); kb(c, im, { scale: 1.1 }, { scale: 1 });
    const rays = c.layer({ zIndex: 5, background: "repeating-conic-gradient(from 0deg at 50% 38%, rgba(255,230,160,.22) 0 4deg, rgba(255,230,160,0) 4deg 14deg)", WebkitMaskImage: "radial-gradient(circle at 50% 38%, #000 0%, transparent 60%)" });
    c.tl.fromTo(rays, { rotation: -8, opacity: 0 }, { rotation: 6, opacity: 1, duration: c.D, ease: "none" }, 0);
    darkBottom(c, 6); titleAt(c, c.S.title || "درها|[[باز شد]]", 1040, 1320, 1.0, { px: 160 }); c.frame({ footT: 1.6 });
  });
  def("CI10", (c) => {  // cinematic ending
    c.layer({ background: "#050505" }); c.grain(0.07);
    const a = c.el("div", "s3-t", null, "پایان", { position: "absolute", left: 0, right: 0, top: "760px", textAlign: "center", fontSize: "170px", color: "#eee", zIndex: 10 });
    c.tl.fromTo(a, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.2); c.tl.to(a, { opacity: 0, duration: 0.4 }, 2.0);
    const b = c.el("div", "s3-t", null, "یا… شروع؟", { position: "absolute", left: 0, right: 0, top: "760px", textAlign: "center", fontSize: "140px", color: c.Y, zIndex: 10 });
    c.tl.fromTo(b, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 0.5 }, 2.4);
    const s = c.el("div", "s3-b", null, c.S.sub || "تا یلدا ادامه داره", { position: "absolute", left: 0, right: 0, top: "1000px", textAlign: "center", fontSize: "56px", color: "#fff", zIndex: 10 }); c.fadeUp(s, 3.2);
    c.frame({ footT: 3.6 });
  });

  /* ============ 3D ============ */
  const stage = (c, persp, z) => { const s = c.layer({ zIndex: z || 10, perspective: (persp || 1800) + "px" }); const w = c.el("div", null, s, null, { position: "absolute", left: "50%", top: "45%", transformStyle: "preserve-3d" }); return w; };
  def("D3-1", (c) => {  // brand cube
    c.layer({ background: "radial-gradient(ellipse at 50% 45%, #2a2410 0%, #050505 70%)" });
    const s = 560, w = stage(c, 2200); const cube = c.el("div", null, w, null, { position: "absolute", width: s + "px", height: s + "px", left: -s / 2 + "px", top: -s / 2 + "px", transformStyle: "preserve-3d" });
    const ph = c.S.photo || ["shops/s01", "shops/s20", "shops/s25", "shops/s29", "shops/s05"], tr = ["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"];
    tr.forEach((t, i) => { const f = c.el("div", null, cube, null, { position: "absolute", inset: 0, transform: `${t} translateZ(${s / 2}px)`, backfaceVisibility: "hidden", overflow: "hidden", border: "6px solid #FFD21F" });
      if (i === 5) { f.style.background = "#FFD21F"; c.el("div", "s3-t", f, "رویال ویک", { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "120px", color: "#0A0A0A" }); }
      else c.img(ph[i % ph.length], f); });
    c.tl.fromTo(cube, { rotationY: 0, rotationX: -12 }, { keyframes: { rotationY: [0, -90, -180, -270, -360, -360], rotationX: [-12, -12, -12, -12, -12, 90] }, duration: 5.2, ease: "power2.inOut" }, 0.2);
    titleAt(c, c.S.title || "هر طرفش [[رویالیه]]", 1080, 1320, 5.0, { px: 130 }); c.frame({ footT: 5.2 });
  });
  def("D3-2", (c) => {  // orbit carousel of brand cards
    c.layer({ background: "radial-gradient(ellipse at 50% 40%, #1b2250 0%, #05060f 75%)" });
    const names = c.S.items || ["کومار", "کالکشن", "لیان", "بارگلو", "بوردا", "پوپو", "بوکت", "زرسان", "فکرینه", "لون"];
    const w = stage(c, 2000), ring = c.el("div", null, w, null, { position: "absolute", transformStyle: "preserve-3d" }), R = 620, n = names.length;
    names.forEach((nm, i) => { const card = c.el("div", "s3-t", ring, nm, { position: "absolute", width: "300px", height: "400px", left: "-150px", top: "-200px", display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "64px", color: "#0A0A0A", background: i % 2 ? "#FFD21F" : "#fff", borderRadius: "28px", transform: `rotateY(${(i * 360) / n}deg) translateZ(${R}px)`, boxShadow: "0 20px 40px rgba(0,0,0,.5)" }); });
    c.tl.fromTo(ring, { rotationY: 0, rotationX: -8 }, { rotationY: -360 - 36, rotationX: -8, duration: c.D - 1.5, ease: "power2.inOut" }, 0.1);
    titleAt(c, c.S.title || "[[۱۸ برند]] دور تو", 1120, 1330, 1.0, { px: 130 }); c.frame({ footT: 1.4 });
  });
  def("D3-3", (c) => {  // isometric mall, floors explode
    c.layer({ background: "#07070c" });
    const F = c.S.floors || [["همکف", "نینجا هوم"], ["۱", "بارگلو"], ["۲", "تا ۵۰٪"], ["۳", "تا ۲۰٪"], ["۴", "تا ۳۰٪"], ["۵", "۱۵٪"]];
    const w = stage(c, 3000), iso = c.el("div", null, w, null, { position: "absolute", transformStyle: "preserve-3d", transform: "rotateX(58deg) rotateZ(-40deg)" });
    const slabs = F.map(([lbl, off], i) => { const s = c.el("div", null, iso, null, { position: "absolute", width: "520px", height: "520px", left: "-260px", top: "-260px", transformStyle: "preserve-3d",
      background: i % 2 ? "rgba(255,210,31,.9)" : "rgba(255,255,255,.92)", border: "6px solid #0A0A0A", boxShadow: "0 0 0 2px #FFD21F" });
      c.el("div", "s3-t", s, `${lbl} — ${off}`, { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "58px", color: "#0A0A0A", transform: "rotateZ(40deg)" }); return s; });
    slabs.forEach((s, i) => { c.tl.fromTo(s, { z: i * 40 }, { z: i * 150, duration: 1.2, ease: "power3.inOut" }, 0.8); c.tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.1 + i * 0.1); });
    c.tl.fromTo(iso, { rotationZ: -40 }, { rotationZ: -25, duration: c.D, ease: "none" }, 0);
    titleAt(c, c.S.title || "[[هر طبقه]] یه تخفیف", 1180, 1330, 2.2, { px: 120 }); c.frame({ footT: 2.4 });
  });
  def("D3-4", (c) => {  // extruded 3D number
    c.layer({ background: "radial-gradient(ellipse at 50% 42%, #3a2a0c 0%, #070503 70%)" }); c.dust(30);
    const w = stage(c, 2200), grp = c.el("div", null, w, null, { position: "absolute", transformStyle: "preserve-3d" });
    const txt = c.S.big || "۵۰٪";
    for (let i = 0; i < 22; i++) { const e = c.el("div", "s3-t", grp, txt, { position: "absolute", left: "-460px", width: "920px", top: "-240px", textAlign: "center", fontSize: "420px", fontFamily: "var(--fa-body)",
      color: i === 21 ? "transparent" : `rgb(${110 + i * 4},${80 + i * 3},${25})`, transform: `translateZ(${i * 3}px)` });
      if (i === 21) Object.assign(e.style, { backgroundImage: "linear-gradient(100deg,#8a6420,#f6dc8e 30%,#fff6d0 40%,#c99a3c 55%,#f6dc8e 80%)", WebkitBackgroundClip: "text", backgroundClip: "text", backgroundSize: "200% 100%" }); }
    c.tl.fromTo(grp, { rotationY: -70, rotationX: 10 }, { rotationY: 20, rotationX: -6, duration: c.D - 0.5, ease: "power2.inOut" }, 0);
    titleAt(c, c.S.title || "تخفیف [[حجیم]]", 1150, 1330, 1.6, { px: 120 }); c.frame({ footT: 1.8 });
  });
  def("D3-5", (c) => {  // gallery tunnel of shop photos
    c.layer({ background: "#050505" });
    const w = stage(c, 900), world = c.el("div", null, w, null, { position: "absolute", transformStyle: "preserve-3d" });
    const ph = c.S.photo || ["shops/s01", "shops/s05", "shops/s12", "shops/s14", "shops/s20", "shops/s24", "shops/s25", "shops/s29", "shops/s31", "shops/s07"];
    ph.forEach((p, i) => { const side = i % 2 ? 1 : -1, f = c.el("div", null, world, null, { position: "absolute", width: "700px", height: "900px", left: "-350px", top: "-450px", overflow: "hidden",
      transform: `translateZ(${-i * 650}px) translateX(${side * 560}px) rotateY(${-side * 70}deg)`, border: "8px solid #FFD21F" }); c.img(p, f); });
    const end = c.el("div", "s3-t", world, "رویال پارس", { position: "absolute", left: "-500px", width: "1000px", top: "-120px", textAlign: "center", fontSize: "180px", color: "#FFD21F", transform: `translateZ(${-ph.length * 650}px)` });
    c.tl.fromTo(world, { z: 0 }, { z: ph.length * 650 - 600, duration: c.D - 1.5, ease: "power1.inOut" }, 0);
    c.frame({ footT: c.D - 2.2 });
  });
  def("D3-6", (c) => {  // spinning 3D price tag
    c.layer({ background: "#0A0A0A" }); c.dust(20);
    const w = stage(c, 2200), tag = c.el("div", null, w, null, { position: "absolute", width: "520px", height: "700px", left: "-260px", top: "-400px", transformStyle: "preserve-3d", transformOrigin: "50% 0%" });
    const face = (back) => { const f = c.el("div", null, tag, null, { position: "absolute", inset: 0, backfaceVisibility: "hidden", background: back ? "#FFD21F" : "#151515", border: "10px solid #FFD21F",
      clipPath: "polygon(22% 0,78% 0,100% 14%,100% 100%,0 100%,0 14%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: back ? "rotateY(180deg)" : "" }); return f; };
    const fr = face(false), bk = face(true);
    c.el("div", "s3-t", fr, c.S.big || "تا ۳۰٪", { fontSize: "150px", color: "#FFD21F", fontFamily: "var(--fa-body)" }); c.el("div", "s3-t", bk, "هدیه!", { fontSize: "170px", color: "#0A0A0A" });
    c.tl.fromTo(tag, { rotationY: 0, rotationZ: 0 }, { keyframes: { rotationY: [0, 180, 360, 540], rotationZ: [6, -4, 3, 0] }, duration: c.D - 1, ease: "power1.inOut" }, 0.2);
    titleAt(c, c.S.title || "تخفیف [[و]] هدیه", 1150, 1330, 1.4, { px: 120 }); c.frame({ footT: 1.6 });
  });
  def("D3-7", (c) => {  // tilted brand cards fan out
    c.layer({ background: "#FFD21F" }); c.layer({ backgroundImage: "radial-gradient(circle, rgba(0,0,0,.1) 28%, transparent 31%)", backgroundSize: "26px 26px", zIndex: 1 });
    const items = c.S.items || [["کالکشن", "تا ۵۰٪"], ["کومار", "تا ۳۳٪"], ["گاراژ", "تا ۳۰٪"], ["بوردا", "تا ۲۰٪"], ["لیان", "هدیه"]];
    const w = stage(c, 2000);
    items.forEach(([n, o], i) => { const k = i - (items.length - 1) / 2, card = c.el("div", null, w, null, { position: "absolute", width: "420px", height: "600px", left: "-210px", top: "-330px", background: "#0A0A0A", borderRadius: "30px",
      border: "6px solid #fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", boxShadow: "0 30px 50px rgba(0,0,0,.35)" });
      c.el("div", "s3-t", card, n, { fontSize: "80px", color: "#fff" }); c.el("div", "s3-t", card, o, { fontSize: "96px", color: "#FFD21F", fontFamily: "var(--fa-body)" });
      c.tl.fromTo(card, { rotationY: 0, rotationZ: 0, x: 0, z: -i * 10 }, { rotationY: k * -18, rotationZ: k * 6, x: k * 150, z: -Math.abs(k) * 120, duration: 1.0, ease: "power3.out" }, 0.4 + i * 0.05); });
    titleAt(c, c.S.title || "ورق [[رویالی]]", 1180, 1330, 1.5, { px: 120, color: "#0A0A0A", key: "#fff" }); c.frame({ dark: false, footT: 1.7 });
  });
  def("D3-8", (c) => {  // 3D gift box opens
    c.layer({ background: "radial-gradient(ellipse at 50% 50%, #2a1206 0%, #050302 70%)" });
    const w = stage(c, 2400), s = 380, box = c.el("div", null, w, null, { position: "absolute", transformStyle: "preserve-3d", transform: "rotateX(-22deg) rotateY(-34deg)", top: "120px" });
    const face = (t, col) => c.el("div", null, box, null, { position: "absolute", width: s + "px", height: s + "px", left: -s / 2 + "px", top: -s / 2 + "px", background: col, transform: t,
      backgroundImage: "linear-gradient(90deg, transparent 44%, #E8262B 44% 56%, transparent 56%)" });
    face(`translateZ(${s / 2}px)`, "#FFD21F"); face(`rotateY(90deg) translateZ(${s / 2}px)`, "#e5bd17"); face(`rotateY(-90deg) translateZ(${s / 2}px)`, "#e5bd17"); face(`rotateY(180deg) translateZ(${s / 2}px)`, "#d6af10");
    const lid = c.el("div", null, box, null, { position: "absolute", width: s + 40 + "px", height: s + 40 + "px", left: -s / 2 - 20 + "px", top: -s / 2 - 20 + "px", background: "#FFD21F", transform: `rotateX(90deg) translateZ(${s / 2 + 10}px)`,
      backgroundImage: "linear-gradient(90deg, transparent 44%, #E8262B 44% 56%, transparent 56%), linear-gradient(0deg, transparent 44%, #E8262B 44% 56%, transparent 56%)" });
    c.tl.to(lid, { y: -500, rotationZ: 40, opacity: 0, duration: 0.7, ease: "power3.in" }, 1.4);
    const beam = c.el("div", null, null, null, { position: "absolute", left: "290px", width: "500px", top: "300px", height: "760px", zIndex: 5, background: "linear-gradient(0deg, rgba(255,230,140,.7), rgba(255,230,140,0))", clipPath: "polygon(30% 100%, 70% 100%, 100% 0, 0 0)", opacity: 0 });
    c.tl.to(beam, { opacity: 1, duration: 0.5 }, 1.6);
    const off = c.el("div", "s3-t", null, c.S.big || "هدیه با خرید", { position: "absolute", left: 0, right: 0, top: "420px", textAlign: "center", fontSize: "120px", color: "#fff", zIndex: 30 }); c.fit(off, 880, null, 130);
    c.tl.fromTo(off, { y: 300, opacity: 0, scale: 0.5 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }, 1.8);
    c.frame({ footT: 2.2 });
  });
  def("D3-9", (c) => {  // catalogue page flip
    c.layer({ background: "#1a1408" });
    const pages = c.S.items || [["کومار", "تا ۳۳٪"], ["کالکشن", "تا ۵۰٪"], ["بارگلو", "یکی بخر یکی ببر"], ["لیان", "هدیه با خرید"]];
    const w = stage(c, 2600), book = c.el("div", null, w, null, { position: "absolute", transformStyle: "preserve-3d", left: "-420px", top: "-560px" });
    c.el("div", "s3-t", book, "کاتالوگ رویال", { position: "absolute", width: "840px", height: "1120px", background: "#FFD21F", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "100px", color: "#0A0A0A", borderRadius: "10px" });
    pages.forEach(([n, o], i) => { const p = c.el("div", null, book, null, { position: "absolute", width: "840px", height: "1120px", background: i % 2 ? "#fff" : "#f6f0e3", transformOrigin: "100% 50%", backfaceVisibility: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "30px", borderRadius: "10px", boxShadow: "inset -40px 0 60px rgba(0,0,0,.12)", zIndex: 10 - i });
      c.el("div", "s3-t", p, n, { fontSize: "120px", color: "#0A0A0A" }); const oo = c.el("div", "s3-t", p, o, { fontSize: "90px", color: "#B8860B", fontFamily: "var(--fa-body)" }); c.fit(oo, 760, null, 96);
      c.tl.fromTo(p, { rotationY: 0 }, { rotationY: 178, duration: 0.7, ease: "power2.inOut" }, 0.8 + i * 1.05); });
    c.frame({ footT: 1 });
  });
  def("D3-10", (c) => { // disco ball
    c.layer({ background: "#07050c" });
    const ball = c.el("div", null, null, null, { position: "absolute", left: "290px", top: "420px", width: "500px", height: "500px", borderRadius: "50%", zIndex: 10,
      backgroundImage: "linear-gradient(90deg, rgba(0,0,0,.35) 2px, transparent 2px), linear-gradient(0deg, rgba(0,0,0,.35) 2px, transparent 2px), radial-gradient(circle at 35% 30%, #fff6d0, #c99a3c 45%, #5c4210 80%)",
      backgroundSize: "40px 40px, 40px 40px, 100% 100%", boxShadow: "0 0 120px rgba(255,210,31,.4)" });
    c.tl.fromTo(ball, { backgroundPosition: "0 0, 0 0, 0 0" }, { backgroundPosition: "400px 0, 0 0, 0 0", duration: c.D, ease: "none" }, 0);
    c.el("div", null, null, null, { position: "absolute", left: "538px", top: "0", width: "4px", height: "420px", background: "#888", zIndex: 9 });
    for (let i = 0; i < 26; i++) { const s = 18 + c.r() * 26, sp = c.el("i", null, null, null, { position: "absolute", width: s + "px", height: s + "px", borderRadius: "50%", background: c.r() > 0.5 ? "rgba(255,210,31,.8)" : "rgba(255,255,255,.7)", zIndex: 5, left: c.r() * 1080 + "px", top: 260 + c.r() * 1300 + "px", filter: "blur(2px)" });
      c.tl.fromTo(sp, { x: 0, opacity: 0.2 }, { x: (c.r() - 0.5) * 500, opacity: 1, duration: c.D, ease: "none" }, 0); }
    titleAt(c, c.S.title || "شب‌های|[[رویالی]]", 1020, 1320, 0.8, { px: 160 }); c.frame({ footT: 1.2 });
  });

  /* ============ APP UI ============ */
  const phoneBg = (c) => c.layer({ background: "linear-gradient(180deg, #1a1a1f, #0b0b0e)" });
  const bubble = (c, parent, txt, me, top) => c.el("div", "s3-b", parent, txt, { position: "absolute", top: top + "px", [me ? "left" : "right"]: "90px", maxWidth: "720px", padding: "22px 34px 28px", fontSize: "48px",
    background: me ? "#FFD21F" : "#2b2b31", color: me ? "#0A0A0A" : "#fff", borderRadius: me ? "40px 40px 40px 8px" : "40px 40px 8px 40px", zIndex: 20 });
  def("U1", (c) => {
    phoneBg(c); const hd = c.el("div", "s3-t", null, "رویال پارس", { position: "absolute", top: "330px", left: 0, right: 0, textAlign: "center", fontSize: "52px", color: "#fff", zIndex: 20 }); c.fadeUp(hd, 0.1);
    const msgs = c.S.msgs || [["سلام! بلک‌فرایدی کجا بریم؟", false], ["…", true], ["رویال پارس! ۳ تا ۹ آذر", true], ["۱۸ برند، هدیه، بازی و جایزه 🎁", true]];
    let y = 460; msgs.forEach(([m, me], i) => { const t = 0.5 + i * 1.0; const b = bubble(c, null, m, me, y); c.pop(b, t); if (m === "…") c.tl.to(b, { opacity: 0, duration: 0.1 }, t + 0.8); else y += 150; });
    const loc = c.el("div", "s3-b", null, "📍 " + c.T.address, { position: "absolute", top: y + 10 + "px", left: "90px", right: "160px", fontSize: "38px", background: "#2b2b31", color: "#fff", padding: "20px 30px", borderRadius: "30px", zIndex: 20 }); c.pop(loc, 4.6);
    c.frame({ footT: 5 });
  });
  def("U2", (c) => {
    phoneBg(c); const bar = c.el("div", "s3-b", null, "", { position: "absolute", top: "520px", left: "90px", right: "90px", height: "130px", background: "#fff", borderRadius: "70px", display: "flex", alignItems: "center", padding: "0 50px", fontSize: "54px", color: "#111", zIndex: 20, direction: "rtl" });
    const q = (c.S.query || "بلک فرایدی اهواز").split(" "), span = c.el("span", null, bar, ""); q.forEach((w, i) => c.tl.call(() => {}, null, 0));
    q.forEach((w, i) => { const s = c.el("span", null, bar, (i ? " " : "") + w); c.win(s, 0.5 + i * 0.45); });
    const res = ["رویال پارس — ۳ تا ۹ آذر", "رویال پارس — تخفیف ۱۸ برند", "رویال پارس — جمعه ۶ آذر"];
    res.forEach((r2, i) => { const e = c.el("div", "s3-b", null, r2, { position: "absolute", top: 700 + i * 150 + "px", left: "90px", right: "90px", height: "120px", display: "flex", alignItems: "center", padding: "0 40px", fontSize: "44px", color: i ? "#ddd" : "#0A0A0A", background: i ? "#26262b" : "#FFD21F", borderRadius: "26px", zIndex: 20, direction: "rtl" }); c.fadeUp(e, 2.0 + i * 0.25); });
    const ck = c.el("div", "s3-t", null, "✓", { position: "absolute", top: "712px", left: "120px", fontSize: "80px", color: "#0A0A0A", zIndex: 21 }); c.pop(ck, 3.0);
    c.frame({ footT: 3.2 });
  });
  def("U3", (c) => {
    c.layer({ background: "#e9e4da" }); const sv = c.el("div", null, null, null, { position: "absolute", inset: 0, zIndex: 2 });
    sv.innerHTML = `<svg viewBox="0 0 1080 1920" style="width:100%;height:100%"><g stroke="#fff" stroke-width="26" fill="none"><path d="M0 700H1080M0 1200H1080M300 0V1920M760 0V1920M0 400L1080 1500"/></g><path d="M-50 1500 C200 1450 300 1300 520 1250 S900 1000 1130 980" stroke="#9ec9f0" stroke-width="70" fill="none"/><path id="rt" d="M200 1380 L300 1200 L760 1200 L760 700 L620 520" stroke="#3A7BD5" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const rt = sv.querySelector("#rt"), L = rt.getTotalLength(); rt.style.strokeDasharray = L; rt.style.strokeDashoffset = L;
    c.tl.to(rt, { strokeDashoffset: 0, duration: 2.4, ease: "power1.inOut" }, 0.4);
    const pin = c.el("div", null, null, "📍", { position: "absolute", left: "585px", top: "420px", fontSize: "110px", zIndex: 5 }); c.tl.fromTo(pin, { y: -200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out" }, 2.6);
    const card = c.el("div", "s3-b", null, "رسیدی! مرکز خرید رویال پارس<br><span style='font-size:36px;opacity:.8'>" + c.T.address + "</span>", { position: "absolute", left: "90px", right: "90px", top: "1110px", padding: "34px 40px", background: "#fff", color: "#111", fontSize: "50px", borderRadius: "36px", zIndex: 6, boxShadow: "0 20px 40px rgba(0,0,0,.2)", textAlign: "right" });
    c.fadeUp(card, 3.2); c.frame({ dark: false, footT: 3.6 });
  });
  def("U4", (c) => {
    phoneBg(c); const items = c.S.items || [["کفش چرم", "۲٬۴۰۰٬۰۰۰"], ["کیف دستی", "۳٬۱۰۰٬۰۰۰"], ["عطر", "۱٬۸۰۰٬۰۰۰"]];
    c.el("div", "s3-t", null, "سبد خرید", { position: "absolute", top: "330px", left: 0, right: 0, textAlign: "center", fontSize: "56px", color: "#fff", zIndex: 20 });
    items.forEach(([n, p], i) => { const row = c.el("div", "s3-b", null, `<span>${n}</span><span class="pr">${p}</span>`, { position: "absolute", top: 450 + i * 150 + "px", left: "90px", right: "90px", height: "126px", display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "0 40px", fontSize: "48px", color: "#fff", background: "#26262b", borderRadius: "26px", zIndex: 20, direction: "rtl" }); c.tl.fromTo(row, { x: 600, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.3 + i * 0.3);
      const pr = row.querySelector(".pr"); c.tl.to(pr, { color: "#777", textDecoration: "line-through", duration: 0.1 }, 2.6); });
    const code = c.el("div", "s3-b", null, "کد تخفیف: ROYAL ✓", { position: "absolute", top: "930px", left: "90px", right: "90px", height: "110px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "46px", color: "#0A0A0A", background: "#FFD21F", borderRadius: "26px", zIndex: 20 });
    c.pop(code, 1.8); const tot = c.el("div", "s3-t", null, "خرید [[رویالی]]".replace("[[رویالی]]", "<span style='color:#FFD21F'>رویالی</span>"), { position: "absolute", top: "1100px", left: 0, right: 0, textAlign: "center", fontSize: "110px", color: "#fff", zIndex: 20 });
    c.slam(tot, 2.8); c.frame({ footT: 3.2 });
  });
  def("U5", (c) => {
    phoneBg(c); const card = c.el("div", null, null, null, { position: "absolute", left: "110px", right: "110px", top: "480px", height: "760px", background: "#fff", borderRadius: "50px", zIndex: 20, overflow: "hidden", boxShadow: "0 30px 60px rgba(0,0,0,.5)" });
    c.el("div", "s3-en", card, "NOV 27", { background: "#E8262B", color: "#fff", fontSize: "50px", padding: "26px", textAlign: "center" });
    c.el("div", "s3-t", card, "۶", { fontSize: "300px", color: "#111", textAlign: "center", lineHeight: 1.1, fontFamily: "var(--fa-body)" });
    c.el("div", "s3-t", card, "Royal Friday".replace("Royal Friday", "جمعه رویالی"), { fontSize: "70px", color: "#111", textAlign: "center" });
    const btn = c.el("div", "s3-t", card, "قبول می‌کنم ✓", { margin: "30px auto 0", width: "520px", fontSize: "56px", color: "#0A0A0A", background: "#FFD21F", borderRadius: "60px", textAlign: "center", padding: "10px 0 22px" });
    c.tl.fromTo(card, { y: 900, rotation: 6 }, { y: 0, rotation: 0, duration: 0.7, ease: "power4.out" }, 0.2); c.tl.fromTo(btn, { scale: 1 }, { keyframes: { scale: [1, 0.9, 1.06, 1] }, duration: 0.4, ease: "none", immediateRender: false }, 2.4);
    c.frame({ footT: 2.6 });
  });
  def("U6", (c) => {
    c.layer({ background: "linear-gradient(180deg, #3f6fb5 0%, #1c2f5a 100%)" });
    c.el("div", "s3-t", null, "اهواز", { position: "absolute", top: "360px", left: 0, right: 0, textAlign: "center", fontSize: "80px", color: "#fff", zIndex: 20 });
    const big = c.el("div", "s3-t", null, "٪", { position: "absolute", top: "470px", left: 0, right: 0, textAlign: "center", fontSize: "300px", color: "#FFD21F", zIndex: 20, fontFamily: "var(--fa-body)" }); c.pop(big, 0.4);
    c.el("div", "s3-t", null, "جمعه: بارش شدید تخفیف", { position: "absolute", top: "860px", left: 0, right: 0, textAlign: "center", fontSize: "70px", color: "#fff", zIndex: 20 });
    for (let i = 0; i < 40; i++) { const d = c.el("div", "s3-b", null, "٪", { position: "absolute", left: c.r() * 1040 + "px", top: "-80px", fontSize: 30 + c.r() * 40 + "px", color: "rgba(255,210,31,.8)", zIndex: 10 });
      c.tl.fromTo(d, { y: -100 - c.r() * 800 }, { y: 2100, duration: 2 + c.r() * 2, ease: "none", repeat: 3 }, 0); }
    const row = c.el("div", "s3-b", null, "پنجشنبه: ابری با احتمال هدیه — شنبه: آفتابی و رویالی", { position: "absolute", top: "1040px", left: "90px", right: "90px", textAlign: "center", fontSize: "40px", color: "#e8eefc", zIndex: 20 });
    c.fadeUp(row, 1.2); c.frame({ footT: 1.6 });
  });
  def("U7", (c) => {
    c.layer({ background: "#07110a" });
    const sv = c.el("div", null, null, null, { position: "absolute", left: "90px", right: "90px", top: "700px", height: "460px", zIndex: 10 });
    let d = "M0 400"; const r = c.RP.rng(7); for (let i = 1; i <= 30; i++) d += ` L${i * 30} ${400 - i * 12 + (r() - 0.5) * 50}`;
    sv.innerHTML = `<svg viewBox="0 0 900 460" style="width:100%;height:100%"><path id="ln" d="${d}" fill="none" stroke="#3ddc84" stroke-width="10" stroke-linejoin="round"/></svg>`;
    const ln = sv.querySelector("#ln"), L = ln.getTotalLength(); ln.style.strokeDasharray = L; ln.style.strokeDashoffset = L; c.tl.to(ln, { strokeDashoffset: 0, duration: 2.6, ease: "power1.out" }, 0.3);
    c.el("div", "s3-t", null, "شاخص رویالی", { position: "absolute", top: "380px", left: 0, right: 0, textAlign: "center", fontSize: "80px", color: "#fff", zIndex: 20 });
    const v = c.el("div", "s3-t", null, "▲ ۵۰٪+", { position: "absolute", top: "500px", left: 0, right: 0, textAlign: "center", fontSize: "140px", color: "#3ddc84", zIndex: 20, direction: "ltr", fontFamily: "var(--fa-body)" }); c.pop(v, 2.6);
    c.el("div", "s3-b", null, "تحلیل: هفته‌ی رویالی، صعودی!", { position: "absolute", top: "1200px", left: 0, right: 0, textAlign: "center", fontSize: "46px", color: "#9fe8b9", zIndex: 20 });
    c.frame({ footT: 2.8 });
  });
  def("U8", (c) => {
    c.layer({ background: "linear-gradient(180deg, #2a2108, #0a0a0a)" });
    const art = c.el("div", null, null, null, { position: "absolute", left: "190px", width: "700px", top: "360px", height: "700px", borderRadius: "30px", overflow: "hidden", zIndex: 10, boxShadow: "0 30px 70px rgba(0,0,0,.6)", background: "#FFD21F" });
    c.el("div", "s3-t", art, "این جمعه|رویالیه".replace("|", "<br>"), { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: "110px", color: "#0A0A0A", lineHeight: 1.3 });
    c.tl.fromTo(art, { scale: 0.9 }, { scale: 1, duration: 0.6 }, 0.1);
    c.el("div", "s3-t", null, "این جمعه رویالیه", { position: "absolute", top: "1100px", right: "90px", fontSize: "58px", color: "#fff", zIndex: 10 });
    c.el("div", "s3-b", null, "رویال پارس", { position: "absolute", top: "1180px", right: "90px", fontSize: "40px", color: "#bbb", zIndex: 10 });
    const bar = c.el("div", null, null, null, { position: "absolute", left: "90px", right: "90px", top: "1270px", height: "10px", borderRadius: "5px", background: "rgba(255,255,255,.2)", zIndex: 10 });
    const fill = c.el("div", null, bar, null, { height: "100%", width: "100%", borderRadius: "5px", background: "#FFD21F", transformOrigin: "100% 50%" }); c.tl.fromTo(fill, { scaleX: 0 }, { scaleX: 0.8, duration: c.D, ease: "none" }, 0);
    for (let i = 0; i < 24; i++) { const b = c.el("i", null, null, null, { position: "absolute", left: 120 + i * 36 + "px", top: "1040px", width: "20px", height: "40px", background: "rgba(255,210,31,.7)", transformOrigin: "50% 100%", zIndex: 9 });
      const kf = []; for (let k = 0; k < 16; k++) kf.push(0.2 + c.r()); c.tl.fromTo(b, { scaleY: 0.3 }, { keyframes: { scaleY: kf }, duration: c.D, ease: "none" }, 0); }
    c.frame({ noFoot: true });
  });
  def("U9", (c) => {
    const im = c.img(c.S.photo || "shops/s12"); kb(c, im); c.layer({ background: "rgba(0,0,0,.25)", zIndex: 2 });
    const ns = c.S.items || ["تخفیف رویالی تا ۵۰٪", "هدیه با خرید", "بازی رویالی شروع شد", "جمعه ۶ آذر: Royal Friday"];
    ns.forEach((n, i) => { const card = c.el("div", "s3-glass", null, null, { position: "absolute", left: "90px", right: "90px", top: 380 + i * 190 + "px", height: "160px", zIndex: 20, display: "flex", alignItems: "center", gap: "26px", padding: "0 34px", direction: "rtl", backdropFilter: "blur(18px)" });
      c.el("div", null, card, null, { width: "96px", height: "96px", borderRadius: "26px", background: "#FFD21F", flex: "none" });
      const tx = c.el("div", "s3-b", card, `<div style="font-size:30px;opacity:.75">رویال ویک · اکنون</div><div style="font-size:46px">${n}</div>`, { color: "#fff", textAlign: "right" });
      c.tl.fromTo(card, { y: -300, opacity: 0, scale: 0.95 }, { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.4)" }, 0.3 + i * 0.5); });
    c.frame({ footT: 2.4 });
  });
  def("U10", (c) => {
    phoneBg(c); const card = c.el("div", null, null, null, { position: "absolute", left: "110px", right: "110px", top: "450px", height: "760px", background: "#1f1f25", borderRadius: "50px", zIndex: 20, display: "flex", flexDirection: "column", alignItems: "center", gap: "26px", paddingTop: "70px" });
    const av = c.el("div", null, card, null, { width: "260px", height: "260px", borderRadius: "50%", background: "conic-gradient(#FFD21F, #E8262B, #FFD21F)", padding: "10px" });
    const lg = RP.logo({ parent: c.el("div", null, av, null, { width: "100%", height: "100%", borderRadius: "50%", background: "#1B2250", display: "flex", alignItems: "center", justifyContent: "center" }), outerStroke: "#C9A45C", innerFill: "#1B2250", innerStroke: "#C9A45C", mono: "#C9A45C" }); lg.style.height = "170px"; lg.style.width = "102px";
    c.el("div", "s3-b", card, c.T.ig, { fontSize: "56px", color: "#fff", direction: "ltr" }); c.el("div", "s3-b", card, "مرکز خرید رویال پارس — اهواز", { fontSize: "40px", color: "#aaa" });
    const btn = c.el("div", "s3-t", card, null, { fontSize: "58px", color: "#fff", background: "#3A7BD5", borderRadius: "30px", padding: "12px 90px 26px" });
    const bA = c.el("span", null, btn, "دنبال کردن"), bB = c.el("span", null, btn, "دنبال می‌کنید ✓", { display: "none" });
    c.tl.set(bA, { display: "none" }, 2.0); c.tl.set(bB, { display: "inline" }, 2.0);
    c.tl.fromTo(card, { y: 700 }, { y: 0, duration: 0.7, ease: "power4.out" }, 0.1);
    c.tl.to(btn, { backgroundColor: "#2b2b31", duration: 0.1 }, 2.0); 
    for (let i = 0; i < 14; i++) { const h = c.el("div", null, null, "❤", { position: "absolute", left: 700 + c.r() * 200 + "px", top: "1150px", fontSize: 50 + c.r() * 40 + "px", color: i % 2 ? "#E8262B" : "#FFD21F", zIndex: 30, opacity: 0 });
      c.tl.fromTo(h, { y: 0, opacity: 1, x: 0 }, { y: -700 - c.r() * 300, x: (c.r() - 0.5) * 200, opacity: 0, duration: 1.8, ease: "power1.out" }, 2.1 + i * 0.07); }
    c.frame({ noFoot: true });
  });

  /* ============ HANDMADE ============ */
  const paperBg = (c, col) => { c.layer({ background: col || "#efe6d2" }); c.grain(0.1); };
  def("H1", (c) => {   // paper stop-motion at 12 fps
    paperBg(c, "#FFD21F");
    const parts = [["#0A0A0A", 320, 700, 440, 520, 0], ["#fff", 340, 720, 400, 40, 0], ["#0A0A0A", 430, 600, 220, 130, 1], ["#E8262B", 470, 1000, 140, 140, 0]];
    parts.forEach(([col, x, y, w, h, ring], i) => { const e = c.el("div", null, null, null, { position: "absolute", left: x + "px", top: y + "px", width: w + "px", height: h + "px", zIndex: 10 + i,
      background: ring ? "transparent" : col, border: ring ? `26px solid ${col}` : "none", borderBottom: ring ? "none" : "", borderRadius: ring ? "120px 120px 0 0" : i === 3 ? "50%" : "8px", boxShadow: "6px 8px 0 rgba(0,0,0,.25)" });
      const t0 = 0.3 + i * 0.6; for (let f = 0; f <= 6; f++) { const k = f / 6; c.tl.set(e, { x: (1 - k) * (i % 2 ? 500 : -500) + (c.r() - 0.5) * 8, y: (1 - k) * -300 + (c.r() - 0.5) * 8, rotation: (1 - k) * 30 + (c.r() - 0.5) * 3, opacity: 1 }, t0 + f / 12); }
      gsap.set(e, { opacity: 0 }); for (let f = 0; f < 24; f++) c.tl.set(e, { x: (c.r() - 0.5) * 6, y: (c.r() - 0.5) * 6, rotation: (c.r() - 0.5) * 2 }, t0 + 0.6 + f / 12); });
    const tt = titleAt(c, c.S.title || "ساخته شده|برای [[شما]]", 1180, 1340, 3.0, { px: 120, color: "#0A0A0A", key: "#E8262B" }); c.frame({ dark: false, footT: 3.4 });
  });
  def("H2", (c) => {   // torn paper reveal
    c.layer({ background: "#FFD21F" }); titleAt(c, c.S.title || "این جمعه|[[رویالیه]]", 650, 1150, 1.1, { px: 190, color: "#0A0A0A", key: "#E8262B" });
    let p = "", q = ""; const r = c.RP.rng(3); const pts = []; for (let y = 0; y <= 100; y += 4) pts.push([50 + (r() - 0.5) * 8, y]);
    const left = "polygon(0 0," + pts.map(([x, y]) => `${x}% ${y}%`).join(",") + ",0 100%)", right = "polygon(100% 0," + pts.map(([x, y]) => `${x}% ${y}%`).join(",") + ",100% 100%)";
    const L = c.layer({ zIndex: 40, background: "#0A0A0A", clipPath: left }), R = c.layer({ zIndex: 40, background: "#141414", clipPath: right });
    [L, R].forEach((e) => c.el("div", "s3-en", e, "BLACK FRIDAY", { position: "absolute", top: "880px", left: 0, right: 0, textAlign: "center", fontSize: "110px", color: "#333" }));
    c.tl.to(L, { x: -900, rotation: -8, duration: 0.7, ease: "power3.in" }, 0.6); c.tl.to(R, { x: 900, rotation: 8, duration: 0.7, ease: "power3.in" }, 0.6);
    c.frame({ dark: false, footT: 1.6 });
  });
  def("H3", (c) => {   // marker circles on a photo
    const im = c.img(c.S.photo || "shops/s20"); kb(c, im, { scale: 1.05 }, { scale: 1 });
    const sv = c.el("div", null, null, null, { position: "absolute", inset: 0, zIndex: 10 });
    sv.innerHTML = `<svg viewBox="0 0 1080 1920" style="width:100%;height:100%"><path id="o" d="M540 640 C820 600 900 820 760 960 C620 1100 300 1060 260 880 C220 700 380 620 600 650" fill="none" stroke="#FFD21F" stroke-width="16" stroke-linecap="round"/><path id="a" d="M860 1240 C820 1160 780 1090 740 1040 M740 1040 L720 1110 M740 1040 L810 1060" fill="none" stroke="#FFD21F" stroke-width="14" stroke-linecap="round"/></svg>`;
    ["o", "a"].forEach((id, i) => { const p = sv.querySelector("#" + id), L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; c.tl.to(p, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.5 + i * 0.8); });
    darkBottom(c, 6); const lab = c.strip(c.sc, c.S.title || "اینو ببین!", { px: 110, rot: -4 }); Object.assign(lab.style, { position: "absolute", top: "1250px", right: "90px", zIndex: 20 }); c.pop(lab, 1.9);
    c.frame({ footT: 2.2 });
  });
  def("H4", (c) => {   // magazine cover
    const im = c.img(c.S.photo || "p6"); kb(c, im, { scale: 1.08 }, { scale: 1 });
    const mast = c.el("div", "s3-t", null, "رویال‌مگ", { position: "absolute", top: "290px", left: 0, right: 0, textAlign: "center", fontSize: "230px", color: "#FFD21F", zIndex: 10, textShadow: "0 8px 20px rgba(0,0,0,.4)" }); c.slam(mast, 0.3);
    const lines = c.S.items || [["۱۸ برند", "رویالی شدن"], ["جمعه ۶ آذر", "اوج هفته"], ["بازی رویالی", "پادشاه هفته کیه؟"]];
    lines.forEach(([a, b], i) => { const e = c.el("div", "s3-b", null, `<b style="font-family:var(--fa);font-size:66px;color:#FFD21F">${a}</b><br>${b}`, { position: "absolute", top: 760 + i * 220 + "px", [i % 2 ? "left" : "right"]: "80px", fontSize: "44px", color: "#fff", zIndex: 10, textAlign: i % 2 ? "left" : "right", textShadow: "0 4px 12px rgba(0,0,0,.6)" }); c.fadeUp(e, 0.9 + i * 0.3); });
    const bc = c.el("div", "s3-en", null, "ISSUE 1405 · NOV", { position: "absolute", top: "1380px", left: "90px", fontSize: "28px", color: "#fff", zIndex: 10, background: "#E8262B", padding: "6px 16px" }); c.fadeUp(bc, 1.8);
    c.frame({ noFoot: true });
  });
  def("H5", (c) => {   // ransom-note words
    paperBg(c, "#f3ecdc");
    const words = (c.S.title || "تو رویالی هستی").split(" "), styles = [["#0A0A0A", "#FFD21F", "var(--fa)"], ["#FFD21F", "#0A0A0A", "var(--fa-body)"], ["#E8262B", "#fff", "var(--fa)"], ["#fff", "#0A0A0A", "var(--fa-body)"]];
    const col = c.col(600, 1250, { flexDirection: "row", flexWrap: "wrap", gap: "24px", direction: "rtl" });
    words.forEach((w, i) => { const [bg, fg, ff] = styles[i % 4]; const e = c.el("div", null, col, w, { background: bg, color: fg, fontFamily: ff, fontWeight: 700, fontSize: 130 + (i % 2) * 40 + "px", padding: "0 30px 20px", transform: `rotate(${(c.r() - 0.5) * 14}deg)`, boxShadow: "8px 10px 0 rgba(0,0,0,.2)", direction: "rtl" });
      c.tl.fromTo(e, { scale: 2.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "power4.in" }, 0.4 + i * 0.4); });
    c.frame({ dark: false, footT: 0.6 + words.length * 0.4 });
  });
  def("H6", (c) => {   // scrapbook page
    c.layer({ background: "#fbf7ee", backgroundImage: "repeating-linear-gradient(0deg, transparent 0 58px, #c9d9f0 58px 60px)" }); c.grain(0.07);
    c.el("div", null, null, null, { position: "absolute", left: "150px", top: 0, bottom: 0, width: "4px", background: "#f1a0a0", zIndex: 1 });
    const pol = c.el("div", "s3-card", null, null, { left: "520px", top: "360px", width: "420px", height: "520px", transform: "rotate(5deg)", zIndex: 10 }); c.img(c.S.photo || "p2", pol);
    c.tl.fromTo(pol, { y: -900 }, { y: 0, duration: 0.6, ease: "back.out(1.3)" }, 0.2);
    c.el("div", null, null, null, { position: "absolute", left: "640px", top: "330px", width: "180px", height: "54px", background: "rgba(255,210,31,.75)", transform: "rotate(-6deg)", zIndex: 11 });
    const list = c.S.items || ["کفش جمعه", "کیف رویالی", "هدیه برای مامان", "یه عطر خوب"];
    c.el("div", "s3-t", null, "لیست خرید جمعه:", { position: "absolute", top: "920px", right: "100px", fontSize: "70px", color: "#1B2250", zIndex: 10 });
    list.forEach((it, i) => { const e = c.el("div", "s3-b", null, `<span class="u">☐</span><span class="k" style="display:none">☑</span> ${it}`, { position: "absolute", top: 1030 + i * 75 + "px", right: "120px", fontSize: "52px", color: "#1B2250", zIndex: 10 }); c.tl.fromTo(e, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 0.4 }, 0.9 + i * 0.35);
      c.tl.set(e.querySelector(".u"), { display: "none" }, 2.6 + i * 0.25); c.tl.set(e.querySelector(".k"), { display: "inline" }, 2.6 + i * 0.25); });
    const st = c.el("div", null, null, "★", { position: "absolute", left: "140px", top: "420px", fontSize: "200px", color: "#FFD21F", zIndex: 10 }); c.pop(st, 1.4);
    c.frame({ dark: false, noFoot: true });
  });
  def("H7", (c) => {   // sticker bomb
    c.layer({ background: "#0A0A0A" });
    const S = c.S.items || ["رویالی!", "٪", "BLACK FRIDAY", "هدیه", "تخفیف", "جمعه ۶ آذر", "★", "تو رویالی هستی", "۵۰٪", "ROYAL WEEK", "بازی", "اوه!"];
    S.forEach((t, i) => { const s = 220 + c.r() * 160, latin = /[A-Z]/.test(t); const e = c.el("div", "s3-t", null, t, { position: "absolute", left: 40 + c.r() * 700 + "px", top: 300 + c.r() * 1100 + "px", width: s + "px", height: s * (i % 3 ? 1 : 0.6) + "px",
      display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", borderRadius: i % 3 === 1 ? "50%" : "24px", background: ["#FFD21F", "#fff", "#E8262B"][i % 3], color: i % 3 === 2 ? "#fff" : "#0A0A0A",
      fontSize: (latin ? 32 : t.length > 6 ? 40 : 64) + "px", fontFamily: latin ? "var(--en)" : "var(--fa)", border: "8px solid #fff", boxShadow: "0 14px 30px rgba(0,0,0,.4)", zIndex: 10 + i, transform: `rotate(${(c.r() - 0.5) * 40}deg)` });
      c.tl.fromTo(e, { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.16, ease: "power4.in" }, 0.2 + i * 0.28); });
    c.frame({ footT: 3.8 });
  });
  def("H8", (c) => {   // whiteboard plan
    c.layer({ background: "#f4f6f7" }); c.layer({ zIndex: 1, boxShadow: "inset 0 0 0 26px #b9bfc4" });
    const rows = c.S.items || [["سه‌شنبه", "شروع!"], ["پنجشنبه", "شب اول اجرا"], ["جمعه", "Royal Friday"], ["دوشنبه", "روز آخر"]];
    c.el("div", "s3-t", null, "برنامه رویال ویک", { position: "absolute", top: "330px", left: 0, right: 0, textAlign: "center", fontSize: "88px", color: "#1d3f8f", zIndex: 10 });
    rows.forEach(([d, e], i) => { const row = c.el("div", "s3-t", null, `${d} ← <span style="color:#E8262B">${e}</span>`, { position: "absolute", top: 560 + i * 170 + "px", right: "110px", fontSize: "74px", color: "#1d3f8f", zIndex: 10 });
      c.tl.fromTo(row, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 0.6, ease: "none" }, 0.5 + i * 0.7); });
    const sv = c.el("div", null, null, `<svg viewBox="0 0 1080 1920" style="width:100%;height:100%"><path id="bx" d="M120 880 L960 880 L960 1060 L120 1060 Z" fill="none" stroke="#E8262B" stroke-width="10"/></svg>`, { position: "absolute", inset: 0, zIndex: 11 });
    const bx = sv.querySelector("#bx"), L = bx.getTotalLength(); bx.style.strokeDasharray = L; bx.style.strokeDashoffset = L; c.tl.to(bx, { strokeDashoffset: 0, duration: 0.7 }, 3.4);
    c.frame({ dark: false, footT: 3.6 });
  });
  def("H9", (c) => {   // origami unfold to the floor map
    c.layer({ background: "#1b2250" });
    const w = stage(c, 2400), base = c.el("div", null, w, null, { position: "absolute", width: "760px", height: "760px", left: "-380px", top: "-420px", background: "#FFD21F", transformStyle: "preserve-3d" });
    const F = c.S.floors || ["همکف — نینجا هوم", "۱ — بارگلو", "۲ — کالکشن، کومار…", "۳ — زرسان، بوکت…", "۴ — گاراژ، لون…", "۵ — بی‌بی‌شاپ"];
    F.forEach((f, i) => c.el("div", "s3-t", base, f, { position: "absolute", right: "40px", top: 40 + i * 118 + "px", fontSize: "56px", color: "#0A0A0A" }));
    const flap = (k) => { const s = c.el("div", null, base, null, { position: "absolute", inset: 0, background: k % 2 ? "#ffe27a" : "#ffd21f", border: "2px solid #c9a20f", transformOrigin: ["50% 0%", "100% 50%", "50% 100%", "0% 50%"][k], backfaceVisibility: "visible" });
      c.tl.fromTo(s, { rotationX: k % 2 ? 0 : (k ? -180 : 180) * 0 + (k === 0 ? 0 : 0) }, { [k % 2 ? "rotationY" : "rotationX"]: [180, -180, -180, 180][k] * (k % 2 ? 1 : 1), opacity: 0, duration: 0.6, ease: "power2.inOut" }, 0.4 + k * 0.4); };
    [0, 1, 2, 3].forEach(flap);
    c.tl.fromTo(base, { rotationX: 30 }, { rotationX: 8, duration: 2.4 }, 0);
    c.frame({ footT: 2.4 });
  });
  def("H10", (c) => {  // rubber stamp
    paperBg(c, "#f2ead7");
    const st = c.el("div", "s3-t", null, c.S.big || "رویالی", { position: "absolute", left: "190px", width: "700px", top: "700px", height: "360px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "180px", color: "#E8262B",
      border: "16px solid #E8262B", borderRadius: "30px", transform: "rotate(-10deg)", zIndex: 10, opacity: 0.88, WebkitMaskImage: "radial-gradient(circle at 30% 40%, #000 60%, rgba(0,0,0,.6) 61%, #000 75%)" });
    c.tl.fromTo(st, { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 0.9, duration: 0.18, ease: "power4.in" }, 0.6); c.shake(0.78, 12);
    const ok = c.el("div", "s3-t", null, c.S.title || "تأیید شد: هفته‌ی رویالی", { position: "absolute", top: "1150px", left: 0, right: 0, textAlign: "center", fontSize: "70px", color: "#0A0A0A", zIndex: 10 }); c.fadeUp(ok, 1.1);
    c.frame({ dark: false, footT: 1.4 });
  });
})();
