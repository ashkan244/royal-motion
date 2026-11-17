RP.run(function (tl, RP) {
  const { u, W, H, K, NS } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // wide soft light band crossing the frame
  const band = RP.el("div", { style: { position: "absolute", top: "-50%", left: 0, width: u * 30 + "px", height: "200%", zIndex: 45,
    background: "linear-gradient(90deg, rgba(255,240,200,0), rgba(255,240,200,.16), rgba(255,240,200,0))", transform: "rotate(20deg)" } }, sc);
  const r = RP.brandLockup({});
  RP.dust(tl, sc, 40, 8);
  // foil shine: a moving gradient masked by the logo strokes
  const lg = r.logo;
  const defs = RP.svgEl("defs", {}, lg);
  const mask = RP.svgEl("mask", { id: "foilM", maskUnits: "userSpaceOnUse", x: -5, y: -5, width: 90, height: 140 }, defs);
  const mg = RP.svgEl("g", { fill: "none", stroke: "#fff", "stroke-width": 2.2, "stroke-linecap": "round", "stroke-linejoin": "round" }, mask);
  [RP.LOGO.outer, ...RP.LOGO.mono].forEach((d) => RP.svgEl("path", { d }, mg));
  const grad = RP.svgEl("linearGradient", { id: "foilG", x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
  [["0", 0], [".4", .0], [".5", 1], [".6", 0], ["1", 0]].forEach(([o, a]) => RP.svgEl("stop", { offset: o, "stop-color": "#FFFBEA", "stop-opacity": a }, grad));
  const g = RP.svgEl("g", { mask: "url(#foilM)" }, lg);
  const bar = RP.svgEl("rect", { x: -40, y: -10, width: 40, height: 150, fill: "url(#foilG)", transform: "skewX(-20)" }, g);
  const tLock = RP.brandIn(tl, r, 0.1, "fade");
  tl.fromTo(bar, { attr: { x: -50 } }, { attr: { x: 110 }, duration: 0.9, ease: "power2.inOut" }, 0.7);
  tl.fromTo(bar, { attr: { x: -50 } }, { attr: { x: 110 }, duration: 1.1, ease: "power2.inOut", immediateRender: false }, 3.0);
  tl.fromTo(band, { x: -u * 40 }, { x: W + u * 30, duration: 1.0, ease: "power2.inOut" }, 0.65);
  tl.fromTo(lg, { filter: `drop-shadow(0 0 0px rgba(236,207,146,0))` }, { keyframes: { filter: [`drop-shadow(0 0 ${u * 2.4}px rgba(236,207,146,.7))`, `drop-shadow(0 0 ${u * 0.6}px rgba(236,207,146,.2))`] }, duration: 1.0, ease: "none" }, 0.95);
  RP.brandEnd(tl, r, tLock);
});
