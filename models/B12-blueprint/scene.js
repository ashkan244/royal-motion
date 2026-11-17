RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  const grid = RP.el("div", { class: "full", style: { backgroundImage:
    `linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px),
     linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)`,
    backgroundSize: `${u * 20}px ${u * 20}px, ${u * 20}px ${u * 20}px, ${u * 4}px ${u * 4}px, ${u * 4}px ${u * 4}px`, backgroundPosition: "center" } }, sc);
  const r = RP.brandLockup({ logoOpts: { outerStroke: "#ffffff", innerStroke: "#ffffff", mono: "#ffffff" } });
  // construction geometry around the badge
  const lb = RP.box(r.logo);
  const g = RP.svgEl("svg", { viewBox: `0 0 ${W} ${H}`, style: "position:absolute;inset:0;width:100%;height:100%;z-index:49" }, sc);
  const st = { fill: "none", stroke: "rgba(255,255,255,.55)", "stroke-width": 1.2 };
  const els = [
    RP.svgEl("circle", Object.assign({ cx: lb.cx, cy: lb.cy, r: lb.h * 0.62 }, st), g),
    RP.svgEl("circle", Object.assign({ cx: lb.cx, cy: lb.cy, r: lb.h * 0.5, "stroke-dasharray": "6 6" }, st), g),
    RP.svgEl("line", Object.assign({ x1: lb.cx, y1: lb.y - u * 14, x2: lb.cx, y2: lb.y + lb.h + u * 14 }, st), g),
    RP.svgEl("line", Object.assign({ x1: lb.x - u * 22, y1: lb.cy, x2: lb.x + lb.w + u * 22, y2: lb.cy }, st), g),
    RP.svgEl("path", Object.assign({ d: `M${lb.x - u * 6} ${lb.y}V${lb.y + lb.h}M${lb.x - u * 8} ${lb.y}H${lb.x - u * 4}M${lb.x - u * 8} ${lb.y + lb.h}H${lb.x - u * 4}` }, st), g),
    RP.svgEl("path", Object.assign({ d: `M${lb.x} ${lb.y + lb.h + u * 5}H${lb.x + lb.w}M${lb.x} ${lb.y + lb.h + u * 3}V${lb.y + lb.h + u * 7}M${lb.x + lb.w} ${lb.y + lb.h + u * 3}V${lb.y + lb.h + u * 7}` }, st), g),
  ];
  const lab = RP.svgEl("text", { x: lb.x - u * 10, y: lb.cy, fill: "rgba(255,255,255,.6)", "font-family": "Horizon, sans-serif", "font-size": u * 1.6, transform: `rotate(-90 ${lb.x - u * 10} ${lb.cy})`, "text-anchor": "middle" }, g);
  lab.textContent = "R · P  1405";
  const L = RP.dash(els);
  els.forEach((e, i) => tl.fromTo(e, { strokeDashoffset: L[i] }, { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" }, 0.05 + i * 0.1));
  tl.fromTo(lab, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0.8);
  const tLock = RP.brandIn(tl, r, 0.35, "draw", 0.95);
  // blueprint white turns to brand gold
  tl.to([r.outer, ...r.monos], { attr: { stroke: K.gold }, duration: 0.5 }, 1.95);
  tl.to(r.inner, { attr: { stroke: K.gold }, duration: 0.5 }, 1.95);
  tl.to([g], { opacity: 0, duration: 0.6 }, 2.1);
  tl.to(grid, { opacity: 0.35, duration: 0.8 }, 2.1);
  RP.brandEnd(tl, r, tLock);
});
