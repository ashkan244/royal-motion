RP.run(function (tl, RP) {
  const { u, W, H, K, T, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.ivoryBg();
  // a 3x3 feed grid of brand tiles assembles, then the handle lands under it
  const S = u * (RP.landscape ? 22 : 26), g = u * 1.2, gw = S * 3 + g * 2;
  const gridBox = RP.el("div", { style: { position: "absolute", left: W / 2 - gw / 2 + "px", top: H / 2 - gw / 2 - u * 8 + "px", width: gw + "px", height: gw + "px", zIndex: 40 } }, sc);
  const tiles = [
    ["navy", "logo"], ["gold", "رویال"], ["navy", "۱۴۰۵"], ["ivory", "مد"], ["navy", "logo"], ["gold", "پارس"], ["gold", "خانواده"], ["navy", "سبک"], ["ivory", "logo"]];
  const bgs = { navy: "linear-gradient(135deg, #26306f, #121842)", gold: "linear-gradient(135deg, #ECCF92, #A57B34)", ivory: "linear-gradient(135deg, #FFFDF6, #E9DDC2)" };
  const fg = { navy: K.gold, gold: K.navyInk, ivory: K.navy };
  const els = tiles.map(([c, t], i) => {
    const e = RP.el("div", { style: { position: "absolute", width: S + "px", height: S + "px", left: (i % 3) * (S + g) + "px", top: Math.floor(i / 3) * (S + g) + "px", borderRadius: u * 1.2 + "px",
      background: bgs[c], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * 6 + "px", color: fg[c], direction: "rtl" } }, gridBox, t === "logo" ? "" : t);
    if (t === "logo") { const l = RP.logo({ parent: e, outerStroke: fg[c], innerFill: c === "ivory" ? K.navy : "rgba(0,0,0,0)", innerStroke: fg[c], innerWidth: 0.5, mono: c === "ivory" ? K.gold : fg[c] }); l.style.height = S * 0.62 + "px"; l.style.width = S * 0.37 + "px"; }
    return e;
  });
  els.forEach((e, i) => tl.fromTo(e, { scale: 0, rotation: (i % 2 ? 1 : -1) * 15, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.45, ease: "back.out(1.8)" }, 0.1 + ((i * 4) % 9) * 0.07));
  const handle = RP.el("div", { style: { position: "absolute", left: 0, right: 0, top: H / 2 + gw / 2 - u * 4 + "px", display: "flex", flexDirection: "column", alignItems: "center", gap: u * 1.6 + "px", zIndex: 41 } }, sc,
    `<div style="display:flex;align-items:center;gap:${u * 1.6}px;font-family:var(--fa-body);font-weight:700;font-size:${u * 5.4}px;color:${K.navy};direction:ltr"><span style="width:${u * 5}px;height:${u * 5}px;display:inline-flex">${RP.ICON_IG(K.goldDeep)}</span>${T.ig}</div>
     <div style="font-family:var(--fa);font-weight:700;font-size:${u * 3.6}px;color:${K.goldDeep};direction:rtl">${T.igCta}</div>`);
  RP.$$("svg", handle).forEach((s) => { s.style.width = "100%"; s.style.height = "100%"; });
  tl.fromTo(handle, { opacity: 0, y: u * 4 }, { opacity: 1, y: 0, duration: 0.6 }, 1.2);
  tl.fromTo(gridBox, { scale: 1 }, { scale: 0.97, duration: D - 1.8, ease: "none" }, 1.3);
  tl.to("#scene", { opacity: 0, duration: 0.55 }, D - 0.55);
});
