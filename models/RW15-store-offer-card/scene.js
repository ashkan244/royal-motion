RP.run(function (tl, RP) {
  const { u, H, T, duration: D } = RP;
  const tc = 3.85;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const card = RP.el("div", { id: "card" }, sc,
    `<div class="top"><span>ROYAL WEEK</span><span class="fl">${T.floor}</span></div>` +
    `<div id="store">${T.store}</div><div id="offer">${T.offer}</div><div id="note">${T.offerNote}</div><div id="only">فقط در ${T.rwName}</div>`);
  gsap.set(card, { xPercent: -50, yPercent: -50 });
  const sw = RP.words(RP.$("#store"));
  tl.fromTo(card, { y: H, rotation: 6 }, { y: 0, rotation: -2, duration: 0.7, ease: "power4.out" }, 0);
  tl.fromTo(sw, { yPercent: 120 }, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.08 }, 0.45);
  tl.fromTo("#offer", { scale: 0, rotation: -120 }, { scale: 1, rotation: -8, duration: 0.6, ease: "back.out(2)" }, 0.9);
  tl.fromTo("#note", { opacity: 0, y: u * 3 }, { opacity: 1, y: 0, duration: 0.5 }, 1.3);
  tl.fromTo("#only", { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 1.7);
  tl.to("#offer", { keyframes: { scale: [1, 1.08, 1, 1.05, 1] }, duration: 1.6, ease: "none" }, 2.0);
  tl.to(card, { y: -H, rotation: -10, duration: 0.5, ease: "power3.in" }, tc - 0.45);
  const rc = RP.rwCard({ theme: "yellow", links: true });
  RP.rwCardIn(tl, rc, tc, "slam");
});
