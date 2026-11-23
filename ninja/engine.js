/* Ninja Home Kitchen (Royal Pars, ground floor unit 4) — product motion engine.
   One data row (RP.params) -> one composition. Styles:
   J1 hero drop-in · J2 feature callouts · J3 big-SALE poster card · J4 product grid · J5 carousel promo · J6 landscape loop · K brand reveal
   Product images are the brand's own (assets/img/ninja/<MODEL>/..., fetched by scripts/ninja_fetch.py); logo cut-outs live in assets/img/ninja/logo/. */
RP.run(function (tl, RP) {
  const S = RP.params, W = RP.W, H = RP.H, D = RP.duration;
  const sc = RP.$("#scene");
  const RED = "#AE1B21", RED2 = "#E8262B", INK = "#231F20", Y = "#FFD21F";
  const r = RP.rng((S.id || "x").split("").reduce((a, c) => a + c.charCodeAt(0), 11));
  const IMG = (p) => "../assets/img/ninja/" + p;
  const LOGO = (white) => IMG("logo/ninja-home-kitchen-wordmark-" + (white ? "white" : "black") + ".png");

  /* ---------- builders ---------- */
  const el = (tag, cls, parent, html, style) => { const e = RP.el(tag, cls ? { class: cls } : {}, parent, html); if (style) Object.assign(e.style, style); return e; };
  const layer = (style) => el("div", null, sc, null, Object.assign({ position: "absolute", inset: 0 }, style || {}));
  const img = (parent, src, style) => { const i = el("img", null, parent, null, style); i.src = src; return i; };
  const FA = "var(--fa-body)";
  const txt = (parent, text, o) => {
    o = o || {};
    return el("div", null, parent, text, Object.assign({ fontFamily: o.display ? "var(--fa)" : FA, fontWeight: 700, direction: o.ltr ? "ltr" : "rtl", whiteSpace: "nowrap",
      lineHeight: 1.2, textAlign: o.align || "center", color: o.color || INK, fontSize: (o.size || 48) + "px" }, o.style || {}));
  };
  const grain = (op) => { const g = RP.grain(sc, 17, op == null ? 0.04 : op); g.style.position = "absolute"; g.style.inset = "-10%"; g.style.zIndex = 55; g.style.pointerEvents = "none"; RP.grainSteps(tl, g, D); };

  /* product box: image bottom-aligned inside a fixed box (no dependence on natural size) + soft ground shadow */
  function product(src, x, y, w, h, o) {
    o = o || {};
    const box = el("div", null, sc, null, { position: "absolute", left: x + "px", top: y + "px", width: w + "px", height: h + "px", zIndex: o.z || 20 });
    const sh = el("div", null, sc, null, { position: "absolute", left: x + w * 0.12 + "px", top: y + h - 16 + "px", width: w * 0.76 + "px", height: Math.max(24, h * 0.06) + "px",
      borderRadius: "50%", background: o.shadow || "radial-gradient(ellipse, rgba(0,0,0,.42), rgba(0,0,0,0) 70%)", zIndex: (o.z || 20) - 1 });
    const im = img(box, src, { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", objectPosition: "50% 100%" });
    return { box, sh, im };
  }

  /* ---------- palettes ---------- */
  const PAL = {
    white: { bg: "#ffffff", ink: INK, sub: "#555", acc: RED, dark: false },
    red: { bg: "#ffffff", ink: INK, sub: "#555", acc: RED, dark: false },
    dark: { bg: "radial-gradient(ellipse at 50% 42%, #3a0d10 0%, #0c0c0c 66%)", ink: "#ffffff", sub: "rgba(255,255,255,.72)", acc: RED2, dark: true },
    ry: { bg: "radial-gradient(ellipse at 50% 40%, #1d1a0c 0%, #070707 62%)", ink: "#ffffff", sub: "rgba(255,255,255,.75)", acc: Y, dark: true },
  };
  const P = PAL[S.theme || "white"];

  /* ---------- frame: top (logo + pill) and footer ---------- */
  function frame(o) {
    o = o || {};
    const top = el("div", null, sc, null, { position: "absolute", top: "232px", left: "70px", right: "70px", height: "110px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 60 });
    img(top, LOGO(P.dark), { height: "104px" });
    const accTxt = P.acc === Y ? INK : "#fff";
    el("div", null, top, S.pill || "همکف — واحد ۴", { fontFamily: FA, fontWeight: 700, fontSize: "34px", padding: "6px 28px 12px", borderRadius: "40px", background: P.acc, color: accTxt, direction: "rtl", whiteSpace: "nowrap", border: "6px solid " + (P.dark ? "#0c0c0c" : "#fff") });
    tl.fromTo(top, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.45 }, 0.05);
    if (o.noFoot) return;
    const foot = el("div", null, sc, null, { position: "absolute", left: "60px", right: "60px", top: "1430px", textAlign: "center", zIndex: 60, direction: "rtl" });
    txt(foot, S.foot1 || "نینجا هوم — مرکز خرید رویال پارس", { display: true, size: 44, color: P.ink });
    txt(foot, S.foot2 || "همکف، واحد ۴ | کیان‌پارس، بلوار چمران", { size: 34, color: P.sub, style: { marginTop: "6px", fontWeight: 400 } });
    tl.fromTo(foot, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, Math.min(1.2, D - 2));
  }
  const bg = () => layer({ background: P.bg, zIndex: 0 });
  const wave = (target, t, amt) => tl.fromTo(target, { rotation: -amt }, { rotation: amt, duration: Math.max(1, D - t), ease: "sine.inOut", immediateRender: false }, t);

  /* giant cropped poster letters (Ninja Home poster look); scaleX squeezes Vazirmatn into a condensed face */
  const giant = (text, o) => {
    const g = el("div", null, sc, text, Object.assign({ position: "absolute", fontFamily: FA, fontWeight: 700, whiteSpace: "nowrap", direction: "ltr", lineHeight: 0.8,
      color: o.color || RED, fontSize: o.size + "px", WebkitTextStroke: (o.stroke || 16) + "px " + (o.color || RED), zIndex: o.z || 5, transformOrigin: "100% 0%",
      transform: `scale(${o.sx || 0.72}, ${o.sy || 1.25})` }, o.style || {}));
    return g;
  };

  const STYLES = {
    /* J1 hero drop-in on white, with the model code as giant cropped type behind */
    J1() {
      bg();
      const g = giant((S.code || "NINJA"), { size: 430, right: 0, color: "rgba(174,27,33,.95)", stroke: 10, sx: 0.8, sy: 1.5, style: { right: "-40px", top: "300px" } });
      tl.fromTo(g, { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.7, ease: "power4.out" }, 0.1);
      const pr = product(IMG(S.hero), 110, 520, 860, 700, { z: 20 });
      tl.fromTo(pr.box, { y: -900, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "bounce.out" }, 0.25);
      tl.fromTo(pr.sh, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, 0.75);
      tl.fromTo(pr.box, { rotation: -1.5 }, { rotation: 1.5, duration: D - 1.5, ease: "sine.inOut", immediateRender: false }, 1.2);
      const b = txt(sc, S.title || "", { display: true, size: 62, color: INK, style: { position: "absolute", left: "60px", right: "60px", top: "1236px", zIndex: 30 } });
      RP.fit(b, 960, 150, 66);
      const code = el("div", null, sc, "NINJA " + (S.code || ""), { position: "absolute", left: "60px", right: "60px", top: "1330px", textAlign: "center", zIndex: 30, fontFamily: "var(--en)", letterSpacing: ".18em",
        fontSize: "34px", color: RED, direction: "ltr" });
      tl.fromTo([b, code], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12 }, 1.1);
      frame();
      grain(0.03);
    },
    /* J2 feature callouts on dark */
    J2() {
      bg();
      const ring = el("div", null, sc, null, { position: "absolute", left: "140px", top: "560px", width: "800px", height: "800px", borderRadius: "50%", zIndex: 2,
        background: "radial-gradient(circle, rgba(174,27,33,.5), rgba(174,27,33,0) 66%)" });
      tl.fromTo(ring, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 1 }, 0.1);
      const t = txt(sc, S.title || "", { display: true, size: 60, color: "#fff", style: { position: "absolute", left: "60px", right: "60px", top: "380px", zIndex: 30 } });
      RP.fit(t, 960, 150, 64);
      tl.fromTo(t, { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.5 }, 0.2);
      const pr = product(IMG(S.hero), 190, 620, 700, 620, { z: 20, shadow: "radial-gradient(ellipse, rgba(0,0,0,.6), rgba(0,0,0,0) 70%)" });
      tl.fromTo(pr.box, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, 0.3);
      tl.fromTo(pr.sh, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.6);
      wave(pr.box, 1.2, 2);
      const feats = (S.feat || []).slice(0, 3);
      const pos = [{ x: 560, y: 470, side: "r" }, { x: 70, y: 780, side: "l" }, { x: 560, y: 1090, side: "r" }];
      const svg = RP.svgEl("svg", { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, sc); svg.style.cssText = "position:absolute;inset:0;z-index:25;pointer-events:none";
      feats.forEach((f, i) => {
        const p = pos[i], t0 = 1.1 + i * 0.9;
        const chip = el("div", null, sc, null, { position: "absolute", left: p.x + "px", top: p.y + "px", width: "450px", height: "120px", borderRadius: "60px", zIndex: 30, background: "#fff",
          display: "flex", alignItems: "center", direction: "rtl", padding: "0 20px", gap: "18px", boxShadow: "0 18px 40px rgba(0,0,0,.45)" });
        el("div", null, chip, RP.faNum(i + 1), { width: "76px", height: "76px", borderRadius: "50%", background: RED, color: "#fff", fontFamily: FA, fontWeight: 700, fontSize: "40px", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" });
        const tx = txt(chip, f, { size: 38, color: INK, align: "right", style: { flex: 1, minWidth: 0 } });
        RP.fit(tx, 290, 80, 40);
        const ex = p.side === "r" ? p.x : p.x + 450, ey = p.y + 60, tx2 = 540 + (p.side === "r" ? 120 : -120), ty2 = 940 + (i - 1) * 90;
        const path = RP.svgEl("path", { d: `M${ex} ${ey} L${(ex + tx2) / 2} ${ey} L${tx2} ${ty2}`, fill: "none", stroke: RED2, "stroke-width": 5, "stroke-linecap": "round" }, svg);
        const dot = RP.svgEl("circle", { cx: tx2, cy: ty2, r: 11, fill: RED2 }, svg);
        const len = 600; path.style.strokeDasharray = len; path.style.strokeDashoffset = len;
        tl.fromTo(chip, { scale: 0.3, opacity: 0, transformOrigin: p.side === "r" ? "0% 50%" : "100% 50%" }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" }, t0);
        tl.to(path, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, t0 + 0.15);
        tl.fromTo(dot, { opacity: 0, scale: 0, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.3 }, t0 + 0.55);
      });
      const code = el("div", null, sc, "NINJA " + (S.code || ""), { position: "absolute", left: 0, right: 0, top: "1300px", textAlign: "center", fontFamily: "var(--en)", letterSpacing: ".2em", fontSize: "34px", color: RED2, direction: "ltr", zIndex: 30 });
      tl.fromTo(code, { opacity: 0 }, { opacity: 1, duration: 0.5 }, D - 3);
      frame();
      grain(0.05);
    },
    /* J3 big-SALE poster card (white page, giant red cropped letters, black label + red box) */
    J3() {
      bg();
      const a = giant("sa", { size: 620, color: RED, style: { right: "-20px", top: "-60px" } });
      const b = giant("le", { size: 620, color: RED, style: { right: "-20px", top: "600px" } });
      tl.fromTo(a, { xPercent: 60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.55, ease: "power4.out" }, 0.1);
      tl.fromTo(b, { xPercent: 60, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.55, ease: "power4.out" }, 0.3);
      const pr = product(IMG(S.hero), 40, 440, 640, 560, { z: 20 });
      tl.fromTo(pr.box, { y: 120, scale: 0.7, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.5)" }, 0.55);
      tl.fromTo(pr.sh, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.0);
      const lab = el("div", null, sc, null, { position: "absolute", left: "70px", top: "1040px", zIndex: 30, textAlign: "left", direction: "ltr" });
      const l1 = el("div", null, lab, "BLACK<br>FRIDAY", { fontFamily: FA, fontWeight: 700, fontSize: "76px", lineHeight: 0.98, color: INK, WebkitTextStroke: "2px " + INK });
      const box = el("div", null, lab, S.box || "پیش‌خرید رویالی", { display: "inline-block", background: RED, color: "#fff", fontFamily: FA, fontWeight: 700, fontSize: "58px", padding: "0 26px 14px", marginTop: "14px", direction: "rtl", whiteSpace: "nowrap" });
      const l3 = el("div", null, lab, "NINJA " + (S.code || ""), { fontFamily: "var(--en)", fontSize: "30px", letterSpacing: ".18em", color: INK, marginTop: "16px" });
      tl.fromTo(l1, { opacity: 0, x: -60 }, { opacity: 1, x: 0, duration: 0.5 }, 1.0);
      tl.fromTo(box, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, 1.25);
      tl.fromTo(l3, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 1.6);
      frame();
    },
    /* J4 product grid (category roundup / gift guide) */
    J4() {
      bg();
      const t = txt(sc, S.title || "", { display: true, size: 64, color: P.ink, style: { position: "absolute", left: "60px", right: "60px", top: "380px", zIndex: 30 } });
      RP.fit(t, 960, 120, 70);
      tl.fromTo(t, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.5 }, 0.15);
      const items = S.items || [], n = items.length, cols = n <= 4 ? 2 : 3, rows = Math.ceil(n / cols), gap = 22;
      const top0 = 500, area = 880, tw = Math.floor((940 - gap * (cols - 1)) / cols), th = Math.floor((area - gap * (rows - 1)) / rows);
      items.forEach((it, i) => {
        const rr = Math.floor(i / cols), cc = i % cols, inRow = rr === rows - 1 ? n - rr * cols : cols;
        const x = 70 + (940 - (inRow * tw + (inRow - 1) * gap)) / 2 + cc * (tw + gap), y = top0 + rr * (th + gap);
        const tile = el("div", null, sc, null, { position: "absolute", left: x + "px", top: y + "px", width: tw + "px", height: th + "px", borderRadius: "28px", zIndex: 20,
          background: P.dark ? "rgba(255,255,255,.1)" : "#f4f4f4", border: P.dark ? "2px solid rgba(255,255,255,.16)" : "2px solid #e6e6e6", overflow: "hidden" });
        img(tile, IMG(it.hero), { position: "absolute", left: "6%", top: "5%", width: "88%", height: "72%", objectFit: "contain", objectPosition: "50% 100%" });
        txt(tile, it.code, { ltr: true, size: 34, color: RED2, style: { position: "absolute", left: 0, right: 0, bottom: "20px", fontFamily: "var(--en)", letterSpacing: ".14em" } });
        tl.fromTo(tile, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)" }, 0.5 + i * 0.22);
      });
      frame();
      grain(0.03);
    },
    /* J5 vertical carousel promo: one product at a time, headline stays */
    J5() {
      bg();
      const a = giant("sa", { size: 470, color: P.dark ? "rgba(232,38,43,.32)" : "rgba(174,27,33,.16)", stroke: 10, style: { right: "-70px", top: "260px" } });
      const b = giant("le", { size: 470, color: P.dark ? "rgba(232,38,43,.32)" : "rgba(174,27,33,.16)", stroke: 10, style: { right: "-70px", top: "700px" } });
      tl.fromTo([a, b], { opacity: 0, xPercent: 30 }, { opacity: 1, xPercent: 0, duration: 0.7, stagger: 0.15 }, 0.1);
      const items = S.items || [], slot = (D - 3) / Math.max(1, items.length);
      items.forEach((it, i) => {
        const t0 = 0.6 + i * slot;
        const holder = el("div", null, sc, null, { position: "absolute", inset: 0, zIndex: 20 });
        const pr = product(IMG(it.hero), 160, 480, 760, 620, { z: 20 });
        holder.appendChild(pr.box); holder.appendChild(pr.sh);
        const nm = txt(holder, it.name, { display: true, size: 52, color: P.ink, style: { position: "absolute", left: "60px", right: "60px", top: "1140px" } });
        RP.fit(nm, 960, 130, 56);
        gsap.set(holder, { autoAlpha: 0 });
        tl.set(holder, { autoAlpha: 1 }, t0);
        tl.fromTo(holder, { xPercent: 40, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.45, ease: "power3.out", immediateRender: false }, t0);
        if (i < items.length - 1) tl.to(holder, { xPercent: -40, opacity: 0, duration: 0.35, ease: "power2.in" }, t0 + slot - 0.35);
      });
      const head = el("div", null, sc, S.box || "پیش‌خرید رویالی", { position: "absolute", left: "50%", top: "1290px", transform: "translateX(-50%)", zIndex: 30, background: P.acc, color: P.acc === Y ? INK : "#fff",
        fontFamily: FA, fontWeight: 700, fontSize: "58px", padding: "0 34px 14px", direction: "rtl", whiteSpace: "nowrap" });
      tl.fromTo(head, { scale: 0.3, opacity: 0, xPercent: -50 }, { scale: 1, opacity: 1, xPercent: -50, duration: 0.5, ease: "back.out(2)" }, 0.8);
      frame();
    },
    /* K brand reveal: wordmark + place */
    K() {
      const k = S.k || 1;
      if (k === 1) { layer({ background: RED, zIndex: 0 }); } else { bg(); }
      const onRed = k === 1;
      const g = giant("NINJA", { size: 380, color: onRed ? "rgba(255,255,255,.12)" : (P.dark ? "rgba(232,38,43,.35)" : "rgba(174,27,33,.12)"), stroke: 8, sx: 0.8, sy: 1.4, style: { right: "-30px", top: "520px" } });
      tl.fromTo(g, { xPercent: 30, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.8 }, 0.1);
      const wm = img(sc, LOGO(onRed || P.dark), { position: "absolute", left: "190px", top: "480px", width: "700px", zIndex: 20 });
      tl.fromTo(wm, { scale: 1.5, opacity: 0, filter: "blur(18px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "expo.out" }, 0.3);
      const ink = onRed || P.dark ? "#fff" : INK;
      const l1 = txt(sc, S.l1 || "غرفه‌ی نینجا هوم", { display: true, size: 70, color: ink, style: { position: "absolute", left: "60px", right: "60px", top: "1180px", zIndex: 30 } });
      RP.fit(l1, 960, 120, 74);
      const l2 = txt(sc, S.l2 || "همکف، واحد ۴ — مرکز خرید رویال پارس", { size: 42, color: onRed ? "rgba(255,255,255,.9)" : P.sub, style: { position: "absolute", left: "60px", right: "60px", top: "1280px", zIndex: 30 } });
      tl.fromTo([l1, l2], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.14 }, 1.0);
      frame({ noFoot: true });
      grain(0.04);
    },
    /* J6 landscape loop (TV / LED): product carousel with wordmark, silent */
    J6() {
      layer({ background: P.bg });
      const items = S.items || [], slot = (D - 1) / Math.max(1, items.length);
      const wm = img(sc, LOGO(P.dark), { position: "absolute", left: "80px", top: "70px", height: "150px", zIndex: 40 });
      tl.fromTo(wm, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.6 }, 0.1);
      const tag = txt(sc, S.title || "نینجا هوم — رویال پارس", { display: true, size: 56, color: P.ink, align: "left", style: { position: "absolute", left: "80px", bottom: "150px", zIndex: 40, direction: "rtl" } });
      const tag2 = txt(sc, "همکف، واحد ۴", { size: 40, color: P.sub, align: "left", style: { position: "absolute", left: "80px", bottom: "90px", zIndex: 40 } });
      items.forEach((it, i) => {
        const t0 = 0.4 + i * slot;
        const holder = el("div", null, sc, null, { position: "absolute", inset: 0, zIndex: 20 });
        const pr = product(IMG(it.hero), 760, 130, 1000, 760, { z: 20 });
        holder.appendChild(pr.box); holder.appendChild(pr.sh);
        const nm = txt(holder, it.name, { display: true, size: 54, color: P.ink, style: { position: "absolute", left: "760px", width: "1000px", top: "900px" } });
        RP.fit(nm, 980, 110, 58);
        const cd = el("div", null, holder, "NINJA " + it.code, { position: "absolute", left: "760px", width: "1000px", top: "990px", textAlign: "center", fontFamily: "var(--en)", letterSpacing: ".2em", fontSize: "34px", color: RED2, direction: "ltr" });
        gsap.set(holder, { autoAlpha: 0 });
        tl.set(holder, { autoAlpha: 1 }, t0);
        tl.fromTo(holder, { x: 120, opacity: 0, scale: 0.94 }, { x: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.out", immediateRender: false }, t0);
        if (i < items.length - 1) tl.to(holder, { x: -120, opacity: 0, duration: 0.4, ease: "power2.in" }, t0 + slot - 0.4);
      });
      grain(0.03);
    },
  };
  (STYLES[S.style] || STYLES.J1)();
});
