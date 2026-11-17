RP.run(function (tl, RP) {
  const { u, W, H, K, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // two diagonal escalator bands with moving steps (rising toward the top-left)
  const diag = Math.hypot(W, H) * 1.2, step = u * 6;
  const mk = (off, op) => {
    const band = RP.el("div", { style: { position: "absolute", left: "50%", top: "50%", width: diag + "px", height: u * 16 + "px", overflow: "hidden", opacity: op,
      borderTop: `2px solid ${K.gold}`, borderBottom: `2px solid ${K.gold}` } }, sc);
    gsap.set(band, { xPercent: -50, yPercent: -50, y: off, rotation: 30 });
    const steps = RP.el("div", { style: { position: "absolute", top: 0, bottom: 0, left: -step * 2 + "px", width: diag + step * 4 + "px",
      background: `repeating-linear-gradient(90deg, rgba(201,164,92,.5) 0 2px, rgba(201,164,92,.08) 2px ${step}px)` } }, band);
    const wrap = gsap.utils.wrap(-step, 0);
    tl.fromTo(steps, { x: 0 }, { x: -step * (D / 0.4), duration: D, ease: "none", modifiers: { x: gsap.utils.unitize(wrap) } }, 0);
    return band;
  };
  const b1 = mk(-u * 26, 0.55), b2 = mk(u * 30, 0.3);
  tl.fromTo([b1, b2], { opacity: 0 }, { opacity: (i) => (i ? 0.3 : 0.55), duration: 0.6 }, 0);
  const r = RP.brandLockup({});
  // the badge rides up the escalator to its place
  const ang = (30 * Math.PI) / 180, dist = u * 60;
  tl.fromTo(r.logo, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 1.25, ease: "power2.out" }, 0.15);
  tl.fromTo(r.logo, { filter: `drop-shadow(0 0 ${u * 2.6}px rgba(236,207,146,.8))` }, { filter: "drop-shadow(0 0 0px rgba(236,207,146,0))", duration: 0.9, immediateRender: false }, 1.4);
  const tLock = RP.brandIn(tl, r, 1.4, "none");
  RP.brandEnd(tl, r, tLock);
});
