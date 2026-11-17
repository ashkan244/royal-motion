RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.ivoryBg();
  // a 3x3 typographic grid of brand words that shuffles before resolving into the lockup
  const words = ["سبک", "خانواده", "رویال", "خرید", "اهواز", "پارس", "لذت", "مد", "۱۴۰۵"];
  const S = Math.min(W, H) * 0.9 / 3, ox = W / 2 - S * 1.5, oy = H / 2 - S * 1.5;
  const grid = RP.svgEl("svg", { viewBox: `0 0 ${W} ${H}`, style: "position:absolute;inset:0;width:100%;height:100%" }, sc);
  const lines = [];
  for (let i = 0; i <= 3; i++) {
    lines.push(RP.svgEl("line", { x1: ox, y1: oy + S * i, x2: ox + S * 3, y2: oy + S * i, stroke: K.navy, "stroke-width": 2 }, grid));
    lines.push(RP.svgEl("line", { x1: ox + S * i, y1: oy, x2: ox + S * i, y2: oy + S * 3, stroke: K.navy, "stroke-width": 2 }, grid));
  }
  const L = RP.dash(lines);
  lines.forEach((l, i) => tl.fromTo(l, { strokeDashoffset: L[i] }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, 0.02 * i));
  const cells = words.map((w, i) => {
    const e = RP.el("div", { style: { position: "absolute", width: S + "px", height: S + "px", display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * (w.length > 4 ? 6 : 8.5) + "px", color: i % 4 === 2 ? K.goldDeep : K.navy, direction: "rtl" } }, sc, w);
    return e;
  });
  const perm = [[0, 1, 2, 3, 4, 5, 6, 7, 8], [2, 0, 5, 1, 4, 8, 3, 6, 7], [5, 2, 8, 0, 4, 7, 1, 3, 6], [8, 5, 7, 2, 4, 6, 0, 1, 3]];
  const pos = (k) => [ox + S * (k % 3), oy + S * Math.floor(k / 3)];
  cells.forEach((c, i) => { const [x, y] = pos(perm[0][i]); gsap.set(c, { left: 0, top: 0, x, y }); });
  tl.fromTo(cells, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)", stagger: 0.04 }, 0.15);
  [0.65, 0.95, 1.25].forEach((t, s) => cells.forEach((c, i) => { const [x, y] = pos(perm[s + 1][i]); tl.to(c, { x, y, duration: 0.24, ease: "power3.inOut" }, t); }));
  tl.to([...cells, grid], { opacity: 0, scale: 0.9, duration: 0.3, stagger: 0.01 }, 1.5);
  const r = RP.brandLockup({ theme: "ivory" });
  const tLock = RP.brandIn(tl, r, 1.55, "pop");
  RP.brandEnd(tl, r, tLock);
});
