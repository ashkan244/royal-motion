RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const r = RP.brandLockup({});
  gsap.set(r.logo, { opacity: 0 });
  // sample target points along the badge outline and monogram strokes
  const paths = [r.outer, ...r.monos], pts = [];
  paths.forEach((p) => {
    const L = p.getTotalLength(), n = Math.max(8, Math.round(L / 2.1));
    for (let i = 0; i < n; i++) { const q = p.getPointAtLength((L * i) / n); pts.push(RP.logoPt(r.logo, q.x, q.y)); }
  });
  const layer = RP.el("div", { class: "full", style: { zIndex: 55 } }, sc);
  const rr = RP.rng(23), s = u * 0.75;
  pts.forEach(([x, y], i) => {
    const p = RP.el("i", { style: { position: "absolute", left: x - s / 2 + "px", top: y - s / 2 + "px", width: s + "px", height: s + "px", borderRadius: "50%",
      background: "radial-gradient(circle, #fffbe6 0%, #ECCF92 45%, rgba(201,164,92,0) 75%)" } }, layer);
    const a = rr() * Math.PI * 2, dist = Math.max(W, H) * (0.4 + rr() * 0.5);
    const t0 = 0.05 + rr() * 0.35;
    tl.fromTo(p, { x: Math.cos(a) * dist, y: Math.sin(a) * dist, scale: 2.5 + rr() * 2, opacity: 0 },
      { x: 0, y: 0, scale: 1, opacity: 1, duration: 1.2 + rr() * 0.2, ease: "power3.inOut" }, t0);
  });
  tl.fromTo(r.logo, { opacity: 0 }, { opacity: 1, duration: 0.35 }, 1.55);
  tl.to(layer, { opacity: 0, duration: 0.45 }, 1.65);
  tl.fromTo(r.logo, { filter: `drop-shadow(0 0 ${u * 3}px rgba(236,207,146,.9))` }, { filter: "drop-shadow(0 0 0px rgba(236,207,146,0))", duration: 1.0, immediateRender: false }, 1.6);
  RP.dust(tl, sc, 24, 3);
  const tLock = RP.brandIn(tl, r, 1.7, "none");
  RP.brandEnd(tl, r, tLock);
});
