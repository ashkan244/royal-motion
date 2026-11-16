RP.run(function (tl, RP) {
  const { u, W, H, K, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 2.75 : 2.45;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  // marquee bulbs around the frame
  const bulbs = [], step = u * 7, m = u * 3;
  for (let x = m; x < W - m; x += step) bulbs.push([x, m], [x, H - m]);
  for (let y = m + step; y < H - m - step / 2; y += step) bulbs.push([m, y], [W - m, y]);
  const bEls = bulbs.map(([x, y], i) => { const b = RP.el("div", { class: "bulb" }, sc); gsap.set(b, { left: x - u * 0.9, top: y - u * 0.9 }); b._g = i % 2; return b; });
  const A = bEls.filter((b) => b._g), B = bEls.filter((b) => !b._g);
  for (let t = 0; t < D; t += 0.25) { tl.set(A, { opacity: (t / 0.25) % 2 ? 1 : 0.25 }, t); tl.set(B, { opacity: (t / 0.25) % 2 ? 0.25 : 1 }, t); }

  const mach = RP.el("div", { id: "machine" }, sc, `<div class="ttl">ماشین شانس رویالی</div><div id="reels"></div>`);
  gsap.set(mach, { xPercent: -50, yPercent: -50, scale: RP.landscape ? 0.9 : 1 });
  const badge = () => {
    const s = RP.logo({ outerStroke: K.rwBlack, outerWidth: 1.6, innerFill: K.rwYellow, innerStroke: K.rwBlack, innerWidth: .6, mono: K.rwBlack, monoWidth: 2 });
    return s.outerHTML;
  };
  const pool = ["٪", "۵۰", badge(), "★", "۳۰", "٪", "۲۰", "★"];
  const reels = RP.$("#reels");
  const cell = u * 27, spins = [14, 18, 22], stops = [1.05, 1.35, 1.65];
  spins.forEach((n, ri) => {
    const reel = RP.el("div", { class: "reel" }, reels);
    const strip = RP.el("div", { class: "strip" }, reel);
    for (let k = 0; k < n; k++) RP.el("div", { class: "sym" }, strip, pool[(k * 3 + ri * 2) % pool.length]);
    RP.el("div", { class: "sym" }, strip, badge());               // final symbol: the Royal badge
    tl.fromTo(strip, { y: 0 }, { y: -cell * n, duration: stops[ri] - 0.2, ease: "back.out(0.6)" }, 0.2);
    tl.fromTo(strip, { filter: `blur(${u * 0.8}px)` }, { filter: "blur(0px)", duration: stops[ri] - 0.2, ease: "power4.in" }, 0.2);
    tl.fromTo(reel, { y: 0 }, { keyframes: { y: [0, u * 1.2, 0] }, duration: 0.2, ease: "none", immediateRender: false }, stops[ri]);
  });
  tl.fromTo(mach, { scale: 0.7, opacity: 0 }, { scale: RP.landscape ? 0.9 : 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, 0);
  const win = RP.el("div", { id: "win" }, sc, "<span>جک‌پات رویالی!</span>");
  gsap.set(win, { top: H / 2 + u * 25, autoAlpha: 0 });
  tl.set(win, { autoAlpha: 1 }, 1.75);
  tl.fromTo(win, { scale: 0.3 }, { scale: 1, duration: 0.4, ease: "back.out(2.4)", immediateRender: false }, 1.75);
  tl.fromTo(mach, { boxShadow: `0 0 ${u * 6}px rgba(255,210,31,.25)` }, { keyframes: { boxShadow: [`0 0 ${u * 14}px rgba(255,210,31,.9)`, `0 0 ${u * 6}px rgba(255,210,31,.25)`, `0 0 ${u * 12}px rgba(255,210,31,.8)`] }, duration: 0.6, ease: "none", immediateRender: false }, 1.7);
  tl.to([mach, win], { y: -H, duration: 0.45, ease: "power3.in" }, tc - 0.4);
  const rc = RP.rwCard({ theme: "dark", links: outro });
  RP.rwCardIn(tl, rc, tc, "slam");
  RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
});
