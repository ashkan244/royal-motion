RP.run(function (tl, RP) {
  const { u, K } = RP;
  const sc = RP.$("#scene");
  // navy brick wall
  RP.el("div", { class: "full", style: { backgroundColor: "#121733",
    backgroundImage: "linear-gradient(#0a0d22 2px, transparent 2px), linear-gradient(90deg, #0a0d22 2px, transparent 2px), linear-gradient(90deg, #0a0d22 2px, transparent 2px)",
    backgroundSize: `${u * 12}px ${u * 5}px, ${u * 12}px ${u * 10}px, ${u * 12}px ${u * 10}px`, backgroundPosition: `0 0, 0 0, ${u * 6}px ${u * 5}px` } }, sc);
  const wallGlow = RP.el("div", { class: "full", style: { background: "radial-gradient(ellipse at 50% 46%, rgba(255,226,150,.25) 0%, rgba(0,0,0,0) 50%)", opacity: 0 } }, sc);
  RP.el("div", { class: "full", style: { background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 25%, rgba(0,0,0,.8) 90%)" } }, sc);
  const tube = "#FFE9B0";
  const r = RP.brandLockup({ logoOpts: { outerStroke: tube, outerWidth: 1.6, innerFill: "rgba(0,0,0,0)", innerStroke: tube, innerWidth: 0.8, mono: tube, monoWidth: 1.9 } });
  r.logo.style.filter = `drop-shadow(0 0 ${u * 0.5}px #fff) drop-shadow(0 0 ${u * 1.6}px ${K.gold}) drop-shadow(0 0 ${u * 4}px #c98a1e)`;
  r.fa.style.textShadow = `0 0 ${u * 0.4}px #fff, 0 0 ${u * 1.4}px ${K.gold}, 0 0 ${u * 3.4}px #c98a1e`;
  r.fa.style.color = "#FFF4D6";
  const fl = (el, t0, seq) => tl.fromTo(el, { opacity: 0.06 }, { keyframes: { opacity: seq }, duration: seq.length * 0.06, ease: "none" }, t0);
  fl(r.logo, 0.25, [0.06, 1, 0.1, 0.1, 1, 0.3, 1, 1, 0.12, 1]);
  fl(wallGlow, 0.25, [0, 0.8, 0, 0, 0.9, 0.2, 1, 1, 0.1, 1]);
  const tLock = RP.brandIn(tl, r, 0.95, "none");
  for (let t = 2.2; t < RP.duration - 0.6; t += 0.9) tl.fromTo(r.logo, { opacity: 1 }, { keyframes: { opacity: [1, 0.8, 1] }, duration: 0.12, ease: "none", immediateRender: false }, t);
  RP.brandEnd(tl, r, tLock);
});
