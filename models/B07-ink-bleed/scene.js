RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.ivoryBg();
  // paper fibre: faint seeded grain
  RP.grain(sc, 31, 0.05);
  const r = RP.brandLockup({ theme: "ivory" });
  const lg = r.logo;
  // ink pools spread inside the badge shape
  const defs = RP.svgEl("defs", {}, lg);
  const cp = RP.svgEl("clipPath", { id: "inkC" }, defs);
  RP.svgEl("path", { d: RP.LOGO.inner }, cp);
  const ink = RP.svgEl("g", { "clip-path": "url(#inkC)" }, lg);
  lg.insertBefore(ink, r.inner.nextSibling);
  gsap.set(r.inner, { opacity: 0 });
  const rr = RP.rng(14), blobs = [];
  for (let i = 0; i < 9; i++) {
    const c = RP.svgEl("circle", { cx: 12 + rr() * 50, cy: 18 + rr() * 90, r: 0, fill: K.navy }, ink);
    blobs.push(c);
    tl.fromTo(c, { attr: { r: 0 } }, { attr: { r: 22 + rr() * 22 }, duration: 1.0 + rr() * 0.4, ease: "power2.out" }, 0.15 + i * 0.09);
  }
  // ink splatter around the badge (on the paper)
  const lb = RP.box(lg);
  for (let i = 0; i < 14; i++) {
    const a = rr() * Math.PI * 2, dist = lb.w * (0.55 + rr() * 0.5), s = u * (0.5 + rr() * 1.4);
    const dot = RP.el("i", { style: { position: "absolute", borderRadius: "50%", background: K.navy, width: s + "px", height: s + "px",
      left: lb.cx + Math.cos(a) * dist + "px", top: lb.cy + Math.sin(a) * dist * 1.4 + "px", zIndex: 49 } }, sc);
    tl.fromTo(dot, { scale: 0, opacity: 0.85 }, { scale: 1, duration: 0.25, ease: "back.out(3)" }, 0.25 + rr() * 0.6);
    tl.to(dot, { opacity: 0, duration: 0.8 }, 2.0 + rr() * 0.5);
  }
  const L = RP.dash([r.outer, ...r.monos]);
  tl.fromTo(r.outer, { strokeDashoffset: L[0] }, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, 0.2);
  r.monos.forEach((p, i) => tl.fromTo(p, { strokeDashoffset: L[i + 1] }, { strokeDashoffset: 0, duration: 0.55, ease: "power2.inOut" }, 1.05 + i * 0.1));
  tl.set(r.inner, { opacity: 1 }, 1.5);
  tl.set(ink, { opacity: 0 }, 1.5);
  const tLock = RP.brandIn(tl, r, 1.5, "none");
  RP.brandEnd(tl, r, tLock);
});
