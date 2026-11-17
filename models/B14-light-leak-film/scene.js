RP.run(function (tl, RP) {
  const { u, W, H, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const r = RP.brandLockup({});
  // warm light leaks sweeping across
  const leaks = [["rgba(255,170,60,.55)", -0.3, 0.2, 0.0], ["rgba(255,215,140,.45)", 1.2, 0.7, 0.35], ["rgba(255,120,40,.35)", 0.4, 1.1, 0.8]];
  leaks.forEach(([c, x0, y0, t0], i) => {
    const s = Math.max(W, H) * 0.9;
    const l = RP.el("i", { style: { position: "absolute", width: s + "px", height: s + "px", borderRadius: "50%", left: W * x0 - s / 2 + "px", top: H * y0 - s / 2 + "px", zIndex: 60,
      background: `radial-gradient(circle, ${c} 0%, rgba(0,0,0,0) 65%)` } }, sc);
    tl.fromTo(l, { opacity: 0, x: 0 }, { keyframes: { opacity: [0, 1, 0.6, 0] }, x: (i % 2 ? -1 : 1) * W * 0.4, duration: 1.8, ease: "none" }, t0);
  });
  // film grain + gate flicker
  const g = RP.grain(sc, 5, 0.1); g.style.zIndex = 70;
  RP.grainSteps(tl, g, D);
  const fl = RP.el("div", { class: "full", style: { background: "#fff", opacity: 0, zIndex: 65 } }, sc);
  const rr = RP.rng(2);
  for (let t = 0.05; t < 1.4; t += 0.08) tl.set(fl, { opacity: rr() * 0.12 }, t);
  tl.set(fl, { opacity: 0 }, 1.45);
  // letterbox bars open
  const bar = (top) => RP.el("div", { style: { position: "absolute", left: 0, right: 0, height: H * 0.5 + "px", [top ? "top" : "bottom"]: 0, background: "#000", zIndex: 80 } }, sc);
  const b1 = bar(true), b2 = bar(false);
  tl.fromTo(b1, { yPercent: 0 }, { yPercent: -88, duration: 1.0, ease: "power3.inOut" }, 0.1);
  tl.fromTo(b2, { yPercent: 0 }, { yPercent: 88, duration: 1.0, ease: "power3.inOut" }, 0.1);
  tl.to([b1, b2], { opacity: 0, duration: 0.6 }, 1.3);
  const tLock = RP.brandIn(tl, r, 0.9, "fade");
  RP.brandEnd(tl, r, tLock);
});
