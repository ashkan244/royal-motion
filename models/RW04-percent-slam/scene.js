RP.run(function (tl, RP) {
  const { u, W, H, T, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 2.65 : 2.35;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const flash = RP.el("div", { id: "flash", class: "full" }, sc);
  const cr = RP.svgEl("svg", { id: "cracks", viewBox: `0 0 ${W} ${H}` }, sc);
  const nums = RP.params.nums;
  const times = [0.15, 0.55, 0.95, 1.35];
  const els = nums.map((n, i) => {
    const last = i === nums.length - 1;
    const e = RP.el("div", { class: "num" }, sc, `${n}<small>٪</small>`);
    gsap.set(e, { yPercent: -55, fontSize: u * (last ? 42 : 30), autoAlpha: 0 });
    const t = times[i];
    tl.set(e, { autoAlpha: 1 }, t);
    tl.fromTo(e, { scale: 3.2, rotation: (i % 2 ? 1 : -1) * 8, filter: `blur(${u * 1.5}px)` },
      { scale: 1, rotation: (i % 2 ? -1 : 1) * 3, filter: "blur(0px)", duration: 0.16, ease: "power4.in", immediateRender: false }, t);
    tl.fromTo(flash, { opacity: last ? 0.9 : 0.4 }, { opacity: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, t + 0.16);
    tl.fromTo(sc, { x: 0, y: 0 }, { keyframes: { x: [u * 1.5, -u * 1.2, u * 0.7, -u * 0.3, 0], y: [-u, u * 0.8, -u * 0.4, 0, 0] }, duration: 0.3, ease: "none", immediateRender: false }, t + 0.16);
    if (!last) tl.to(e, { scale: 0.6, opacity: 0, y: u * (i % 2 ? 20 : -20), duration: 0.22, ease: "power2.in" }, times[i + 1] - 0.05);
    return e;
  });
  // cracks radiate from the last slam
  const r = RP.rng(17), cx = W / 2, cy = H / 2;
  for (let k = 0; k < 16; k++) {
    let a = (k / 16) * Math.PI * 2 + r() * 0.3, x = cx + Math.cos(a) * u * 14, y = cy + Math.sin(a) * u * 14, d = `M${x} ${y}`;
    const steps = 5 + ((r() * 4) | 0);
    for (let s = 0; s < steps; s++) { a += (r() - 0.5) * 0.7; const L = u * (5 + r() * 9); x += Math.cos(a) * L; y += Math.sin(a) * L; d += `L${x.toFixed(1)} ${y.toFixed(1)}`; }
    const p = RP.svgEl("path", { d, fill: "none", stroke: k % 3 ? "rgba(255,210,31,.55)" : "#fff", "stroke-width": k % 3 ? 2 : 3 }, cr);
    const len = RP.dash(p)[0];
    tl.fromTo(p, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.35, ease: "power3.out" }, 1.52);
  }
  const ow = RP.el("div", { id: "offWord", class: "fa" }, sc, T.rwOff);
  gsap.set(ow, { top: H / 2 + u * 19 });
  const owW = RP.words(ow);
  tl.fromTo(owW, { yPercent: 120 }, { yPercent: 0, duration: 0.5, ease: "power4.out" }, 1.55);
  tl.to([els[els.length - 1], ow, cr], { scale: 0.2, opacity: 0, duration: 0.35, ease: "power3.in", transformOrigin: "50% 50%" }, tc - 0.3);
  const card = RP.rwCard({ theme: "dark", links: outro });
  RP.rwCardIn(tl, card, tc, "slam");
  RP.hold(tl, card.c, tc + 1.6, D - tc - 1.6);
});
