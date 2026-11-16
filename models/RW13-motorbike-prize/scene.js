RP.run(function (tl, RP) {
  const { u, W, H, T, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 3.55 : 3.25;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  RP.el("div", { id: "floor" }, sc);
  // stylised sport bike silhouette (generic, no brand), facing left
  const bike = RP.el("div", { id: "bike" }, sc,
    `<svg viewBox="0 0 700 420" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <g stroke="${K.rwYellow}" stroke-width="10"><circle cx="140" cy="310" r="92"/><circle cx="560" cy="310" r="92"/></g>
      <g stroke="rgba(255,210,31,.5)" stroke-width="4"><circle cx="140" cy="310" r="58"/><circle cx="560" cy="310" r="58"/></g>
      <g fill="${K.rwYellow}"><circle cx="140" cy="310" r="16"/><circle cx="560" cy="310" r="16"/></g>
      <path d="M140 310L215 160L255 120H300" stroke="#e8e8e8" stroke-width="14"/>
      <path d="M210 175Q260 110 360 120L470 150Q520 165 560 200L600 250L520 260L430 270L330 300L250 300Z" fill="${K.rwYellow}"/>
      <path d="M250 120L215 95L180 120L205 150Z" fill="#111" stroke="${K.rwYellow}" stroke-width="5"/>
      <path d="M380 135Q430 120 500 150L470 175Q420 160 380 165Z" fill="#111"/>
      <path d="M330 300L400 230L470 290" stroke="#111" stroke-width="12"/>
      <path d="M470 290L560 310" stroke="#cfcfcf" stroke-width="12"/>
      <path d="M520 255L640 250" stroke="#888" stroke-width="10"/>
      <circle cx="196" cy="128" r="10" fill="#fff"/></svg>`);
  gsap.set(bike, { xPercent: -50, yPercent: -50, y: u * (RP.portrait ? 6 : 4) });
  // headlight beam + glare (headlight at ~x=196,y=128 of 700x420 viewbox)
  const bw = u * 70, bh = u * 42;
  const hx = W / 2 - bw / 2 + (196 / 700) * bw, hy = H / 2 + u * (RP.portrait ? 6 : 4) - bh / 2 + (128 / 420) * bh;
  const beam = RP.el("div", { id: "beam" }, sc);
  gsap.set(beam, { left: hx, top: hy, yPercent: -50, rotation: 180, transformOrigin: "0% 50%" });
  const glare = RP.el("div", { id: "glare" }, sc);
  gsap.set(glare, { left: hx - u * 8, top: hy - u * 8 });
  tl.fromTo(bike, { x: W * 0.9, opacity: 0 }, { x: 0, opacity: 1, duration: 1.1, ease: "power3.out" }, 0.15);
  tl.fromTo([beam, glare], { opacity: 0 }, { opacity: 1, duration: 0.15, ease: "none" }, 1.3);
  tl.fromTo(glare, { scale: 0.3 }, { keyframes: { scale: [0.3, 2.4, 1] }, duration: 0.7, ease: "none", immediateRender: false }, 1.3);
  tl.fromTo(beam, { scaleY: 0.6 }, { scaleY: 1, duration: 0.6, ease: "power2.out", immediateRender: false }, 1.3);
  tl.fromTo(beam, { x: W * 0.9 }, { x: 0, duration: 1.1, ease: "power3.out" }, 0.15);
  tl.fromTo(glare, { x: W * 0.9 }, { x: 0, duration: 1.1, ease: "power3.out" }, 0.15);
  const t1 = RP.el("div", { id: "t1", class: "fa" }, sc, "جایزه بزرگ");
  const t2 = RP.el("div", { id: "t2" }, sc, "قرعه‌کشی موتورسیکلت بین بازیکن‌های رویالی");
  gsap.set(t1, { top: H / 2 - u * (RP.portrait ? 40 : 34) });
  gsap.set(t2, { top: H / 2 + u * (RP.portrait ? 30 : 27) });
  const w1 = RP.words(t1), w2 = RP.words(t2);
  tl.fromTo(w1, { yPercent: 120 }, { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.12 }, 1.75);
  tl.fromTo(w2, { yPercent: 120 }, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.05 }, 2.05);
  tl.fromTo(bike, { scale: 1 }, { scale: 1.06, duration: 1.4, ease: "sine.inOut" }, 1.6);
  tl.to([bike, beam, glare, t1, t2, "#floor"], { opacity: 0, duration: 0.4, ease: "power2.in" }, tc - 0.4);
  tl.to(bike, { x: -W, duration: 0.45, ease: "power3.in" }, tc - 0.45);
  const rc = RP.rwCard({ theme: "dark", links: outro, slogan: T.rwPrize });
  RP.rwCardIn(tl, rc, tc, "slam");
  RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
});
