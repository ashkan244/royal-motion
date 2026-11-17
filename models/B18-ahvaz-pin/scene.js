RP.run(function (tl, RP) {
  const { u, W, H, K, T } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // stylised city map: the Karun river and a few avenues (not a survey map)
  const map = RP.el("div", { class: "full" }, sc);
  const sv = RP.svgEl("svg", { viewBox: "0 0 100 100", preserveAspectRatio: "xMidYMid slice", style: "position:absolute;inset:0;width:100%;height:100%" }, map);
  const river = RP.svgEl("path", { d: "M-5 18 C20 22 30 40 46 46 S62 58 70 72 S88 92 108 96", fill: "none", stroke: "rgba(120,160,220,.45)", "stroke-width": 3.2, "stroke-linecap": "round" }, sv);
  const roads = ["M10 0 L30 100", "M0 62 L100 38", "M60 0 L48 100", "M0 84 L100 76", "M84 0 L72 100"].map((d) =>
    RP.svgEl("path", { d, fill: "none", stroke: "rgba(201,164,92,.28)", "stroke-width": 0.5 }, sv));
  const L = RP.dash([river, ...roads]);
  tl.fromTo(river, { strokeDashoffset: L[0] }, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, 0.05);
  roads.forEach((p, i) => tl.fromTo(p, { strokeDashoffset: L[i + 1] }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.out" }, 0.2 + i * 0.08));
  // pin drop
  const px = W * 0.56, py = H * 0.5;
  const pin = RP.el("div", { style: { position: "absolute", left: px - u * 4 + "px", top: py - u * 10.5 + "px", width: u * 8 + "px", height: u * 10.5 + "px", zIndex: 30 } }, sc,
    `<svg viewBox="0 0 20 26" style="width:100%;height:100%"><path d="M10 25s8-8.6 8-14.5A8 8 0 0 0 2 10.5C2 16.4 10 25 10 25z" fill="${K.gold}"/><circle cx="10" cy="10.5" r="3.2" fill="${K.navy}"/></svg>`);
  const lab = RP.el("div", { style: { position: "absolute", left: px + u * 5 + "px", top: py - u * 9 + "px", fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * 4 + "px", color: K.ivory, zIndex: 30 } }, sc, T.city);
  tl.fromTo(pin, { y: -u * 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out" }, 0.75);
  tl.fromTo(lab, { opacity: 0, x: -u * 2 }, { opacity: 1, x: 0, duration: 0.4 }, 1.1);
  for (let i = 0; i < 2; i++) {
    const ring = RP.el("i", { style: { position: "absolute", left: px - u * 6 + "px", top: py - u * 1.5 + "px", width: u * 12 + "px", height: u * 3 + "px", borderRadius: "50%", border: `2px solid ${K.gold}`, zIndex: 29 } }, sc);
    tl.fromTo(ring, { scale: 0.2, opacity: 0.9 }, { scale: 2.4, opacity: 0, duration: 0.9, ease: "power2.out" }, 1.15 + i * 0.3);
  }
  // fly into the pin, then the lockup
  tl.to([map, pin, lab], { scale: 2.6, opacity: 0, transformOrigin: `${(px / W) * 100}% ${(py / H) * 100}%`, duration: 0.6, ease: "power3.in" }, 1.55);
  const r = RP.brandLockup({});
  const tLock = RP.brandIn(tl, r, 1.75, "pop");
  RP.brandEnd(tl, r, tLock);
});
