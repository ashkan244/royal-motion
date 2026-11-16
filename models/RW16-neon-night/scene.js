RP.run(function (tl, RP) {
  const { u, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 3.1 : 2.8;
  const sc = RP.$("#scene");
  RP.el("div", { id: "wall", class: "full" }, sc);
  const gw = RP.el("div", { id: "glowWall", class: "full" }, sc);
  RP.el("div", { id: "shade", class: "full" }, sc);
  const sign = RP.el("div", { id: "sign" }, sc);
  gsap.set(sign, { yPercent: -50 });
  const hex = RP.svgEl("svg", { id: "hex", viewBox: "-2 -2 79 129" }, sign);
  const glowF = `drop-shadow(0 0 ${u * 0.6}px #fff) drop-shadow(0 0 ${u * 1.6}px ${K.rwYellow})`;
  const ho = RP.svgEl("path", { d: RP.LOGO.outer, fill: "none", stroke: "#FFF4B8", "stroke-width": 2.2, "stroke-linejoin": "round" }, hex);
  const g = RP.svgEl("g", { fill: "none", stroke: "#FFF4B8", "stroke-width": 2.2, "stroke-linecap": "round", "stroke-linejoin": "round" }, hex);
  RP.LOGO.mono.forEach((d) => RP.svgEl("path", { d }, g));
  hex.style.filter = glowF;
  const fa = RP.el("div", { id: "neonFa" }, sign, "شب‌های رویالی");
  const en = RP.el("div", { id: "neonEn" }, sign, "ROYAL NIGHTS");
  const lens = RP.dash([ho, ...g.querySelectorAll("path")]);
  tl.fromTo(ho, { strokeDashoffset: lens[0] }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.1);
  RP.$$("path", g).forEach((p, i) => tl.fromTo(p, { strokeDashoffset: lens[i + 1] }, { strokeDashoffset: 0, duration: 0.5, ease: "power2.inOut" }, 0.4 + i * 0.08));
  // neon tube ignition: deterministic flicker
  const fl = (el, t0, seq) => tl.fromTo(el, { opacity: 0.08 }, { keyframes: { opacity: seq }, duration: seq.length * 0.06, ease: "none", immediateRender: true }, t0);
  fl(fa, 0.3, [0.08, 1, 0.1, 0.1, 1, 0.3, 1, 1, 0.15, 1]);
  fl(en, 0.75, [0.05, 1, 0.1, 1, 0.2, 1]);
  fl(gw, 0.3, [0, 0.8, 0, 0, 0.9, 0.2, 1, 1, 0.1, 1]);
  tl.fromTo(hex, { opacity: 0.2 }, { keyframes: { opacity: [0.2, 1, 0.3, 1, 1, 0.5, 1] }, duration: 0.5, ease: "none" }, 1.0);
  // buzz pulse while holding
  for (let t = 1.6; t < tc - 0.5; t += 0.45) tl.fromTo(fa, { opacity: 1 }, { keyframes: { opacity: [1, 0.85, 1] }, duration: 0.12, ease: "none", immediateRender: false }, t);
  tl.to(sign, { scale: 1.15, opacity: 0, duration: 0.4, ease: "power2.in" }, tc - 0.35);
  const rc = RP.rwCard({ theme: "dark", links: outro, slogan: "هر شب، رویالی" });
  RP.rwCardIn(tl, rc, tc, "rise");
  RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
});
