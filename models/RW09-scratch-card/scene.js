RP.run(function (tl, RP) {
  const { u, W, H, T, mode, duration: D } = RP;
  const outro = mode === "outro", tc = outro ? 2.9 : 2.6;
  const sc = RP.$("#scene");
  RP.el("div", { id: "bg", class: "full" }, sc);
  const card = RP.el("div", { id: "card" }, sc,
    `<div class="head">${T.rwGame} · ${T.rwName}</div><div id="win"><div id="prize"><b>${RP.params.prize}</b><span>${RP.params.prizeLabel}</span></div></div><div class="foot">ROYAL WEEK</div>`);
  gsap.set(card, { xPercent: -50, yPercent: -50 });
  const win = RP.$("#win");
  const ww = win.offsetWidth, wh = win.offsetHeight;
  // silver coating with a scratch mask that follows a zig-zag
  const coat = RP.svgEl("svg", { id: "coat", viewBox: `0 0 ${ww} ${wh}` }, win);
  coat.innerHTML = `<defs><linearGradient id="sv" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e9e9e9"/><stop offset=".5" stop-color="#a9a9a9"/><stop offset="1" stop-color="#d6d6d6"/></linearGradient>
    <pattern id="sp" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="6" fill="url(#sv)"/><circle cx="2" cy="2" r=".8" fill="rgba(255,255,255,.5)"/></pattern>
    <mask id="mk" maskUnits="userSpaceOnUse"><rect width="${ww}" height="${wh}" fill="#fff"/><path id="scr" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="${u * 9}"/></mask></defs>
    <rect width="${ww}" height="${wh}" fill="url(#sp)" mask="url(#mk)"/>
    <text x="${ww / 2}" y="${wh / 2}" text-anchor="middle" dominant-baseline="middle" font-family="Fanavari, Vazirmatn" font-weight="700" font-size="${u * 4}" fill="#777" mask="url(#mk)">بخراش!</text>`;
  const rows = 4, pts = [];
  for (let i = 0; i <= rows; i++) {
    const y = wh * (0.1 + 0.8 * i / rows);
    pts.push(i % 2 ? [ww * 0.95, y] : [ww * 0.05, y]);
    pts.push(i % 2 ? [ww * 0.05, y + wh * 0.1] : [ww * 0.95, y + wh * 0.1]);
  }
  const scr = RP.$("#scr");
  scr.setAttribute("d", "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L"));
  const len = scr.getTotalLength();
  scr.style.strokeDasharray = len; scr.style.strokeDashoffset = len;
  const tS = 0.55, tE = 1.95;
  tl.fromTo(scr, { strokeDashoffset: len }, { strokeDashoffset: 0, duration: tE - tS, ease: "none" }, tS);
  // coin rides the same path (sampled → keyframes, so seeking stays exact)
  const coin = RP.el("div", { id: "coin" }, sc, "R");
  const N = 48, xs = [], ys = [];
  const ox = W / 2 - card.offsetWidth / 2 + win.offsetLeft, oy = H / 2 - card.offsetHeight / 2 + win.offsetTop;
  for (let i = 0; i <= N; i++) {
    const p = scr.getPointAtLength((len * i) / N);
    xs.push(ox + p.x - u * 4.5); ys.push(oy + p.y - u * 4.5);
  }
  tl.fromTo(card, { scale: 0.6, rotation: -8, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 0.55, ease: "back.out(1.6)" }, 0);
  gsap.set(coin, { x: xs[0], y: ys[0], autoAlpha: 0 });
  tl.fromTo(coin, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.25 }, tS - 0.25);
  tl.to(coin, { keyframes: { x: xs, y: ys }, duration: tE - tS, ease: "none" }, tS);
  tl.to(coin, { rotation: 720, duration: tE - tS, ease: "none" }, tS);
  tl.to(coin, { autoAlpha: 0, y: "+=" + u * 10, duration: 0.3 }, tE);
  tl.fromTo("#prize", { scale: 1 }, { keyframes: { scale: [1, 1.15, 1] }, duration: 0.45, ease: "none" }, tE + 0.05);
  tl.to(card, { rotationY: 90, scale: 0.8, opacity: 0, duration: 0.4, ease: "power3.in" }, tc - 0.35);
  const rc = RP.rwCard({ theme: "dark", links: outro });
  RP.rwCardIn(tl, rc, tc, "slam");
  RP.hold(tl, rc.c, tc + 1.6, D - tc - 1.6);
});
