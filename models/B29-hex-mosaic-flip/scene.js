RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const r = RP.brandLockup({});
  // a wall of hexagon tiles flips away in a wave from the centre
  const R = u * 7, dx = Math.sqrt(3) * R, dy = 1.5 * R;
  const box = RP.el("div", { class: "full", style: { zIndex: 70, perspective: u * 120 + "px" } }, sc);
  const cx = W / 2, cy = H / 2, tiles = [], rr = RP.rng(5);
  for (let row = -1; row * dy < H + R; row++) for (let col = -1; col * dx < W + dx; col++) {
    const x = col * dx + (row % 2 ? dx / 2 : 0), y = row * dy;
    const tone = rr();
    const t = RP.el("div", { style: { position: "absolute", left: x - dx / 2 - 0.5 + "px", top: y - R - 0.5 + "px", width: dx + 1 + "px", height: 2 * R + 1 + "px", clipPath: RP.HEXCLIP,
      background: tone > 0.82 ? `linear-gradient(135deg, ${K.goldLight}, ${K.goldDeep})` : tone > 0.4 ? "#202a66" : "#151b4a" } }, box);
    t._d = Math.hypot(x - cx, y - cy) / Math.hypot(W, H);
    tiles.push(t);
  }
  tiles.forEach((t) => {
    const t0 = 0.35 + t._d * 1.4;
    tl.fromTo(t, { rotationY: 0, opacity: 1 }, { rotationY: 90, duration: 0.28, ease: "power2.in" }, t0);
    tl.set(t, { opacity: 0 }, t0 + 0.28);
  });
  const tLock = RP.brandIn(tl, r, 0.8, "pop");
  RP.brandEnd(tl, r, tLock);
});
