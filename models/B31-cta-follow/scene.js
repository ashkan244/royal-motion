RP.run(function (tl, RP) {
  const { u, W, H, K, T, duration: D } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  RP.dust(tl, sc, 26, 31);
  const col = RP.el("div", { style: { position: "absolute", left: 0, right: 0, top: "50%", display: "flex", flexDirection: "column", alignItems: "center", gap: u * 3.4 + "px", zIndex: 50 } }, sc);
  gsap.set(col, { yPercent: -50 });
  const logo = RP.logo({ parent: col, outerStroke: K.gold, innerFill: "#212a66", innerStroke: K.gold, innerWidth: 0.45, mono: K.gold });
  logo.style.height = u * 16 + "px"; logo.style.width = u * 16 * 0.6 + "px";
  // big Instagram glyph drawn in gold
  const ig = RP.svgEl("svg", { viewBox: "0 0 24 24", style: `width:${u * 22}px;height:${u * 22}px`, fill: "none", stroke: K.gold, "stroke-width": 1.4 }, col);
  const p1 = RP.svgEl("rect", { x: 3, y: 3, width: 18, height: 18, rx: 5 }, ig), p2 = RP.svgEl("circle", { cx: 12, cy: 12, r: 4.2 }, ig);
  const p3 = RP.svgEl("circle", { cx: 17.4, cy: 6.6, r: 1, fill: K.gold, stroke: "none" }, ig);
  const handle = RP.el("div", { style: { fontFamily: "var(--fa-body)", fontWeight: 700, fontSize: u * 6 + "px", color: K.ivory, direction: "ltr" } }, col, T.ig);
  const sub = RP.el("div", { style: { fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * 4 + "px", color: K.goldLight, direction: "rtl" } }, col, "برای دیدن تخفیف‌ها و رویدادها");
  const btn = RP.el("div", { style: { position: "relative", fontFamily: "var(--fa)", fontWeight: 700, fontSize: u * 4.4 + "px", direction: "rtl", padding: `${u * 1.4}px ${u * 7}px ${u * 2}px`,
    borderRadius: u * 2 + "px", background: K.gold, color: K.navyInk, overflow: "hidden" } }, col, `<span class="a">دنبال کنید</span><span class="b" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;background:#212a66;color:${K.goldLight}">دنبال می‌کنید ✓</span>`);
  // finger tap
  const tap = RP.el("i", { style: { position: "absolute", width: u * 7 + "px", height: u * 7 + "px", borderRadius: "50%", border: `3px solid ${K.ivory}`, zIndex: 60, opacity: 0 } }, sc);
  const L = RP.dash([p1, p2]);
  tl.fromTo(logo, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 0.1);
  tl.fromTo(p1, { strokeDashoffset: L[0] }, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, 0.3);
  tl.fromTo(p2, { strokeDashoffset: L[1] }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.inOut" }, 0.6);
  tl.fromTo(p3, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 1.0);
  tl.fromTo(handle, { opacity: 0, y: u * 3 }, { opacity: 1, y: 0, duration: 0.6 }, 0.9);
  const sw = RP.words(sub);
  tl.fromTo(sw, { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.06 }, 1.2);
  tl.fromTo(btn, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)" }, 1.5);
  const bb = RP.box(btn);
  gsap.set(tap, { left: bb.cx - u * 3.5, top: bb.cy - u * 3.5 });
  tl.fromTo(tap, { scale: 1.6, opacity: 0 }, { scale: 0.7, opacity: 1, duration: 0.3, ease: "power2.in" }, 2.4);
  tl.to(tap, { scale: 2, opacity: 0, duration: 0.4 }, 2.7);
  tl.fromTo(btn, { scale: 1 }, { keyframes: { scale: [1, 0.92, 1.04, 1] }, duration: 0.35, ease: "none", immediateRender: false }, 2.65);
  tl.set(RP.$(".b", btn), { opacity: 1 }, 2.72);
  RP.hold(tl, col, 3, D - 3.6, 0.02);
  tl.to("#scene", { opacity: 0, duration: 0.55 }, D - 0.55);
});
