RP.run(function (tl, RP) {
  const { u, W, H, K, duration: D } = RP;
  const sc = RP.$("#scene");
  // transparent overlay: nothing paints the frame background
  document.documentElement.style.background = "transparent"; document.body.style.background = "transparent";
  const style = RP.params.style || "gold";
  const name = RP.params.name, role = RP.params.role;
  const k = RP.landscape ? 1 : 1.25;
  const box = RP.el("div", { style: { position: "absolute", right: u * 6 + "px", bottom: (RP.landscape ? H * 0.12 : H * 0.2) + "px", display: "flex", alignItems: "stretch", direction: "rtl", gap: u * 1.6 + "px" } }, sc);
  const nameEl = `<div class="n" style="font-family:var(--fa);font-weight:700;font-size:${u * 5 * k}px;line-height:1.3;white-space:nowrap">${name}</div>`;
  const roleEl = `<div class="r" style="font-family:var(--fa-body);font-weight:700;font-size:${u * 2.8 * k}px;line-height:1.4;white-space:nowrap">${role}</div>`;
  let bar, plate, n, r;
  if (style === "gold") {
    bar = RP.el("i", { style: { width: u * 1.2 + "px", background: `linear-gradient(180deg, ${K.goldLight}, ${K.goldDeep})`, borderRadius: "2px" } }, box);
    plate = RP.el("div", { style: { padding: `${u * 1.4}px ${u * 3}px ${u * 1.8}px`, background: "rgba(14,19,48,.88)", borderRadius: u * 0.8 + "px" } }, box, nameEl + roleEl);
    n = RP.$(".n", plate); r = RP.$(".r", plate); n.style.color = K.ivory; r.style.color = K.gold;
  } else if (style === "plate") {
    plate = RP.el("div", { style: { display: "flex", alignItems: "center", gap: u * 2.4 + "px", padding: `${u * 1.4}px ${u * 2.4}px ${u * 1.4}px ${u * 4}px`, background: `linear-gradient(90deg, rgba(27,34,80,.92), rgba(38,48,111,.95))`,
      border: `1.5px solid ${K.gold}`, borderRadius: u * 6 + "px" } }, box);
    const lg = RP.logo({ parent: plate, outerStroke: K.gold, innerFill: "#212a66", innerStroke: K.gold, innerWidth: .45, mono: K.gold });
    lg.style.height = u * 9 * k + "px"; lg.style.width = u * 5.4 * k + "px";
    RP.el("div", {}, plate, nameEl + roleEl);
    n = RP.$(".n", plate); r = RP.$(".r", plate); n.style.color = K.ivory; r.style.color = K.goldLight;
    bar = lg;
  } else {
    plate = RP.el("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start" } }, box, nameEl + `<i class="ln" style="display:block;height:2px;width:100%;margin:${u * 0.6}px 0;background:${K.gold}"></i>` + roleEl);
    n = RP.$(".n", plate); r = RP.$(".r", plate); n.style.color = "#fff"; r.style.color = K.goldLight;
    n.style.textShadow = r.style.textShadow = `0 ${u * 0.3}px ${u * 1.2}px rgba(0,0,0,.6)`;
    bar = RP.$(".ln", plate);
  }
  const nw = RP.words(n), rw = RP.words(r);
  if (style === "line") tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power3.out", transformOrigin: "100% 50%" }, 0.1);
  else if (style === "gold") tl.fromTo(bar, { scaleY: 0 }, { scaleY: 1, duration: 0.45, ease: "power3.out", transformOrigin: "50% 100%" }, 0.1);
  else tl.fromTo(bar, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2)" }, 0.25);
  if (style !== "line") tl.fromTo(plate, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0 0 0%)", duration: 0.55, ease: "power3.inOut" }, 0.2);
  tl.fromTo(nw, { yPercent: 115 }, { yPercent: 0, duration: 0.6, ease: "power4.out", stagger: 0.06 }, 0.45);
  tl.fromTo(rw, { yPercent: 115 }, { yPercent: 0, duration: 0.5, ease: "power4.out", stagger: 0.05 }, 0.65);
  // out
  tl.to(box, { opacity: 0, x: u * 4, duration: 0.45, ease: "power2.in" }, D - 0.6);
});
