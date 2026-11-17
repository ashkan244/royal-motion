RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const r = RP.brandLockup({});
  // gift wrap: navy paper + crossing satin ribbons + bow, all untied to reveal the lockup
  const wrap = RP.el("div", { class: "full", style: { zIndex: 60, background: "linear-gradient(135deg, #222b6a, #141a44)" } }, sc);
  const satin = "linear-gradient(90deg, #a07a34, #f3dc9c 35%, #d7b26a 55%, #9d7531)";
  const rw = u * 10;
  const v = RP.el("div", { style: { position: "absolute", top: 0, bottom: 0, left: W / 2 - rw / 2 + "px", width: rw + "px", background: satin, zIndex: 61 } }, sc);
  const h = RP.el("div", { style: { position: "absolute", left: 0, right: 0, top: H / 2 - rw / 2 + "px", height: rw + "px", background: satin.replace("90deg", "180deg"), zIndex: 61 } }, sc);
  const bow = RP.el("div", { style: { position: "absolute", left: W / 2 - u * 22 + "px", top: H / 2 - u * 14 + "px", width: u * 44 + "px", height: u * 28 + "px", zIndex: 62 } }, sc,
    `<svg viewBox="0 0 220 140" style="width:100%;height:100%"><defs><linearGradient id="bw" x1="0" x2="1"><stop offset="0" stop-color="#a07a34"/><stop offset=".45" stop-color="#f3dc9c"/><stop offset="1" stop-color="#9d7531"/></linearGradient></defs>
     <path d="M110 70 C70 10 10 20 18 62 C24 98 80 92 110 70Z" fill="url(#bw)"/><path d="M110 70 C150 10 210 20 202 62 C196 98 140 92 110 70Z" fill="url(#bw)"/>
     <path d="M110 70 L80 138 L96 132 L104 140 Z" fill="#b48c46"/><path d="M110 70 L140 138 L124 132 L116 140 Z" fill="#b48c46"/><circle cx="110" cy="70" r="15" fill="#e2c37f"/></svg>`);
  tl.fromTo(bow, { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }, 0.1);
  tl.fromTo([v, h], { scale: 0 }, { scale: 1, duration: 0.45, ease: "power3.out", stagger: 0.05, transformOrigin: "50% 50%" }, 0);
  tl.to(bow, { scale: 1.4, rotation: 25, opacity: 0, y: -u * 20, duration: 0.45, ease: "power3.in" }, 0.85);
  tl.to(v, { yPercent: -110, duration: 0.5, ease: "power3.in" }, 0.95);
  tl.to(h, { xPercent: 110, duration: 0.5, ease: "power3.in" }, 1.0);
  tl.to(wrap, { clipPath: "circle(0% at 50% 50%)", duration: 0.6, ease: "power3.inOut" }, 1.1);
  gsap.set(wrap, { clipPath: "circle(75% at 50% 50%)" });
  const tLock = RP.brandIn(tl, r, 1.2, "pop");
  RP.brandEnd(tl, r, tLock);
});
