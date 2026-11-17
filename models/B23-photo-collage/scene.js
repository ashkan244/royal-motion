RP.run(function (tl, RP) {
  const { u, W, H, K } = RP;
  const sc = RP.$("#scene");
  RP.navyBg();
  // four tiles (replace with store photos via params.images) collapse into the badge
  const imgs = RP.params.images || [];
  const labels = RP.params.labels || ["مد و پوشاک", "کیف و کفش", "زیبایی", "کودک"];
  const tones = [["#2b3584", "#151b4a"], ["#8c6a2e", "#4a3713"], ["#6E1F2E", "#33101a"], ["#2f6b7a", "#123540"]];
  const S = Math.min(W, H) * 0.42, g = u * 2, lb0 = { x: W / 2, y: H / 2 };
  const tiles = labels.map((t, i) => {
    const e = RP.el("div", { style: { position: "absolute", width: S + "px", height: S + "px", borderRadius: u * 2 + "px", overflow: "hidden", zIndex: 30,
      left: lb0.x + (i % 2 ? g / 2 : -S - g / 2) + "px", top: lb0.y + (i < 2 ? -S - g / 2 : g / 2) + "px",
      background: imgs[i] ? `url(${imgs[i]}) center/cover` : `linear-gradient(135deg, ${tones[i][0]}, ${tones[i][1]})`, boxShadow: `0 ${u}px ${u * 3}px rgba(0,0,0,.4)` } }, sc,
      `<div style="position:absolute;inset:auto 0 0 0;padding:${u * 1.4}px ${u * 2}px;font-family:var(--fa);font-weight:700;font-size:${u * 3.6}px;color:#F6F0E3;direction:rtl;text-align:right;background:linear-gradient(0deg, rgba(0,0,0,.55), transparent)">${t}</div>`);
    return e;
  });
  tiles.forEach((t, i) => {
    tl.fromTo(t, { opacity: 0, scale: 0.7, rotation: (i % 2 ? 1 : -1) * 6 }, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.6)" }, 0.1 + i * 0.12);
    tl.to(t, { x: (i % 2 ? -1 : 1) * (S / 2 + g / 2), y: (i < 2 ? 1 : -1) * (S / 2 + g / 2), scale: 0.15, rotation: (i % 2 ? 1 : -1) * 20, opacity: 0, duration: 0.5, ease: "power3.in" }, 1.1 + i * 0.03);
  });
  const r = RP.brandLockup({});
  const tLock = RP.brandIn(tl, r, 1.5, "pop");
  RP.brandEnd(tl, r, tLock);
});
