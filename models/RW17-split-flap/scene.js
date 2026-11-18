RP.run(function (tl, RP) {
  const { u, T, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 3.15 : 2.85;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const board = RP.el("div", { id: "board" }, sc, `<div class="lbl"><span>DEPARTURES</span><span>ROYAL PARS</span></div>`);
  gsap.set(board, { xPercent: -50, yPercent: -50, scale: RP.landscape ? 0.95 : 1.0 });
  const r = RP.rng(12), AZ = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  // flip helper: a stack of states shown one at a time with a quick fold
  const flipSeq = (box, states, t0, dt) => {
    const spans = states.map((s) => RP.el("span", {}, box, s));
    states.forEach((s, i) => {
      const t = t0 + i * dt;
      tl.set(spans, { opacity: 0 }, t);
      tl.set(spans[i], { opacity: 1 }, t);
      tl.fromTo(box, { scaleY: 0.15 }, { scaleY: 1, duration: Math.min(dt, 0.07), ease: "power1.out", immediateRender: false }, t);
    });
  };
  // row 1: Latin letters (per-letter flaps are fine for Latin)
  const word = "ROYAL WEEK";
  const row1 = RP.el("div", { class: "row" }, board);
  Array.from(word).forEach((ch, i) => {
    const c = RP.el("div", { class: "cell" }, row1);
    const n = 6 + i;
    const states = []; for (let k = 0; k < n; k++) states.push(AZ[(r() * AZ.length) | 0]);
    states.push(ch === " " ? "" : ch);
    flipSeq(c, states, 0.2, 0.07);
  });
  // row 2 + 3: Persian flips whole words on one panel (letters stay joined)
  const p2 = RP.el("div", { class: "panel" }, board);
  flipSeq(p2, ["تخفیف", "هدیه", "جایزه", "بازی", T.rwS2], 0.9, 0.22);
  const p3 = RP.el("div", { class: "panel y" }, board);
  flipSeq(p3, ["۰۰ ۰۰ ۰۰", "۳ آذر", "۵ آذر", T.rwFriday], 1.4, 0.2);
  tl.fromTo(board, { opacity: 0, y: u * 6 }, { opacity: 1, y: 0, duration: 0.4 }, 0);
  tl.fromTo(board, { boxShadow: "0 0 0 rgba(255,210,31,0)" }, { boxShadow: `0 0 ${u * 6}px rgba(255,210,31,.5)`, duration: 0.3, immediateRender: false }, 2.3);
  tl.to(board, { rotationX: 80, opacity: 0, duration: 0.4, ease: "power3.in" }, tc - 0.35);
  const rc = RP.rwCard({ theme: "dark", links: outro, slogan: T.rwS2 });
  RP.rwCardIn(tl, rc, tc, "slam");
  RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
});
