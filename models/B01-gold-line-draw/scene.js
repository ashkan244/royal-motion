RP.run(function (tl, RP) {
  const { u, W, H, T, K, mode, duration: D } = RP;
  const $ = RP.$;
  const outro = mode === "outro";
  const k = outro ? 0.68 : 1;               // outro builds faster

  // honeycomb backdrop
  const comb = $("#comb");
  comb.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const combPath = RP.svgEl("path", { d: RP.honeycomb(W, H, u * 6.2), fill: "none", stroke: K.gold, "stroke-width": 1, opacity: 0.09 }, comb);

  // logo
  const logo = RP.logo({ parent: $("#logoWrap"), outerStroke: K.gold, outerWidth: 1.0, innerFill: "#212a66", innerStroke: K.gold, innerWidth: 0.45, mono: K.gold, monoWidth: 1.55 });
  logo.id = "logo";
  const outer = logo.querySelector(".lg-outer"), inner = logo.querySelector(".lg-inner");
  const monos = RP.$$(".lg-m", logo);
  RP.dash([outer, inner, ...monos]);
  inner.style.fillOpacity = 0;
  // shine copy of the monogram
  const defs = RP.svgEl("defs", {}, logo);
  const grad = RP.svgEl("linearGradient", { id: "shine", gradientUnits: "userSpaceOnUse", x1: -60, y1: 0, x2: -20, y2: 20 }, defs);
  [["0", 0], ["0.45", 0], ["0.5", 0.95], ["0.55", 0], ["1", 0]].forEach(([o, a]) => RP.svgEl("stop", { offset: o, "stop-color": "#FFF8E6", "stop-opacity": a }, grad));
  const shine = logo.querySelector(".lg-mono").cloneNode(true);
  shine.setAttribute("stroke", "url(#shine)"); shine.setAttribute("stroke-width", 1.9);
  RP.$$("path", shine).forEach((p) => { p.style.strokeDasharray = ""; p.style.strokeDashoffset = ""; });
  logo.appendChild(shine);

  // names
  $("#faName").textContent = T.faName;
  const faWords = RP.words($("#faName"));
  $("#enName").textContent = T.enName;
  const rule = RP.$$("#rule i"), dia = $("#rule b");

  // dust
  const dust = $("#dust");
  const motes = RP.particles(dust, 46, 11, (r) => {
    const s = u * (0.35 + r() * 0.9);
    const e = RP.el("i", { style: { width: s + "px", height: s + "px", left: r() * W + "px", top: (0.15 + r() * 0.8) * H + "px" } }, dust);
    e._d = { rise: u * (6 + r() * 14), drift: u * (r() - 0.5) * 6, delay: r() * 1.5, a: 0.25 + r() * 0.65 };
    return e;
  });

  const brand = $("#brand");
  gsap.set(brand, { yPercent: -50 });
  gsap.set("#cta", { autoAlpha: 0 });

  // ---------------- timeline ----------------
  tl.fromTo("#bg", { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "none" }, 0);
  tl.fromTo(combPath, { opacity: 0 }, { opacity: 0.1, duration: 1.4 * k, ease: "sine.inOut" }, 0.15);
  tl.fromTo(comb, { scale: 1.1, transformOrigin: "50% 46%" }, { scale: 1, duration: D, ease: "none" }, 0);
  tl.fromTo(outer, { strokeDashoffset: outer.getTotalLength() }, { strokeDashoffset: 0, duration: 1.2 * k, ease: "power2.inOut" }, 0.25 * k);
  tl.fromTo(inner, { strokeDashoffset: inner.getTotalLength() }, { strokeDashoffset: 0, duration: 1.0 * k, ease: "power2.inOut" }, 0.5 * k);
  monos.forEach((p, i) => {
    tl.fromTo(p, { strokeDashoffset: p.getTotalLength() }, { strokeDashoffset: 0, duration: 0.75 * k, ease: "power2.inOut" }, (0.95 + i * 0.15) * k);
  });
  tl.fromTo(inner, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.6 * k, ease: "sine.out" }, 1.7 * k);
  tl.fromTo(logo, { scale: 0.94, transformOrigin: "50% 50%" }, { scale: 1, duration: 2.2 * k, ease: "power2.out" }, 0.2 * k);
  tl.fromTo(logo, { filter: "drop-shadow(0 0 0px rgba(236,207,146,0))" },
    { filter: `drop-shadow(0 0 ${u * 2.2}px rgba(236,207,146,.55))`, duration: 0.35, ease: "power2.out" }, 2.2 * k);
  tl.to(logo, { filter: `drop-shadow(0 0 ${u * 0.8}px rgba(236,207,146,.25))`, duration: 0.9, ease: "sine.inOut" }, 2.55 * k);
  tl.fromTo(grad, { attr: { x1: -40, x2: -10, y1: 0, y2: 30 } }, { attr: { x1: 95, x2: 125, y1: 0, y2: 30 }, duration: 1.0, ease: "power1.inOut" }, 2.2 * k);

  const tName = 2.4 * k;
  tl.fromTo(faWords, { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: "power4.out", stagger: 0.09 }, tName);
  tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: "power3.out", transformOrigin: (i) => (i ? "0% 50%" : "100% 50%") }, tName + 0.35);
  tl.fromTo(dia, { scale: 0, rotation: -135 }, { scale: 1, rotation: 45, duration: 0.6, ease: "back.out(2)" }, tName + 0.3);
  tl.fromTo("#enName", { opacity: 0, letterSpacing: "0.9em" }, { opacity: 1, letterSpacing: "0.3em", duration: 1.1, ease: "power3.out" }, tName + 0.45);

  motes.forEach((m) => {
    const d = m._d;
    tl.fromTo(m, { opacity: 0, y: 0, x: 0 }, { opacity: d.a, duration: 0.8, ease: "sine.out" }, 0.4 + d.delay);
    tl.to(m, { y: -d.rise, x: d.drift, duration: D - 0.4 - d.delay, ease: "none" }, 0.4 + d.delay);
  });

  if (outro) {
    // shift the brand up and reveal the call to action
    const bh = brand.offsetHeight, cta = $("#cta"), ch = cta.offsetHeight, s = 0.74, gap = u * 6;
    const total = bh * s + gap + ch, top = (H - total) / 2;
    const yTarget = top - (H / 2 - bh / 2);
    gsap.set(cta, { top: top + bh * s + gap });
    tl.to(brand, { y: yTarget, scale: s, duration: 0.9, ease: "power3.inOut" }, 2.6);
    tl.set(cta, { autoAlpha: 1 }, 3.1);
    $("#follow").textContent = T.igCta; const fw = RP.words($("#follow"));
    $("#igText").textContent = T.ig; $("#addrText").textContent = T.address;
    tl.fromTo(fw, { yPercent: 115 }, { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.08 }, 3.15);
    tl.fromTo("#igPill", { opacity: 0, scale: 0.85, y: u * 2 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" }, 3.45);
    tl.fromTo("#addr", { opacity: 0, y: u * 2 }, { opacity: 1, y: 0, duration: 0.7 }, 3.8);
    tl.to("#scene", { opacity: 0, duration: 0.6, ease: "power1.in" }, D - 0.6);
  } else {
    tl.to(brand, { scale: 1.02, duration: D - 3, ease: "none", transformOrigin: "50% 50%" }, 3);
  }
});
