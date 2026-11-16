RP.run(function (tl, RP) {
  const { u, W, H, T, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 3.65 : 3.35;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const head = RP.el("div", { id: "head", class: "fa" }, sc, `<b>${T.rwGame}</b>: امتیاز بگیر، رویالی‌تر شو`);
  // staircase rises from bottom-right to top-left (reading direction)
  const titles = RP.params.titles, n = titles.length;
  const sw = u * (RP.landscape ? 30 : 34), sh = u * 11, dx = RP.landscape ? u * 32 : u * 16, dy = u * (RP.landscape ? 12 : 17);
  const x0 = W / 2 + (dx * (n - 1)) / 2 - sw / 2, y0 = H / 2 + (dy * (n - 1)) / 2 - sh / 2 + u * 6;
  gsap.set(head, { top: y0 - dy * (n - 1) - u * 22 });
  const steps = titles.map((t, i) => {
    const s = RP.el("div", { class: "step" }, sc, `<span>${t}</span><i class="lv">LEVEL ${i + 1}</i>`);
    gsap.set(s, { left: x0 - dx * i, top: y0 - dy * i, width: sw, height: sh, fontSize: u * (i === n - 1 ? 5.6 : 5) });
    tl.fromTo(s, { y: u * 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }, 0.15 + i * 0.1);
    return s;
  });
  tl.fromTo(head, { opacity: 0, y: -u * 3 }, { opacity: 1, y: 0, duration: 0.6 }, 0.1);
  // crown hops step to step
  const crown = RP.el("div", { id: "crown" }, sc,
    `<svg viewBox="0 0 110 80"><path d="M8 70L2 18L32 42L55 6L78 42L108 18L102 70Z" fill="${K.rwYellow}" stroke="#000" stroke-width="4" stroke-linejoin="round"/>` +
    `<rect x="8" y="64" width="94" height="12" rx="3" fill="${K.rwYellow}" stroke="#000" stroke-width="4"/><circle cx="55" cy="44" r="7" fill="#000"/></svg>`);
  const cw = u * 11, ch = u * 8;
  const pos = steps.map((s, i) => [x0 - dx * i + sw / 2 - cw / 2, y0 - dy * i - ch - u * 4.2]);
  gsap.set(crown, { transformOrigin: "50% 100%" });
  gsap.set(crown, { x: pos[0][0], y: pos[0][1] - u * 30, autoAlpha: 0 });
  tl.set(crown, { autoAlpha: 1 }, 0.5);
  tl.to(crown, { y: pos[0][1], duration: 0.4, ease: "bounce.out" }, 0.5);
  const lit = (i, t) => {
    tl.to(steps[i], { backgroundColor: K.rwYellow, color: K.rwBlack, borderColor: K.rwYellow, duration: 0.15 }, t);
    tl.fromTo(steps[i], { scale: 1 }, { keyframes: { scale: [1, 1.08, 1] }, duration: 0.3, ease: "none", immediateRender: false }, t);
  };
  lit(0, 0.9);
  for (let i = 1; i < n; i++) {
    const t = 0.9 + i * 0.55;
    tl.to(crown, { keyframes: { x: [pos[i - 1][0], (pos[i - 1][0] + pos[i][0]) / 2, pos[i][0]], y: [pos[i - 1][1], Math.min(pos[i - 1][1], pos[i][1]) - u * 12, pos[i][1]] }, duration: 0.4, ease: "power1.inOut" }, t - 0.4);
    tl.fromTo(crown, { rotation: 0 }, { rotation: -360, duration: 0.4, ease: "power1.inOut", immediateRender: false }, t - 0.4);
    lit(i, t);
  }
  const tk = 0.9 + (n - 1) * 0.55;
  tl.fromTo(crown, { scale: 1 }, { scale: 1.5, duration: 0.4, ease: "back.out(3)" }, tk + 0.05);
  tl.fromTo(steps[n - 1], { boxShadow: "0 0 0 rgba(255,210,31,0)" }, { boxShadow: `0 0 ${u * 6}px rgba(255,210,31,.9)`, duration: 0.4 }, tk);
  tl.to([...steps, crown, head], { opacity: 0, y: "-=" + u * 10, duration: 0.4, ease: "power2.in", stagger: 0.02 }, tc - 0.45);
  const rc = RP.rwCard({ theme: "dark", links: outro, slogan: "پادشاه هفته شو!" });
  RP.rwCardIn(tl, rc, tc, "slam");
  RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
});
