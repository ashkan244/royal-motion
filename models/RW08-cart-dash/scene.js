RP.run(function (tl, RP) {
  const { u, W, H, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 2.3 : 2.0;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  // speed lines streaming right -> left (the cart travels in reading direction)
  const r = RP.rng(31);
  for (let i = 0; i < 26; i++) {
    const l = RP.el("div", { class: "spd", style: { top: r() * H + "px", width: u * (8 + r() * 30) + "px", opacity: 0.15 + r() * 0.5 } }, sc);
    const span = W + u * 100, d = 0.35 + r() * 0.5, x0 = r() * span;
    const wrap = gsap.utils.wrap(-u * 60, W + u * 40);
    tl.fromTo(l, { x: x0 }, { x: x0 - span * (D / d), duration: D, ease: "none", modifiers: { x: gsap.utils.unitize(wrap) } }, 0);
  }
  const cart = RP.el("div", { id: "cartWrap" }, sc,
    `<svg viewBox="0 0 120 100" fill="none" stroke="${K.rwBlack}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M112 10H98L84 66H22L12 26H94"/><path d="M28 38H88M32 52H84M44 26L48 66M64 26L62 66M80 26L74 66"/>
      <path d="M84 66L88 78H24"/><g class="wh"><circle cx="34" cy="88" r="7" fill="${K.rwYellow}"/><path d="M34 81V95M27 88H41" stroke-width="2.5"/></g>
      <g class="wh"><circle cx="80" cy="88" r="7" fill="${K.rwYellow}"/><path d="M80 81V95M73 88H87" stroke-width="2.5"/></g></svg>`);
  gsap.set(cart, { xPercent: -50, yPercent: -50 });
  const wheels = RP.$$(".wh", cart);
  gsap.set(wheels[0], { svgOrigin: "34 88" }); gsap.set(wheels[1], { svgOrigin: "80 88" });
  tl.fromTo(cart, { x: W }, { x: 0, duration: 0.6, ease: "power3.out" }, 0);
  tl.fromTo(cart, { skewX: 0 }, { keyframes: { skewX: [0, 14, -6, 2, 0] }, duration: 0.8, ease: "none" }, 0.1);
  tl.fromTo(wheels, { rotation: 0 }, { rotation: -900, duration: 0.6, ease: "power3.out" }, 0);
  // offer bubbles pop out of the basket
  const tags = ["تخفیف", "۳۰٪", "هدیه", "۵۰٪"];
  tags.forEach((t, i) => {
    const b = RP.el("div", { class: "bagx" }, sc, t);
    gsap.set(b, { left: W / 2 + u * (-14 + i * 9), top: H / 2 - u * 12, xPercent: -50, autoAlpha: 0 });
    tl.set(b, { autoAlpha: 1 }, 0.85 + i * 0.12);
    tl.fromTo(b, { y: 0, scale: 0.2, rotation: 0 }, { y: -u * (14 + (i % 2) * 8), scale: 1, rotation: (i % 2 ? 8 : -8), duration: 0.45, ease: "back.out(2)", immediateRender: false }, 0.85 + i * 0.12);
    tl.to(b, { x: -W, duration: 0.5, ease: "power3.in" }, tc - 0.45);
  });
  // cart dashes out to the left, dragging a black sheet in behind it
  tl.to(cart, { x: -W, duration: 0.5, ease: "power3.in" }, tc - 0.45);
  tl.to(wheels, { rotation: -1800, duration: 0.5, ease: "power3.in" }, tc - 0.45);
  const sheet = RP.el("div", { id: "sheet", class: "full" }, sc);
  tl.fromTo(sheet, { x: W + u * 30 }, { x: 0, duration: 0.55, ease: "power3.in" }, tc - 0.45);
  const card = RP.rwCard({ theme: "dark", links: outro });
  RP.rwCardIn(tl, card, tc, "slam");
  RP.hold(tl, card.c, tc + 1.6, D - tc - 1.6);
});
