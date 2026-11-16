RP.run(function (tl, RP) {
  const { u, W, H, T, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 2.6 : 2.3;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  // radial speed rays
  const rays = RP.svgEl("svg", { id: "rays", viewBox: `0 0 ${W} ${H}` }, sc);
  const R = Math.hypot(W, H);
  for (let i = 0; i < 36; i++) {
    const a = (i / 36) * Math.PI * 2, a2 = a + Math.PI / 72;
    RP.svgEl("path", { d: `M${W / 2} ${H / 2}L${W / 2 + Math.cos(a) * R} ${H / 2 + Math.sin(a) * R}L${W / 2 + Math.cos(a2) * R} ${H / 2 + Math.sin(a2) * R}Z`, fill: "rgba(0,0,0,.12)" }, rays);
  }
  tl.fromTo(rays, { rotation: 0, transformOrigin: "50% 50%" }, { rotation: 20, duration: D, ease: "none" }, 0);
  // comic burst
  const pts = [];
  for (let i = 0; i < 32; i++) { const rr = i % 2 ? 34 : 50, a = (i / 32) * Math.PI * 2; pts.push([(50 + Math.cos(a) * rr).toFixed(1), (50 + Math.sin(a) * rr * 0.92).toFixed(1)]); }
  const inner = pts.map(([x, y]) => [(50 + (x - 50) * 0.82).toFixed(1), (50 + (y - 50) * 0.82).toFixed(1)]);
  const burst = RP.el("div", { id: "burst" }, sc,
    `<svg viewBox="0 0 100 100"><polygon points="${pts.map((p) => p.join(",")).join(" ")}" fill="${K.rwBlack}"/><polygon points="${inner.map((p) => p.join(",")).join(" ")}" fill="#ffffff"/></svg>`);
  gsap.set(burst, { xPercent: -50, yPercent: -50 });
  tl.fromTo(burst, { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.6)" }, 0.12);
  tl.to(burst, { rotation: 8, duration: tc - 0.5, ease: "sine.inOut" }, 0.5);
  const pow = RP.el("div", { id: "pow" }, sc, "رویالی!");
  gsap.set(pow, { yPercent: -55, rotation: -8 });
  tl.fromTo(pow, { scale: 3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power4.in" }, 0.15);
  tl.fromTo(sc, { x: 0 }, { keyframes: { x: [u, -u, u * 0.5, 0] }, duration: 0.2, ease: "none", immediateRender: false }, 0.4);
  // caption boxes
  const c1 = RP.el("div", { class: "cap" }, sc, T.rwS1), c2 = RP.el("div", { class: "cap" }, sc, T.rwName);
  gsap.set(c1, { left: W * 0.5 - u * 30, top: H / 2 - u * 42, rotation: -4 });
  gsap.set(c2, { left: W * 0.5 + u * 2, top: H / 2 + u * 30, rotation: 3 });
  tl.fromTo(c1, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.4)" }, 0.7);
  tl.fromTo(c2, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2.4)" }, 0.85);
  tl.to([burst, pow, c1, c2], { scale: 0, opacity: 0, duration: 0.35, ease: "back.in(1.6)", stagger: 0.04 }, tc - 0.45);
  const rc = RP.rwCard({ theme: "yellow", links: outro });
  RP.rwCardIn(tl, rc, tc, "slam");
  RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
});
