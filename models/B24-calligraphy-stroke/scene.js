RP.run(function (tl, RP) {
  const { u, W, K } = RP;
  const sc = RP.$("#scene");
  RP.ivoryBg();
  RP.grain(sc, 9, 0.04);
  const r = RP.brandLockup({ theme: "ivory" });
  // a tapered gold brush stroke sweeps (right to left) behind the Persian name
  const fb = RP.box(r.fa);
  const bw = Math.min(W * 0.92, fb.w * 1.9), bh = fb.h * 1.25;
  const brush = RP.el("div", { style: { position: "absolute", left: fb.cx - bw / 2 + "px", top: fb.cy - bh / 2 + "px", width: bw + "px", height: bh + "px", zIndex: 49 } }, sc,
    `<svg viewBox="0 0 400 80" preserveAspectRatio="none" style="width:100%;height:100%"><defs><linearGradient id="br" x1="0" x2="1"><stop offset="0" stop-color="#C9A45C" stop-opacity=".15"/><stop offset=".3" stop-color="#E7C784"/><stop offset=".85" stop-color="#C9A45C"/><stop offset="1" stop-color="#9A7838"/></linearGradient></defs>
     <path d="M396 34 C330 12 250 18 170 26 C110 32 50 30 4 44 C60 46 120 56 190 58 C270 60 340 56 398 46 Z" fill="url(#br)"/>
     <path d="M380 38 C300 28 200 34 120 40" fill="none" stroke="#fff6dc" stroke-opacity=".5" stroke-width="2"/></svg>`);
  tl.fromTo(brush, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 0.6, ease: "power3.inOut" }, 1.0);
  tl.fromTo(brush, { opacity: 1 }, { opacity: 0.85, duration: 1.5 }, 1.6);
  const tLock = RP.brandIn(tl, r, 0.2, "fade");
  if (RP.mode === "outro") tl.to(brush, { opacity: 0, duration: 0.4 }, Math.max(tLock, 2.2));
  RP.brandEnd(tl, r, tLock);
});
