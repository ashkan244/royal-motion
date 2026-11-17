RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.el("div", { class: "full", style: { background: "radial-gradient(circle at 50% 46%, #26306f 0%, #0E1330 45%, #04061a 100%)" } }, sc);
  // flying through a tunnel of hexagon rings (scale grows exponentially = perspective)
  const box = RP.el("div", { class: "full", style: { zIndex: 10 } }, sc);
  const cx = W / 2, cy = H * 0.46, base = u * 12;
  const n = 16, period = 1.7;
  for (let i = 0; i < n; i++) {
    const ring = RP.el("div", { style: { position: "absolute", left: cx - base / 2 + "px", top: cy - base * 0.583 + "px", width: base + "px", height: base * 1.166 + "px" } }, box,
      `<svg viewBox="0 0 86.6 100" style="width:100%;height:100%"><polygon points="43.3,1 85.6,25.5 85.6,74.5 43.3,99 1,74.5 1,25.5" fill="none" stroke="${i % 3 ? K.gold : K.goldLight}" stroke-width="${i % 3 ? 0.6 : 1.1}" vector-effect="non-scaling-stroke"/></svg>`);
    const t0 = (i / n) * period;
    tl.fromTo(ring, { scale: 0.05, opacity: 0, rotation: i * 4 }, { keyframes: { scale: [0.05, 1, 4, 14], opacity: [0, 0.9, 0.7, 0] }, rotation: i * 4 + 30, duration: period, ease: "power2.in" }, t0 * 0.6);
  }
  tl.to(box, { opacity: 0, duration: 0.4 }, 1.55);
  const flash = RP.el("div", { class: "full", style: { background: "radial-gradient(circle at 50% 46%, rgba(255,245,215,.9), rgba(255,245,215,0) 55%)", opacity: 0, zIndex: 60 } }, sc);
  tl.fromTo(flash, { opacity: 0 }, { keyframes: { opacity: [0, 1, 0] }, duration: 0.6, ease: "none" }, 1.45);
  const r = RP.brandLockup({});
  tl.fromTo(r.logo, { scale: 0.05, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.55, ease: "expo.out" }, 1.55);
  const tLock = RP.brandIn(tl, r, 1.7, "none");
  RP.brandEnd(tl, r, tLock);
});
