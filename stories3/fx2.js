/* v3 stories: typography (T), data (DA), shaders (SH), photo effects (PH) */
(function () {
  const def = (id, fn) => S3.def(id, fn);
  const darkBottom = (c, z) => c.layer({ zIndex: z || 6, background: "linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 26%, rgba(0,0,0,0) 48%, rgba(0,0,0,.88) 100%)" });
  const titleAt = (c, text, top, bot, t, o) => { const col = c.col(top, bot); const tt = c.title(col, text, o); c.rise(tt.words, t); return { col, tt }; };
  const swap = (c, parent, a, b, t, style) => { const A = c.el("div", null, parent, a, style), B = c.el("div", null, parent, b, Object.assign({}, style, { position: "absolute", inset: 0 })); c.win(A, 0, t); c.win(B, t); return [A, B]; };

  /* ============ TYPOGRAPHY ============ */
  def("T1", (c) => {   // photo seen through giant letters (knockout type)
    c.layer({ background: "#0A0A0A" });
    const e = c.el("div", "s3-t", null, c.S.big || "رویال", { position: "absolute", left: 0, right: 0, top: "520px", textAlign: "center", fontSize: "420px", lineHeight: 1.1, zIndex: 10,
      backgroundImage: `url(${c.src(c.S.photo || "p3")})`, backgroundSize: "cover", backgroundPosition: "50% 30%", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" });
    c.fit(e, 1000, 700, 460);
    c.tl.fromTo(e, { backgroundPosition: "50% 0%", scale: 1.3, opacity: 0 }, { backgroundPosition: "50% 60%", scale: 1, opacity: 1, duration: 2.4, ease: "power2.out" }, 0.2);
    const ln = c.el("div", "s3-t", null, c.S.title || "تو رویالی هستی", { position: "absolute", left: 0, right: 0, top: "1130px", textAlign: "center", fontSize: "90px", color: c.Y, zIndex: 10 }); c.fadeUp(ln, 1.8);
    c.frame({ footT: 2.2 });
  });
  def("T2", (c) => {   // flowing gold/marble texture inside letters
    c.layer({ background: "radial-gradient(ellipse at 50% 45%, #241a06 0%, #050403 70%)" }); c.dust(26);
    const col = c.col(560, 1200); const tt = c.title(col, c.S.title || "تخفیف|طلایی", { px: 230 });
    tt.words.forEach((w) => Object.assign(w.style, { backgroundImage: "linear-gradient(115deg,#6b4a12 0%,#f6dc8e 18%,#fff8dc 24%,#c99a3c 38%,#7a5414 52%,#f3d27a 68%,#fffbe9 74%,#b8842e 90%)",
      backgroundSize: "300% 300%", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 12px 0 #3d2a06) drop-shadow(0 30px 30px rgba(0,0,0,.6))" }));
    c.tl.fromTo(tt.words, { backgroundPosition: "0% 50%" }, { backgroundPosition: "100% 50%", duration: c.D, ease: "none" }, 0);
    c.rise(tt.words, 0.3, 0.15); c.frame({ footT: 1.6 });
  });
  def("T3", (c) => {   // clone wall collapses to the message
    c.layer({ background: "#FFD21F" });
    const wall = c.el("div", null, null, null, { position: "absolute", left: "-60px", right: "-60px", top: "150px", bottom: "150px", display: "flex", flexWrap: "wrap", alignContent: "center", justifyContent: "center", gap: "4px 26px", zIndex: 10, direction: "rtl" });
    const ws = []; for (let i = 0; i < 90; i++) ws.push(c.el("div", "s3-t", wall, c.S.word || "رویالی", { fontSize: "92px", color: i % 7 ? "#0A0A0A" : "#E8262B" }));
    c.tl.fromTo(ws, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.2, stagger: { each: 0.012, from: "center" } }, 0.1);
    c.tl.to(ws, { opacity: 0, scale: 0.2, duration: 0.3, stagger: { each: 0.008, from: "edges" } }, 2.0);
    const box = c.layer({ zIndex: 20, background: "#0A0A0A", clipPath: "circle(0% at 50% 45%)" }); c.tl.to(box, { clipPath: "circle(80% at 50% 45%)", duration: 0.6, ease: "power3.inOut" }, 2.6);
    const r = titleAt(c, c.S.title || "این هفته|[[رویالیه]]", 620, 1200, 2.9, { px: 190 }); r.col.style.zIndex = 30; c.frame({ footT: 3.2 });
  });
  def("T4", (c) => {   // gooey morph between words
    c.layer({ background: "#0A0A0A" });
    const sv = c.el("div", null, null, `<svg width="0" height="0" style="position:absolute"><filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="14"/><feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -12"/></filter></svg>`);
    const stage = c.el("div", null, null, null, { position: "absolute", left: 0, right: 0, top: "640px", height: "460px", filter: "url(#goo)", zIndex: 10 });
    const words = c.S.items || ["تخفیف", "هدیه", "رویالی"];
    words.forEach((w, i) => { const e = c.el("div", "s3-t", stage, w, { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "260px", color: i === words.length - 1 ? c.Y : "#fff" });
      const t0 = 0.3 + i * 1.3; c.tl.fromTo(e, { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }, t0); if (i < words.length - 1) c.tl.to(e, { opacity: 0, scale: 1.3, duration: 0.6, ease: "power2.in" }, t0 + 1.0); });
    c.frame({ footT: 3.2 });
  });
  def("T5", (c) => {   // word-level scramble locks into the slogan
    c.layer({ background: "#050505" }); c.grain(0.06);
    const target = (c.S.title || "این جمعه رویالیه").split(" "), pool = ["تخفیف", "هدیه", "بازی", "جایزه", "طلایی", "شب", "مد", "رویال", "خرید", "اهواز"];
    const row = c.el("div", null, null, null, { position: "absolute", left: "60px", right: "60px", top: "760px", display: "flex", justifyContent: "center", gap: "40px", direction: "rtl", zIndex: 10 });
    target.forEach((w, i) => { const slot = c.el("div", null, row, null, { position: "relative", height: "220px", minWidth: "260px" });
      const states = []; for (let k = 0; k < 6 + i * 3; k++) states.push(pool[(k * 3 + i * 5) % pool.length]); states.push(w);
      states.forEach((s, k) => { const e = c.el("div", "s3-t", slot, s, { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "150px", color: k === states.length - 1 ? c.Y : "#666", whiteSpace: "nowrap" });
        c.win(e, 0.2 + k * 0.09, k === states.length - 1 ? null : 0.2 + (k + 1) * 0.09); }); });
    const tEnd = 0.2 + (6 + (target.length - 1) * 3 + 1) * 0.09; c.flash(tEnd, "#FFD21F", 0.4);
    c.frame({ footT: tEnd + 0.3 });
  });
  def("T6", (c) => {   // camera pulls back as the sentence grows
    c.layer({ background: "#FFD21F" });
    const words = (c.S.title || "این هفته همه‌چیز توی رویال پارس رویالیه").split(" ");
    const box = c.el("div", null, null, null, { position: "absolute", left: "50%", top: "50%", width: "1600px", marginLeft: "-800px", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px 40px", direction: "rtl", zIndex: 10, transformOrigin: "50% 50%" });
    gsap.set(box, { yPercent: -50 });
    words.forEach((w, i) => { const e = c.el("div", "s3-t", box, w, { fontSize: "220px", color: i === words.length - 1 ? "#E8262B" : "#0A0A0A" }); c.win(e, 0.2 + i * 0.5); c.tl.fromTo(e, { scale: 1.6 }, { scale: 1, duration: 0.25, ease: "power3.out", immediateRender: false }, 0.2 + i * 0.5); });
    const kf = words.map((_, i) => 1.9 - i * (1.4 / words.length)); c.tl.fromTo(box, { scale: 2.2 }, { keyframes: { scale: kf }, duration: 0.5 * words.length, ease: "none" }, 0.2);
    c.frame({ dark: false, footT: 0.5 * words.length + 0.4 });
  });
  def("T7", (c) => {   // editorial emphasis
    c.layer({ background: "#f4efe4" }); c.grain(0.07);
    const a = c.el("div", "s3-b", null, c.S.kicker || "این هفته، فقط یک کلمه:", { position: "absolute", top: "560px", right: "100px", fontSize: "60px", color: "#333", zIndex: 10 }); c.fadeUp(a, 0.3);
    const big = c.el("div", "s3-t", null, c.S.big || "رویالی", { position: "absolute", left: 0, right: 0, top: "660px", textAlign: "center", fontSize: "360px", color: "#0A0A0A", zIndex: 10, lineHeight: 1.1 }); c.fit(big, 980, 500, 380);
    c.tl.fromTo(big, { opacity: 0, x: 120 }, { opacity: 1, x: 0, duration: 0.7, ease: "power4.out" }, 0.8);
    const u = c.el("div", null, null, null, { position: "absolute", left: "140px", right: "140px", top: "1130px", height: "18px", background: "#FFD21F", transformOrigin: "100% 50%", zIndex: 9 }); c.tl.fromTo(u, { scaleX: 0 }, { scaleX: 1, duration: 0.6 }, 1.3);
    const b = c.el("div", "s3-b", null, c.S.sub || "۱۸ برند · ۳ تا ۹ آذر", { position: "absolute", top: "1190px", left: 0, right: 0, textAlign: "center", fontSize: "52px", color: "#333", zIndex: 10 }); c.fadeUp(b, 1.6);
    c.frame({ dark: false, footT: 2 });
  });
  def("T8", (c) => {   // marker highlight while reading
    c.layer({ background: "#0A0A0A" });
    const lines = c.S.lines || ["این هفته", "تخفیف داره،", "هدیه داره،", "بازی داره،", "و یه جمعه‌ی طلایی!"];
    lines.forEach((ln, i) => { const row = c.el("div", null, null, null, { position: "absolute", right: "100px", top: 420 + i * 190 + "px", zIndex: 10 });
      const hl = c.el("div", null, row, null, { position: "absolute", left: "-20px", right: "-20px", top: "40%", height: "55%", background: "#FFD21F", transformOrigin: "100% 50%", transform: "skewX(-8deg)" });
      const tx = c.el("div", "s3-t", row, ln, { position: "relative", fontSize: "120px", color: "#fff" });
      const t0 = 0.3 + i * 0.6; c.fadeUp(row, t0, 0.3); c.tl.fromTo(hl, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, t0 + 0.2); c.tl.to(tx, { color: "#0A0A0A", duration: 0.1 }, t0 + 0.4); });
    c.frame({ footT: 3.4 });
  });
  def("T9", (c) => {   // strikethrough & replace
    c.layer({ background: "#FFD21F" });
    const pairs = c.S.items || [["قیمت عادی", "قیمت رویالی"], ["خرید معمولی", "خرید رویالی"], ["یه جمعه‌ی معمولی", "این جمعه رویالیه"]];
    pairs.forEach(([a, b], i) => { const top = 480 + i * 290, t0 = 0.3 + i * 1.0;
      const A = c.el("div", "s3-t", null, a, { position: "absolute", top: top + "px", left: 0, right: 0, textAlign: "center", fontSize: "100px", color: "#555", zIndex: 10 }); c.fadeUp(A, t0, 0.3);
      const line = c.el("div", null, null, null, { position: "absolute", top: top + 70 + "px", left: "160px", right: "160px", height: "14px", background: "#E8262B", transformOrigin: "100% 50%", zIndex: 11 }); c.tl.fromTo(line, { scaleX: 0 }, { scaleX: 1, duration: 0.3 }, t0 + 0.35);
      const B = c.el("div", "s3-t", null, b, { position: "absolute", top: top + 120 + "px", left: 0, right: 0, textAlign: "center", fontSize: "110px", color: "#0A0A0A", zIndex: 10 }); c.fit(B, 900, null, 110); B.style.display = "block"; c.slam(B, t0 + 0.6); });
    c.frame({ dark: false, footT: 3.4 });
  });
  def("T10", (c) => {  // ticker takeover
    c.layer({ background: "#0A0A0A" });
    const msgs = c.S.items || ["رویال ویک · ۳ تا ۹ آذر", "BLACK FRIDAY", "این جمعه رویالیه", "ROYAL FRIDAY", "تخفیف · هدیه · بازی", "۱۸ برند"];
    msgs.forEach((m, i) => { const latin = /[A-Z]/.test(m), band = c.el("div", null, null, null, { position: "absolute", left: "-10%", right: "-10%", top: 250 + i * 215 + "px", height: "190px", overflow: "hidden", zIndex: 10,
      background: i % 2 ? "#FFD21F" : "#151515", transform: `rotate(${i % 2 ? -3 : 3}deg)` });
      const inner = c.el("div", latin ? "s3-en" : "s3-t", band, (`<span style="padding:0 50px">${m}</span>`).repeat(8), { display: "flex", whiteSpace: "nowrap", alignItems: "center", height: "100%", fontSize: latin ? "100px" : "120px", color: i % 2 ? "#0A0A0A" : "#FFD21F" });
      const dir = i % 2 ? 1 : -1; c.tl.fromTo(inner, { x: dir * 200 }, { x: dir * -900, duration: c.D, ease: "none" }, 0); c.tl.fromTo(band, { xPercent: dir * 110 }, { xPercent: 0, duration: 0.4, ease: "power3.out" }, 0.05 * i); });
    c.frame({ noFoot: true });
  });

  /* ============ DATA ============ */
  def("DA1", (c) => {  // campaign counters
    c.layer({ background: "#0A0A0A" });
    const st = c.S.items || [[18, "برند"], [6, "طبقه"], [7, "روز"], [3, "شب اجرای زنده"], [1, "موتورسیکلت"]];
    st.forEach(([n, l], i) => { const t0 = 0.3 + i * 0.8, top = 360 + i * 210;
      const card = c.el("div", null, null, null, { position: "absolute", left: "110px", right: "110px", top: top + "px", height: "180px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 50px", direction: "rtl", background: i % 2 ? "#151515" : "#FFD21F", borderRadius: "30px", zIndex: 10 });
      c.el("div", "s3-t", card, l, { fontSize: "70px", color: i % 2 ? "#fff" : "#0A0A0A" }); const num = c.el("div", "s3-t", card, "۰", { fontSize: "120px", color: i % 2 ? "#FFD21F" : "#0A0A0A", fontFamily: "var(--fa-body)" });
      c.tl.fromTo(card, { x: 900 }, { x: 0, duration: 0.45, ease: "power3.out" }, t0);
      const obj = { v: 0 }; c.tl.fromTo(obj, { v: 0 }, { v: n, duration: 0.6, ease: "power2.out", onUpdate: () => (num.textContent = RP.faNum(Math.round(obj.v))) }, t0 + 0.2); });
    c.frame({ noFoot: true });
  });
  def("DA2", (c) => {  // discount bar race
    c.layer({ background: "#0d0d10" });
    const B = c.S.items || [["کالکشن", 50], ["کومار", 33], ["گاراژ استور", 30], ["بوردا", 20], ["زرسان", 20], ["بی‌بی‌شاپ", 15]];
    c.el("div", "s3-t", null, "تخفیف‌ها، [[کی بیشتر؟]]".replace(/\[\[|\]\]/g, ""), { position: "absolute", top: "330px", left: 0, right: 0, textAlign: "center", fontSize: "80px", color: "#fff", zIndex: 10 });
    B.forEach(([n, v], i) => { const top = 480 + i * 150, bar = c.el("div", null, null, null, { position: "absolute", right: "110px", top: top + "px", height: "110px", width: v * 14 + "px", background: i ? "#FFD21F" : "#E8262B", transformOrigin: "100% 50%", zIndex: 10, borderRadius: "0 0 0 0" });
      c.el("div", "s3-t", bar, n, { position: "absolute", right: "20px", top: "10px", fontSize: "58px", color: "#0A0A0A", whiteSpace: "nowrap" });
      const val = c.el("div", "s3-t", null, "تا " + RP.faNum(v) + "٪", { position: "absolute", right: 110 + v * 14 + 20 + "px", top: top + 16 + "px", fontSize: "58px", color: "#fff", zIndex: 10, fontFamily: "var(--fa-body)" });
      c.tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: "power2.out" }, 0.4 + i * 0.12); c.fadeUp(val, 1.6 + i * 0.12); });
    c.frame({ footT: 2.6 });
  });
  def("DA3", (c) => {  // gauge to «royal»
    c.layer({ background: "#0A0A0A" });
    const g = c.el("div", null, null, `<svg viewBox="-220 -220 440 260" style="width:100%;height:100%"><path d="M-180 0 A180 180 0 0 1 180 0" fill="none" stroke="#333" stroke-width="40"/><path id="ga" d="M-180 0 A180 180 0 0 1 180 0" fill="none" stroke="#FFD21F" stroke-width="40"/></svg>`, { position: "absolute", left: "140px", width: "800px", top: "560px", height: "480px", zIndex: 10 });
    const ga = g.querySelector("#ga"), L = ga.getTotalLength(); ga.style.strokeDasharray = L; ga.style.strokeDashoffset = L; c.tl.to(ga, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }, 0.5);
    const needle = c.el("div", null, null, null, { position: "absolute", left: "536px", top: "620px", width: "8px", height: "340px", background: "#fff", transformOrigin: "50% 100%", zIndex: 11, borderRadius: "4px" });
    c.tl.fromTo(needle, { rotation: -90 }, { rotation: 86, duration: 2, ease: "power2.inOut" }, 0.5);
    c.el("div", "s3-b", null, "معمولی", { position: "absolute", top: "990px", left: "150px", fontSize: "44px", color: "#888", zIndex: 10 });
    const rr = c.el("div", "s3-t", null, "رویالی!", { position: "absolute", top: "970px", right: "130px", fontSize: "70px", color: "#FFD21F", zIndex: 10 }); c.pop(rr, 2.4);
    c.frame({ footT: 2.6 });
  });
  def("DA4", (c) => {  // «Royal Wrapped» — colour pages with campaign facts
    const P = c.S.pages || [["#FFD21F", "#0A0A0A", "رویال ویک تموم شد…", "ولی چه هفته‌ای!"], ["#E8262B", "#fff", "۷ روز", "تخفیف و هدیه"], ["#0A0A0A", "#FFD21F", "۱۸ برند", "رویالی شدن"], ["#1B2250", "#fff", "۳ شب", "اجرای زنده درام"], ["#FFD21F", "#0A0A0A", "ممنون که", "رویالی بودید"]];
    const seg = (c.D - 0.4) / P.length;
    P.forEach(([bg, fg, a, b], i) => { const L = c.scene(i * seg, i === P.length - 1 ? null : (i + 1) * seg, { background: bg, zIndex: 10 + i });
      const A = c.el("div", "s3-t", L, a, { position: "absolute", left: 0, right: 0, top: "700px", textAlign: "center", fontSize: "170px", color: fg }); c.fit(A, 900, null, 180); A.style.display = "block";
      const Bx = c.el("div", "s3-t", L, b, { position: "absolute", left: 0, right: 0, top: "960px", textAlign: "center", fontSize: "80px", color: fg });
      c.tl.fromTo(A, { y: 120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, i * seg + 0.05); c.tl.fromTo(Bx, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, i * seg + 0.35);
      c.tl.fromTo(L, { clipPath: "circle(0% at 50% 50%)" }, { clipPath: "circle(100% at 50% 50%)", duration: 0.35, ease: "power3.out", immediateRender: false }, i * seg); });
    c.frame({ noFoot: true });
  });
  def("DA5", (c) => {  // hot offers per floor
    c.layer({ background: "#0b0b0f" });
    const F = c.S.floors || [["طبقه ۵", "۱۵٪", 0.3], ["طبقه ۴", "تا ۳۰٪", 0.6], ["طبقه ۳", "تا ۲۰٪", 0.4], ["طبقه ۲", "تا ۵۰٪", 1], ["طبقه ۱", "۱+۱", 0.7], ["همکف", "پیش‌خرید", 0.35]];
    c.el("div", "s3-t", null, "تخفیف‌های داغ هر طبقه", { position: "absolute", top: "330px", left: 0, right: 0, textAlign: "center", fontSize: "76px", color: "#fff", zIndex: 10 });
    F.forEach(([n, o, heat], i) => { const top = 460 + i * 150, col = `rgb(255,${Math.round(220 - heat * 180)},${Math.round(40 - heat * 30)})`;
      const row = c.el("div", "s3-t", null, `<span>${n}</span><span style="font-family:var(--fa-body)">${o}</span>`, { position: "absolute", left: "110px", right: "110px", top: top + "px", height: "126px", display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 40px", direction: "rtl", fontSize: "60px", color: "#0A0A0A", background: col, borderRadius: "24px", zIndex: 10, boxShadow: `0 0 ${20 + heat * 60}px ${col}` });
      c.tl.fromTo(row, { opacity: 0, x: -200 }, { opacity: 1, x: 0, duration: 0.4 }, 0.4 + i * 0.15); c.tl.fromTo(row, { scale: 1 }, { keyframes: { scale: [1, 1 + heat * 0.04, 1] }, duration: 0.8, ease: "none", repeat: 3, immediateRender: false }, 1.6); });
    c.frame({ footT: 2 });
  });

  /* ============ SHADERS ============ */
  const NOISE = "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p*=2.;a*=.5;}return s;}";
  def("SH1", (c) => {
    c.gl(NOISE + "void main(){vec2 p=v*vec2(1.,1.78)*3.;float t=u_t*.35;float q=fbm(p+vec2(t,t*.6));float r=fbm(p+q*2.+vec2(-t,.3*t));float g=pow(r,1.4);vec3 c=mix(vec3(.25,.15,.03),vec3(1.,.82,.4),g);c+=pow(g,6.)*vec3(1.,.95,.8)*1.5;gl_FragColor=vec4(c,1.);}");
    const col = c.col(560, 1200, { zIndex: 30 }); const b = c.el("div", "s3-t", col, c.S.big || "۵۰٪", { fontSize: "380px", color: "rgba(255,255,255,.18)", fontFamily: "var(--fa-body)", backdropFilter: "blur(10px)", textShadow: "0 0 2px #fff, 0 20px 60px rgba(0,0,0,.5)", WebkitTextStroke: "4px rgba(255,255,255,.85)" });
    c.pop(b, 0.4); const s = c.el("div", "s3-t", col, c.S.title || "تخفیف طلایی", { fontSize: "100px", color: "#0A0A0A" }); c.fadeUp(s, 1.0); c.frame({ footT: 1.4 });
  });
  def("SH2", (c) => {  // holographic membership card
    c.layer({ background: "#0b0b12" });
    const card = c.el("div", null, null, null, { position: "absolute", left: "140px", width: "800px", top: "600px", height: "500px", borderRadius: "40px", zIndex: 10, overflow: "hidden",
      background: "linear-gradient(115deg, #ff9adf, #9ad1ff 20%, #fff59a 40%, #9affc6 60%, #c79aff 80%, #ff9adf)", backgroundSize: "300% 300%", boxShadow: "0 40px 80px rgba(0,0,0,.6)" });
    c.el("div", "s3-en", card, "ROYAL MEMBER", { position: "absolute", top: "50px", left: "50px", fontSize: "40px", color: "#0A0A0A" });
    c.el("div", "s3-t", card, "کارت رویالی", { position: "absolute", bottom: "60px", right: "50px", fontSize: "90px", color: "#0A0A0A" });
    c.el("div", "s3-en", card, "1405 · VIP", { position: "absolute", bottom: "70px", left: "50px", fontSize: "34px", color: "#0A0A0A" });
    const sheen = c.el("div", null, card, null, { position: "absolute", inset: 0, background: "linear-gradient(110deg, transparent 35%, rgba(255,255,255,.75) 50%, transparent 65%)", backgroundSize: "250% 100%" });
    c.tl.fromTo(card, { rotationY: -30, rotationX: 14, backgroundPosition: "0% 50%" }, { rotationY: 24, rotationX: -8, backgroundPosition: "100% 50%", duration: c.D, ease: "sine.inOut" }, 0);
    c.tl.fromTo(sheen, { backgroundPosition: "150% 0" }, { backgroundPosition: "-50% 0", duration: 1.6, ease: "power2.inOut", repeat: 2 }, 0.3);
    card.parentNode.style.perspective = "1600px";
    titleAt(c, c.S.title || "تو [[رویالی]] هستی", 1170, 1330, 1.0, { px: 110 }); c.frame({ footT: 1.4 });
  });
  def("SH3", (c) => {
    c.gl("void main(){vec2 p=(v-.5)*vec2(1.,1.78)*6.;float t=u_t;float s=sin(p.x+t)+sin(p.y*1.3+t*1.2)+sin((p.x+p.y+t)*.7)+sin(length(p+vec2(sin(t*.5)*3.,cos(t*.4)*3.))*1.5);vec3 c=.5+.5*cos(vec3(.9,.6,.1)*s+vec3(0.,1.6,3.2));c=mix(c,vec3(1.,.82,.12),.35);gl_FragColor=vec4(c*.85,1.);}");
    c.layer({ zIndex: 3, background: "rgba(0,0,0,.35)" });
    titleAt(c, c.S.title || "شب‌های|[[رویالی]]", 640, 1200, 0.5, { px: 200 }); c.frame({ footT: 1.2 });
  });
  def("SH4", (c) => {  // glitch cuts between photos (RGB-split slices)
    const ph = c.S.photo || ["shops/s01", "shops/s20", "shops/s29"], seg = 1.5;
    ph.forEach((p, i) => { const L = c.scene(i * seg, i === ph.length - 1 ? null : (i + 1) * seg, { zIndex: 2 + i }); c.img(p, L);
      for (let k = 0; k < 3; k++) { const g = c.layer({ zIndex: 20, mixBlendMode: "screen", opacity: 0 }); const im = c.img(p, g); im.style.filter = ["sepia(1) hue-rotate(-50deg) saturate(6)", "sepia(1) hue-rotate(130deg) saturate(6)", "none"][k];
        const t0 = (i + 1) * seg - 0.25; if (i < ph.length - 1) for (let f = 0; f < 6; f++) c.tl.set(g, { opacity: 0.7, x: (c.r() - 0.5) * 60, clipPath: `inset(${(c.r() * 70) | 0}% 0 ${(c.r() * 20) | 0}% 0)` }, t0 + f * 0.05); c.tl.set(g, { opacity: 0 }, t0 + 0.32); } });
    darkBottom(c, 25); const r = titleAt(c, c.S.title || "بلک‌فرایدی|[[رویالی]]", 1020, 1320, ph.length * seg - 1.0, { px: 150 }); r.col.style.zIndex = 30; c.frame({ footT: 3.4 });
  });
  def("SH5", (c) => {  // ripple distortion on a photo (GL texture)
    c.after = (imgs) => {
      c.gl("void main(){vec2 p=v;vec2 d=p-vec2(.5,.55);float r=length(d*vec2(1.,1.78));float w=sin(r*40.-u_t*8.)*.012*exp(-r*3.)*smoothstep(0.,1.,u_t);p+=normalize(d+1e-4)*w;gl_FragColor=texture2D(u_tex,p);}", { tex: c.coverCanvas(imgs[0], 540, 960), w: 540, h: 960 });
      darkBottom(c, 4); titleAt(c, c.S.title || "موج [[رویالی]]", 1020, 1320, 1.2, { px: 150 }); c.frame({ footT: 1.6 });
    };
  });
  def("SH6", (c) => {  // SDF iris between two photos
    c.after = (imgs) => {
      c.gl("void main(){vec2 p=(v-vec2(.5,.55))*vec2(1.,1.78);float k=clamp((u_t-1.)/1.4,0.,1.);float d=abs(p.x)+abs(p.y)*.9;float m=step(d,k*1.6);vec4 a=texture2D(u_tex,v),b=texture2D(u_tex2,v);float edge=smoothstep(.0,.02,abs(d-k*1.6));gl_FragColor=mix(a,b,m)*mix(.2,1.,edge)+vec4(1.,.82,.12,0.)*(1.-edge);}",
        { tex: c.coverCanvas(imgs[0], 540, 960), tex2: c.coverCanvas(imgs[1], 540, 960), w: 540, h: 960 });
      darkBottom(c, 4); titleAt(c, c.S.title || "از این [[به این]]", 1020, 1320, 2.6, { px: 150 }); c.frame({ footT: 3 });
    };
  });
  def("SH7", (c) => {  // heat haze over hot text
    c.layer({ background: "linear-gradient(180deg, #3a0d05, #0a0302)" });
    c.el("div", null, null, `<svg width="0" height="0" style="position:absolute"><filter id="heat"><feTurbulence id="tb" type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="30"/></filter></svg>`);
    const col = c.col(580, 1200, { filter: "url(#heat)" }); const tt = c.title(col, c.S.title || "فروش [[داغ]]|جمعه", { px: 220, key: "#FF6A1C", color: "#FFD21F" }); c.rise(tt.words, 0.3);
    const tb = c.sc.querySelector("#tb"), st = { f: 0 }; c.tl.fromTo(st, { f: 0 }, { f: 1, duration: c.D, ease: "none", onUpdate: () => tb.setAttribute("baseFrequency", `${0.012 + Math.sin(st.f * 20) * 0.004} ${0.06 + Math.cos(st.f * 17) * 0.02}`) }, 0);
    c.frame({ footT: 1.4 });
  });
  def("SH8", (c) => {  // fractal-noise dissolve between photos
    c.after = (imgs) => {
      c.gl(NOISE + "void main(){float k=clamp((u_t-1.)/1.6,0.,1.);float nn=fbm(v*vec2(4.,7.));vec4 a=texture2D(u_tex,v),b=texture2D(u_tex2,v);float m=smoothstep(k-.06,k+.06,nn);float e=smoothstep(.08,.0,abs(nn-k))*step(.01,k)*step(k,.99);gl_FragColor=mix(b,a,m)+vec4(1.,.75,.2,0.)*e*1.4;}",
        { tex: c.coverCanvas(imgs[0], 540, 960), tex2: c.coverCanvas(imgs[1], 540, 960), w: 540, h: 960 });
      darkBottom(c, 4); titleAt(c, c.S.title || "حل شد در|[[رویال]]", 1020, 1320, 2.8, { px: 150 }); c.frame({ footT: 3 });
    };
  });
  def("SH9", (c) => {  // god rays behind the badge
    c.gl("void main(){vec2 p=(v-vec2(.5,.56))*vec2(1.,1.78);float a=atan(p.y,p.x);float r=length(p);float rays=pow(.5+.5*sin(a*14.+u_t*.8),8.)*.9+pow(.5+.5*sin(a*7.-u_t*.5),12.)*.6;float f=rays*exp(-r*1.6)+exp(-r*5.)*.9;vec3 c=vec3(.07,.09,.22)+vec3(1.,.82,.4)*f;gl_FragColor=vec4(c,1.);}");
    const lw = c.el("div", null, null, null, { position: "absolute", left: "390px", width: "300px", top: "640px", height: "500px", zIndex: 10 });
    const lg = RP.logo({ parent: lw, outerStroke: "#C9A45C", innerFill: "#1B2250", innerStroke: "#C9A45C", mono: "#ECCF92", monoWidth: 1.8 }); lg.style.width = "100%"; lg.style.height = "100%";
    c.pop(lw, 0.4, 0.8); const n = c.el("div", "s3-t", null, "مرکز خرید رویال پارس", { position: "absolute", top: "1180px", left: 0, right: 0, textAlign: "center", fontSize: "70px", color: "#F6F0E3", zIndex: 10 }); c.fadeUp(n, 1.2);
    c.frame({ footT: 1.6 });
  });
  def("SH10", (c) => {  // chrome title with environment reflection
    c.layer({ background: "linear-gradient(180deg, #0a0a0a, #1d1d22 60%, #0a0a0a)" });
    const col = c.col(620, 1180); const tt = c.title(col, c.S.title || "جمعه|[[رویالی]]", { px: 230 });
    tt.words.forEach((w) => Object.assign(w.style, { backgroundImage: "linear-gradient(180deg, #ffffff 0%, #d9dde3 30%, #6b717a 50%, #202326 52%, #8a9099 70%, #f2f4f7 100%)", backgroundSize: "100% 200%",
      WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 6px 0 #0d0f11) drop-shadow(0 24px 30px rgba(0,0,0,.7))" }));
    c.tl.fromTo(tt.words, { backgroundPosition: "0 0%" }, { backgroundPosition: "0 100%", duration: c.D, ease: "sine.inOut" }, 0); c.rise(tt.words, 0.3, 0.15);
    const glint = c.el("div", null, null, "✦", { position: "absolute", left: "700px", top: "640px", fontSize: "90px", color: "#fff", zIndex: 40 }); c.tl.fromTo(glint, { scale: 0, rotation: 0 }, { keyframes: { scale: [0, 1.4, 0] }, rotation: 90, duration: 0.7 }, 1.4);
    c.frame({ footT: 1.6 });
  });

  /* ============ PHOTO EFFECTS ============ */
  def("PH1", (c) => {  // cinemagraph: frozen shop, one living light band
    const im = c.img(c.S.photo || "shops/s25");
    const band = c.layer({ zIndex: 3, background: "linear-gradient(105deg, transparent 40%, rgba(255,240,190,.45) 50%, transparent 60%)", backgroundSize: "300% 100%", WebkitMaskImage: "linear-gradient(180deg, transparent 18%, #000 25%, #000 60%, transparent 68%)" });
    c.tl.fromTo(band, { backgroundPosition: "150% 0" }, { backgroundPosition: "-50% 0", duration: 2.2, ease: "none", repeat: 3 }, 0);
    darkBottom(c, 4); titleAt(c, c.S.title || "یه لحظه‌ی|[[رویالی]]", 1020, 1320, 0.8, { px: 150 }); c.frame({ footT: 1.2 });
  });
  def("PH2", (c) => {  // slit-scan transition between two photos
    c.after = (imgs) => {
      const A = c.coverCanvas(imgs[0], 270, 480), B = c.coverCanvas(imgs[1], 270, 480);
      c.proc((g, t, w, h) => { const k = Math.max(0, Math.min(1, (t - 0.8) / 1.6));
        for (let x = 0; x < w; x += 3) { const delay = x / w, kk = Math.max(0, Math.min(1, (k - delay * 0.6) / 0.4)), src = kk >= 1 ? B : A, stretch = Math.sin(kk * Math.PI) * 60;
          g.drawImage(src, x, 0, 3, h, x, -stretch, 3, h + stretch * 2); } }, { smooth: true });
      darkBottom(c, 6); titleAt(c, c.S.title || "زمان، [[رویالی]] می‌گذره", 1020, 1320, 2.6, { px: 130 }); c.frame({ footT: 3 });
    };
  });
  def("PH3", (c) => {  // halftone dots resolve into the photo
    c.after = (imgs) => {
      const cols = 54, rows = 96, sm = c.coverCanvas(imgs[0], cols, rows), d = sm.getContext("2d").getImageData(0, 0, cols, rows).data;
      c.proc((g, t, w, h) => { g.fillStyle = "#FFD21F"; g.fillRect(0, 0, w, h); const k = Math.min(1, t / 2.2), cs = w / cols;
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) { const i = (y * cols + x) * 4, lum = (0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255; const rr = (1 - lum) * cs * 0.62 * Math.min(1, k * 1.5);
          if (rr > 0.2) { g.fillStyle = "#0A0A0A"; g.beginPath(); g.arc(x * cs + cs / 2, y * cs + cs / 2, rr, 0, 6.283); g.fill(); } } }, { w: 1080, h: 1920, smooth: true });
      const real = c.img(c.S.photo || "shops/s29", null, { zIndex: 8, opacity: 0 }); c.tl.to(real, { opacity: 1, duration: 0.8 }, 3.0);
      darkBottom(c, 9); const r = titleAt(c, c.S.title || "نقطه‌به‌نقطه [[رویالی]]", 1020, 1320, 3.4, { px: 130 }); r.col.style.zIndex = 30; c.frame({ footT: 3.6 });
    };
  });
  def("PH4", (c) => {  // duotone cuts on the beat
    const ph = c.S.photo || ["shops/s14", "shops/s20", "shops/s24"], seg = 0.94;
    ph.forEach((p, i) => { const L = c.scene(i * seg, i === ph.length - 1 ? null : (i + 1) * seg, { zIndex: 2 + i, background: i % 2 ? "#0A0A0A" : "#FFD21F" });
      const im = c.img(p, L); Object.assign(im.style, { filter: "grayscale(1) contrast(1.4)", mixBlendMode: i % 2 ? "screen" : "multiply" }); c.tl.fromTo(im, { scale: 1.15 }, { scale: 1, duration: seg, ease: "none" }, i * seg); });
    const r = titleAt(c, c.S.title || "زرد و مشکی|[[رویالی]]", 1020, 1320, ph.length * seg, { px: 150 }); r.col.style.zIndex = 30;
    darkBottom(c, 20); c.frame({ footT: ph.length * seg + 0.3 });
  });
  def("PH5", (c) => {  // photo shatters
    c.layer({ background: "#FFD21F" }); const r = titleAt(c, c.S.title || "قیمت‌ها|[[شکست!]]", 620, 1200, 1.4, { px: 200, color: "#0A0A0A", key: "#E8262B" });
    const shards = [[0, 0, 55, 0, 30, 35], [55, 0, 100, 0, 100, 30, 30, 35], [0, 0, 30, 35, 0, 60], [30, 35, 100, 30, 70, 62], [0, 60, 30, 35, 70, 62, 40, 100, 0, 100], [70, 62, 100, 30, 100, 100, 40, 100]];
    shards.forEach((pts, i) => { const L = c.layer({ zIndex: 20, clipPath: "polygon(" + pts.reduce((a, v, k) => a + (k % 2 ? ` ${v}%` : (k ? "," : "") + `${v}%`), "") + ")" }); c.img(c.S.photo || "shops/s31", L);
      const a = (i / shards.length) * 6.28; c.tl.to(L, { x: Math.cos(a) * 1200, y: Math.sin(a) * 1600 + 600, rotation: (c.r() - 0.5) * 120, duration: 1.0, ease: "power3.in" }, 0.9 + c.r() * 0.15); });
    c.flash(0.88, "#fff", 0.7); c.shake(0.9, 14); c.frame({ dark: false, footT: 1.8 });
  });
  def("PH6", (c) => {  // 2.5D parallax from one photo
    const back = c.layer({ zIndex: 1, overflow: "hidden" }), bi = c.img(c.S.photo || "p6", back); bi.style.filter = "blur(10px) brightness(.7)";
    const mid = c.layer({ zIndex: 2, clipPath: "inset(14% 12% 18% 12% round 40px)" }), mi = c.img(c.S.photo || "p6", mid);
    c.tl.fromTo(bi, { scale: 1.25, x: 40 }, { scale: 1.1, x: -40, duration: c.D, ease: "none" }, 0); c.tl.fromTo(mi, { scale: 1.05, x: -30 }, { scale: 1.15, x: 30, duration: c.D, ease: "none" }, 0);
    c.tl.fromTo(mid, { clipPath: "inset(50% 50% 50% 50% round 40px)" }, { clipPath: "inset(14% 12% 18% 12% round 40px)", duration: 0.8, ease: "power3.out" }, 0.1);
    titleAt(c, c.S.title || "یه قدم [[جلوتر]]", 1130, 1330, 1.0, { px: 130 }); c.frame({ footT: 1.4 });
  });
  def("PH7", (c) => {  // before / after slider
    const ph = c.S.photo || "shops/s12"; c.img(ph, c.layer({ zIndex: 1 }));
    const after = c.layer({ zIndex: 2, clipPath: "inset(0 0 0 100%)" }), ai = c.img(ph, after); ai.style.filter = "grayscale(1) sepia(1) hue-rotate(5deg) saturate(5) contrast(1.1)";
    const handle = c.el("div", null, null, null, { position: "absolute", top: 0, bottom: 0, width: "10px", background: "#fff", zIndex: 5, left: "1080px", boxShadow: "0 0 20px rgba(0,0,0,.5)" });
    const lab = (t, side) => c.el("div", "s3-t", null, t, { position: "absolute", top: "420px", [side]: "60px", fontSize: "56px", color: "#fff", background: "rgba(0,0,0,.6)", padding: "6px 24px 14px", zIndex: 6 });
    lab("قبل", "right"); lab("رویالی", "left");
    const st = { p: 100 }; c.tl.fromTo(st, { p: 100 }, { keyframes: { p: [100, 30, 60, 0] }, duration: 3.2, ease: "power1.inOut", onUpdate: () => { after.style.clipPath = `inset(0 0 0 ${st.p}%)`; handle.style.left = st.p * 10.8 + "px"; } }, 0.4);
    darkBottom(c, 4); const r = titleAt(c, c.S.title || "قبل و [[بعدِ]] رویال ویک", 1060, 1320, 3.0, { px: 130 }); r.col.style.zIndex = 20; c.frame({ footT: 3.4 });
  });
  def("PH8", (c) => {  // camcorder REC overlay
    const ph = c.S.photo || ["shops/s02", "shops/s09", "shops/s13"], seg = (c.D - 1) / ph.length;
    ph.forEach((p, i) => { const L = c.scene(i * seg, i === ph.length - 1 ? null : (i + 1) * seg, { zIndex: 2 + i }); const im = c.img(p, L);
      for (let f = 0; f < seg * 10; f++) c.tl.set(im, { x: (c.r() - 0.5) * 14, y: (c.r() - 0.5) * 14, rotation: (c.r() - 0.5) * 0.8 }, i * seg + f / 10); });
    c.layer({ zIndex: 10, background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,.6))" });
    const rec = c.el("div", "s3-en", null, "● REC", { position: "absolute", top: "320px", left: "100px", fontSize: "48px", color: "#E8262B", zIndex: 20 }); for (let t = 0; t < c.D; t += 1) { c.tl.set(rec, { opacity: 1 }, t); c.tl.set(rec, { opacity: 0.2 }, t + 0.5); }
    c.el("div", "s3-mono", null, "1405/09/06  20:14", { position: "absolute", top: "1440px", left: "100px", fontSize: "44px", color: "#fff", zIndex: 20 });
    c.el("div", "s3-en", null, "▮▮▮▯", { position: "absolute", top: "320px", right: "100px", fontSize: "44px", color: "#fff", zIndex: 20 });
    const lab = c.strip(c.sc, c.S.title || "زنده از رویال پارس", { px: 90, rot: -2 }); Object.assign(lab.style, { position: "absolute", top: "1180px", right: "90px", zIndex: 20 }); c.pop(lab, 0.8);
    c.frame({ noFoot: true });
  });
  def("PH9", (c) => {  // polaroid develops
    c.layer({ background: "#e8dfcc" }); c.grain(0.08);
    const card = c.el("div", "s3-card", null, null, { left: "190px", width: "700px", top: "400px", height: "880px", transform: "rotate(-3deg)", zIndex: 10, padding: "30px 30px 150px" });
    const im = c.img(c.S.photo || "p5", card); c.tl.fromTo(im, { filter: "brightness(2.4) contrast(.2) sepia(.4) blur(4px)" }, { filter: "brightness(1) contrast(1) sepia(0) blur(0px)", duration: 3.2, ease: "power1.inOut" }, 0.4);
    const cap = c.el("div", "s3-t", card, c.S.title || "یادگاری رویالی", { position: "absolute", bottom: "34px", left: 0, right: 0, textAlign: "center", fontSize: "64px", color: "#1B2250" }); c.fadeUp(cap, 2.4);
    c.tl.fromTo(card, { y: 900, rotation: 10 }, { y: 0, rotation: -3, duration: 0.7, ease: "power4.out" }, 0); c.frame({ dark: false, footT: 2.8 });
  });
  def("PH10", (c) => { // photos travel on an S-curve path
    c.layer({ background: "#0A0A0A" });
    const ph = c.S.photo || ["shops/s01", "shops/s05", "shops/s12", "shops/s20", "shops/s24", "shops/s29", "shops/s31", "shops/s14"];
    const path = (k) => [540 + Math.sin(k * Math.PI * 2) * 300, 2100 - k * 2400];
    ph.forEach((p, i) => { const card = c.el("div", "s3-card", null, null, { left: 0, top: 0, width: "330px", height: "420px", padding: "12px 12px 40px", zIndex: 10 + i }); c.img(p, card);
      const kf = { x: [], y: [], rotation: [] }; for (let s = 0; s <= 10; s++) { const k = s / 10, [x, y] = path(k); kf.x.push(x - 165); kf.y.push(y - 210); kf.rotation.push(Math.cos(k * Math.PI * 2) * 14); }
      c.tl.fromTo(card, { x: kf.x[0], y: kf.y[0] }, { keyframes: kf, duration: 4.2, ease: "none" }, i * 0.45); });
    const r = titleAt(c, c.S.title || "یه مسیر [[رویالی]]", 860, 1100, 1.0, { px: 150 }); r.col.style.zIndex = 40; c.frame({ footT: 1.4 });
  });
})();
