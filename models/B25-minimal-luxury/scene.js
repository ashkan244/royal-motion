RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // thin gold corner marks, slow and quiet — for formal content
  const m = u * 6, L = u * 9;
  const sv = RP.svgEl("svg", { viewBox: `0 0 ${W} ${H}`, style: "position:absolute;inset:0;width:100%;height:100%" }, sc);
  const cs = [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].map(([x, y, sx, sy]) =>
    RP.svgEl("path", { d: `M${x} ${y + sy * L}V${y}H${x + sx * L}`, fill: "none", stroke: K.gold, "stroke-width": 1.5 }, sv));
  const Ls = RP.dash(cs);
  cs.forEach((c, i) => tl.fromTo(c, { strokeDashoffset: Ls[i] }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.2 + i * 0.08));
  const r = RP.brandLockup({});
  tl.fromTo(r.c, { scale: 1.06 }, { scale: 1, duration: 2.6, ease: "power2.out", immediateRender: false }, 0.2);
  const tLock = RP.brandIn(tl, r, 0.3, "fade");
  RP.brandEnd(tl, r, tLock + 0.3);
});
