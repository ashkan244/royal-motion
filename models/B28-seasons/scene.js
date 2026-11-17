RP.run(function (tl, RP) {
  const { u, W, H, K, duration: D } = RP;
  const sc = RP.$("#scene");
  const season = RP.params.season || "winter";
  const S = {
    spring: { bg: "radial-gradient(ellipse at 50% 40%, #2c3a7a 0%, #1B2250 50%, #0b0f2b 100%)", tint: "rgba(255,190,210,.18)", kind: "petal", cols: ["#ffd3e0", "#ffb6c9", "#fff0f4"], txt: "بهار" },
    summer: { bg: "radial-gradient(ellipse at 50% 30%, #3a3f86 0%, #1B2250 50%, #0b0f2b 100%)", tint: "rgba(255,200,90,.22)", kind: "ray", cols: ["#ffe08a"], txt: "تابستان" },
    autumn: { bg: "radial-gradient(ellipse at 50% 40%, #33285a 0%, #1B2250 50%, #0b0f2b 100%)", tint: "rgba(230,130,50,.18)", kind: "leaf", cols: ["#e08a3c", "#c8622a", "#e9b04c"], txt: "پاییز" },
    winter: { bg: "radial-gradient(ellipse at 50% 40%, #2a3d80 0%, #16205a 50%, #070b25 100%)", tint: "rgba(170,210,255,.16)", kind: "snow", cols: ["#ffffff", "#dfeaff"], txt: "زمستان" },
  }[season];
  RP.el("div", { class: "full", style: { background: S.bg } }, sc);
  RP.el("div", { class: "full", style: { background: `radial-gradient(ellipse at 50% 0%, ${S.tint} 0%, rgba(0,0,0,0) 60%)` } }, sc);
  const box = RP.el("div", { class: "full", style: { zIndex: 60 } }, sc);
  const rr = RP.rng(season.length * 7 + 1);
  if (S.kind === "ray") {
    const rays = RP.el("div", { style: { position: "absolute", left: W / 2 - H + "px", top: -H * 1.2 + "px", width: H * 2 + "px", height: H * 2 + "px", borderRadius: "50%", zIndex: 5,
      background: "repeating-conic-gradient(from 0deg, rgba(255,224,138,.12) 0 6deg, rgba(255,224,138,0) 6deg 18deg)" } }, sc);
    tl.fromTo(rays, { rotation: 0, opacity: 0 }, { rotation: 25, opacity: 1, duration: D, ease: "none" }, 0);
  } else {
    const n = S.kind === "snow" ? 90 : 40;
    for (let i = 0; i < n; i++) {
      const s = u * (S.kind === "snow" ? 0.5 + rr() * 1.1 : 1.6 + rr() * 1.8), c = S.cols[i % S.cols.length];
      const shape = S.kind === "snow" ? { borderRadius: "50%", width: s + "px", height: s + "px", background: c, opacity: 0.85 }
        : S.kind === "petal" ? { borderRadius: "70% 0 70% 0", width: s + "px", height: s * 0.7 + "px", background: c }
        : { borderRadius: "0 80% 0 80%", width: s + "px", height: s * 0.6 + "px", background: c };
      const p = RP.el("i", { style: Object.assign({ position: "absolute", left: rr() * W + "px", top: -u * 4 + "px" }, shape) }, box);
      const dur = (S.kind === "snow" ? 3.5 : 3.0) + rr() * 2.5, t0 = -rr() * dur;   // already falling at frame 0
      const f = -t0 / dur, travel = H + u * 10;
      tl.fromTo(p, { y: travel * f }, { y: travel, duration: dur * (1 - f), ease: "none" }, 0);
      tl.fromTo(p, { x: 0, rotation: rr() * 360 }, { keyframes: { x: [0, u * 4, -u * 3, u * 2] }, rotation: "+=" + (S.kind === "snow" ? 0 : 400), duration: Math.min(D, dur * (1 - f)), ease: "none" }, 0);
    }
  }
  const r = RP.brandLockup({});
  const tag = RP.el("div", { style: { fontFamily: "var(--fa-body)", fontWeight: 700, fontSize: u * 2.8 + "px", color: K.goldLight, marginTop: u * 2 + "px", direction: "rtl" } }, r.c, `${S.txt} در ${RP.T.faShort}`);
  const tLock = RP.brandIn(tl, r, 0.35, "fade");
  tl.fromTo(tag, { opacity: 0, y: u * 2 }, { opacity: 1, y: 0, duration: 0.6 }, tLock - 0.4);
  RP.brandEnd(tl, r, tLock);
});
