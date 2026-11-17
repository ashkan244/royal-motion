RP.run(function (tl, RP) {
  const { u, W, H, K, T, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // end screen: two video slots (to overlay in the editor) + handle
  const slotW = RP.landscape ? u * 62 : u * 70, slotH = slotW * 9 / 16;
  const wrap = RP.el("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", display: "flex", flexDirection: RP.landscape ? "row-reverse" : "column", alignItems: "center", justifyContent: "center",
    gap: u * 4 + "px", zIndex: 40 } }, sc);
  gsap.set(wrap, { yPercent: -50, y: -u * 6 });
  const slot = (label) => RP.el("div", { style: { width: slotW + "px", height: slotH + "px", borderRadius: u * 2 + "px", border: `2px solid ${K.gold}`, background: "rgba(9,12,34,.6)", position: "relative",
    display: "flex", alignItems: "center", justifyContent: "center" } }, wrap,
    `<svg viewBox="0 0 24 24" style="width:${u * 9}px;height:${u * 9}px"><circle cx="12" cy="12" r="11" fill="none" stroke="${K.gold}" stroke-width="1.2"/><path d="M10 8l6 4-6 4z" fill="${K.gold}"/></svg>
     <div style="position:absolute;top:${-u * 5}px;right:0;font-family:var(--fa);font-weight:700;font-size:${u * 3.4}px;color:${K.goldLight};direction:rtl">${label}</div>`);
  const s1 = slot("قسمت بعد"), s2 = slot("ویدیوی پیشنهادی");
  const foot = RP.el("div", { style: { position: "absolute", left: 0, right: 0, bottom: (RP.portrait ? H * 0.12 : u * 6) + "px", display: "flex", justifyContent: "center", alignItems: "center", gap: u * 2 + "px",
    fontFamily: "var(--fa-body)", fontWeight: 700, fontSize: u * 4 + "px", color: K.ivory, direction: "ltr", zIndex: 40 } }, sc,
    `<span style="width:${u * 4.4}px;height:${u * 4.4}px;display:inline-flex">${RP.ICON_IG(K.gold)}</span>${T.ig}`);
  RP.$$("svg", foot).forEach((s) => { s.style.width = "100%"; s.style.height = "100%"; });
  const lg = RP.logo({ parent: sc, outerStroke: K.gold, innerFill: "#212a66", innerStroke: K.gold, innerWidth: 0.45, mono: K.gold });
  Object.assign(lg.style, { position: "absolute", height: u * 12 + "px", width: u * 7.2 + "px", left: W / 2 - u * 3.6 + "px", top: (RP.portrait ? H * 0.08 : u * 4) + "px", zIndex: 40 });
  tl.fromTo(lg, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 0.1);
  tl.fromTo([s1, s2], { opacity: 0, y: u * 8, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", stagger: 0.15 }, 0.3);
  tl.fromTo(foot, { opacity: 0, y: u * 3 }, { opacity: 1, y: 0, duration: 0.5 }, 0.9);
  RP.hold(tl, wrap, 1.5, D - 2.1, 0.015);
  tl.to("#scene", { opacity: 0, duration: 0.5 }, D - 0.5);
});
