RP.run(function (tl, RP) {
  const { u, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const r = RP.brandLockup({});
  const lg = r.logo;
  // ghost outline first, then molten gold rises inside the strokes
  const ghosts = [r.outer, ...r.monos];
  gsap.set(ghosts, { attr: { "stroke-opacity": 0.18 } });
  const defs = RP.svgEl("defs", {}, lg);
  const mask = RP.svgEl("mask", { id: "liqM", maskUnits: "userSpaceOnUse", x: -5, y: -5, width: 90, height: 140 }, defs);
  const mg = RP.svgEl("g", { fill: "none", stroke: "#fff", "stroke-width": 1.9, "stroke-linecap": "round", "stroke-linejoin": "round" }, mask);
  [RP.LOGO.outer, ...RP.LOGO.mono].forEach((d) => RP.svgEl("path", { d }, mg));
  const gg = RP.svgEl("linearGradient", { id: "liqG", x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  [["0", "#FFF2C2"], [".25", "#ECCF92"], ["1", "#A57B34"]].forEach(([o, c]) => RP.svgEl("stop", { offset: o, "stop-color": c }, gg));
  const grp = RP.svgEl("g", { mask: "url(#liqM)" }, lg);
  let d = "M-80 6";
  for (let x = -80; x <= 160; x += 10) d += ` Q${x + 5} ${x % 20 ? 1 : 11} ${x + 10} 6`;
  d += " L160 200 L-80 200 Z";
  const wave = RP.svgEl("path", { d, fill: "url(#liqG)" }, grp);
  tl.fromTo(ghosts, { attr: { "stroke-opacity": 0 } }, { attr: { "stroke-opacity": 0.18 }, duration: 0.4 }, 0);
  tl.fromTo(r.inner, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.05);
  tl.fromTo(wave, { y: 132, x: 0 }, { y: -12, x: -40, duration: 1.75, ease: "power1.inOut" }, 0.2);
  tl.set(ghosts, { attr: { "stroke-opacity": 1 } }, 1.95);
  tl.set(grp, { opacity: 0 }, 1.95);
  tl.fromTo(lg, { filter: `drop-shadow(0 0 ${u * 3.2}px rgba(255,220,140,.9))` }, { filter: `drop-shadow(0 0 ${u * 0.5}px rgba(236,207,146,.2))`, duration: 1.2, immediateRender: false }, 1.95);
  // a few molten drops falling past
  const rr = RP.rng(6), lb = RP.box(lg);
  for (let i = 0; i < 6; i++) {
    const dr = RP.el("i", { style: { position: "absolute", width: u * 0.9 + "px", height: u * 1.3 + "px", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "#ECCF92",
      left: lb.x + lb.w * (0.2 + rr() * 0.6) + "px", top: lb.y + lb.h * 0.8 + "px", opacity: 0, zIndex: 51 } }, sc);
    const t0 = 0.9 + rr() * 0.8;
    tl.fromTo(dr, { y: 0, opacity: 0.9 }, { y: u * (25 + rr() * 20), opacity: 0, duration: 0.8, ease: "power2.in" }, t0);
  }
  const tLock = RP.brandIn(tl, r, 1.75, "none");
  RP.brandEnd(tl, r, tLock);
});
