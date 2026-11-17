RP.run(function (tl, RP) {
  const { u, W, H, K, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // drifting gold bokeh behind the glass
  const rr = RP.rng(41);
  for (let i = 0; i < 14; i++) {
    const s = u * (10 + rr() * 22);
    const b = RP.el("i", { style: { position: "absolute", width: s + "px", height: s + "px", borderRadius: "50%", left: rr() * W - s / 2 + "px", top: rr() * H - s / 2 + "px",
      background: `radial-gradient(circle, rgba(236,207,146,${0.18 + rr() * 0.3}) 0%, rgba(236,207,146,0) 70%)` } }, sc);
    tl.fromTo(b, { x: 0, y: 0 }, { x: (rr() - 0.5) * u * 20, y: (rr() - 0.5) * u * 20, duration: D, ease: "sine.inOut" }, 0);
  }
  const r = RP.brandLockup({});
  // glass card slides in (right to left) and settles behind the lockup
  const bh = r.c.offsetHeight;
  const card = RP.el("div", { style: { position: "absolute", left: "50%", top: "50%", width: u * 80 + "px", height: bh + u * 14 + "px", borderRadius: u * 4 + "px", zIndex: 45,
    background: "linear-gradient(135deg, rgba(255,255,255,.16), rgba(255,255,255,.04))", border: "1.5px solid rgba(255,255,255,.28)",
    backdropFilter: `blur(${u * 1.4}px)`, boxShadow: `0 ${u * 3}px ${u * 8}px rgba(0,0,0,.35)` } }, sc);
  gsap.set(card, { xPercent: -50, yPercent: -50 });
  tl.fromTo(card, { x: W, skewX: -12, rotation: 4 }, { x: 0, skewX: 0, rotation: 0, duration: 0.95, ease: "power3.out" }, 0.1);
  const shine = RP.el("i", { style: { position: "absolute", inset: 0, borderRadius: "inherit", background: "linear-gradient(115deg, transparent 40%, rgba(255,255,255,.35) 50%, transparent 60%)" } }, card);
  tl.fromTo(shine, { backgroundPosition: "-200% 0" }, { backgroundPosition: "200% 0", duration: 1.2, ease: "power2.inOut" }, 0.9);
  shine.style.backgroundSize = "200% 100%";
  const tLock = RP.brandIn(tl, r, 0.85, "fade");
  if (RP.mode === "outro") tl.to(card, { opacity: 0, duration: 0.5 }, Math.max(tLock, 2.2) - 0.1);
  RP.brandEnd(tl, r, tLock);
});
