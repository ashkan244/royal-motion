/* V2A2 — Royal Week main teaser, 15 s, vertical-first, 128 BPM (8 bars).
   bar 1 hook «تا ۵۰٪ تخفیف» · bar 2 «۱۸ برند» · bar 3 prize · bar 4 game ladder ·
   bar 5 drum nights · bar 6 Friday · bars 7–8 end card                       */
RP.run(function (tl, RP) {
  const { W, H, T, K } = RP;
  const S = RP.safe, B = RP.beat, BAR = 4 * B, D = RP.duration;
  const cut = [0, 1, 2, 3, 4, 5, 6].map((i) => +(i * BAR).toFixed(4));
  const sc = RP.$("#scene");
  const r = RP.rng(1405);
  const el = (tag, attrs, parent, html) => RP.el(tag, attrs, parent, html);
  const txt = (parent, cls, html) => el("div", { class: "c " + cls }, parent, html);
  const put = (e, cx, cy) => { gsap.set(e, { left: cx, top: cy, xPercent: -50, yPercent: -50 }); return e; };
  const DEEP = "#9E7600";

  /* ---------------- background: warm vignette, drifting outline word, light beams, grain */
  el("div", { id: "bg" }, sc);
  const bw = el("div", { id: "bgword" }, sc, "ROYAL WEEK");
  gsap.set(bw, { xPercent: -50, yPercent: -50, rotation: -90 });
  tl.fromTo(bw, { y: H * 0.22 }, { y: -H * 0.22, duration: D, ease: "none" }, 0);
  [[-280, 17], [320, -21]].forEach(([x0, rot]) => {
    const e = el("div", { class: "beam" }, sc);
    gsap.set(e, { xPercent: -50, rotation: rot, x: x0 });
    tl.fromTo(e, { x: x0 }, { x: -x0 * 0.7, duration: D, ease: "sine.inOut" }, 0);
  });
  const grain = RP.grain(sc, 11, 0.05);
  grain.style.mixBlendMode = "normal";
  RP.grainSteps(tl, grain, D);

  /* ---------------- HUD: brand tag, date chip, 6 progress segments (story-style) */
  const hud = el("div", { id: "hud" }, sc);
  const tag = el("div", { class: "tag" }, hud);
  const hl = RP.logo({ parent: tag, outerStroke: K.rwYellow, outerWidth: 1.6, innerFill: K.rwBlack, innerStroke: K.rwYellow, innerWidth: 0.6, mono: K.rwYellow, monoWidth: 2 });
  hl.style.height = "72px"; hl.style.width = 72 * RP.LOGO.w / RP.LOGO.h + "px";
  el("span", {}, tag, "ROYAL WEEK");
  gsap.set(tag, { left: S.x1, top: S.y0, xPercent: -100 });
  const chip = el("div", { class: "date" }, hud, T.rwStart);
  gsap.set(chip, { left: S.x0, top: S.y0 + 6 });
  tl.fromTo([tag, chip], { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, stagger: 0.06 }, 0.05);
  const segs = el("div", { class: "segs" }, hud);
  gsap.set(segs, { left: S.x0, top: S.y1 - 12, width: S.w });
  for (let i = 0; i < 6; i++) {
    const f = el("i", {}, el("div", { class: "seg" }, segs));
    tl.fromTo(f, { scaleX: 0 }, { scaleX: 1, duration: BAR, ease: "none", immediateRender: false }, cut[i]);
  }
  tl.to(hud, { autoAlpha: 0, duration: 0.15 }, cut[6] - 0.05);

  /* ---------------- bar 1 — HOOK: «تا ۵۰٪ تخفیف» */
  const s1 = RP.scene(tl, 0, cut[1]);
  const tA = RP.tape(s1, "رویال ویک • این هفته رویالیه •", { dark: true });
  gsap.set(tA.el, { top: 365, rotation: -4 });
  const tB = RP.tape(s1, "تخفیف • رویال ویک •");
  gsap.set(tB.el, { top: 1440, rotation: 7 });
  tl.fromTo(tA.el, { x: -W * 1.2 }, { x: 0, duration: 0.3, ease: "power4.out" }, 0.04);
  tl.fromTo(tB.el, { x: W * 1.2 }, { x: 0, duration: 0.3, ease: "power4.out" }, 0.1);
  tl.fromTo(tA.inner, { x: 0 }, { x: -520, duration: BAR, ease: "none" }, 0);
  tl.fromTo(tB.inner, { x: -520 }, { x: 0, duration: BAR, ease: "none" }, 0);
  const k1 = txt(s1, "kick", "تا"); k1.style.fontFamily = "var(--fa-body)"; RP.fit(k1, 400, 170, 170); put(k1, W / 2, 545);
  const n1 = txt(s1, "hero", "۵۰٪"); n1.style.letterSpacing = "-0.03em"; const f1 = RP.fit(n1, S.w, 560); RP.x3d(n1, DEEP, 14, 0.7, 1.0); put(n1, W / 2, 870);
  for (let i = 1; i <= 2; i++) {
    const g = txt(s1, "hero ghost", "۵۰٪"); g.style.fontSize = f1 + "px"; put(g, W / 2, 870);
    tl.fromTo(g, { scale: 1.35 + i * 0.14, autoAlpha: 0.35 }, { scale: 1, autoAlpha: 0, duration: 0.24, ease: "expo.out" }, 0);
  }
  tl.fromTo(n1, { scale: 1.35 }, { scale: 1, duration: 0.26, ease: "expo.out" }, 0);
  for (let i = 1; i <= 3; i++) RP.punch(tl, n1, B * i, 0.035, 0.3);
  tl.fromTo(k1, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, 0.08);
  const t1 = txt(s1, "kick slab", "تخفیف"); RP.fit(t1, 560, 190); put(t1, W / 2, 1235);
  tl.fromTo(t1, { scaleX: 0 }, { scaleX: 1, duration: 0.32, ease: "power3.inOut", transformOrigin: "100% 50%" }, 0.2);

  /* ---------------- bar 2 — «تخفیف در ۱۸ برند» + brand wall */
  const s2 = RP.scene(tl, cut[1], cut[2]);
  const k2 = txt(s2, "kick", "تخفیف در"); RP.fit(k2, 520, 110); put(k2, W / 2, 400);
  const row = txt(s2, "", ""); row.style.display = "flex"; row.style.alignItems = "center"; row.style.gap = "30px"; row.style.direction = "rtl";
  const F2 = 300, LH = Math.round(F2 * 1.12);
  const reel = el("div", { class: "reel" }, row); reel.style.position = "relative"; reel.style.height = LH + "px"; reel.style.padding = "0 18px";
  const strip = el("div", { class: "strip" }, reel);
  ["۰", "۲", "۴", "۶", "۸", "۱۰", "۱۲", "۱۴", "۱۶", "۱۸"].forEach((n) => {
    const d = el("div", { class: "hero" }, strip, n);
    d.style.fontSize = F2 + "px"; d.style.lineHeight = LH + "px"; d.style.height = LH + "px"; RP.x3d(d, DEEP, 9, 0.6, 0.8);
  });
  const bw2 = el("div", { class: "hero white" }, row, "برند"); bw2.style.fontSize = "190px";
  put(row, W / 2, 610);
  tl.fromTo(strip, { y: 0 }, { y: -9 * LH, duration: 0.75, ease: "power4.out" }, cut[1] + 0.05);
  tl.fromTo(bw2, { x: -120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, cut[1] + 0.1);
  tl.fromTo(k2, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, cut[1]);
  RP.punch(tl, row, cut[1] + B * 2, 0.05);
  const wall = el("div", { id: "wall" }, s2);
  gsap.set(wall, { left: S.x0, top: 840, width: S.w });
  (T.brands || []).forEach((n, i) => {
    const p = el("div", { class: "pill" + (i % 3 === 0 ? " on" : "") }, wall, n);
    tl.fromTo(p, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: "back.out(2.4)" }, cut[1] + 0.25 + i * 0.045);
  });
  tl.fromTo(wall, { y: 24 }, { y: -24, duration: BAR, ease: "none" }, cut[1]);

  /* ---------------- bar 3 — prize: motorbike */
  const s3 = RP.scene(tl, cut[2], cut[3]);
  for (let i = 0; i < 16; i++) {
    const s = el("div", { class: "speed" }, s3), w = 220 + r() * 520, y = 640 + r() * 560;
    gsap.set(s, { left: W, top: y, width: w });
    tl.fromTo(s, { x: 0 }, { x: -(W + w + 300) * (1 + r() * 0.4), duration: 0.55 + r() * 0.4, ease: "none" }, cut[2] + r() * 1.3);
  }
  const k3 = txt(s3, "kick slab", "جایزه بزرگ"); RP.fit(k3, 520, 120); put(k3, W / 2, 420);
  tl.fromTo(k3, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power3.inOut" }, cut[2] + 0.05);
  const bike = el("div", { id: "bike" }, s3,
    `<svg viewBox="0 0 700 420" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g stroke="${K.rwYellow}" stroke-width="10"><circle cx="140" cy="310" r="92"/><circle cx="560" cy="310" r="92"/></g>
      <g stroke="rgba(255,210,31,.5)" stroke-width="4"><circle cx="140" cy="310" r="58"/><circle cx="560" cy="310" r="58"/></g>
      <g fill="${K.rwYellow}"><circle cx="140" cy="310" r="16"/><circle cx="560" cy="310" r="16"/></g>
      <path d="M140 310L215 160L255 120H300" stroke="#e8e8e8" stroke-width="14"/>
      <path d="M210 175Q260 110 360 120L470 150Q520 165 560 200L600 250L520 260L430 270L330 300L250 300Z" fill="${K.rwYellow}"/>
      <path d="M250 120L215 95L180 120L205 150Z" fill="#111" stroke="${K.rwYellow}" stroke-width="5"/>
      <path d="M380 135Q430 120 500 150L470 175Q420 160 380 165Z" fill="#111"/>
      <path d="M330 300L400 230L470 290" stroke="#111" stroke-width="12"/>
      <path d="M470 290L560 310" stroke="#cfcfcf" stroke-width="12"/>
      <path d="M520 255L640 250" stroke="#888" stroke-width="10"/>
      <circle cx="196" cy="128" r="10" fill="#fff"/></svg>`);
  put(bike, W / 2, 880);
  const bwPx = W * 0.86, bhPx = bwPx * 420 / 700, hx = bwPx * 196 / 700, hy = bhPx * 128 / 420;
  const beam = el("div", {}, bike);
  Object.assign(beam.style, { position: "absolute", left: hx - 760 + "px", top: hy - 190 + "px", width: "760px", height: "380px",
    clipPath: "polygon(0 0, 100% 46%, 100% 54%, 0 100%)", background: "linear-gradient(270deg, rgba(255,244,190,.6), rgba(255,210,31,0))" });
  const glare = el("div", { id: "glare" }, bike);
  gsap.set(glare, { left: hx - 130, top: hy - 130 });
  tl.fromTo(bike, { x: W * 1.15 }, { x: 0, duration: 0.55, ease: "power4.out" }, cut[2]);
  tl.to(bike, { x: -36, duration: 1.2, ease: "sine.inOut" }, cut[2] + 0.6);
  tl.fromTo(beam, { opacity: 0, scaleX: 0.3, transformOrigin: "100% 50%" }, { opacity: 1, scaleX: 1, duration: 0.35, ease: "power2.out" }, cut[2] + 0.45);
  tl.fromTo(glare, { scale: 0, opacity: 0 }, { keyframes: { scale: [0, 2.6, 1.1], opacity: [0, 1, 0.85] }, duration: 0.6, ease: "none" }, cut[2] + 0.45);
  const t3 = txt(s3, "hero", "موتورسیکلت"); RP.fit(t3, S.w, 230); RP.x3d(t3, DEEP, 10, 0.6, 0.9); put(t3, W / 2, 1235);
  tl.fromTo(t3, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power4.out" }, cut[2] + 0.35);
  const u3 = txt(s3, "sub", "قرعه‌کشی بین بازیکن‌های رویالی"); RP.fit(u3, S.w * 0.92, 72, 50); put(u3, W / 2, 1390);
  tl.fromTo(u3, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, cut[2] + 0.6);

  /* ---------------- bar 4 — game: title ladder lights up on each beat */
  const s4 = RP.scene(tl, cut[3], cut[4]);
  const t4 = txt(s4, "hero", "بازی رویالی"); RP.fit(t4, S.w, 250); RP.x3d(t4, DEEP, 10, 0.6, 0.9); put(t4, W / 2, 450);
  tl.fromTo(t4, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "expo.out" }, cut[3]);
  const names = ["مهمان", "شوالیه", "شاهزاده", "پادشاه هفته"], ys = [1265, 1120, 975, 830];
  const crown = el("div", { id: "crown" }, s4,
    `<svg viewBox="0 0 120 90"><path d="M8 78L14 22L40 48L60 8L80 48L106 22L112 78Z" fill="${K.rwYellow}" stroke="#111" stroke-width="5" stroke-linejoin="round"/>
     <rect x="8" y="72" width="104" height="14" rx="4" fill="${K.rwYellow}" stroke="#111" stroke-width="5"/><circle cx="60" cy="54" r="7" fill="#111"/></svg>`);
  names.forEach((n, i) => {
    const rg = el("div", { class: "rung" }, s4, `<b>${n}</b><small>LEVEL ${i + 1}</small>`); put(rg, W / 2, ys[i]);
    const lit = el("div", { class: "lit" }, rg, `<b>${n}</b><small>LEVEL ${i + 1}</small>`);
    gsap.set(lit, { autoAlpha: 0 });
    tl.fromTo(rg, { x: i % 2 ? 140 : -140, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 }, cut[3] + 0.04 + i * 0.05);
    tl.set(lit, { autoAlpha: 1 }, cut[3] + B * i);
    RP.punch(tl, rg, cut[3] + B * i, 0.07);
  });
  put(crown, W / 2 + 300, ys[0] - 64); gsap.set(crown, { rotation: 16 });
  tl.fromTo(crown, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(2.5)" }, cut[3] + 0.05);
  for (let i = 1; i < 4; i++) tl.to(crown, { y: ys[i] - ys[0], duration: 0.24, ease: "back.out(2)" }, cut[3] + B * i);
  const u4 = txt(s4, "sub", "QR رو اسکن کن · امتیاز بگیر · رویالی شو"); RP.fit(u4, S.w, 70, 46); put(u4, W / 2, 1405);
  tl.fromTo(u4, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, cut[3] + 0.4);

  /* ---------------- bar 5 — drum nights: neon + rings on every hit */
  const s5 = RP.scene(tl, cut[4], cut[5]);
  const fl = el("div", { id: "flash" }, s5);
  const t5 = txt(s5, "hero neon", "شب‌های رویالی"); RP.fit(t5, S.w, 230); put(t5, W / 2, 450);
  tl.fromTo(t5, { opacity: 0 }, { keyframes: { opacity: [0, 1, 0.15, 1, 0.45, 1] }, duration: 0.5, ease: "none" }, cut[4]);
  const rings = [0, 1, 2, 3].map(() => { const g = el("div", { class: "ring" }, s5); gsap.set(g, { width: 420, height: 420, left: W / 2 - 210, top: 860 - 210, opacity: 0 }); return g; });
  const drum = el("div", {}, s5,
    `<svg viewBox="0 -14 200 190" style="width:100%;display:block"><path d="M20 40V125A80 24 0 0 0 180 125V40" fill="#141414" stroke="#FFD21F" stroke-width="5"/>
     <path d="M20 62L50 128L80 66L110 131L140 66L170 128" stroke="#FFD21F" stroke-width="4" fill="none"/>
     <ellipse cx="100" cy="40" rx="80" ry="24" fill="#FFF4B8" stroke="#FFD21F" stroke-width="5"/>
     <line x1="38" y1="-10" x2="92" y2="34" stroke="#eee" stroke-width="7" stroke-linecap="round"/>
     <line x1="162" y1="-10" x2="108" y2="34" stroke="#eee" stroke-width="7" stroke-linecap="round"/></svg>`);
  drum.style.position = "absolute"; drum.style.width = "380px"; put(drum, W / 2, 920);
  tl.fromTo(drum, { y: 220, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, cut[4]);
  for (let i = 0; i < 4; i++) {
    const t = cut[4] + B * i;
    tl.fromTo(fl, { opacity: 0.2 }, { opacity: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, t);
    tl.fromTo(rings[i], { scale: 0.35, opacity: 0.9 }, { scale: 2.5, opacity: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, t);
    RP.punch(tl, drum, t, 0.09, 0.28);
  }
  const t5b = txt(s5, "hero white", "اجرای زنده طبل"); RP.fit(t5b, 700, 150); put(t5b, W / 2, 1250);
  tl.fromTo(t5b, { y: 70, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power4.out" }, cut[4] + 0.25);
  const u5 = txt(s5, "sub", "در شب‌های رویال ویک"); RP.fit(u5, 600, 70, 50); put(u5, W / 2, 1390);
  tl.fromTo(u5, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, cut[4] + 0.45);

  /* ---------------- bar 6 — Friday: «این جمعه رویالیه» + rolling calendar 3→6 */
  const s6 = RP.scene(tl, cut[5], cut[6]);
  const l1 = txt(s6, "kick", "این جمعه"); RP.fit(l1, 600, 170); put(l1, W / 2, 410);
  const l2 = txt(s6, "hero", "رویالیه"); RP.fit(l2, S.w, 300); RP.x3d(l2, DEEP, 12, 0.6, 0.9); put(l2, W / 2, 640);
  tl.fromTo(l1, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3 }, cut[5]);
  tl.fromTo(l2, { scale: 1.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "expo.out" }, cut[5] + 0.12);
  const cal = el("div", { id: "cal" }, s6, `<div class="top">آذر</div>`);
  put(cal, W / 2, 1075);
  const creel = el("div", { class: "reel" }, cal);
  Object.assign(creel.style, { left: 0, right: 0, top: "120px", height: "350px" });
  const cstrip = el("div", { class: "strip" }, creel);
  ["۳", "۴", "۵", "۶"].forEach((n) => {
    const d = el("div", { class: "hero" }, cstrip, n);
    Object.assign(d.style, { color: K.rwBlack, fontSize: "300px", height: "350px", lineHeight: "350px" });
  });
  tl.fromTo(cal, { rotationX: -90, transformPerspective: 1400, transformOrigin: "50% 0%", opacity: 0 }, { rotationX: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, cut[5] + 0.1);
  tl.fromTo(cstrip, { y: 0 }, { y: -3 * 350, duration: 0.8, ease: "power3.inOut" }, cut[5] + 0.45);
  RP.punch(tl, cal, cut[5] + 1.25, 0.06);
  const u6 = txt(s6, "sub", "جمعه ۶ آذر · پیشنهادهای ویژه شب جمعه"); RP.fit(u6, S.w, 70, 48); put(u6, W / 2, 1400);
  tl.fromTo(u6, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }, cut[5] + 0.5);
  tl.fromTo(s6, { x: 0 }, { keyframes: { x: [0, -5, 5, -8, 8, -12, 12, -7, 0] }, duration: 0.75, ease: "none", immediateRender: false }, cut[6] - 0.8);

  /* ---------------- bars 7–8 — end card (vertical-first, every line readable) */
  const s7 = RP.scene(tl, cut[6], null);
  const e1 = RP.tape(s7, "رویال ویک • این هفته رویالیه •"); gsap.set(e1.el, { top: 285, rotation: -5 });
  const e2 = RP.tape(s7, "این جمعه رویالیه • رویال ویک •", { dark: true }); gsap.set(e2.el, { top: 1545, rotation: 5 });
  const rest = D - cut[6];
  tl.fromTo(e1.el, { x: W * 1.2 }, { x: 0, duration: 0.35, ease: "power4.out" }, cut[6]);
  tl.fromTo(e2.el, { x: -W * 1.2 }, { x: 0, duration: 0.35, ease: "power4.out" }, cut[6] + 0.06);
  tl.fromTo(e1.inner, { x: -560 }, { x: 0, duration: rest, ease: "none" }, cut[6]);
  tl.fromTo(e2.inner, { x: 0 }, { x: -560, duration: rest, ease: "none" }, cut[6]);
  const badge = el("div", { class: "c" }, s7);
  RP.logo({ parent: badge, outerStroke: K.rwYellow, outerWidth: 1.6, innerFill: K.rwBlack, innerStroke: K.rwYellow, innerWidth: 0.6, mono: K.rwYellow, monoWidth: 2, height: 150 });
  put(badge, W / 2, 500);
  const et = txt(s7, "hero", T.rwName); RP.fit(et, S.w, 290); RP.x3d(et, DEEP, 13, 0.65, 0.95); put(et, W / 2, 720);
  const en = txt(s7, "", T.rwEn); Object.assign(en.style, { fontFamily: "var(--en)", color: "#fff", fontSize: "50px", letterSpacing: ".45em", paddingLeft: ".45em" }); put(en, W / 2, 885);
  const ed = txt(s7, "kick slab", T.rwStart); RP.fit(ed, 640, 160); put(ed, W / 2, 1030);
  const ename = txt(s7, "kick", T.faName); RP.fit(ename, 680, 84); put(ename, W / 2, 1180);
  const ead = txt(s7, "sub", T.address); RP.fit(ead, 780, 56, 40); ead.style.opacity = 0.8; put(ead, W / 2, 1255);
  const links = txt(s7, "", ""); Object.assign(links.style, { display: "flex", gap: "22px", direction: "ltr" });
  const c1 = el("div", { class: "chip site" }, links, T.rwSite);
  const c2 = el("div", { class: "chip ig" }, links,
    `<svg viewBox="0 0 24 24" fill="none" stroke="${K.rwYellow}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="${K.rwYellow}" stroke="none"/></svg><span>${T.ig}</span>`);
  put(links, W / 2, 1375);
  const t0 = cut[6];
  tl.fromTo(et, { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "expo.out" }, t0);
  tl.fromTo(badge, { y: -90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(2)" }, t0 + 0.08);
  tl.fromTo(en, { scaleX: 1.5, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.6 }, t0 + 0.25);
  tl.fromTo(ed, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power3.inOut", transformOrigin: "100% 50%" }, t0 + 0.4);
  tl.fromTo([ename, ead], { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, stagger: 0.1 }, t0 + 0.6);
  tl.fromTo([c1, c2], { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)", stagger: 0.12 }, t0 + 0.95);
  tl.fromTo(et, { scale: 1 }, { scale: 1.035, duration: D - t0 - 0.6, ease: "sine.inOut", immediateRender: false }, t0 + 0.6);
  RP.punch(tl, ed, t0 + B * 4, 0.05);
  // confetti burst
  const cols = [K.rwYellow, "#ffffff", K.rwAmber];
  for (let i = 0; i < 38; i++) {
    const c = el("div", { class: "conf" }, s7);
    c.style.background = cols[i % 3];
    const x = r() * W, d = 2.2 + r() * 1.4;
    gsap.set(c, { left: x, top: -60, rotation: r() * 360 });
    tl.fromTo(c, { y: 0, x: 0, rotation: r() * 360 }, { y: H + 140, x: (r() - 0.5) * 260, rotation: "+=" + (360 + r() * 540), duration: d, ease: "power1.in" }, t0 + r() * 0.35);
  }
  // light sweep across the card
  const sw = el("div", {}, s7);
  Object.assign(sw.style, { position: "absolute", top: "-20%", height: "140%", width: "220px", left: 0, zIndex: 60,
    background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.22), rgba(255,255,255,0))" });
  gsap.set(sw, { rotation: 14 });
  tl.fromTo(sw, { x: -400 }, { x: W + 400, duration: 0.9, ease: "power2.inOut" }, t0 + 2.1);
  const wf = el("div", { id: "flash" }, s7); wf.style.background = "#fff"; wf.style.zIndex = 70;
  tl.fromTo(wf, { opacity: 0.85 }, { opacity: 0, duration: 0.35, ease: "power2.out", immediateRender: false }, t0);

  /* ---------------- cut transitions (cover each hard cut on the downbeat) */
  [1, 2, 3, 4, 5].forEach((i) => RP.shutter(tl, cut[i], i % 2 ? "var(--y)" : "var(--k)"));
});
