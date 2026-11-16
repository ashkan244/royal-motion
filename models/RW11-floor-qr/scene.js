RP.run(function (tl, RP) {
  const { u, T, K, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const lay = RP.el("div", { id: "lay" }, sc);
  const info = RP.el("div", { id: "info" }, lay,
    `<div class="badge">ROYAL WEEK</div><div id="floor">${T.floorName}</div><div id="sub">تخفیف‌های این طبقه</div><div id="scan">اسکن کن و ببین</div>`);
  const box = RP.el("div", { id: "qrBox" }, lay);
  if (RP.landscape) lay.insertBefore(box, info);   // RTL reading: text on the right
  // QR modules as individual rects so they can pop in
  const qr = qrcode(0, "M"); qr.addData(T.floorUrl); qr.make();
  const n = qr.getModuleCount(), q = 2;
  const svg = RP.svgEl("svg", { viewBox: `${-q} ${-q} ${n + 2 * q} ${n + 2 * q}`, "shape-rendering": "crispEdges" }, box);
  const cells = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qr.isDark(r, c)) {
    const e = RP.svgEl("rect", { x: c, y: r, width: 1.02, height: 1.02, fill: K.rwBlack }, svg);
    e._d = Math.hypot(r - n / 2, c - n / 2) / (n / 1.4);
    cells.push(e);
  }
  RP.el("div", { class: "url" }, box, T.floorShort);
  // corner brackets + scan beam
  const s = u * 3.4, br = [];
  [["left", "top", "0 0 1 1"], ["right", "top", "0 1 1 0"], ["left", "bottom", "1 0 0 1"], ["right", "bottom", "1 1 0 0"]].forEach(([h, v, bw], i) => {
    const b = RP.el("div", { class: "brk" }, box);
    const [t, rgt, btm, lft] = bw.split(" ").map(Number);
    gsap.set(b, { [h]: -s * 0.7, [v]: -s * 0.7, borderTopWidth: t ? "" : 0, borderRightWidth: rgt ? "" : 0, borderBottomWidth: btm ? "" : 0, borderLeftWidth: lft ? "" : 0 });
    br.push(b);
  });
  const beam = RP.el("div", { id: "beam" }, box);
  // timeline
  tl.fromTo(box, { scale: 0.7, opacity: 0, rotation: -4 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.6)" }, 0.1);
  cells.forEach((e) => tl.fromTo(e, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, 0.6 + e._d * 1.2));
  tl.fromTo(br, { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.06 }, 1.9);
  const bh = box.offsetHeight;
  tl.fromTo(beam, { y: u * 2, opacity: 0 }, { y: bh - u * 6, opacity: 1, duration: 1.1, ease: "sine.inOut", yoyo: true, repeat: Math.floor((D - 2.4) / 1.1) - 1 }, 2.3);
  const fw = RP.words(RP.$("#floor")), sw = RP.words(RP.$("#sub"));
  tl.fromTo(".badge", { opacity: 0, scaleX: 1.4 }, { opacity: 1, scaleX: 1, duration: 0.7 }, 0.3);
  tl.fromTo(fw, { yPercent: 120 }, { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.1 }, 0.45);
  tl.fromTo(sw, { yPercent: 120 }, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.08 }, 0.8);
  tl.fromTo("#scan", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.2)" }, 1.2);
  for (let t = 3; t < D - 0.5; t += 1.5) tl.fromTo("#scan", { scale: 1 }, { keyframes: { scale: [1, 1.08, 1] }, duration: 0.5, ease: "none", immediateRender: false }, t);
});
