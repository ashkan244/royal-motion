RP.run(function (tl, RP) {
  const { u, W, H, K, T } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // giant outlined English running behind
  const bgTxt = RP.el("div", { style: { position: "absolute", left: 0, top: "50%", whiteSpace: "nowrap", fontFamily: "var(--en-o)", fontSize: u * 24 + "px",
    color: "rgba(201,164,92,.12)", letterSpacing: ".05em", lineHeight: 1 } }, sc, "ROYAL PARS · ROYAL PARS · ROYAL PARS · ROYAL PARS");
  gsap.set(bgTxt, { yPercent: -50 });
  tl.fromTo(bgTxt, { x: -u * 10 }, { x: -u * 90, duration: RP.duration, ease: "none" }, 0);
  const big = (txt, col) => {
    const e = RP.el("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", textAlign: "center", fontFamily: "var(--fa)", fontWeight: 700,
      fontSize: u * 30 + "px", color: col, direction: "rtl", whiteSpace: "nowrap", lineHeight: 1.2, zIndex: 60 } }, sc, txt);
    gsap.set(e, { yPercent: -55 });
    return { e, w: RP.words(e) };
  };
  const a = big("رویال", K.ivory), b = big("پارس", K.gold);
  tl.fromTo(a.w, { yPercent: 120 }, { yPercent: 0, duration: 0.45, ease: "power4.out" }, 0.1);
  tl.to(a.w, { yPercent: -120, duration: 0.3, ease: "power3.in" }, 0.6);
  tl.fromTo(b.w, { yPercent: 120 }, { yPercent: 0, duration: 0.45, ease: "power4.out" }, 0.75);
  tl.to(b.e, { scale: 0.18, opacity: 0, duration: 0.4, ease: "power3.in" }, 1.15);
  const r = RP.brandLockup({});
  const tLock = RP.brandIn(tl, r, 1.3, "pop");
  tl.to(bgTxt, { opacity: 0.5, duration: 0.6 }, 1.3);
  RP.brandEnd(tl, r, tLock);
});
