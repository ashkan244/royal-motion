RP.run(function (tl, RP) {
  const { u, W, H, T, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 3.6 : 3.6;
  const sc = RP.$("#scene");
  const bg = RP.el("div", { id: "bg", class: "full" }, sc);
  const b = 60 / (RP.params.bpm || 100);     // 0.6 s per beat — matches the rw_drums bed
  // pattern of rw_drums: kick on 0, snare on beat 1 of each 2-beat bar
  const words = ["این", "جمعه", "رویالیه!"];
  const sizes = [14, 16, 20];
  const r = RP.rng(4);
  words.forEach((w, i) => {
    const t = b * (i * 2);
    const e = RP.el("div", { class: "word" }, sc, w);
    gsap.set(e, { yPercent: -55, fontSize: u * sizes[i], color: i === 2 ? "#FFD21F" : "#fff", autoAlpha: 0 });
    tl.set(e, { autoAlpha: 1 }, t);
    tl.fromTo(e, { scale: 1.9, filter: `blur(${u}px)` }, { scale: 1, filter: "blur(0px)", duration: 0.14, ease: "power4.in", immediateRender: false }, t);
    tl.fromTo(e, { rotation: (r() - 0.5) * 10 }, { rotation: 0, duration: b * 2, ease: "power2.out", immediateRender: false }, t);
    if (i < 2) tl.to(e, { autoAlpha: 0, duration: 0.05 }, t + b * 2 - 0.02);
    else tl.to(e, { y: -u * 16, scale: 0.7, duration: 0.5, ease: "power3.inOut" }, b * 5.2);
  });
  // drum-skin ripples on every hit (kick + snare)
  for (let k = 0; k * b < tc; k++) {
    const ring = RP.el("div", { class: "ring" }, sc);
    const s = u * (k % 2 ? 34 : 46);
    gsap.set(ring, { width: s, height: s, marginLeft: -s / 2, marginTop: -s / 2, opacity: 0 });
    tl.fromTo(ring, { scale: 0.4, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: b * 1.6, ease: "power2.out", immediateRender: false }, k * b);
    tl.fromTo(bg, { backgroundColor: k % 2 ? "#1c1704" : "#2a2306" }, { backgroundColor: "#070707", duration: b * 0.9, ease: "power2.out", immediateRender: false }, k * b);
  }
  // equaliser bars bouncing on 8ths
  const bars = RP.el("div", { id: "bars" }, sc);
  gsap.set(bars, { top: H - u * (RP.portrait ? 30 : 16) });
  const N = RP.landscape ? 48 : 28, bl = [];
  for (let i = 0; i < N; i++) bl.push(RP.el("i", {}, bars));
  for (let t = 0; t < D; t += b / 2) {
    const amp = Math.round(t / b) % 2 ? 0.6 : 1;
    const vals = bl.map(() => 0.12 + r() * amp);   // precomputed: identical on every worker
    tl.set(bl, { scaleY: (i) => vals[i] }, t);
  }
  const live = RP.el("div", { id: "live" }, sc, "<b>اجرای زنده</b> شب‌های " + T.rwName);
  gsap.set(live, { top: H / 2 + u * 10, autoAlpha: 0 });
  tl.set(live, { autoAlpha: 1 }, b * 5.4);
  tl.fromTo(live, { y: u * 4, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, immediateRender: false }, b * 5.4);
  tl.to([".word", live, bars], { opacity: 0, duration: 0.3 }, tc - 0.3);
  const rc = RP.rwCard({ theme: "dark", links: outro, slogan: T.rwS2 });
  RP.rwCardIn(tl, rc, tc, "slam");
  for (let k = Math.ceil(tc / b); k * b < D - 0.3; k++) tl.fromTo(rc.title, { scale: 1.06 }, { scale: 1, duration: b * 0.8, ease: "power2.out", immediateRender: false }, k * b);
});
