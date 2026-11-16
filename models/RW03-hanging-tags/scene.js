RP.run(function (tl, RP) {
  const { u, W, H, T, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 2.55 : 2.15;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const vals = RP.params.tags, r = RP.rng(8);
  const n = RP.landscape ? 7 : RP.aspect === "4x5" ? 5 : 4;
  const tagSvg = `<svg viewBox="0 0 150 220"><path d="M30 0H120L150 34V210Q150 220 140 220H10Q0 220 0 210V34Z" fill="${K.rwBlack}"/>` +
    `<circle cx="75" cy="26" r="9" fill="${K.rwYellow}"/><path d="M14 52H136" stroke="${K.rwYellow}" stroke-width="2" stroke-dasharray="6 6"/></svg>`;
  for (let i = 0; i < n; i++) {
    const h = RP.el("div", { class: "hang" }, sc);
    const len = (RP.portrait ? H * 0.12 : H * 0.04) + r() * H * (RP.portrait ? 0.3 : 0.2);
    RP.el("div", { class: "str", style: { height: len + "px" } }, h);
    RP.el("div", { class: "tag" }, h, tagSvg + `<div class="v">${vals[i % vals.length]}</div><div class="l">${T.rwOff}</div>`);
    gsap.set(h, { left: W * (i + 0.5) / n, xPercent: -50, transformOrigin: "50% 0%", scale: (RP.aspect === "9x16" ? 1.45 : RP.aspect === "4x5" ? 1.2 : 1) * (0.85 + r() * 0.3) });
    const t0 = 0.1 + i * 0.08 + r() * 0.1;
    tl.fromTo(h, { y: -H * 0.8 }, { y: 0, duration: 0.55, ease: "back.out(1.6)" }, t0);
    const sw = 10 + r() * 8;
    tl.fromTo(h, { rotation: 0 }, { keyframes: { rotation: [sw, -sw * 0.6, sw * 0.35, -sw * 0.18, sw * 0.08, 0] }, duration: 2.2, ease: "none" }, t0 + 0.35);
    tl.to(h, { y: -H * 0.95, duration: 0.5, ease: "power3.in" }, tc - 0.45 + i * 0.03);
  }
  const card = RP.rwCard({ theme: "yellow", links: outro });
  RP.rwCardIn(tl, card, tc, "slam");
  RP.hold(tl, card.c, tc + 1.6, D - tc - 1.6);
});
