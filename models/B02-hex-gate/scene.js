RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const glow = RP.el("div", { class: "full", style: { background: "radial-gradient(circle at 50% 46%, rgba(236,207,146,.5) 0%, rgba(201,164,92,.14) 26%, rgba(0,0,0,0) 56%)", opacity: 0 } }, sc);
  const r = RP.brandLockup({});
  RP.dust(tl, sc, 30, 4);
  // a tall hexagonal double door covering the lockup
  const gw = Math.min(W * 0.92, u * 74), gh = gw * 1.66;
  const gate = RP.el("div", { style: { position: "absolute", left: W / 2 - gw / 2 + "px", top: H / 2 - gh / 2 + "px", width: gw + "px", height: gh + "px", perspective: u * 140 + "px", zIndex: 60 } }, sc);
  const door = (side) => {
    const d = RP.el("div", { style: { position: "absolute", top: 0, [side]: 0, width: "50%", height: "100%", transformOrigin: side === "left" ? "0% 50%" : "100% 50%" } }, gate);
    const pts = side === "left" ? "100,0 0,25 0,75 100,100" : "0,0 100,25 100,75 0,100";
    const inner = side === "left" ? "100,6 6,28 6,72 100,94" : "0,6 94,28 94,72 0,94";
    const hx = side === "left" ? 88 : 12;
    d.innerHTML = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width:100%;height:100%;display:block">
      <defs><linearGradient id="dg${side}" x1="${side === "left" ? 0 : 1}" x2="${side === "left" ? 1 : 0}"><stop offset="0" stop-color="#121842"/><stop offset="1" stop-color="#26306f"/></linearGradient></defs>
      <polygon points="${pts}" fill="url(#dg${side})" stroke="${K.gold}" stroke-width="2" vector-effect="non-scaling-stroke"/>
      <polygon points="${inner}" fill="none" stroke="${K.gold}" stroke-opacity=".55" stroke-width="1" vector-effect="non-scaling-stroke"/>
      <rect x="${hx - 1.2}" y="44" width="2.4" height="12" rx="1.2" fill="${K.goldLight}"/></svg>`;
    return d;
  };
  const L = door("left"), R = door("right");
  const seam = RP.el("div", { style: { position: "absolute", left: "50%", top: "4%", width: u * 0.5 + "px", height: "92%", marginLeft: -u * 0.25 + "px",
    background: "linear-gradient(180deg, transparent, #fff8e0, transparent)", boxShadow: `0 0 ${u * 3}px #ECCF92`, opacity: 0, zIndex: 2 } }, gate);
  tl.fromTo(gate, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" }, 0);
  tl.fromTo(seam, { opacity: 0, scaleY: 0.2 }, { opacity: 1, scaleY: 1, duration: 0.4, ease: "power2.out" }, 0.4);
  tl.to(seam, { opacity: 0, duration: 0.2 }, 0.85);
  tl.fromTo(L, { rotationY: 0 }, { rotationY: -108, duration: 1.0, ease: "power3.inOut" }, 0.75);
  tl.fromTo(R, { rotationY: 0 }, { rotationY: 108, duration: 1.0, ease: "power3.inOut" }, 0.75);
  tl.to(gate, { opacity: 0, duration: 0.4 }, 1.5);
  tl.fromTo(glow, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, 0.85);
  tl.to(glow, { opacity: 0.45, duration: 1.5, ease: "sine.inOut" }, 1.9);
  const tLock = RP.brandIn(tl, r, 1.1, "fade");
  RP.brandEnd(tl, r, tLock);
});
