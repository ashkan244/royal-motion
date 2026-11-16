RP.run(function (tl, RP) {
  const { u, W, H, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 1.7 : 1.5;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const wipe = RP.el("div", { id: "wipe" }, sc);
  const R = Math.hypot(W, H);
  gsap.set(wipe, { width: R, height: R, xPercent: -50, yPercent: -50, scale: 0 });
  tl.fromTo(wipe, { scale: 0 }, { scale: 1.05, duration: 0.7, ease: "power3.inOut" }, tc - 0.35);
  const card = RP.rwCard({ theme: "yellow", links: outro });
  RP.rwCardIn(tl, card, tc, "rise");
  RP.hold(tl, card.c, tc + 1.6, D - tc - 1.6);
  // balloons drift up across the whole piece, over the card
  const r = RP.rng(5), n = RP.landscape ? 22 : 18;
  const cols = [[K.rwYellow, "#D9A800"], ["#2b2b2b", "#000"], [K.rwYellow, "#D9A800"], ["#333", "#050505"], ["#fff", "#cfcfcf"]];
  for (let i = 0; i < n; i++) {
    const s = u * (11 + r() * 9), c = cols[i % cols.length];
    const b = RP.el("div", { class: "bal" }, sc);
    RP.el("div", { class: "b", style: { width: s + "px", height: s * 1.18 + "px", background: `radial-gradient(circle at 35% 30%, ${c[0]} 0%, ${c[0]} 45%, ${c[1]} 100%)`,
      boxShadow: `inset -${s * 0.08}px -${s * 0.1}px ${s * 0.15}px rgba(0,0,0,.25)` } }, b);
    RP.el("div", { class: "k", style: { borderBottom: `${u * 1.2}px solid ${c[1]}` } }, b);
    b.insertAdjacentHTML("beforeend", `<svg width="${u * 3}" height="${s * 1.1}" viewBox="0 0 30 100" preserveAspectRatio="none"><path d="M15 0C5 20 25 35 15 55S5 85 15 100" fill="none" stroke="rgba(0,0,0,.45)" stroke-width="1.2" vector-effect="non-scaling-stroke"/></svg>`);
    const x0 = r() * W - s / 2, dur = 3.2 + r() * 1.6, travel = H + s * 2.6 + u * 10;
    const start = (i / n) * (outro ? 3.4 : 3.0) - 1.6 + r() * 0.3;   // negative = already on screen at frame 0
    const f = start < 0 ? -start / dur : 0, at = Math.max(0, start);
    gsap.set(b, { left: x0, top: H + u * 5 });
    tl.fromTo(b, { y: -travel * f }, { y: -travel, duration: dur * (1 - f), ease: "none" }, at);
    tl.fromTo(b, { x: 0, rotation: -6 }, { keyframes: { x: [0, u * 3, -u * 2.5, u * 2, 0], rotation: [-6, 5, -4, 3, 0] }, duration: dur * (1 - f), ease: "none" }, at);
  }
});
