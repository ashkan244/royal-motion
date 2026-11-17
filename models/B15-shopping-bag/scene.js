RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.ivoryBg();
  const r = RP.brandLockup({ theme: "ivory" });
  gsap.set(r.logo, { opacity: 0 });
  // a navy Royal Pars shopping bag drops in, then the badge rises out of it
  const bw = u * 46, bh = u * 54;
  const bag = RP.el("div", { style: { position: "absolute", left: W / 2 - bw / 2 + "px", top: H / 2 - bh / 2 + u * 4 + "px", width: bw + "px", height: bh + "px", zIndex: 60, transformOrigin: "50% 100%" } }, sc,
    `<svg viewBox="0 0 100 117" style="width:100%;height:100%;display:block;overflow:visible">
      <path d="M32 30 C32 6 68 6 68 30" fill="none" stroke="${K.gold}" stroke-width="4" stroke-linecap="round"/>
      <path d="M10 28 H90 L96 112 Q96 116 92 116 H8 Q4 116 4 112 Z" fill="${K.navy}"/>
      <path d="M10 28 H90 L91 38 H9 Z" fill="#141a44"/>
      <path d="M50 52 l14 11 v26 l-14 11 l-14 -11 v-26 z" fill="none" stroke="${K.gold}" stroke-width="2"/>
      <text x="50" y="84" text-anchor="middle" font-family="Horizon, sans-serif" font-size="12" fill="${K.gold}">R</text></svg>`);
  const shadow = RP.el("i", { style: { position: "absolute", left: W / 2 - bw * 0.45 + "px", top: H / 2 + bh / 2 + u * 3 + "px", width: bw * 0.9 + "px", height: u * 3 + "px", borderRadius: "50%",
    background: "radial-gradient(ellipse, rgba(27,34,80,.35), rgba(27,34,80,0) 70%)", zIndex: 59 } }, sc);
  tl.fromTo(bag, { y: -H, rotation: -8 }, { y: 0, rotation: 0, duration: 0.55, ease: "power3.in" }, 0.05);
  tl.fromTo(bag, { scaleY: 1, scaleX: 1 }, { keyframes: { scaleY: [0.82, 1.06, 0.98, 1], scaleX: [1.12, 0.96, 1.01, 1] }, duration: 0.45, ease: "none", immediateRender: false }, 0.6);
  tl.fromTo(shadow, { opacity: 0, scaleX: 0.3 }, { opacity: 1, scaleX: 1, duration: 0.55, ease: "power3.in" }, 0.05);
  tl.to(bag, { keyframes: { rotation: [0, -6, 5, 0] }, duration: 0.4, ease: "none" }, 1.0);
  // badge springs out of the bag into its lockup place
  const lb = RP.box(r.logo);
  tl.fromTo(r.logo, { opacity: 0, scale: 0.3, y: (H / 2 - lb.cy) + u * 10, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)" }, 1.15);
  tl.to([bag, shadow], { y: H * 0.6, opacity: 0, duration: 0.5, ease: "power3.in" }, 1.35);
  const tLock = RP.brandIn(tl, r, 1.5, "none");
  RP.brandEnd(tl, r, tLock);
});
