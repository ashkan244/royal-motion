RP.run(function (tl, RP) {
  const { u, W, H, T, K, mode, duration: D } = RP;
  const $ = RP.$;
  const outro = mode === "outro";
  const from = outro ? 3 : (RP.params.from || 10);
  const t0 = outro ? 0.5 : 1;              // first number change
  const tZero = t0 + from;                   // reveal moment

  // caution bands top & bottom
  const bands = $("#bands");
  const off = ({ "9x16": 0.12, "4x5": 0.03, "16x9": 0.035 }[RP.aspect] || 0.04) * H;
  const top = RP.el("div", { class: "band stripes", style: { top: off + "px", transform: "rotate(-3deg)" } }, bands);
  const bot = RP.el("div", { class: "band stripes", style: { bottom: off + "px", transform: "rotate(-3deg)" } }, bands);
  tl.fromTo(top, { xPercent: -100 }, { xPercent: 0, duration: 0.8, ease: "power3.out" }, 0);
  tl.fromTo(bot, { xPercent: 100 }, { xPercent: 0, duration: 0.8, ease: "power3.out" }, 0.1);
  tl.fromTo([top, bot], { backgroundPositionX: 0 }, { backgroundPositionX: u * 40, duration: D, ease: "none" }, 0);

  // ring: 60 ticks + progress arc
  const svg = $("#ringWrap svg");
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2, r1 = 46, r2 = i % 5 ? 43.5 : 41.5;
    RP.svgEl("line", { x1: Math.sin(a) * r1, y1: -Math.cos(a) * r1, x2: Math.sin(a) * r2, y2: -Math.cos(a) * r2, stroke: i % 5 ? "rgba(255,255,255,.25)" : K.rwYellow, "stroke-width": i % 5 ? 0.35 : 0.7 }, svg);
  }
  RP.svgEl("circle", { r: 38, fill: "none", stroke: "rgba(255,210,31,.15)", "stroke-width": 1.6 }, svg);
  const arc = RP.svgEl("circle", { r: 38, fill: "none", stroke: K.rwYellow, "stroke-width": 1.6, "stroke-linecap": "round", transform: "rotate(-90)" }, svg);
  const C = 2 * Math.PI * 38;
  arc.style.strokeDasharray = C; arc.style.strokeDashoffset = 0;
  tl.fromTo("#ringWrap", { scale: 0.6, opacity: 0, rotation: -40 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.9, ease: "expo.out" }, 0.1);
  tl.fromTo(arc, { strokeDashoffset: 0 }, { strokeDashoffset: C, duration: from, ease: "none" }, t0);

  // labels
  const lt = $("#lblTop"), lb = $("#lblBot");
  lt.textContent = outro ? T.rwS2 : "تا شروع " + T.rwName;
  lb.textContent = "COUNTDOWN";
  const ring = { "9x16": 78, "4x5": 62, "16x9": 56 }[RP.aspect] || 62;
  gsap.set("#ringWrap", { width: u * ring, height: u * ring, marginLeft: -u * ring / 2, marginTop: -u * ring / 2 });
  gsap.set("#num", { fontSize: u * ring * 0.5 });
  gsap.set(lt, { top: H / 2 - u * (ring / 2 + 8) + "px" });
  gsap.set(lb, { top: H / 2 + u * (ring / 2 + 3.5) + "px" });
  tl.fromTo([lt, lb], { opacity: 0, y: u * 2 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 }, 0.3);

  // numbers
  const numBox = $("#num");
  for (let n = from; n >= 1; n--) {
    const s = RP.el("span", {}, numBox, RP.faNum(n));
    const tin = n === from ? 0.15 : t0 + (from - n);
    const tout = t0 + (from - n) + 1;
    tl.fromTo(s, { opacity: 0, scale: 0.35, filter: `blur(${u * 1.2}px)` }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.32, ease: "back.out(2.2)" }, tin);
    tl.to(s, { opacity: 0, scale: 1.7, filter: `blur(${u}px)`, duration: 0.28, ease: "power2.in" }, tout - 0.02);
    if (n <= 3) tl.fromTo("#bg", { backgroundColor: "rgba(255,210,31,.25)" }, { backgroundColor: "rgba(0,0,0,0)", duration: 0.5, ease: "power2.out" }, tin);
  }
  // heartbeat pulse of ring each second
  for (let i = 0; i < from; i++) tl.fromTo("#ringWrap", { scale: 1.035 }, { scale: 1, duration: 0.4, ease: "power2.out" }, t0 + i);

  // reveal
  tl.to(["#ringWrap", lt, lb], { opacity: 0, scale: 1.4, duration: 0.35, ease: "power2.in" }, tZero - 0.1);
  tl.fromTo("#flash", { opacity: 0 }, { opacity: 1, duration: 0.08, ease: "none" }, tZero);
  tl.to("#flash", { opacity: 0, duration: 0.7, ease: "power2.out" }, tZero + 0.08);
  tl.to("#bg", { background: "radial-gradient(ellipse at 50% 50%, #3a300a 0%, #0d0c08 55%, #000 100%)", duration: 0.1 }, tZero);
  const card = RP.rwCard({ theme: "dark", slogan: T.rwS1, links: true });
  RP.rwCardIn(tl, card, tZero + 0.05, "slam");
  RP.hold(tl, card.c, tZero + 1.8, D - tZero - 1.8, 0.03);

  // confetti burst (yellow/black/white squares)
  const conf = $("#conf"), r = RP.rng(21);
  for (let i = 0; i < 70; i++) {
    const s = u * (0.8 + r() * 1.6);
    const p = RP.el("i", { class: "conf", style: { width: s + "px", height: s * (0.4 + r() * 0.6) + "px", left: W / 2 + "px", top: H / 2 + "px",
      background: [K.rwYellow, "#fff", K.rwYellow, "#222"][i % 4] } }, conf);
    const ang = r() * Math.PI * 2, dist = u * (30 + r() * 70);
    gsap.set(p, { autoAlpha: 0 });
    tl.set(p, { autoAlpha: 1 }, tZero + 0.02);
    tl.fromTo(p, { x: 0, y: 0, rotation: 0, opacity: 1 },
      { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist + u * 30, rotation: r() * 720 - 360, opacity: 0, duration: 2 + r() * 1.2, ease: "power2.out", immediateRender: false }, tZero + 0.02);
  }
});
