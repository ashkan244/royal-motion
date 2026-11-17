RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.el("div", { class: "full", style: { background: "#070a1c" } }, sc);
  // scanlines
  RP.el("div", { class: "full", style: { zIndex: 80, opacity: 0.18, background: "repeating-linear-gradient(0deg, rgba(0,0,0,.6) 0 2px, transparent 2px 4px)" } }, sc);
  // colour-split ghosts of the badge, sliced and jittered, then they lock together
  const ghost = (col, z) => {
    const b = RP.brandLockup({ cta: false, logoOpts: { outerStroke: col, innerFill: "rgba(0,0,0,0)", innerStroke: col, mono: col } });
    b.c.style.zIndex = z; b.c.style.mixBlendMode = "screen";
    gsap.set([b.fa, b.en], { color: col }); gsap.set(b.rule, { opacity: 0 });
    return b;
  };
  const gA = ghost("#00E5FF", 51), gB = ghost("#FF3B6B", 52);
  const r = RP.brandLockup({});
  const rr = RP.rng(13);
  for (let t = 0; t < 1.1; t += 1 / 15) {
    const k = 1 - t / 1.1;
    tl.set(gA.c, { x: (rr() - 0.5) * u * 6 * k, y: (rr() - 0.5) * u * 2 * k, clipPath: `inset(${(rr() * 60) | 0}% 0 ${(rr() * 30) | 0}% 0)`, opacity: 0.9 }, t);
    tl.set(gB.c, { x: (rr() - 0.5) * u * 6 * k, y: (rr() - 0.5) * u * 2 * k, clipPath: `inset(${(rr() * 30) | 0}% 0 ${(rr() * 60) | 0}% 0)`, opacity: 0.9 }, t);
    tl.set(r.c, { x: (rr() - 0.5) * u * 3 * k, opacity: rr() > 0.35 ? 1 : 0.2, skewX: (rr() - 0.5) * 20 * k }, t);
  }
  tl.set([gA.c, gB.c], { opacity: 0 }, 1.12);
  tl.set(r.c, { x: 0, skewX: 0, opacity: 1 }, 1.12);
  const flash = RP.el("div", { class: "full", style: { background: "#fff", opacity: 0, zIndex: 85 } }, sc);
  tl.fromTo(flash, { opacity: 0.7 }, { opacity: 0, duration: 0.3, immediateRender: false }, 1.12);
  const tLock = RP.brandIn(tl, r, 0.0, "none");
  // a couple of after-glitches while holding
  if (RP.mode !== "outro") [2.6, 3.9].forEach((t) => {
    tl.set(gA.c, { opacity: 0.8, x: u * 1.2, clipPath: "inset(40% 0 45% 0)" }, t);
    tl.set(gA.c, { opacity: 0 }, t + 0.08);
  });
  RP.brandEnd(tl, r, Math.max(tLock, 1.3));
});
