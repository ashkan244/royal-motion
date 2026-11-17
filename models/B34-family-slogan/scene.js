RP.run(function (tl, RP) {
  const { u, W, H, K, T } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  RP.dust(tl, sc, 30, 34);
  // the slogan first, large, then it settles above the lockup
  const sl = RP.el("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", textAlign: "center", fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * 10 + "px",
    color: K.goldLight, direction: "rtl", whiteSpace: "nowrap", zIndex: 60, lineHeight: 1.3 } }, sc, T.slogan);
  gsap.set(sl, { yPercent: -50 });
  const sw = RP.words(sl);
  tl.fromTo(sw, { yPercent: 120 }, { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.14 }, 0.15);
  // a gold arch line grows under the words
  const arc = RP.svgEl("svg", { viewBox: "0 0 200 40", style: `position:absolute;left:${W / 2 - u * 40}px;top:${H / 2 + u * 5}px;width:${u * 80}px;height:${u * 16}px;z-index:59` }, sc);
  const ap = RP.svgEl("path", { d: "M10 30 Q100 -10 190 30", fill: "none", stroke: K.gold, "stroke-width": 1.4 }, arc);
  const La = RP.dash(ap)[0];
  tl.fromTo(ap, { strokeDashoffset: La }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0.7);
  tl.to([sl, arc], { opacity: 0, y: -u * 6, duration: 0.45, ease: "power2.in" }, 1.25);
  const r = RP.brandLockup({});
  const tag = RP.el("div", { style: { fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * 3.6 + "px", color: K.goldLight, marginTop: u * 2.4 + "px", direction: "rtl" } }, r.c, T.slogan);
  const tLock = RP.brandIn(tl, r, 1.45, "pop");
  tl.fromTo(tag, { opacity: 0, y: u * 2 }, { opacity: 1, y: 0, duration: 0.6 }, tLock - 0.5);
  RP.brandEnd(tl, r, tLock);
});
