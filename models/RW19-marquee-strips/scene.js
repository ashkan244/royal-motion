RP.run(function (tl, RP) {
  const { u, W, H, T, mode, duration: D } = RP;
  const loop = mode === "loop", outro = mode === "outro";
  const tc = outro ? 2.4 : 2.1;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const box = RP.el("div", { id: "strips" }, sc);
  const diag = Math.hypot(W, H) * 1.15;
  const rows = Math.ceil(diag / (u * 12)) + 1;
  gsap.set(box, { xPercent: -50, yPercent: -50, rotation: -8, width: diag });
  const sets = [[T.rwName, "ROYAL WEEK", T.rwS1], [T.rwOff, "BLACK FRIDAY", T.rwS2], [T.rwName, "ROYAL PARS", T.rwFriday]];
  const strips = [];
  for (let i = 0; i < rows; i++) {
    const s = RP.el("div", { class: "strip " + (i % 2 ? "k" : "y") }, box);
    const run = RP.el("div", { class: "run" }, s);
    const items = sets[i % sets.length];
    for (let k = 0; k < 5; k++) items.forEach((t, j) => {
      RP.el("span", { class: /[A-Z]/.test(t) ? (j % 2 && i % 3 === 1 ? "eo" : "en") : "fa" }, run, t);
      RP.el("i", {}, run);
    });
    strips.push([s, run, i % 2 ? 1 : -1]);
  }
  // seamless marquee: move by exactly one item-set width per cycle, wrapped
  strips.forEach(([s, run, dir], i) => {
    const setW = run.scrollWidth / 5;
    const speed = u * (14 + (i % 3) * 4);              // px per second
    const wrap = gsap.utils.wrap(-setW, 0);
    tl.fromTo(run, { x: -setW / 2 }, { x: -setW / 2 + dir * speed * D, duration: D, ease: "none", modifiers: { x: gsap.utils.unitize(wrap) } }, 0);
    if (!loop) {
      tl.fromTo(s, { xPercent: dir * 100 }, { xPercent: 0, duration: 0.6, ease: "power3.out" }, 0.03 * i);
      tl.to(s, { xPercent: -dir * 110, duration: 0.5, ease: "power3.in" }, tc - 0.5 + 0.02 * i);
    }
  });
  if (!loop) {
    const rc = RP.rwCard({ theme: "dark", links: outro });
    RP.rwCardIn(tl, rc, tc, "slam");
    RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
  }
});
