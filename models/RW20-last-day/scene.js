RP.run(function (tl, RP) {
  const { u, H, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 3.15 : 2.85;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const frame = RP.el("div", { id: "frame" }, sc);
  // clock face
  const clock = RP.svgEl("svg", { id: "clock", viewBox: "-50 -50 100 100" }, sc);
  gsap.set(clock, { xPercent: -50, yPercent: -50, y: -u * (RP.portrait ? 6 : 2) });
  RP.svgEl("circle", { r: 47, fill: "#0d0d0d", stroke: K.rwYellow, "stroke-width": 2.4 }, clock);
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    RP.svgEl("line", { x1: Math.sin(a) * 40, y1: -Math.cos(a) * 40, x2: Math.sin(a) * (i % 3 ? 43 : 36), y2: -Math.cos(a) * (i % 3 ? 43 : 36), stroke: i % 3 ? "#888" : K.rwYellow, "stroke-width": i % 3 ? 1.2 : 2.6 }, clock);
  }
  const hh = RP.svgEl("line", { x1: 0, y1: 4, x2: 0, y2: -22, stroke: "#fff", "stroke-width": 4, "stroke-linecap": "round" }, clock);
  const mh = RP.svgEl("line", { x1: 0, y1: 5, x2: 0, y2: -34, stroke: "#fff", "stroke-width": 2.6, "stroke-linecap": "round" }, clock);
  const sh = RP.svgEl("line", { x1: 0, y1: 8, x2: 0, y2: -40, stroke: K.rwYellow, "stroke-width": 1.2, "stroke-linecap": "round" }, clock);
  RP.svgEl("circle", { r: 3, fill: K.rwYellow }, clock);
  gsap.set([hh, mh, sh], { svgOrigin: "0 0" });
  gsap.set(hh, { rotation: 330 }); gsap.set(mh, { rotation: 300 });
  tl.fromTo(clock, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)" }, 0);
  // the minute hand races toward midnight, the second hand ticks
  tl.fromTo(mh, { rotation: 300 }, { rotation: 360, duration: tc - 0.6, ease: "power2.in" }, 0.3);
  tl.fromTo(hh, { rotation: 330 }, { rotation: 360, duration: tc - 0.6, ease: "power2.in" }, 0.3);
  for (let k = 0; k < Math.floor((tc - 0.5) / 0.5); k++) tl.fromTo(sh, { rotation: k * 30 }, { rotation: (k + 1) * 30, duration: 0.12, ease: "back.out(3)", immediateRender: k === 0 }, 0.5 + k * 0.5);
  // urgency: frame blinks, words
  for (let t = 0.5; t < tc - 0.3; t += 0.5) tl.fromTo(frame, { opacity: 1 }, { keyframes: { opacity: [1, 0.25, 1] }, duration: 0.3, ease: "none", immediateRender: false }, t);
  const big = RP.el("div", { id: "big", class: "fa" }, sc, "آخرین روز");
  const small = RP.el("div", { id: "small", class: "fa" }, sc, "<b>فقط تا امشب</b>");
  gsap.set(big, { top: H / 2 + u * (RP.portrait ? 20 : 22) - (RP.landscape ? u * 4 : 0) });
  gsap.set(small, { top: H / 2 - u * (RP.portrait ? 40 : 36) });
  if (RP.landscape) { gsap.set(clock, { scale: 0.8 }); }
  const bw = RP.words(big);
  tl.fromTo(bw, { yPercent: 120 }, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.12 }, 0.5);
  tl.fromTo(small, { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2.4)" }, 0.95);
  tl.fromTo(big, { x: 0 }, { keyframes: { x: [0, -u * 0.6, u * 0.6, -u * 0.4, u * 0.4, 0] }, duration: 0.35, ease: "none", immediateRender: false }, 2.3);
  tl.to([clock, big, small], { scale: 1.6, opacity: 0, duration: 0.35, ease: "power2.in" }, tc - 0.3);
  const rc = RP.rwCard({ theme: "dark", links: outro, slogan: "آخرین فرصت رویالی" });
  RP.rwCardIn(tl, rc, tc, "slam");
  RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
});
