RP.run(function (tl, RP) {
  const { u, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const glow = RP.el("div", { class: "full", style: { background: "radial-gradient(circle at 50% 40%, rgba(236,207,146,.35) 0%, rgba(0,0,0,0) 45%)", opacity: 0 } }, sc);
  const r = RP.brandLockup({});
  RP.dust(tl, sc, 30, 12);
  // a thick gold medallion built from stacked hexagon slices (CSS 3D, no WebGL needed)
  const lw = r.logo.parentNode;
  lw.style.position = "relative"; lw.style.perspective = u * 160 + "px";
  gsap.set(r.logo, { opacity: 0 });
  const medal = RP.el("div", { style: { position: "absolute", inset: 0, transformStyle: "preserve-3d" } }, lw);
  const n = 14, depth = u * 3.2;
  for (let i = 0; i < n; i++) {
    const z = -depth / 2 + (depth * i) / (n - 1), shade = 0.55 + 0.45 * Math.sin((i / (n - 1)) * Math.PI);
    RP.el("div", { style: { position: "absolute", inset: 0, clipPath: RP.HEXCLIP, transform: `translateZ(${z}px)`,
      background: `linear-gradient(135deg, rgba(${(236 * shade) | 0},${(197 * shade) | 0},${(120 * shade) | 0},1), rgba(${(150 * shade) | 0},${(112 * shade) | 0},${(50 * shade) | 0},1))` } }, medal);
  }
  const front = r.logo.cloneNode(true);
  Object.assign(front.style, { position: "absolute", inset: 0, opacity: 1, transform: `translateZ(${depth / 2 + 1}px)`, backfaceVisibility: "hidden" });
  medal.appendChild(front);
  const back = RP.el("div", { style: { position: "absolute", inset: 0, clipPath: RP.HEXCLIP, transform: `translateZ(${-depth / 2 - 1}px) rotateY(180deg)`, backfaceVisibility: "hidden",
    background: "linear-gradient(135deg, #F3D88F, #B88A3A 60%, #8C6526)" } }, medal);
  back.appendChild(RP.logo({ outerStroke: "#5c4210", innerFill: "none", innerStroke: "#5c4210", mono: "#5c4210", monoWidth: 1.6 }));
  back.lastChild.style.cssText = "width:100%;height:100%";
  tl.fromTo(medal, { rotationY: -900, rotationX: 18, scale: 0.25, opacity: 0 }, { rotationY: 0, rotationX: 0, scale: 1, opacity: 1, duration: 1.6, ease: "power3.out" }, 0.1);
  tl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.2);
  tl.set(r.logo, { opacity: 1 }, 1.75);
  tl.set(medal, { opacity: 0 }, 1.75);
  tl.fromTo(r.logo, { filter: `drop-shadow(0 0 ${u * 3}px rgba(236,207,146,.9))` }, { filter: "drop-shadow(0 0 0px rgba(236,207,146,0))", duration: 1.0, immediateRender: false }, 1.75);
  const tLock = RP.brandIn(tl, r, 1.6, "none");
  RP.brandEnd(tl, r, tLock);
});
