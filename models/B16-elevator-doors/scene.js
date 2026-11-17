RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const glow = RP.el("div", { class: "full", style: { background: "radial-gradient(ellipse at 50% 50%, rgba(255,240,200,.3) 0%, rgba(0,0,0,0) 55%)", opacity: 0 } }, sc);
  const r = RP.brandLockup({});
  // brushed-gold doors
  const metal = "repeating-linear-gradient(90deg, rgba(255,255,255,.06) 0 2px, rgba(0,0,0,.05) 2px 4px), linear-gradient(90deg, #8f6c2f, #d9b56b 35%, #f2dca3 50%, #c69c50 70%, #8a672b)";
  const door = (side) => RP.el("div", { style: { position: "absolute", top: 0, bottom: 0, [side]: 0, width: "50%", background: metal, zIndex: 70,
    boxShadow: side === "left" ? "inset -3px 0 0 rgba(0,0,0,.35)" : "inset 3px 0 0 rgba(0,0,0,.35)" } }, sc);
  const L = door("left"), R = door("right");
  // floor indicator
  const ind = RP.el("div", { style: { position: "absolute", left: "50%", top: (RP.portrait ? H * 0.16 : H * 0.08) + "px", zIndex: 80, display: "flex", alignItems: "center", gap: u * 1.6 + "px",
    padding: `${u * 1}px ${u * 2.6}px`, background: "#0b0d1f", border: `2px solid ${K.gold}`, borderRadius: u * 1.2 + "px" } }, sc);
  gsap.set(ind, { xPercent: -50 });
  const arrow = RP.el("span", { style: { color: K.gold, fontSize: u * 3.6 + "px", lineHeight: 1 } }, ind, "▲");
  const nums = ["۱", "۲", "۳", "۴", "۵", "۶"].map((n) => RP.el("span", { style: { fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * 4.4 + "px", color: "rgba(236,207,146,.25)", lineHeight: 1 } }, ind, n));
  tl.fromTo(ind, { opacity: 0, y: -u * 3 }, { opacity: 1, y: 0, duration: 0.35 }, 0);
  nums.forEach((n, i) => {
    tl.to(n, { color: "#FFE7A8", textShadow: `0 0 ${u}px #ECCF92`, duration: 0.05 }, 0.15 + i * 0.18);
    if (i < nums.length - 1) tl.to(n, { color: "rgba(236,207,146,.25)", textShadow: "0 0 0 transparent", duration: 0.05 }, 0.15 + (i + 1) * 0.18);
  });
  tl.fromTo(arrow, { y: 0 }, { keyframes: { y: [0, -u * 0.6, 0, -u * 0.6, 0, -u * 0.6, 0] }, duration: 1.1, ease: "none" }, 0.15);
  tl.fromTo([L, R], { xPercent: 0 }, { xPercent: (i) => (i ? 100 : -100), duration: 0.85, ease: "power2.inOut" }, 1.35);
  tl.to(ind, { opacity: 0, y: -u * 4, duration: 0.4 }, 1.6);
  tl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.4);
  const tLock = RP.brandIn(tl, r, 1.45, "fade");
  RP.brandEnd(tl, r, tLock);
});
