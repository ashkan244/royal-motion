RP.run(function (tl, RP) {
  const { u, W, H, K, T, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // ivory card: logo + name, address, Instagram, QR to the Instagram page
  const card = RP.el("div", { style: { position: "absolute", left: "50%", top: "50%", width: u * (RP.landscape ? 130 : 84) + "px", padding: u * 5 + "px", borderRadius: u * 3 + "px",
    background: "linear-gradient(160deg, #FFFDF6, #F1E8D2)", boxShadow: `0 ${u * 3}px ${u * 8}px rgba(0,0,0,.45)`, display: "flex", gap: u * 5 + "px", alignItems: "center",
    flexDirection: RP.landscape ? "row-reverse" : "column", zIndex: 50, direction: "rtl" } }, sc);
  gsap.set(card, { xPercent: -50, yPercent: -50 });
  const info = RP.el("div", { style: { display: "flex", flexDirection: "column", alignItems: RP.landscape ? "flex-start" : "center", gap: u * 2.4 + "px", flex: 1 } }, card);
  const top = RP.el("div", { style: { display: "flex", alignItems: "center", gap: u * 2.4 + "px" } }, info);
  const lg = RP.logo({ parent: top, outerStroke: K.navy, innerFill: K.navy, innerStroke: K.gold, innerWidth: 0.45, mono: K.gold });
  lg.style.height = u * 13 + "px"; lg.style.width = u * 7.8 + "px";
  RP.el("div", {}, top, `<div style="font-family:var(--fa);font-weight:700;font-size:${u * 5}px;color:${K.navy}">${T.faName}</div><div style="font-family:var(--en);font-size:${u * 1.7}px;letter-spacing:.25em;color:${K.goldDeep};direction:ltr;margin-top:${u * 0.6}px">${T.enName}</div>`);
  const line = (icon, txt, ltr) => RP.el("div", { style: { display: "flex", alignItems: "center", gap: u * 1.4 + "px", fontFamily: "var(--fa-body)", fontWeight: 700, fontSize: u * 3.2 + "px", color: K.navy } }, info,
    `<span style="width:${u * 3.6}px;height:${u * 3.6}px;display:inline-flex">${icon}</span><span style="direction:${ltr ? "ltr" : "rtl"}">${txt}</span>`);
  const l1 = line(RP.ICON_PIN(K.goldDeep), T.address), l2 = line(RP.ICON_IG(K.goldDeep), T.ig, true);
  [l1, l2].forEach((l) => RP.$$("svg", l).forEach((s) => { s.style.width = "100%"; s.style.height = "100%"; }));
  // QR
  const qbox = RP.el("div", { style: { background: "#fff", padding: u * 1.6 + "px", borderRadius: u * 1.6 + "px", border: `2px solid ${K.gold}`, textAlign: "center" } }, card);
  const qr = qrcode(0, "M"); qr.addData("https://instagram.com/" + T.ig.replace("@", "")); qr.make();
  const n = qr.getModuleCount();
  const qs = RP.svgEl("svg", { viewBox: `-1 -1 ${n + 2} ${n + 2}`, "shape-rendering": "crispEdges", style: `width:${u * 26}px;height:${u * 26}px;display:block` }, qbox);
  const cells = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) { const e = RP.svgEl("rect", { x: c, y: r, width: 1.02, height: 1.02, fill: K.navy }, qs); e._d = (r + c) / (2 * n); cells.push(e); }
  RP.el("div", { style: { fontFamily: "var(--fa-body)", fontWeight: 700, fontSize: u * 2.2 + "px", color: K.navy, marginTop: u * 0.8 + "px" } }, qbox, "اسکن کنید");
  tl.fromTo(card, { y: H * 0.6, rotation: 4, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 0.8, ease: "power4.out" }, 0.1);
  tl.fromTo([top, l1, l2], { opacity: 0, x: u * 4 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.15 }, 0.6);
  cells.forEach((e) => tl.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "none" }, 0.9 + e._d * 0.9));
  RP.hold(tl, card, 2.2, D - 2.8, 0.015);
  tl.to("#scene", { opacity: 0, duration: 0.55 }, D - 0.55);
});
