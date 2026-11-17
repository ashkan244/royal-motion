RP.run(function (tl, RP) {
  const { u, W, H, K, T, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // credits roll upward, then the lockup holds
  const roll = RP.el("div", { style: { position: "absolute", left: 0, right: 0, top: H + "px", display: "flex", flexDirection: "column", alignItems: "center", gap: u * 7 + "px", zIndex: 40, direction: "rtl", textAlign: "center" } }, sc);
  (RP.params.credits || []).forEach(([role, name]) => RP.el("div", {}, roll,
    `<div style="font-family:var(--fa-body);font-size:${u * 2.8}px;color:${K.gold};margin-bottom:${u * 1.2}px">${role}</div><div style="font-family:var(--fa);font-weight:700;font-size:${u * 4.6}px;color:${K.ivory}">${name}</div>`));
  RP.el("div", { style: { fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * 4 + "px", color: K.goldLight } }, roll, "با سپاس از همراهی شما");
  const rh = roll.offsetHeight;
  const tEnd = D - 4.2;
  tl.fromTo(roll, { y: 0 }, { y: -(H / 2 + rh / 2 + u * 10), duration: tEnd, ease: "none" }, 0);
  tl.to(roll, { y: -(H + rh), opacity: 0, duration: 0.8, ease: "power2.in" }, tEnd);
  const r = RP.brandLockup({});
  const tLock = RP.brandIn(tl, r, tEnd + 0.2, "draw", 0.7);
  RP.brandCtaIn(tl, r, tLock - 0.2);
  tl.to("#scene", { opacity: 0, duration: 0.5 }, D - 0.5);
});
