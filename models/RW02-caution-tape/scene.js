RP.run(function (tl, RP) {
  const { u, W, H, T, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 2.45 : 2.05;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const diag = Math.hypot(W, H);
  const specs = [[-17, -0.22], [11, 0.02], [-6, 0.25], [23, -0.04], [-28, 0.4]];
  specs.forEach(([rot, oy], i) => {
    const t = RP.el("div", { class: "tape" }, sc);
    const run = RP.el("div", { class: "run" }, t);
    const items = [T.rwName, "ROYAL WEEK", T.rwS1, "ROYAL WEEK"];
    for (let k = 0; k < 7; k++) items.forEach((s) => {
      RP.el("span", { class: /[A-Z]/.test(s) ? "en" : "fa" }, run, s); RP.el("i", {}, run);
    });
    gsap.set(t, { xPercent: -50, yPercent: -50, rotation: rot, y: oy * H, width: diag * 1.6 });
    const dir = i % 2 ? 1 : -1;
    tl.fromTo(t, { x: dir * diag * 1.3 }, { x: 0, duration: 0.65, ease: "power3.out" }, 0.04 + i * 0.12);
    tl.fromTo(run, { x: -u * 30 }, { x: -u * 30 + dir * u * 40, duration: D, ease: "none" }, 0);
    tl.to(t, { x: -dir * diag * 1.4, duration: 0.42, ease: "power3.in" }, tc - 0.45 + i * 0.05);
  });
  tl.fromTo(sc, { x: 0 }, { keyframes: { x: [0, -u * 0.8, u * 0.6, -u * 0.3, 0] }, duration: 0.25, ease: "none", immediateRender: false }, tc + 0.05);
  const card = RP.rwCard({ theme: "dark", links: outro });
  RP.rwCardIn(tl, card, tc, "slam");
  RP.hold(tl, card.c, tc + 1.6, D - tc - 1.6);
});
