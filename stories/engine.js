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
  const wordsOf = (line) => {            // [[keyword]] may span words or sit inside a word / before punctuation
    const out = []; let key = false;
    line.split(" ").filter(Boolean).forEach((w) => {
      let k = key || w.includes("[[");
      if (w.includes("[[")) key = true;
      if (w.includes("]]")) key = false;
      out.push({ w: w.replace(/\[\[|\]\]/g, ""), k });
    });
    return out;
  };
  const ltrTok = (e, t) => { if (/^[+×\-]/.test(t)) { e.style.direction = "ltr"; e.style.unicodeBidi = "isolate"; } };
  /* multi-line title, each line fitted to maxW; uniform size = smallest fit (capped by maxPx) */
  function title(parent, text, o) {
    o = o || {};
    const box = el("div", "st-title", parent);
    const lines = String(text).split("|"), words = [], keys = [];
    const lineEls = lines.map((ln) => {
      const d = el("div", "st-ln", box, null, { color: o.color || "#fff" });
      wordsOf(ln).forEach((t, i, arr) => {
        const w = el("span", "w", d); const wi = el("span", "wi" + (t.w === "تا" ? " ta" : ""), w, t.w);
        ltrTok(wi, t.w);
        if (/[۰-۹]+:[۰-۹]+/.test(t.w)) wi.className += " st-timefont";
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
    ltrTok(d, String(text));
    if (/[۰-۹]+:[۰-۹]+/.test(String(text))) d.className += " st-timefont";
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
  /* ---------- notice (working-hours) helpers ---------- */
  const faN = (x) => String(x).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
  const hhmm = (h) => { const m = Math.round(h * 60); return faN(String(Math.floor(m / 60) % 24).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0")); };
  const PAL = {
    dark: { dark: true, bg: "radial-gradient(ellipse at 50% 38%, #1d1a0c 0%, #070707 62%)", fg: "#fff", key: Y, kick: Y, ring: Y, face: "#0e0e0e", tick: "rgba(255,255,255,.55)", sub: "rgba(255,255,255,.85)", chip: { background: "transparent", color: Y, border: `3px solid ${Y}` } },
    yellow: { dark: false, bg: Y, fg: BK, key: "#fff", kick: BK, ring: BK, face: "#fff7d6", tick: "rgba(0,0,0,.5)", sub: "rgba(0,0,0,.85)", keyShadow: true, chip: { background: BK, color: Y } },
    red: { dark: true, bg: "radial-gradient(ellipse at 50% 38%, #f23a3f 0%, #b5151a 70%)", fg: "#fff", key: Y, kick: "#fff", ring: "#fff", face: "#7e0b10", tick: "rgba(255,255,255,.6)", sub: "rgba(255,255,255,.92)", chip: { background: "#fff", color: "#b5151a" } },
  };
  function noticeHead(P, o) {
    layer({ background: P.bg });
    if (P.dark) dustIn(16, "#FFE9A8", { x0: 100, x1: 980, y0: 300, y1: 1400 });
    const R = stack({ top: o.top, bot: o.bot, gap: 18, titleColor: P.fg, keyColor: P.key, kickerColor: P.kick, subColor: P.sub, titlePx: 105 });
    if (P.keyShadow && R.title) R.title.keys.forEach((k) => (k.style.textShadow = `6px 6px 0 ${BK}`));
    enter(R, 0.15);
    return R;
  }

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
    /* ================= NOTICE styles (working-hours announcement): N1 clock, N3 day bar, N4 door sign, N5 week list ================= */
    N1() {
      const P = PAL[S.theme || "dark"];
      noticeHead(P, { top: 300, bot: 760 });
      const cx = W / 2, cy = 1030, d = 500, inner = d - 24;
      const face = el("div", null, sc, null, { position: "absolute", left: cx - d / 2 + "px", top: cy - d / 2 + "px", width: d + "px", height: d + "px", borderRadius: "50%",
        background: P.face, border: `12px solid ${P.ring}`, zIndex: 20, boxShadow: "0 26px 60px rgba(0,0,0,.45)" });
      for (let i = 0; i < 60; i++) {
        const b = i % 5 === 0;
        el("i", null, face, null, { position: "absolute", left: "50%", top: "8px", width: (b ? 9 : 3) + "px", height: (b ? 36 : 16) + "px", marginLeft: (b ? -4.5 : -1.5) + "px",
          background: b ? P.ring : P.tick, borderRadius: "3px", transformOrigin: `50% ${inner / 2 - 8}px`, transform: `rotate(${i * 6}deg)` });
      }
      const hand = (w, h, col) => el("i", null, face, null, { position: "absolute", left: "50%", bottom: "50%", width: w + "px", height: h + "px", marginLeft: -w / 2 + "px",
        background: col, borderRadius: w + "px", transformOrigin: "50% 100%", zIndex: 3 });
      const hr = hand(18, inner * 0.27, P.fg), mn = hand(11, inner * 0.4, P.ring);
      el("i", null, face, null, { position: "absolute", left: "50%", top: "50%", width: "34px", height: "34px", margin: "-17px 0 0 -17px", borderRadius: "50%", background: P.ring, zIndex: 4 });
      const ro = el("div", null, face, null, { position: "absolute", left: 0, right: 0, top: inner * 0.64 + "px", textAlign: "center", fontFamily: "var(--fa-body)", fontWeight: 700,
        fontSize: "78px", color: P.fg, direction: "ltr", zIndex: 2 });
      const px = { h: S.from != null ? S.from : 10.5 };
      const set = () => { hr.style.transform = `rotate(${(px.h % 12) * 30}deg)`; mn.style.transform = `rotate(${((px.h * 60) % 60) * 6}deg)`; ro.textContent = hhmm(px.h); };
      set();
      tl.fromTo(face, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(1.6)" }, 0.2);
      tl.to(px, { h: S.to != null ? S.to : 23, duration: D - 3.4, ease: "power2.inOut", onUpdate: set }, 0.9);
      const chips = el("div", "st-chips", sc, null, { position: "absolute", left: "60px", right: "60px", top: "1305px", zIndex: 30, flexWrap: "nowrap", gap: "12px" });
      const ce = (S.items || []).map((t) => el("div", "st-chip", chips, t, Object.assign({ fontSize: "38px", padding: "8px 22px 14px" }, P.chip)));
      tl.fromTo(ce, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.12 }, D - 3.2);
      grain(0.05);
      frame(P.dark);
    },
    N3() {
      const P = PAL[S.theme || "dark"];
      noticeHead(P, { top: 300, bot: 760 });
      const x0 = 130, x1 = 950, y = 1100, from = S.from != null ? S.from : 10.5, to = S.to != null ? S.to : 23;
      const xs = (h) => x1 - ((h - from) / (to - from)) * (x1 - x0);       // right (10:30) -> left (23:00)
      const track = el("div", null, sc, null, { position: "absolute", left: x0 + "px", top: y - 28 + "px", width: x1 - x0 + "px", height: "56px", borderRadius: "28px", overflow: "hidden",
        background: P.dark ? "rgba(255,255,255,.14)" : "rgba(0,0,0,.18)", zIndex: 20 });
      const fill = el("div", null, track, null, { position: "absolute", inset: 0, transformOrigin: "100% 50%",
        background: "linear-gradient(270deg, #FFD21F 0%, #ff9d2e 38%, #d9476a 62%, #5b4bd0 82%, #1b1f5e 100%)" });
      for (let h = Math.ceil(from); h <= to; h++) {
        const x = xs(h);
        el("i", null, sc, null, { position: "absolute", left: x - 1.5 + "px", top: y + 40 + "px", width: "3px", height: "20px", background: P.tick, zIndex: 20 });
        el("div", null, sc, faN(h), { position: "absolute", left: x - 30 + "px", width: "60px", textAlign: "center", top: y + 66 + "px", fontFamily: "var(--fa-body)", fontWeight: 700,
          fontSize: "30px", color: P.fg, opacity: 0.85, zIndex: 20 });
      }
      const mk = el("div", null, sc, null, { position: "absolute", top: y - 62 + "px", width: "124px", height: "124px", marginLeft: "-62px", borderRadius: "50%", zIndex: 25,
        border: `8px solid ${P.dark ? "#fff" : BK}`, boxShadow: "0 0 50px rgba(255,210,31,.7)" });
      const ro = el("div", null, sc, null, { position: "absolute", left: 0, right: 0, top: "800px", textAlign: "center", fontFamily: "var(--fa-body)", fontWeight: 700, fontSize: "160px",
        color: P.fg, direction: "ltr", zIndex: 25 });
      const px = { h: from };
      const set = () => {
        const f = (px.h - from) / (to - from);
        mk.style.left = xs(px.h) + "px";
        mk.style.background = f < 0.55 ? "radial-gradient(circle, #fff6b0, #FFD21F)" : "radial-gradient(circle, #ffffff, #c9d0ff)";
        fill.style.transform = `scaleX(${Math.max(0.001, f)})`;
        ro.textContent = hhmm(px.h);
      };
      set();
      tl.to(px, { h: to, duration: D - 3.2, ease: "power1.inOut", onUpdate: set }, 0.8);
      tl.fromTo([track, mk, ro], { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, 0.2);
      const lab = (txt, side) => el("div", null, sc, txt, { position: "absolute", top: y + 120 + "px", [side]: "100px", fontFamily: "var(--fa)", fontWeight: 700, fontSize: "44px", color: P.fg, direction: "rtl", zIndex: 25 });
      const la = lab(S.startLabel || "شروع: ۱۰:۳۰ صبح", "right"), lb = lab(S.endLabel || "پایان: ۲۳:۰۰", "left");
      tl.fromTo([la, lb], { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, 1.0);
      const chips = el("div", "st-chips", sc, null, { position: "absolute", left: "60px", right: "60px", top: "1305px", zIndex: 30, flexWrap: "nowrap", gap: "12px" });
      const ce = (S.items || []).map((t) => el("div", "st-chip", chips, t, Object.assign({ fontSize: "38px", padding: "8px 22px 14px" }, P.chip)));
      tl.fromTo(ce, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.12 }, D - 3.0);
      grain(0.05);
      frame(P.dark);
    },
    N4() {
      const P = PAL[S.theme || "dark"];
      layer({ background: P.bg });
      if (P.dark) dustIn(16, "#FFE9A8", { x0: 100, x1: 980, y0: 300, y1: 1400 });
      const [bd, fg] = P === PAL.dark ? [Y, BK] : P === PAL.yellow ? [BK, Y] : ["#fff", "#b5151a"];
      const bw = 820, bh = 890, bx = (W - bw) / 2, by = 440;
      const sign = el("div", null, sc, null, { position: "absolute", left: bx + "px", top: by + "px", width: bw + "px", height: bh + "px", zIndex: 20, transformOrigin: "50% -150px" });
      sign.innerHTML = `<svg width="${bw}" height="170" style="position:absolute;left:0;top:-160px;overflow:visible"><g stroke="${P.dark ? "#fff" : BK}" stroke-width="8" stroke-linecap="round" fill="none"><path d="M${bw * 0.2} 160 L${bw / 2} 10"/><path d="M${bw * 0.8} 160 L${bw / 2} 10"/></g><circle cx="${bw / 2}" cy="10" r="16" fill="${P.dark ? "#fff" : BK}"/></svg>`;
      const board = el("div", null, sign, null, { position: "absolute", inset: 0, borderRadius: "56px", background: bd, boxShadow: "0 40px 80px rgba(0,0,0,.5)", border: `10px solid ${fg}` });
      el("div", null, board, null, { position: "absolute", inset: "26px", borderRadius: "38px", border: `5px solid ${fg}`, opacity: 0.55 });
      [bw * 0.2, bw * 0.8].forEach((x) => el("i", null, board, null, { position: "absolute", left: x - 18 + "px", top: "26px", width: "36px", height: "36px", borderRadius: "50%", background: P.bg === Y ? "#fff7d6" : "#0a0a0a" }));
      const t1 = el("div", null, board, S.open || "OPEN", { position: "absolute", left: 0, right: 0, top: "90px", textAlign: "center", fontFamily: "var(--en)", color: fg, letterSpacing: ".06em", whiteSpace: "nowrap" });
      RP.fit(t1, 700, 230, 260);
      const t2 = el("div", "st-ln", board, S.head || "یکسره باز است", { position: "absolute", left: 0, right: 0, top: "370px", textAlign: "center", color: fg });
      RP.fit(t2, 700, 150, 130);
      el("div", null, board, null, { position: "absolute", left: "90px", right: "90px", top: "560px", height: "8px", background: fg, opacity: 0.8, borderRadius: "4px" });
      const t3 = el("div", "st-ln", board, S.hours || "۱۰:۳۰ صبح تا ۲۳:۰۰", { position: "absolute", left: 0, right: 0, top: "610px", textAlign: "center", color: fg });
      RP.fit(t3, 700, 130, 110);
      const t4 = el("div", "st-sub", board, S.note || "۳ تا ۹ آذر", { position: "absolute", left: "40px", right: "40px", top: "760px", textAlign: "center", color: fg, fontSize: "46px", maxWidth: "none" });
      RP.fit(t4, 700, 110, 52);
      tl.fromTo(sign, { y: -1000 }, { y: 0, duration: 0.8, ease: "bounce.out" }, 0.1);
      tl.fromTo(sign, { rotation: 9 }, { rotation: 0, duration: 2.6, ease: "elastic.out(1,.28)" }, 0.55);
      tl.fromTo([t3, t4], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 }, 1.3);
      grain(0.05);
      frame(P.dark);
    },
    N5() {
      const P = PAL[S.theme || "dark"];
      noticeHead(P, { top: 300, bot: 570 });
      const DAYS = ["سه‌شنبه ۳ آذر", "چهارشنبه ۴ آذر", "پنجشنبه ۵ آذر", "جمعه ۶ آذر", "شنبه ۷ آذر", "یکشنبه ۸ آذر", "دوشنبه ۹ آذر"];
      const hours = S.hours || "۱۰:۳۰ تا ۲۳:۰۰", rowH = 100, gap = 13, top0 = 590;
      const hi = P.dark ? Y : BK, hiFg = P.dark ? BK : Y;
      DAYS.forEach((dn, i) => {
        const fri = i === 3;
        const row = el("div", null, sc, null, { position: "absolute", left: "90px", right: "90px", top: top0 + i * (rowH + gap) + "px", height: rowH + "px", borderRadius: "26px", zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between", direction: "rtl", padding: "0 34px",
          background: fri ? hi : (P.dark ? "rgba(255,255,255,.1)" : "rgba(0,0,0,.1)"), border: fri ? "none" : `2px solid ${P.dark ? "rgba(255,255,255,.16)" : "rgba(0,0,0,.18)"}` });
        el("div", null, row, dn + (fri ? " — جمعه رویالی" : ""), { fontFamily: "var(--fa)", fontWeight: 700, fontSize: "44px", color: fri ? hiFg : P.fg, whiteSpace: "nowrap" });
        el("div", null, row, hours, { fontFamily: "var(--fa-body)", fontWeight: 700, fontSize: "42px", color: fri ? hiFg : P.fg, whiteSpace: "nowrap" });
        tl.fromTo(row, { xPercent: i % 2 ? -110 : 110, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 0.9 + i * 0.2);
      });
      grain(0.05);
      frame(P.dark);
    },
  };

  (STYLES[S.style] || STYLES.S3)();
  if (S.logo) { /* optional brand logo file: assets/img/logos/<file> */
    const lg = el("img", null, sc, null, { position: "absolute", left: W / 2 - 110 + "px", top: "300px", width: "220px", height: "120px", objectFit: "contain", zIndex: 61 });
    lg.src = "../assets/img/logos/" + S.logo;
    tl.fromTo(lg, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.5 }, 0.3);
  }
});
