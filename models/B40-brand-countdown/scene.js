RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  RP.dust(tl, sc, 24, 40);
  // hexagon ring that drains each second, Persian digits 5..1, then the lockup
  const S = u * (RP.landscape ? 62 : 70);
  const sv = RP.svgEl("svg", { viewBox: "-60 -60 120 120", style: `position:absolute;left:${W / 2 - S / 2}px;top:${H / 2 - S / 2}px;width:${S}px;height:${S}px;z-index:20` }, sc);
  const hexD = RP.hexPath(0, 0, 50);
  RP.svgEl("path", { d: hexD, fill: "none", stroke: "rgba(201,164,92,.18)", "stroke-width": 2 }, sv);
  const ring = RP.svgEl("path", { d: hexD, fill: "none", stroke: K.gold, "stroke-width": 2.4, "stroke-linejoin": "round" }, sv);
  const Lr = RP.dash(ring)[0];
  gsap.set(ring, { strokeDashoffset: 0 });
  RP.svgEl("path", { d: RP.hexPath(0, 0, 44), fill: "none", stroke: "rgba(201,164,92,.35)", "stroke-width": 0.6 }, sv);
  tl.fromTo(sv, { scale: 0.6, opacity: 0, rotation: -30 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: "back.out(1.6)" }, 0);
  tl.fromTo(ring, { strokeDashoffset: 0 }, { strokeDashoffset: Lr, duration: 4.5, ease: "none" }, 0.5);
  for (let n = 5; n >= 1; n--) {
    const e = RP.el("div", { style: { position: "absolute", left: 0, right: 0, top: H / 2 + "px", textAlign: "center", fontFamily: "var(--fa)", fontWeight: 700, fontSize: S * 0.42 + "px",
      color: K.goldLight, lineHeight: 1, zIndex: 21, opacity: 0 } }, sc, RP.faNum(n));
    gsap.set(e, { yPercent: -55 });
    const t = 0.5 + (5 - n);
    tl.fromTo(e, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.3, ease: "back.out(2)", immediateRender: false }, t);
    tl.to(e, { opacity: 0, scale: 1.5, duration: 0.25, ease: "power2.in" }, t + 0.78);
    tl.fromTo(sv, { scale: 1.04 }, { scale: 1, duration: 0.4, immediateRender: false }, t);
  }
  tl.to(sv, { scale: 1.6, opacity: 0, duration: 0.35, ease: "power2.in" }, 4.85);
  const r = RP.brandLockup({ cta: false });
  const tLock = RP.brandIn(tl, r, 5.0, "pop");
  tl.fromTo(r.c, { scale: 1 }, { scale: 1.02, duration: 1.0, immediateRender: false }, 5.6);
});
