RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const r = RP.brandLockup({});
  RP.dust(tl, sc, 24, 19);
  // diagonal brand stripes cover the frame, then slide away to reveal the lockup
  const diag = Math.hypot(W, H);
  const box = RP.el("div", { style: { position: "absolute", left: "50%", top: "50%", width: diag * 1.3 + "px", zIndex: 70, display: "flex", flexDirection: "column" } }, sc);
  gsap.set(box, { xPercent: -50, yPercent: -50, rotation: -32 });
  const cols = ["#0E1330", K.gold, "#1B2250", K.ivory, "#26306f", K.goldDeep, "#0E1330", K.gold, "#1B2250"];
  const n = cols.length, sh = (diag * 1.15) / n;
  cols.forEach((c, i) => {
    const s = RP.el("div", { style: { height: sh + "px", background: c } }, box);
    const dir = i % 2 ? 1 : -1;
    tl.fromTo(s, { xPercent: dir * 110 }, { xPercent: 0, duration: 0.42, ease: "power3.out" }, 0.02 * i);
    tl.to(s, { xPercent: -dir * 110, duration: 0.5, ease: "power3.in" }, 0.6 + 0.045 * i);
  });
  const tLock = RP.brandIn(tl, r, 0.95, "pop");
  RP.brandEnd(tl, r, tLock);
});
