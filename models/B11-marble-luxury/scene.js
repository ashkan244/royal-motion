RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  // procedural ivory marble (seeded value noise, rendered once)
  const cw = 360, ch = Math.round(360 * H / W);
  const cv = document.createElement("canvas"); cv.width = cw; cv.height = ch;
  const x = cv.getContext("2d"), img = x.createImageData(cw, ch), rr = RP.rng(77);
  const G = 64, grid = []; for (let i = 0; i < G * G; i++) grid.push(rr());
  const sm = (t) => t * t * (3 - 2 * t);
  const vn = (px, py) => { const xi = Math.floor(px), yi = Math.floor(py), xf = sm(px - xi), yf = sm(py - yi), g = (a, b) => grid[((b % G + G) % G) * G + ((a % G + G) % G)];
    const a0 = g(xi, yi) + (g(xi + 1, yi) - g(xi, yi)) * xf, a1 = g(xi, yi + 1) + (g(xi + 1, yi + 1) - g(xi, yi + 1)) * xf; return a0 + (a1 - a0) * yf; };
  for (let j = 0; j < ch; j++) for (let i = 0; i < cw; i++) {
    let f = 0, amp = 1, fr = 0.012;
    for (let o = 0; o < 5; o++) { f += vn(i * fr * 10, j * fr * 10) * amp; amp *= 0.5; fr *= 2; }
    const v = Math.abs(Math.sin((i * 0.007 + j * 0.0045 + f * 2.4) * Math.PI));
    const vein = Math.pow(1 - v, 3.2) * 0.85, k = (j * cw + i) * 4;
    img.data[k] = 246 - vein * 70; img.data[k + 1] = 240 - vein * 74; img.data[k + 2] = 227 - vein * 90; img.data[k + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  RP.el("div", { class: "full", style: { backgroundImage: `url(${cv.toDataURL()})`, backgroundSize: "cover" } }, sc);
  RP.el("div", { class: "full", style: { background: "radial-gradient(ellipse at 50% 45%, rgba(255,255,255,.35) 0%, rgba(0,0,0,0) 45%, rgba(60,45,20,.18) 100%)" } }, sc);
  // gold double frame
  const fr = RP.svgEl("svg", { viewBox: `0 0 ${W} ${H}`, style: "position:absolute;inset:0;width:100%;height:100%" }, sc);
  const m1 = u * 4, m2 = u * 5.4;
  const f1 = RP.svgEl("rect", { x: m1, y: m1, width: W - 2 * m1, height: H - 2 * m1, fill: "none", stroke: K.goldDeep, "stroke-width": u * 0.35 }, fr);
  const f2 = RP.svgEl("rect", { x: m2, y: m2, width: W - 2 * m2, height: H - 2 * m2, fill: "none", stroke: K.gold, "stroke-width": u * 0.15 }, fr);
  const L = RP.dash([f1, f2]);
  tl.fromTo(f1, { strokeDashoffset: L[0] }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.05);
  tl.fromTo(f2, { strokeDashoffset: -L[1] }, { strokeDashoffset: 0, duration: 1.4, ease: "power2.inOut" }, 0.15);
  const r = RP.brandLockup({ theme: "ivory" });
  const tLock = RP.brandIn(tl, r, 0.35, "draw", 0.9);
  RP.brandEnd(tl, r, tLock);
});
