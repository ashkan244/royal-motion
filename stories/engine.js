/* Royal Week story engine: one data row (RP.params) -> one 1080x1920 story.
   12 styles share a frame (top tag + date pill, bottom CTA) so the 100 stories read as one family. */
RP.run(function (tl, RP) {
  const S = RP.params, W = RP.W, H = RP.H, D = RP.duration, K = RP.K, T = RP.T;
  const sc = RP.$("#scene");
  const Y = "#FFD21F", BK = "#0A0A0A", RED = "#E8262B";
  const ACC = S.red ? RED : Y;
  const Y0 = 360, Y1 = S.sticker ? 1200 : 1340;            // content band (sticker slot keeps 1250..1500 free)
  const r = RP.rng((S.id || "x").split("").reduce((a, c) => a + c.charCodeAt(0), 7));

  /* ---------- builders ---------- */
  const fixTa = (h) => (typeof h === "string" && h.indexOf("<") < 0 ? h.replace(/(^|\s)تا(?=\s|$)/g, '$1<span class="ta">تا</span>') : h);
  const el = (tag, cls, parent, html, style) => { const e = RP.el(tag, cls ? { class: cls } : {}, parent, fixTa(html)); if (style) Object.assign(e.style, style); return e; };
  const layer = (style) => el("div", "st-layer", sc, null, style || {});
  const wordsOf = (line) => {            // supports [[keyword]] (may span words) and keeps «تا» in Vazirmatn
    const out = []; let key = false;
    line.split(" ").filter(Boolean).forEach((w) => {
      let k = key;
      if (w.startsWith("[[")) { k = true; w = w.slice(2); key = true; }
      if (w.endsWith("]]")) { w = w.slice(0, -2); key = false; }
      out.push({ w, k });
    });
    return out;
  };
  /* multi-line title, each line fitted to maxW; uniform size = smallest fit (capped by maxPx) */
  function title(parent, text, o) {
    o = o || {};
    const box = el("div", "st-title", parent);
    const lines = String(text).split("|"), words = [], keys = [];
    const lineEls = lines.map((ln) => {
      const d = el("div", "st-ln", box, null, { color: o.color || "#fff" });
      wordsOf(ln).forEach((t, i, arr) => {
        const w = el("span", "w", d); const wi = el("span", "wi" + (t.w === "تا" ? " ta" : ""), w, t.w);
        if (t.k) { wi.style.color = o.key || ACC; keys.push(wi); }
        words.push(wi);
        if (i < arr.length - 1) d.appendChild(document.createTextNode(" "));
      });
      return d;
    });
    let px = o.maxPx || 170;
    lineEls.forEach((d) => { const f = RP.fit(d, o.maxW || 880, null, o.maxPx || 170); px = Math.min(px, f); });
    lineEls.forEach((d) => (d.style.fontSize = px + "px"));
    return { box, words, keys, lines: lineEls, px };
  }
  function big(parent, text, o) {
    o = o || {};
    const d = el("div", "st-big", parent, text, { color: o.color || ACC });
    RP.fit(d, o.maxW || 900, o.maxH || 520, o.maxPx || 440);
    return d;
  }
  /* the shared column of kicker / big / title / sub / chips */
  function stack(o) {
    o = o || {};
    const top = o.top != null ? o.top : Y0, bot = o.bot != null ? o.bot : Y1;
    const c = el("div", "st-stack", sc, null, { top: top + "px", height: bot - top + "px", gap: (o.gap || 34) + "px" });
    const R = { c };
    if (S.kicker && !o.noKicker) R.kicker = el("div", "st-kicker", c, S.kicker, { color: o.kickerColor || ACC });
    if (S.big && !o.noBig) R.big = big(c, S.big, { color: o.bigColor, maxPx: o.bigPx, maxW: o.bigW });
    if (S.title && !o.noTitle) R.title = title(c, S.title, { color: o.titleColor, key: o.keyColor, maxPx: o.titlePx, maxW: o.titleW });
    if (S.sub && !o.noSub) R.sub = el("div", "st-sub", c, S.sub, { color: o.subColor || "rgba(255,255,255,.85)" });
    if (S.items && S.items.length && o.chips) {
      R.chips = el("div", "st-chips", c);
      R.chipEls = S.items.map((t) => el("div", "st-chip", R.chips, t, o.chipStyle || { background: ACC, color: BK }));
    }
    return R;
  }
  function fitStack(R) {
    if (!R || !R.c || R._fit) return; R._fit = 1;
    const kids = Array.from(R.c.children), gap = parseFloat(R.c.style.gap) || 0;
    const need = kids.reduce((a, k) => a + k.offsetHeight, 0) + gap * Math.max(0, kids.length - 1);
    const avail = R.c.offsetHeight;
    if (need > avail) R.c.style.zoom = (avail / need).toFixed(3);
  }
  /* standard entrances for a stack */
  function enter(R, t, o) {
    o = o || {};
    fitStack(R);
    if (R.kicker) tl.fromTo(R.kicker, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45 }, t);
    if (R.big) tl.fromTo(R.big, o.bigFrom || { scale: 1.6, opacity: 0, filter: "blur(14px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.45, ease: "expo.out" }, t + 0.1);
    if (R.title) tl.fromTo(R.title.words, { yPercent: 120 }, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: o.stagger || 0.07 }, t + (R.big ? 0.4 : 0.15));
    if (R.sub) tl.fromTo(R.sub, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5 }, t + (R.big ? 0.85 : 0.6));
    if (R.chipEls) tl.fromTo(R.chipEls, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.08 }, t + 1.0);
    return t + 1.2;
  }
  const grain = (op) => { const g = RP.grain(sc, 17, op == null ? 0.05 : op); g.className = "st-grain"; RP.grainSteps(tl, g, D); return g; };
  const dustIn = (n, col, area) => {
    const a = area || { x0: 0, x1: W, y0: 300, y1: 1500 };
    for (let i = 0; i < n; i++) {
      const s = 5 + r() * 9;
      const p = el("i", null, sc, null, { position: "absolute", width: s + "px", height: s + "px", borderRadius: "50%", zIndex: 25,
        left: a.x0 + r() * (a.x1 - a.x0) + "px", top: a.y0 + r() * (a.y1 - a.y0) + "px", background: `radial-gradient(circle, #fff 0%, ${col || "#FFE58A"} 40%, rgba(255,210,31,0) 70%)` });
      tl.fromTo(p, { opacity: 0, y: 0 }, { opacity: 0.4 + r() * 0.6, y: -(40 + r() * 120), duration: D, ease: "none" }, 0);
    }
  };
  const shake = (t, a) => tl.fromTo(sc, { x: 0, y: 0 }, { keyframes: { x: [a, -a * 0.8, a * 0.5, -a * 0.2, 0], y: [-a * 0.6, a * 0.5, -a * 0.3, 0, 0] }, duration: 0.28, ease: "none", immediateRender: false }, t);
  const pushIn = (target, t, amt) => tl.fromTo(target, { scale: 1 }, { scale: 1 + (amt || 0.04), duration: Math.max(0.5, D - t), ease: "none", immediateRender: false }, t);
  const photo = (n) => `../assets/img/${(n || "p3").includes("/") ? n : "photos/" + (n || "p3")}.jpg`;

  /* ---------- frame: top tag + date pill, bottom CTA ---------- */
  function frame(dark) {
    const fg = dark ? "#fff" : BK;
    const top = el("div", "st-top", sc);
    el("div", "st-tag", top, S.tagEn || "ROYAL WEEK", { color: dark ? Y : BK });
    el("div", "st-pill", top, S.pill || T.rwStart, { background: dark ? ACC : BK, color: dark ? BK : Y });
    tl.fromTo(top, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.45 }, 0.05);
    if (S.sticker) return;
    const foot = el("div", "st-foot", sc);
    const lines = S.foot || ["مرکز خرید رویال پارس", "royalweek.ir"];
    const fs = lines.map((l, i) => el("div", /[a-z]/i.test(l) ? "lat" : "fa", foot, l, { color: i === 0 ? fg : (dark ? Y : BK), opacity: i ? 0.95 : 1 }));
    tl.fromTo(fs, { opacity: 0, y: 20 }, { opacity: (i) => (i ? 0.95 : 1), y: 0, duration: 0.5, stagger: 0.1 }, Math.min(1.4, D - 2));
    tl.fromTo(foot, { scale: 1 }, { keyframes: { scale: [1, 1.06, 1] }, duration: 0.45, ease: "none", immediateRender: false }, D - 2.0);
  }

  /* ---------- the 12 styles ---------- */
  const STYLES = {
    /* S1 dark spotlight */
    S1() {
      layer({ background: "#050505" });
      const cone = layer({ background: "radial-gradient(ellipse at 50% 0%, rgba(255,244,210,.62) 0%, rgba(255,220,130,.16) 42%, rgba(0,0,0,0) 72%)",
        clipPath: "polygon(44% 0, 56% 0, 96% 100%, 4% 100%)", transformOrigin: "50% 0%", zIndex: 5 });
      const pool = el("div", null, sc, null, { position: "absolute", left: "15%", width: "70%", top: "1180px", height: "160px", borderRadius: "50%", zIndex: 4,
        background: "radial-gradient(ellipse, rgba(255,226,150,.35), rgba(0,0,0,0) 70%)" });
      tl.fromTo(cone, { rotation: -28, opacity: 0 }, { rotation: 0, opacity: 1, duration: 0.9, ease: "power3.out" }, 0);
      tl.fromTo(cone, { opacity: 1 }, { keyframes: { opacity: [1, 0.55, 1, 0.8, 1] }, duration: 0.5, ease: "none", immediateRender: false }, 0.15);
      tl.fromTo(pool, { opacity: 0, scaleX: 0.4 }, { opacity: 1, scaleX: 1, duration: 0.8 }, 0.5);
      dustIn(34, "#FFE9A8", { x0: 260, x1: 820, y0: 300, y1: 1400 });
      const R = stack({ titleColor: "#fff", kickerColor: "#E9C46A" });
      if (R.big) R.big.style.textShadow = "0 0 60px rgba(255,210,31,.45)";
      enter(R, 0.45, { bigFrom: { scale: 1.12, opacity: 0, filter: "blur(22px)" } });
      pushIn(R.c, 1.5, 0.045);
      frame(true);
    },
    /* S2 adjective discount: full-bleed colour blocks cut on the beat, then the message */
    S2() {
      const seq = S.adj && S.adj.length ? S.adj : ["رویالی"];
      const cols = [[Y, BK], [BK, Y], [S.red ? RED : "#fff", BK]];
      const b = 0.47;
      seq.forEach((a, i) => {
        const [bg, fg] = cols[i % cols.length];
        const blk = layer({ background: bg, zIndex: 10 + i, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "10px" });
        el("div", "st-kicker", blk, S.adjLabel || "تخفیفِ", { color: fg, fontSize: "64px", opacity: 0.9 });
        const w = el("div", "st-big", blk, a, { color: fg });
        RP.fit(w, 900, 520, 330);
        gsap.set(blk, { autoAlpha: 0 });
        tl.set(blk, { autoAlpha: 1 }, i * b);
        tl.fromTo(blk, { xPercent: i % 2 ? -100 : 100 }, { xPercent: 0, duration: 0.14, ease: "power3.out", immediateRender: false }, i * b);
        tl.fromTo(w, { scale: 1.35 }, { scale: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, i * b);
        tl.set(blk, { autoAlpha: 0 }, (i + 1) * b + 0.02 + (i === seq.length - 1 ? 0.05 : 0));
      });
      const t0 = seq.length * b;
      layer({ background: Y, zIndex: 1 });
      layer({ zIndex: 2, backgroundImage: "radial-gradient(circle, rgba(0,0,0,.1) 28%, transparent 31%)", backgroundSize: "26px 26px" });
      const R = stack({ titleColor: BK, keyColor: S.red ? RED : "#fff", kickerColor: BK, bigColor: BK, subColor: "rgba(0,0,0,.8)", chips: true, chipStyle: { background: BK, color: Y } });
      R.c.style.zIndex = 5;
      R.keys = (R.title && R.title.keys) || [];
      R.keys.forEach((k) => (k.style.textShadow = `6px 6px 0 ${BK}`));
      enter(R, t0 + 0.05);
      tl.fromTo(R.c, { scale: 1.08 }, { scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, t0);
      frame(false);
    },
    /* S3 team type: white type, yellow keyword with white 3D offset, words slam on the beat */
    S3() {
      layer({ background: "radial-gradient(ellipse at 50% 45%, #1d1a0c 0%, #070707 60%)" });
      // faint outlined ROYAL WEEK columns drifting
      for (let i = 0; i < 2; i++) {
        const m = el("div", null, sc, "ROYAL WEEK · ROYAL WEEK · ROYAL WEEK", { position: "absolute", left: "-20%", top: (i ? 1560 : 160) + "px", whiteSpace: "nowrap",
          fontFamily: "var(--en-o)", fontSize: "120px", color: "rgba(255,210,31,.16)", zIndex: 2 });
        tl.fromTo(m, { x: i ? -300 : 0 }, { x: i ? 0 : -300, duration: D, ease: "none" }, 0);
      }
      const R = stack({ titleColor: "#fff", titlePx: 190, chips: true, chipStyle: { background: "transparent", color: Y, border: `3px solid ${Y}` } });
      (R.title ? R.title.keys : []).forEach((k) => (k.style.textShadow = "-9px 9px 0 #ffffff"));
      (R.title ? R.title.words : []).forEach((w) => (w.parentNode.style.overflow = "visible"));
      if (R.big) R.big.style.textShadow = "-12px 12px 0 #ffffff";
      if (R.kicker) tl.fromTo(R.kicker, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.4 }, 0.1);
      if (R.big) tl.fromTo(R.big, { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.22, ease: "power4.in" }, 0.2);
      if (R.title) R.title.words.forEach((w, i) => {
        const t = 0.3 + (R.big ? 0.35 : 0) + i * 0.235;
        tl.fromTo(w, { yPercent: 0, scale: 1.8, opacity: 0, rotation: (r() - 0.5) * 14 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.2, ease: "power4.in" }, t);
      });
      const tEnd = 0.3 + (R.big ? 0.35 : 0) + (R.title ? R.title.words.length * 0.235 : 0);
      shake(tEnd, 10);
      if (R.sub) tl.fromTo(R.sub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, tEnd + 0.1);
      if (R.chipEls) tl.fromTo(R.chipEls, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.08 }, tEnd + 0.3);
      grain(0.06);
      frame(true);
    },
    /* S4 Black Friday caution tape */
    S4() {
      layer({ background: "#070707" });
      const mk = (txt, y, rot, dir, d2) => {
        const t = el("div", null, sc, null, { position: "absolute", left: "-30%", width: "160%", top: y + "px", height: "96px", background: d2 ? BK : ACC, zIndex: 8,
          transform: `rotate(${rot}deg)`, boxShadow: "0 16px 30px rgba(0,0,0,.6)", overflow: "hidden", borderTop: `8px solid ${d2 ? ACC : BK}`, borderBottom: `8px solid ${d2 ? ACC : BK}` });
        const inner = el("div", null, t, (`<span>${txt}</span>`).repeat(12), { display: "flex", gap: "60px", whiteSpace: "nowrap", alignItems: "center", height: "100%",
          fontFamily: "var(--en)", fontSize: "44px", color: d2 ? ACC : BK, letterSpacing: ".12em" });
        tl.fromTo(t, { xPercent: dir * 70 }, { xPercent: 0, duration: 0.5, ease: "power3.out" }, 0.05 + (d2 ? 0.1 : 0));
        tl.fromTo(inner, { x: 0 }, { x: dir * -500, duration: D, ease: "none" }, 0);
      };
      mk(S.tape || "BLACK FRIDAY", 430, -7, 1, false);
      mk(S.tape2 || "ROYAL WEEK", 1200, 6, -1, true);
      const R = stack({ top: 560, bot: 1170, titleColor: "#fff", titlePx: 180, chips: true, chipStyle: { background: ACC, color: BK } });
      if (R.big) { R.big.style.color = BK; R.big.style.background = ACC; R.big.style.padding = "0 40px 20px"; R.big.style.transform = "rotate(-3deg)"; R.big.style.borderRadius = "18px"; }
      const t1 = enter(R, 0.45, { bigFrom: { scale: 2.4, opacity: 0, rotation: -8 } });
      shake(0.62, 14);
      if (S.red) for (let t = 1.2; t < D - 0.4; t += 0.5) tl.fromTo(R.c, { opacity: 1 }, { keyframes: { opacity: [1, 0.75, 1] }, duration: 0.18, ease: "none", immediateRender: false }, t);
      frame(true);
    },
    /* S5 paper, hanging price tag (or receipt when S.receipt) */
    S5() {
      layer({ background: "#F2E6C9" });
      layer({ backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.035) 0 2px, transparent 2px 46px)", zIndex: 1 });
      grain(0.09);
      if (S.receipt) {
        const slot = el("div", null, sc, null, { position: "absolute", left: "190px", width: "700px", top: "360px", overflow: "hidden", zIndex: 20 });
        const rc = el("div", null, slot, null, { background: "#FFFDF4", padding: "44px 48px 70px", fontFamily: "var(--fa-body)", direction: "rtl", color: BK, boxShadow: "0 24px 50px rgba(0,0,0,.25)" });
        el("div", null, rc, S.kicker || T.faShort, { fontFamily: "var(--fa)", fontWeight: 700, fontSize: "58px", textAlign: "center" });
        el("div", null, rc, "رویال ویک · " + T.rwStart, { textAlign: "center", fontSize: "34px", color: "#555", margin: "8px 0 26px" });
        (S.items || []).forEach((it) => {
          const [a, b] = it.split("|");
          el("div", null, rc, `<span>${a}</span><span style="flex:1;border-bottom:3px dotted #aaa;margin:0 16px;transform:translateY(-12px)"></span><b style="background:${Y};padding:0 14px 6px;border-radius:8px">${b || ""}</b>`,
            { display: "flex", alignItems: "baseline", fontSize: "46px", fontWeight: 700, margin: "18px 0" });
        });
        el("div", null, rc, `<span>${S.totalL || "جمع کل"}</span><span>${S.totalR || "رویالی!"}</span>`, { display: "flex", justifyContent: "space-between", borderTop: "3px dashed #999", paddingTop: "22px", marginTop: "22px", fontFamily: "var(--fa)", fontWeight: 700, fontSize: "60px" });
        const h = rc.offsetHeight;
        gsap.set(slot, { height: h });
        tl.fromTo(slot, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.6, ease: "steps(12)" }, 0.2);
        if (S.title) { const R = stack({ top: 360 + h + 40, bot: Y1, titleColor: BK, noKicker: true, noBig: true, titlePx: 120 }); enter(R, 1.8); }
      } else {
        const tagW = 560, tagH = 600, hang = el("div", null, sc, null, { position: "absolute", left: (W - tagW) / 2 + "px", top: "300px", width: tagW + "px", zIndex: 20, transformOrigin: "50% 0%" });
        el("div", null, hang, null, { width: "3px", height: "90px", margin: "0 auto", background: "#222" });
        const tag = el("div", null, hang, null, { position: "relative", height: tagH + "px", background: BK, clipPath: "polygon(22% 0, 78% 0, 100% 14%, 100% 100%, 0 100%, 0 14%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "18px", boxShadow: "0 30px 40px rgba(0,0,0,.3)" });
        el("div", null, tag, null, { position: "absolute", top: "40px", width: "56px", height: "56px", borderRadius: "50%", background: "#F2E6C9" });
        el("div", null, tag, null, { position: "absolute", top: "130px", left: "40px", right: "40px", borderTop: `4px dashed ${Y}` });
        if (S.kicker) el("div", "st-kicker", tag, S.kicker, { color: "#fff", marginTop: "110px", fontSize: "60px" });
        const bg = S.big ? big(tag, S.big, { color: Y, maxW: 470, maxPx: 250 }) : null;
        if (S.bigSub) el("div", "st-sub", tag, S.bigSub, { color: "#fff", fontSize: "44px" });
        tl.fromTo(hang, { y: -1200 }, { y: 0, duration: 0.6, ease: "back.out(1.4)" }, 0.1);
        tl.fromTo(hang, { rotation: 0 }, { keyframes: { rotation: [9, -6, 3.5, -2, 0.8, 0] }, duration: 2.2, ease: "none" }, 0.55);
        if (bg) tl.fromTo(bg, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, 0.6);
        const R = stack({ top: 300 + 90 + tagH + 20, bot: Y1, titleColor: BK, keyColor: S.red ? RED : "#B8860B", noKicker: true, noBig: true, titlePx: 110, subColor: "rgba(0,0,0,.75)", gap: 14 });
        enter(R, 0.9);
      }
      // corner tape strips
      [[60, 300, -35], [900, 300, 35]].forEach(([x, y, rot]) => el("div", null, sc, null, { position: "absolute", left: x + "px", top: y + "px", width: "170px", height: "54px", background: "rgba(255,210,31,.75)", transform: `rotate(${rot}deg)`, zIndex: 21 }));
      frame(false);
    },
    /* S6 information board: rows of split-flap panels */
    S6() {
      layer({ background: "linear-gradient(180deg, #121212, #050505)" });
      const R = stack({ top: Y0, bot: Y0 + 330, titleColor: "#fff", titlePx: 130, noSub: true, gap: 18 });
      enter(R, 0.15);
      const rows = S.items || [];
      const top = Y0 + 360, avail = Y1 - top, rh = Math.min(150, (avail - (rows.length - 1) * 18) / Math.max(1, rows.length));
      const pool = ["تخفیف", "هدیه", "بازی", "جایزه", "رویالی", "جمعه", "ROYAL", "WEEK"];
      rows.forEach((txt, i) => {
        const p = el("div", "st-flap", sc, null, { position: "absolute", left: "90px", right: "90px", top: top + i * (rh + 18) + "px", height: rh + "px", zIndex: 20 });
        const states = [pool[(i * 3) % pool.length], pool[(i * 5 + 2) % pool.length], txt];
        const sp = states.map((s) => el("span", null, p, s, { color: s === txt ? (i === 0 && S.firstAccent !== false ? ACC : "#fff") : "#888", fontSize: Math.min(rh * 0.5, 68) + "px", fontFamily: /[A-Z]/.test(s) ? "var(--en)" : "var(--fa)" }));
        states.forEach((s, k) => {
          const t = 0.55 + i * 0.16 + k * 0.12;
          tl.set(sp, { opacity: 0 }, t); tl.set(sp[k], { opacity: 1 }, t);
          tl.fromTo(p, { scaleY: 0.2 }, { scaleY: 1, duration: 0.08, immediateRender: false }, t);
        });
        tl.fromTo(p, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 0.5 + i * 0.16);
      });
      if (S.sub) { const s = el("div", "st-sub", sc, S.sub, { position: "absolute", left: "90px", right: "90px", top: top + rows.length * (rh + 18) + 10 + "px", textAlign: "center", color: Y, zIndex: 20 });
        tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.8 + rows.length * 0.16); }
      if (S.red) layer({ boxShadow: `inset 0 0 0 14px ${RED}`, zIndex: 50 });
      frame(true);
    },
    /* S7 gold: metallic gradient type with a travelling shine */
    S7() {
      layer({ background: "radial-gradient(ellipse at 50% 42%, #3a2a0c 0%, #120d05 55%, #050403 100%)" });
      dustIn(40, "#F7D98B");
      const R = stack({ titleColor: "#fff", titlePx: 170, bigPx: 460, chips: true, chipStyle: { background: "transparent", color: "#F3D27A", border: "3px solid #C99A3C" } });
      const gold = (e) => { Object.assign(e.style, { backgroundImage: "linear-gradient(100deg, #8a6420 0%, #f6dc8e 22%, #fff6d0 30%, #c99a3c 45%, #8a6420 60%, #f6dc8e 80%, #b8842e 100%)",
        backgroundSize: "250% 100%", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 10px 0 #4a3208) drop-shadow(0 26px 30px rgba(0,0,0,.6))" }); return e; };
      if (R.big) gold(R.big);
      if (R.title) R.title.words.forEach(gold);
      enter(R, 0.3, { bigFrom: { scale: 0.5, opacity: 0, rotationX: 70 } });
      const shiny = [R.big, ...(R.title ? R.title.words : [])].filter(Boolean);
      tl.fromTo(shiny, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 1.6, ease: "power2.inOut" }, 0.7);
      tl.fromTo(shiny, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", duration: 1.6, ease: "power2.inOut", immediateRender: false }, Math.max(2.6, D - 2.4));
      for (let i = 0; i < 6; i++) {          // four-point sparkles
        const s = el("div", null, sc, "✦", { position: "absolute", left: 140 + r() * 800 + "px", top: 420 + r() * 820 + "px", color: "#FFF3C4", fontSize: 40 + r() * 50 + "px", zIndex: 35 });
        tl.fromTo(s, { scale: 0, opacity: 0, rotation: 0 }, { keyframes: { scale: [0, 1.2, 0], opacity: [0, 1, 0] }, rotation: 90, duration: 0.8, ease: "none" }, 0.8 + i * 0.45 + r() * 0.3);
      }
      pushIn(R.c, 1.4, 0.03);
      frame(true);
    },
    /* S8 collage: polaroids, stickers and label strips on halftone yellow */
    S8() {
      layer({ background: Y });
      layer({ backgroundImage: "radial-gradient(circle, rgba(0,0,0,.12) 28%, transparent 31%)", backgroundSize: "24px 24px", zIndex: 1 });
      const ph = [].concat(S.photo || []);
      const spots = ph.length > 1 ? [[110, 380, -8, 470, 620], [520, 470, 7, 450, 600]] : [[230, 360, -5, 620, 800]];
      ph.slice(0, 2).forEach((p, i) => {
        const [x, y, rot, w, h] = spots[i];
        const card = el("div", "st-polar", sc, `<img src="${photo(p)}" />`, { left: x + "px", top: y + "px", width: w + "px", height: h + "px", transform: `rotate(${rot}deg)` });
        tl.fromTo(card, { y: -1400, rotation: rot * 3 }, { y: 0, rotation: rot, duration: 0.55, ease: "back.out(1.3)" }, 0.1 + i * 0.2);
        el("div", null, card, null, { position: "absolute", top: "-26px", left: "40%", width: "170px", height: "52px", background: "rgba(255,255,255,.7)", transform: "rotate(-4deg)" });
      });
      const hasPh = ph.length > 0;
      const R = stack({ top: hasPh ? 1080 : Y0, bot: Y1, noTitle: true, noSub: !!hasPh, gap: 18, kickerColor: BK, bigColor: BK });
      const strips = [];
      if (S.title) String(S.title).replace(/\[\[|\]\]/g, "").split("|").forEach((ln, i) => {
        const s = el("div", "st-strip", R.c, ln, { background: i % 2 ? Y : BK, color: i % 2 ? BK : Y, fontSize: (hasPh ? 84 : 120) + "px", transform: `rotate(${i % 2 ? 2 : -2}deg)`, border: i % 2 ? `5px solid ${BK}` : "none" });
        RP.fit(s, 880, null, hasPh ? 92 : 128); strips.push(s);
      });
      fitStack(R);
      if (R.kicker) tl.fromTo(R.kicker, { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.5);
      if (R.big) tl.fromTo(R.big, { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)" }, 0.6);
      strips.forEach((s, i) => tl.fromTo(s, { xPercent: i % 2 ? -140 : 140 }, { xPercent: 0, duration: 0.45, ease: "power3.out" }, 0.7 + i * 0.15));
      if (!hasPh && R.sub) tl.fromTo(R.sub, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 1.2);
      // stickers
      const st = S.items && S.items.length ? S.items : ["رویالی!", "٪", "BLACK FRIDAY"];
      const pos = [[70, 1180], [820, 330], [800, 1160], [90, 330]];
      st.slice(0, 4).forEach((t, i) => {
        const s = 170 + (i % 2) * 40;
        const b = el("div", "st-badge", sc, t, { left: pos[i][0] + "px", top: pos[i][1] + "px", width: s + "px", height: s + "px", background: [BK, "#fff", RED, BK][i], color: [Y, BK, "#fff", "#fff"][i],
          fontSize: (/[A-Z]/.test(t) ? 26 : t.length > 4 ? 34 : 62) + "px", fontFamily: /[A-Z]/.test(t) ? "var(--en)" : "var(--fa)", transform: `rotate(${(r() - 0.5) * 30}deg)`, padding: "12px" });
        tl.fromTo(b, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)" }, 1.0 + i * 0.15);
      });
      frame(false);
    },
    /* S9 UI: notification cards stack in, then a big button */
    S9() {
      layer({ background: "linear-gradient(180deg, #151515, #070707)" });
      [[180, 520, "rgba(255,210,31,.22)"], [860, 1150, "rgba(255,210,31,.14)"]].forEach(([x, y, c]) => el("div", null, sc, null, { position: "absolute", left: x - 300 + "px", top: y - 300 + "px", width: "600px", height: "600px", borderRadius: "50%", background: `radial-gradient(circle, ${c}, rgba(0,0,0,0) 70%)` }));
      const items = S.items || [];
      const icon = () => { const d = document.createElement("div"); d.className = "ic"; d.style.background = Y;
        const l = RP.logo({ outerStroke: BK, outerWidth: 2, innerFill: Y, innerStroke: BK, innerWidth: .8, mono: BK, monoWidth: 2.4 }); l.style.cssText = "height:70px;width:42px"; d.appendChild(l); return d; };
      const reserve = (S.title ? 210 : 0) + (S.button ? 150 : 0) + (S.progress ? 110 : 0), gap = 20, top0 = Y0 + 10;
      const cardH = Math.min(150, (Y1 - top0 - reserve - (items.length - 1) * gap) / Math.max(1, items.length));
      items.forEach((m, i) => {
        const c = el("div", "st-ui", sc, null, { top: top0 + i * (cardH + gap) + "px", height: cardH + "px", color: "#fff" });
        c.appendChild(icon());
        el("div", "tx", c, `<div class="ap"><span>رویال ویک</span><span>اکنون</span></div><div class="ms">${m}</div>`);
        const ms = RP.$(".ms", c); RP.fit(ms, 720, cardH * 0.42, 50); ms.style.display = "block";
        RP.$(".ic", c).style.transform = `scale(${Math.min(1, cardH / 150)})`;
        tl.fromTo(c, { y: -260, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.4)" }, 0.25 + i * 0.42);
      });
      const usedTop = top0 + items.length * (cardH + gap) + 20;
      if (S.progress) {
        const bar = el("div", null, sc, null, { position: "absolute", left: "140px", right: "140px", top: usedTop + 30 + "px", height: "44px", borderRadius: "22px", background: "rgba(255,255,255,.12)", overflow: "hidden", zIndex: 30 });
        const fill = el("div", null, bar, null, { height: "100%", width: "100%", background: `linear-gradient(90deg, ${Y}, #FFB300)`, transformOrigin: "100% 50%" });
        tl.fromTo(fill, { scaleX: 0 }, { scaleX: S.progress, duration: 1.4, ease: "power2.inOut" }, 0.6 + items.length * 0.42);
      }
      const R = stack({ top: usedTop + (S.progress ? 110 : 0), bot: Y1, titleColor: "#fff", titlePx: 120, noKicker: !!items.length, gap: 24 });
      if (S.button) {
        const btn = el("div", null, R.c, S.button, { fontFamily: "var(--fa)", fontWeight: 700, fontSize: "62px", background: ACC, color: BK, borderRadius: "70px", padding: "14px 70px 28px", direction: "rtl", whiteSpace: "nowrap" });
        tl.fromTo(btn, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(2)" }, 0.9 + items.length * 0.42);
        for (let t = 2 + items.length * 0.42; t < D - 0.5; t += 1.1) tl.fromTo(btn, { scale: 1 }, { keyframes: { scale: [1, 1.07, 1] }, duration: 0.4, ease: "none", immediateRender: false }, t);
      }
      enter(R, 0.6 + items.length * 0.42);
      frame(true);
    },
    /* S10 floors: elevator indicator, doors, floor card with brands */
    S10() {
      layer({ background: "#070707" });
      const panel = el("div", null, sc, null, { position: "absolute", left: "300px", right: "300px", top: "330px", height: "150px", background: "#111", border: `4px solid ${Y}`, borderRadius: "24px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "26px", zIndex: 40, overflow: "hidden" });
      const arrow = el("div", null, panel, "▲", { color: Y, fontSize: "60px" });
      const nums = (S.floorSeq || ["همکف", "۱", "۲"]).map((n) => el("div", null, panel, n, { position: "absolute", fontFamily: "var(--fa)", fontWeight: 700, fontSize: "86px", color: "#FFE58A", opacity: 0 }));
      nums.forEach((n, i) => { const t = 0.2 + i * 0.22; tl.set(nums, { opacity: 0 }, t); tl.set(n, { opacity: 1 }, t); tl.fromTo(n, { yPercent: 60 }, { yPercent: 0, duration: 0.18, immediateRender: false }, t); });
      tl.fromTo(arrow, { opacity: 1 }, { keyframes: { opacity: [1, 0.2, 1, 0.2, 1] }, duration: 0.2 + nums.length * 0.22, ease: "none" }, 0.2);
      gsap.set(arrow, { position: "absolute", left: "36px" });
      const tOpen = 0.35 + nums.length * 0.22;
      // floor card behind the doors
      const R = stack({ top: 540, bot: Y1, titleColor: "#fff", titlePx: 140, gap: 14, noSub: true });
      const list = el("div", null, R.c, null, { display: "flex", flexDirection: "column", gap: "14px", width: "900px", marginTop: "10px" });
      const rows = (S.items || []).map((it) => {
        const [a, b, c] = it.split("|");
        const row = el("div", null, list, `<span style="font-family:var(--fa);font-weight:700;font-size:54px;color:#fff;white-space:nowrap">${a}</span><span style="flex:1"></span><span style="font-family:var(--fa);font-weight:700;font-size:50px;color:${BK};background:${Y};padding:0 22px 8px;border-radius:14px;white-space:nowrap">${b || ""}</span>`,
          { display: "flex", alignItems: "center", gap: "16px", direction: "rtl", padding: "14px 26px", background: "rgba(255,255,255,.07)", borderRadius: "20px", borderRight: `8px solid ${Y}` });
        if (c) el("div", null, list, c, { fontFamily: "var(--fa-body)", fontSize: "34px", color: "rgba(255,255,255,.65)", direction: "rtl", textAlign: "right", marginTop: "-10px", paddingRight: "40px" });
        return row;
      });
      if (S.sub) { const s = el("div", "st-sub", R.c, S.sub, { color: Y, fontSize: "44px" }); tl.fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.5 }, tOpen + 0.8); }
      // brushed doors
      const metal = "repeating-linear-gradient(90deg, rgba(255,255,255,.05) 0 3px, rgba(0,0,0,.05) 3px 6px), linear-gradient(90deg, #2a2a2a, #4a4a4a 50%, #2a2a2a)";
      const dl = layer({ right: "50%", background: metal, zIndex: 38, borderRight: `4px solid ${Y}` }), dr = layer({ left: "50%", background: metal, zIndex: 38, borderLeft: `4px solid ${Y}` });
      tl.fromTo(dl, { xPercent: 0 }, { xPercent: -102, duration: 0.7, ease: "power2.inOut" }, tOpen);
      tl.fromTo(dr, { xPercent: 0 }, { xPercent: 102, duration: 0.7, ease: "power2.inOut" }, tOpen);
      enter(R, tOpen + 0.2);
      tl.fromTo(rows, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, stagger: 0.1 }, tOpen + 0.55);
      frame(true);
    },
    /* S11 arcade: pixel grid, level ladder, stamps */
    S11() {
      layer({ background: "#0b0b0b", backgroundImage: "linear-gradient(rgba(255,210,31,.07) 2px, transparent 2px), linear-gradient(90deg, rgba(255,210,31,.07) 2px, transparent 2px)", backgroundSize: "60px 60px" });
      layer({ background: "repeating-linear-gradient(0deg, rgba(0,0,0,.35) 0 3px, transparent 3px 6px)", zIndex: 50, opacity: 0.4 });
      const R = stack({ top: Y0, bot: S.items && S.items.length ? Y0 + 520 : Y1, titleColor: "#fff", titlePx: 140, bigPx: 380, gap: 20 });
      if (R.big) R.big.style.textShadow = "8px 8px 0 #7a5d00";
      enter(R, 0.2, { bigFrom: { scale: 0, opacity: 0, rotation: -20 } });
      if (R.big) tl.fromTo(R.big, { scale: 1 }, { keyframes: { scale: [1, 1.12, 1] }, duration: 0.3, ease: "none", immediateRender: false }, 0.75);
      // coin burst
      for (let i = 0; i < 18; i++) {
        const c = el("i", null, sc, null, { position: "absolute", left: W / 2 - 12 + "px", top: "720px", width: "24px", height: "24px", background: i % 3 ? Y : "#fff", zIndex: 31 });
        const a = r() * Math.PI * 2, d = 200 + r() * 300;
        gsap.set(c, { autoAlpha: 0 });
        tl.set(c, { autoAlpha: 1 }, 0.55);
        tl.fromTo(c, { x: 0, y: 0 }, { x: Math.cos(a) * d, y: Math.sin(a) * d + 200, rotation: 360, opacity: 0, duration: 1.1, ease: "power2.out", immediateRender: false }, 0.55);
      }
      // ladder
      const items = S.items || [];
      if (items.length) {
        const top = Y0 + 560, rh = Math.min(120, (Y1 - top - (items.length - 1) * 16) / items.length);
        items.forEach((t, i) => {
          const k = items.length - 1 - i;           // bottom row = level 1
          const row = el("div", null, sc, `<span style="font-family:var(--en);font-size:30px;letter-spacing:.2em;color:${Y}">LV ${k + 1}</span><span style="font-family:var(--fa);font-weight:700;font-size:${Math.min(56, rh * 0.5)}px">${t}</span>`,
            { position: "absolute", left: 140 + k * 26 + "px", right: 140 + k * 26 + "px", top: top + i * (rh + 16) + "px", height: rh + "px", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "0 34px", border: `4px solid ${Y}`, color: "#fff", background: "#151515", zIndex: 30, direction: "rtl" });
          const tt = 1.0 + k * 0.38;
          tl.fromTo(row, { opacity: 0, x: (k % 2 ? 1 : -1) * 80 }, { opacity: 1, x: 0, duration: 0.3 }, 0.6 + k * 0.1);
          tl.to(row, { backgroundColor: Y, color: BK, duration: 0.12 }, tt);
          tl.fromTo(row, { scale: 1 }, { keyframes: { scale: [1, 1.05, 1] }, duration: 0.25, ease: "none", immediateRender: false }, tt);
        });
      }
      frame(true);
    },
    /* S12 photo: full-bleed photo, freeze-frame card, label strips */
    S12() {
      const ph = [].concat(S.photo || ["p3"]);
      const bg = el("div", null, sc, `<img src="${photo(ph[0])}" style="width:100%;height:100%;object-fit:cover;display:block" />`, { position: "absolute", inset: "-4%", zIndex: 1 });
      layer({ background: "linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 45%, rgba(0,0,0,.85) 78%, rgba(0,0,0,.95) 100%)", zIndex: 2 });
      tl.fromTo(bg, { scale: 1.12, x: -30 }, { scale: 1.0, x: 20, duration: D, ease: "none" }, 0);
      const flash = layer({ background: "#fff", zIndex: 45, opacity: 0 });
      const tF = S.freeze || 0.9;
      tl.fromTo(flash, { opacity: 0 }, { keyframes: { opacity: [0, 0.85, 0] }, duration: 0.3, ease: "none" }, tF);
      // freeze frame: duplicate photo as a tilted white-bordered card + hand-drawn circle
      const card = el("div", "st-polar", sc, `<img src="${photo(ph[1] || ph[0])}" />`, { left: "560px", top: "420px", width: "400px", height: "500px", zIndex: 20, padding: "14px 14px 54px", transform: "rotate(6deg)" });
      gsap.set(card, { autoAlpha: 0 });
      tl.set(card, { autoAlpha: 1 }, tF + 0.1);
      tl.fromTo(card, { scale: 1.6, rotation: 20 }, { scale: 1, rotation: 6, duration: 0.45, ease: "back.out(1.6)", immediateRender: false }, tF + 0.1);
      const R = stack({ top: 960, bot: Y1, noTitle: true, gap: 16, kickerColor: Y, bigColor: Y, subColor: "#fff" });
      const strips = [];
      if (S.title) String(S.title).replace(/\[\[|\]\]/g, "").split("|").forEach((ln, i) => {
        const s = el("div", "st-strip", R.c, ln, { background: i % 2 ? "#fff" : Y, color: BK, fontSize: "96px", transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` });
        RP.fit(s, 880, null, 104); strips.push(s);
      });
      if (R.sub) R.c.appendChild(R.sub);
      gsap.set(R.c, { autoAlpha: 0 }); tl.set(R.c, { autoAlpha: 1 }, tF + 0.3);
      enter(R, tF + 0.3);
      strips.forEach((s, i) => tl.fromTo(s, { xPercent: i % 2 ? -130 : 130 }, { xPercent: 0, duration: 0.45, ease: "power3.out" }, tF + 0.45 + i * 0.15));
      frame(true);
    },
    /* S13 beat slideshow: full-bleed shop photos cut on the beat, a caption per photo, then the message */
    S13() {
      const ph = [].concat(S.photo || ["p3"]), cap = S.items || [];
      const n = ph.length, slot = Math.min(0.95, (D - 2.6) / n);
      ph.forEach((p, i) => {
        const L = layer({ zIndex: 2 + i, overflow: "hidden" });
        const img = el("img", null, L, null, { position: "absolute", inset: "-3%", width: "106%", height: "106%", objectFit: "cover" }); img.src = photo(p);
        layer({ zIndex: 3 + i }).style.cssText += "position:absolute;inset:0;background:linear-gradient(180deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,.1) 55%, rgba(0,0,0,.8) 100%);z-index:" + (3 + i);
        gsap.set(L, { autoAlpha: i ? 0 : 1 });
        const t0 = i * slot;
        if (i) { tl.set(L, { autoAlpha: 1 }, t0); tl.fromTo(L, { clipPath: i % 2 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0%)", duration: 0.16, ease: "power3.out", immediateRender: false }, t0); }
        tl.fromTo(img, { scale: 1.14, x: (i % 2 ? -1 : 1) * 30 }, { scale: 1.0, x: 0, duration: Math.max(slot, D - t0), ease: "none" }, t0);
        if (cap[i]) {
          const c = el("div", "st-strip", sc, cap[i], { position: "absolute", top: "1080px", left: "50%", background: i % 2 ? "#fff" : Y, color: BK, fontSize: "110px", zIndex: 40, transform: "translateX(-50%) rotate(-2deg)" });
          RP.fit(c, 860, null, 120);
          gsap.set(c, { xPercent: -50, x: 0, autoAlpha: 0, rotation: i % 2 ? 2 : -2 });
          tl.set(c, { autoAlpha: 1 }, t0 + 0.05);
          tl.fromTo(c, { scale: 1.6 }, { scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t0 + 0.05);
          tl.set(c, { autoAlpha: 0 }, t0 + slot);
        }
      });
      const tEnd = n * slot;
      const dim = layer({ background: "rgba(0,0,0,.55)", zIndex: 30, opacity: 0 });
      tl.to(dim, { opacity: 1, duration: 0.3 }, tEnd);
      const R = stack({ top: 820, bot: Y1, noTitle: true, gap: 16, kickerColor: Y, bigColor: Y, subColor: "#fff" });
      R.c.style.zIndex = 45;
      const strips = [];
      if (S.title) String(S.title).replace(/\[\[|\]\]/g, "").split("|").forEach((ln, i) => {
        const st = el("div", "st-strip", R.c, ln, { background: i % 2 ? "#fff" : Y, color: BK, fontSize: "110px", transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` });
        RP.fit(st, 880, null, 120); strips.push(st);
      });
      if (R.sub) R.c.appendChild(R.sub);
      gsap.set(R.c, { autoAlpha: 0 }); tl.set(R.c, { autoAlpha: 1 }, tEnd);
      enter(R, tEnd + 0.05);
      strips.forEach((st, i) => tl.fromTo(st, { xPercent: i % 2 ? -130 : 130 }, { xPercent: 0, duration: 0.4, ease: "power3.out" }, tEnd + 0.1 + i * 0.14));
      frame(true);
    },
    /* S14 split screen: two photos slide in from opposite sides, a yellow band carries the message */
    S14() {
      layer({ background: BK });
      const ph = [].concat(S.photo || ["p3", "p4"]);
      const half = (p, top, dir) => {
        const box = el("div", null, sc, null, { position: "absolute", left: 0, right: 0, top: top + "px", height: "800px", overflow: "hidden", zIndex: 2 });
        const img = el("img", null, box, null, { width: "100%", height: "100%", objectFit: "cover", display: "block" }); img.src = photo(p);
        tl.fromTo(box, { xPercent: dir * 100 }, { xPercent: 0, duration: 0.55, ease: "power3.out" }, top > 900 ? 0.15 : 0.05);
        tl.fromTo(img, { scale: 1.12 }, { scale: 1, duration: D, ease: "none" }, 0);
        return box;
      };
      half(ph[0], 180, 1); half(ph[1] || ph[0], 1060, -1);
      layer({ background: "linear-gradient(180deg, rgba(0,0,0,.5) 0%, rgba(0,0,0,0) 22%, rgba(0,0,0,0) 78%, rgba(0,0,0,.6) 100%)", zIndex: 3 });
      const band = el("div", null, sc, null, { position: "absolute", left: "-5%", right: "-5%", top: "900px", height: "240px", background: ACC, zIndex: 20, transform: "rotate(-4deg)",
        display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 20px 40px rgba(0,0,0,.5)" });
      const tx = el("div", "st-ln", band, String(S.title || "").replace(/\[\[|\]\]/g, "").replace("|", " "), { color: BK });
      RP.fit(tx, 860, 180, 130);
      tl.fromTo(band, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power3.inOut" }, 0.55);
      tl.fromTo(tx, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.85);
      if (S.kicker) { const k = el("div", "st-strip", sc, S.kicker, { position: "absolute", top: "380px", right: "90px", background: BK, color: Y, fontSize: "56px", zIndex: 21 });
        tl.fromTo(k, { xPercent: 120 }, { xPercent: 0, duration: 0.4 }, 1.0); }
      if (S.sub) { const sb = el("div", "st-strip", sc, S.sub, { position: "absolute", top: "1180px", left: "90px", background: "#fff", color: BK, fontSize: "48px", zIndex: 21 });
        tl.fromTo(sb, { xPercent: -120 }, { xPercent: 0, duration: 0.4 }, 1.2); }
      frame(true);
    },
  };

  (STYLES[S.style] || STYLES.S3)();
  if (S.logo) { /* optional brand logo file: assets/img/logos/<file> */
    const lg = el("img", null, sc, null, { position: "absolute", left: W / 2 - 110 + "px", top: "300px", width: "220px", height: "120px", objectFit: "contain", zIndex: 61 });
    lg.src = "../assets/img/logos/" + S.logo;
    tl.fromTo(lg, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5 }, 0.3);
  }
});
