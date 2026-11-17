RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const r = RP.brandLockup({});
  gsap.set(r.logo, { opacity: 0 });
  const lb = RP.box(r.logo);
  const cx = lb.cx, cy = lb.cy, R = u * 4.6, dx = Math.sqrt(3) * R, rnd = RP.rng(9);
  const layer = RP.el("div", { class: "full", style: { zIndex: 55 } }, sc);
  const cells = [];
  for (let q = -3; q <= 3; q++) for (let s = -3; s <= 3; s++) {
    const t3 = -q - s; if (Math.abs(t3) > 3) continue;
    const x = cx + dx * (q + s / 2), y = cy + 1.5 * R * s;
    const c = RP.el("div", { style: { position: "absolute", left: x - dx / 2 + "px", top: y - R + "px", width: dx + "px", height: 2 * R + "px" } }, layer,
      `<svg viewBox="0 0 86.6 100" style="width:100%;height:100%;display:block"><polygon points="43.3,2 84.6,26 84.6,74 43.3,98 2,74 2,26" fill="#16205a" stroke="${K.gold}" stroke-width="3"/></svg>`);
    c._d = Math.hypot(q + s / 2, s * 0.866);
    cells.push(c);
  }
  cells.forEach((c) => {
    const t0 = 0.08 + (3 - c._d) * 0.11 + rnd() * 0.12;
    tl.fromTo(c, { x: (rnd() - 0.5) * W * 1.2, y: (rnd() - 0.5) * H * 1.2, rotation: (rnd() - 0.5) * 360, scale: 0.3, opacity: 0 },
      { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, t0);
    tl.to(c.querySelector("polygon"), { attr: { fill: K.gold }, duration: 0.15 }, 1.25 + c._d * 0.05);
    tl.to(c, { x: cx - (parseFloat(c.style.left) + dx / 2), y: cy - (parseFloat(c.style.top) + R), scale: 0, opacity: 0, duration: 0.4, ease: "power3.in" }, 1.4 + c._d * 0.03);
  });
  tl.fromTo(r.logo, { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, 1.7);
  tl.fromTo(r.logo, { filter: `drop-shadow(0 0 ${u * 3}px rgba(236,207,146,.9))` }, { filter: "drop-shadow(0 0 0px rgba(236,207,146,0))", duration: 1.0, immediateRender: false }, 1.75);
  const tLock = RP.brandIn(tl, r, 1.9, "none");
  RP.brandEnd(tl, r, tLock);
});
