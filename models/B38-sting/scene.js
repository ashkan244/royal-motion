RP.run(function (tl, RP) {
  const { u, W, H, K, duration: D } = RP;
  const sc = RP.$("#scene");
  document.documentElement.style.background = "transparent"; document.body.style.background = "transparent";
  // a wave of hexagons sweeps right->left, fully covering the frame at ~0.55 s, then clears (cut under it)
  const R = Math.max(W, H) / 7, dx = Math.sqrt(3) * R, dy = 1.5 * R, rr = RP.rng(38);
  const cols = ["#1B2250", "#141a44", "#26306f", K.gold, "#1B2250"];
  for (let row = -1; row * dy < H + R; row++) for (let col = -1; col * dx < W + dx; col++) {
    const x = col * dx + (row % 2 ? dx / 2 : 0), y = row * dy;
    const t = RP.el("div", { style: { position: "absolute", left: x - dx / 2 - 1 + "px", top: y - R - 1 + "px", width: dx + 2 + "px", height: 2 * R + 2 + "px", clipPath: RP.HEXCLIP,
      background: cols[(rr() * cols.length) | 0] } }, sc);
    const delay = (1 - x / W) * 0.28 + rr() * 0.05;
    tl.fromTo(t, { scale: 0 }, { scale: 1.02, duration: 0.25, ease: "power2.out" }, 0.05 + delay);
    tl.to(t, { scale: 0, duration: 0.25, ease: "power2.in" }, 0.62 + delay);
  }
  const lg = RP.logo({ parent: sc, outerStroke: K.gold, innerFill: "#212a66", innerStroke: K.gold, innerWidth: .45, mono: K.gold });
  Object.assign(lg.style, { position: "absolute", height: u * 30 + "px", width: u * 18 + "px", left: W / 2 - u * 9 + "px", top: H / 2 - u * 15 + "px", zIndex: 10 });
  tl.fromTo(lg, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(2)" }, 0.35);
  tl.to(lg, { scale: 1.6, opacity: 0, duration: 0.2, ease: "power2.in" }, 0.62);
});
