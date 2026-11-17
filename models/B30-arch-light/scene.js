RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // the invitation arch: drawn in gold, then light pours out of it
  const r = RP.brandLockup({});
  const lb = RP.box(r.c);
  const aw = Math.min(W * 0.86, lb.w > 0 ? Math.max(u * 62, u * 70) : u * 70), ah = Math.min(H * 0.86, lb.h + u * 30);
  const ax = W / 2 - aw / 2, ay = H / 2 - ah / 2 + u * 2, rad = aw / 2;
  const sv = RP.svgEl("svg", { viewBox: `0 0 ${W} ${H}`, style: "position:absolute;inset:0;width:100%;height:100%;z-index:20" }, sc);
  const arch = (inset, w, c) => RP.svgEl("path", { d: `M${ax + inset} ${ay + ah}V${ay + rad}A${rad - inset} ${rad - inset} 0 0 1 ${ax + aw - inset} ${ay + rad}V${ay + ah}`,
    fill: "none", stroke: c, "stroke-width": w }, sv);
  const a1 = arch(0, u * 0.45, K.gold), a2 = arch(u * 1.6, u * 0.15, K.goldLight);
  const L = RP.dash([a1, a2]);
  tl.fromTo(a1, { strokeDashoffset: L[0] }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.05);
  tl.fromTo(a2, { strokeDashoffset: -L[1] }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.15);
  // light inside the arch
  const light = RP.el("div", { style: { position: "absolute", left: ax + "px", top: ay + "px", width: aw + "px", height: ah + "px", zIndex: 10,
    borderRadius: `${rad}px ${rad}px 0 0`, background: "radial-gradient(ellipse at 50% 55%, rgba(255,236,190,.42) 0%, rgba(201,164,92,.12) 45%, rgba(0,0,0,0) 75%)" } }, sc);
  tl.fromTo(light, { opacity: 0, scaleY: 0.4, transformOrigin: "50% 100%" }, { opacity: 1, scaleY: 1, duration: 0.9, ease: "power2.out" }, 1.0);
  // floor line + diamonds
  const fl = RP.svgEl("path", { d: `M${ax - u * 6} ${ay + ah}H${ax + aw + u * 6}`, stroke: K.gold, "stroke-width": u * 0.2 }, sv);
  const Lf = RP.dash(fl)[0];
  tl.fromTo(fl, { strokeDashoffset: Lf }, { strokeDashoffset: 0, duration: 0.8 }, 0.6);
  const tLock = RP.brandIn(tl, r, 1.15, "fade");
  if (RP.mode === "outro") tl.to([sv, light], { opacity: 0, duration: 0.5 }, Math.max(tLock, 2.2));
  RP.brandEnd(tl, r, tLock);
});
