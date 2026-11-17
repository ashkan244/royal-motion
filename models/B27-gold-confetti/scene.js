RP.run(function (tl, RP) {
  const { u, W, H, K, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const r = RP.brandLockup({});
  const tLock = RP.brandIn(tl, r, 0.2, "pop");
  // two confetti cannons from the bottom corners (seeded ballistic arcs)
  const box = RP.el("div", { class: "full", style: { zIndex: 60 } }, sc);
  const rr = RP.rng(27), cols = [K.gold, K.goldLight, K.ivory, "#d9b25f", "#ffffff"];
  for (let i = 0; i < 110; i++) {
    const left = i % 2 === 0, s = u * (0.9 + rr() * 1.4);
    const p = RP.el("i", { style: { position: "absolute", width: s + "px", height: s * (0.35 + rr() * 0.5) + "px", background: cols[i % cols.length], borderRadius: rr() > 0.7 ? "50%" : "1px",
      left: (left ? 0 : W) + "px", top: H + "px" } }, box);
    const vx = (left ? 1 : -1) * W * (0.25 + rr() * 0.55), peak = H * (0.45 + rr() * 0.5), t0 = 0.25 + rr() * 0.25, dur = 1.8 + rr() * 1.4;
    tl.fromTo(p, { x: 0, y: 0, rotation: 0, opacity: 1 },
      { keyframes: { x: [vx * 0.35, vx * 0.75, vx], y: [-peak * 0.85, -peak, -peak + H * 0.4] }, rotation: (rr() - 0.5) * 1080, duration: dur, ease: "none" }, t0);
    tl.to(p, { opacity: 0, duration: 0.4 }, Math.min(t0 + dur - 0.3, D - 0.4));
  }
  RP.brandEnd(tl, r, tLock);
});
