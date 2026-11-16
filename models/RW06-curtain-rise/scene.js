RP.run(function (tl, RP) {
  const { u, W, H, T, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 1.6 : 1.3;
  const sc = RP.$("#scene");
  RP.el("div", { id: "stage", class: "full" }, sc);
  const b1 = RP.el("div", { class: "beam" }, sc), b2 = RP.el("div", { class: "beam" }, sc);
  gsap.set(b1, { left: "-18%", rotation: -18, transformOrigin: "50% 0" });
  gsap.set(b2, { right: "-18%", rotation: 18, transformOrigin: "50% 0" });
  tl.fromTo(b1, { rotation: -30 }, { rotation: -10, duration: D, ease: "sine.inOut" }, 0);
  tl.fromTo(b2, { rotation: 30 }, { rotation: 10, duration: D, ease: "sine.inOut" }, 0);
  const card = RP.rwCard({ theme: "yellow", links: outro });
  RP.rwCardIn(tl, card, tc, "rise");
  RP.hold(tl, card.c, tc + 1.6, D - tc - 1.6);

  const cur = RP.el("div", { id: "curtain", class: "full" }, sc, '<div class="trim"></div>');
  const msg = RP.el("div", { class: "msg fa" }, cur, outro ? T.rwS2 : T.rwS1);
  const mw = RP.words(msg);
  const spot = RP.el("div", { id: "spot" }, sc);
  const S = u * 70;
  gsap.set(spot, { width: S, height: S, left: W / 2 - S / 2, top: H / 2 - S / 2 });
  tl.fromTo(spot, { x: -W * 0.35, y: -H * 0.15, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.8, ease: "power2.inOut" }, 0);
  tl.fromTo(mw, { yPercent: 120 }, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.1 }, 0.25);
  const up = tc - 0.85;
  tl.to(spot, { opacity: 0, duration: 0.3 }, up);
  tl.fromTo(cur, { y: 0, skewX: 0 }, { y: -H * 1.08, duration: 0.95, ease: "power3.inOut" }, up);
  tl.fromTo(cur, { scaleX: 1 }, { keyframes: { scaleX: [1, 1.03, 0.99, 1] }, duration: 0.95, ease: "none" }, up);
});
