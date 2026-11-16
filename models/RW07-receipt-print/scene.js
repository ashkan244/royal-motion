RP.run(function (tl, RP) {
  const { u, W, H, T, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 3.0 : 2.65;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const rig = RP.el("div", { class: "full" }, sc);
  const k = { "9x16": 1.4, "4x5": 1.1 }[RP.aspect] || 1;
  gsap.set(rig, { scale: k, transformOrigin: "50% 50%" });
  const pTop = H / 2 - u * (RP.landscape ? 47 : 50);
  const printer = RP.el("div", { id: "printer" }, rig, '<div class="led"></div>');
  gsap.set(printer, { top: pTop });
  const slot = RP.el("div", { id: "slot" }, rig);
  gsap.set(slot, { top: pTop + u * 7.4 });
  const rows = RP.params.items.map(([a, b]) => `<div class="row"><span>${a}</span><span class="dots"></span><span class="off">${b}</span></div>`).join("");
  const rc = RP.el("div", { id: "receipt" }, slot,
    `<h2>${T.faShort}</h2><div class="sub">${T.rwName} · ${T.rwStart}</div><hr>${rows}<hr>` +
    `<div class="tot"><span>جمع کل</span><span>رویالی!</span></div><div class="bar"></div>`);
  const rh = rc.offsetHeight;
  // stepped print feed
  tl.fromTo(printer, { y: -u * 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.4)" }, 0);
  gsap.set(slot, { height: rh + u * 4 });
  tl.fromTo(slot, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.8, ease: "steps(14)" }, 0.15);
  tl.fromTo(rc, { y: -u * 5 }, { y: 0, duration: 1.8, ease: "steps(14)" }, 0.15);
  tl.fromTo(".led", { opacity: 1 }, { keyframes: { opacity: [1, 0.2, 1, 0.2, 1, 0.2, 1] }, duration: 1.8, ease: "none" }, 0.15);
  const stamp = RP.el("div", { id: "stamp" }, rig, "این هفته رویالیه!");
  gsap.set(stamp, { xPercent: -50, yPercent: -50, y: u * 8, autoAlpha: 0, rotation: -12 });
  tl.set(stamp, { autoAlpha: 1 }, 2.0);
  tl.fromTo(stamp, { scale: 2.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "power4.in", immediateRender: false }, 2.0);
  tl.fromTo(sc, { y: 0 }, { keyframes: { y: [0, u * 0.8, -u * 0.4, 0] }, duration: 0.2, ease: "none", immediateRender: false }, 2.18);
  // tear & drop
  tl.to([slot, stamp], { y: H * 1.1, rotation: 8, duration: 0.55, ease: "power3.in" }, tc - 0.45);
  tl.to(printer, { y: -u * 40, opacity: 0, duration: 0.45, ease: "power3.in" }, tc - 0.4);
  const card = RP.rwCard({ theme: "dark", links: outro });
  RP.rwCardIn(tl, card, tc, "slam");
  RP.hold(tl, card.c, tc + 1.6, D - tc - 1.6);
});
