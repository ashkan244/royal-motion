RP.run(function (tl, RP) {
  const { u, W, H, K, duration: D } = RP;
  const sc = RP.$("#scene");
  document.documentElement.style.background = "transparent"; document.body.style.background = "transparent";
  // small animated badge for the corner of every video; holds for the whole clip
  const lg = RP.logo({ parent: sc, outerStroke: K.gold, outerWidth: 1.4, innerFill: "rgba(27,34,80,.85)", innerStroke: K.gold, innerWidth: .5, mono: K.gold, monoWidth: 1.8 });
  const h = u * 11;
  Object.assign(lg.style, { position: "absolute", height: h + "px", width: h * 0.6 + "px", left: u * 4 + "px", top: u * 4 + "px", filter: `drop-shadow(0 ${u * 0.3}px ${u * 0.8}px rgba(0,0,0,.5))` });
  const txt = RP.el("div", { style: { position: "absolute", left: u * 4 + h * 0.6 + u * 1.6 + "px", top: u * 4 + h * 0.32 + "px", fontFamily: "var(--en)", fontSize: u * 1.9 + "px", letterSpacing: ".25em", color: K.goldLight,
    textShadow: `0 ${u * 0.2}px ${u * 0.6}px rgba(0,0,0,.6)`, whiteSpace: "nowrap" } }, sc, "ROYAL PARS");
  const paths = [lg.querySelector(".lg-outer"), ...lg.querySelectorAll(".lg-m")];
  const L = RP.dash(paths);
  paths.forEach((p, i) => tl.fromTo(p, { strokeDashoffset: L[i] }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 0.1 + i * 0.07));
  tl.fromTo(lg.querySelector(".lg-inner"), { opacity: 0 }, { opacity: 1, duration: 0.4 }, 0.5);
  tl.fromTo(txt, { opacity: 0, x: -u * 2 }, { opacity: 1, x: 0, duration: 0.5 }, 0.7);
  for (let t = 2.5; t < D - 0.5; t += 3) tl.fromTo(lg, { filter: `drop-shadow(0 0 ${u * 0.3}px rgba(236,207,146,0))` },
    { keyframes: { filter: [`drop-shadow(0 0 ${u * 1.4}px rgba(236,207,146,.9))`, `drop-shadow(0 ${u * 0.3}px ${u * 0.8}px rgba(0,0,0,.5))`] }, duration: 0.6, ease: "none", immediateRender: false }, t);
});
