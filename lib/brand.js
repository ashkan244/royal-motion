/* ---------- Brand lockup: logo + names (+ CTA for outros) ---------- */
(function () {
  const RP = window.RP;
  const PIN = (c) => `<svg viewBox="0 0 20 26" fill="none" stroke="${c}" stroke-width="1.8"><path d="M10 25s8-8.6 8-14.5A8 8 0 0 0 2 10.5C2 16.4 10 25 10 25z"/><circle cx="10" cy="10.5" r="3"/></svg>`;
  const IGI = (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1" fill="${c}" stroke="none"/></svg>`;
  RP.ICON_PIN = PIN; RP.ICON_IG = IGI;

  /* opts: {theme:'navy'|'ivory', parent, cta:bool, logoOpts:{}} — cta defaults to (mode === 'outro') */
  RP.brandLockup = function (o) {
    o = o || {};
    const K = RP.K, T = RP.T, th = o.theme || "navy", dark = th === "navy";
    const par = o.parent || RP.$("#scene");
    const c = RP.el("div", { class: "bl " + th }, par);
    const lw = RP.el("div", {}, c);
    const logo = RP.logo(Object.assign({ parent: lw, cls: "bl-logo",
      outerStroke: dark ? K.gold : K.navy, outerWidth: 1.0, innerFill: dark ? "#212a66" : K.navy,
      innerStroke: K.gold, innerWidth: 0.45, mono: K.gold, monoWidth: 1.55 }, o.logoOpts || {}));
    const fa = RP.el("div", { class: "bl-fa" }, c, T.faName);
    const rule = RP.el("div", { class: "bl-rule" }, c, "<i></i><b></b><i></i>");
    const en = RP.el("div", { class: "bl-en" }, c, T.enName);
    const r = { c, logo, outer: logo.querySelector(".lg-outer"), inner: logo.querySelector(".lg-inner"), monos: RP.$$(".lg-m", logo),
      fa, faWords: RP.words(fa), rule, ruleI: RP.$$("i", rule), dia: RP.$("b", rule), en, dark };
    gsap.set(c, { yPercent: -50 });
    const wantCta = o.cta == null ? RP.mode === "outro" : o.cta;
    if (wantCta) {
      const col = dark ? K.gold : K.goldDeep;
      const box = RP.el("div", { class: "blc " + th }, par);
      const f = RP.el("div", { class: "f" }, box, T.igCta);
      const pill = RP.el("div", { class: "pill" }, box, IGI(col) + `<span>${T.ig}</span>`);
      const ad = RP.el("div", { class: "ad" }, box, PIN(col) + `<span>${T.address}</span>`);
      gsap.set(box, { autoAlpha: 0 });
      r.cta = { box, f, fWords: RP.words(f), pill, ad };
    }
    return r;
  };

  /* animate the lockup in. logo: 'draw' | 'pop' | 'fade' | 'none'. Returns the time the lockup settles. */
  RP.brandIn = function (tl, r, t, logo, k) {
    k = k || 1;
    const u = RP.u;
    if (logo === "draw") {
      const L = RP.dash([r.outer, r.inner, ...r.monos]);
      r.inner.style.fillOpacity = 0;
      tl.fromTo(r.outer, { strokeDashoffset: L[0] }, { strokeDashoffset: 0, duration: 1.1 * k, ease: "power2.inOut" }, t);
      tl.fromTo(r.inner, { strokeDashoffset: L[1] }, { strokeDashoffset: 0, duration: 0.9 * k, ease: "power2.inOut" }, t + 0.25 * k);
      r.monos.forEach((p, i) => tl.fromTo(p, { strokeDashoffset: L[i + 2] }, { strokeDashoffset: 0, duration: 0.7 * k, ease: "power2.inOut" }, t + (0.6 + i * 0.13) * k));
      tl.fromTo(r.inner, { fillOpacity: 0 }, { fillOpacity: 1, duration: 0.5 * k }, t + 1.3 * k);
      t += 1.75 * k;
    } else if (logo === "pop") {
      tl.fromTo(r.logo, { scale: 0.4, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.8)" }, t);
      t += 0.45;
    } else if (logo === "fade") {
      tl.fromTo(r.logo, { opacity: 0, scale: 1.08, filter: `blur(${u * 1.2}px)`, transformOrigin: "50% 50%" }, { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.9, ease: "power2.out" }, t);
      t += 0.6;
    }
    tl.fromTo(r.faWords, { yPercent: 115 }, { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.08 }, t);
    tl.fromTo(r.ruleI, { scaleX: 0 }, { scaleX: 1, duration: 0.8, transformOrigin: (i) => (i ? "0% 50%" : "100% 50%") }, t + 0.3);
    tl.fromTo(r.dia, { scale: 0, rotation: -135 }, { scale: 1, rotation: 45, duration: 0.6, ease: "back.out(2)" }, t + 0.25);
    tl.fromTo(r.en, { opacity: 0, scaleX: 1.4 }, { opacity: 1, scaleX: 1, duration: 1.0 }, t + 0.4);
    return t + 1.2;
  };

  /* outro: lift the lockup and reveal follow / IG / address */
  RP.brandCtaIn = function (tl, r, t) {
    const u = RP.u, H = RP.H, bh = r.c.offsetHeight, ch = r.cta.box.offsetHeight, s = 0.74, gap = u * 6;
    const top = (H - (bh * s + gap + ch)) / 2;
    gsap.set(r.cta.box, { top: top + bh * s + gap });
    tl.to(r.c, { y: top - (H / 2 - bh / 2), scale: s, duration: 0.9, ease: "power3.inOut" }, t);
    tl.set(r.cta.box, { autoAlpha: 1 }, t + 0.5);
    tl.fromTo(r.cta.fWords, { yPercent: 115 }, { yPercent: 0, duration: 0.7, ease: "power4.out", stagger: 0.08 }, t + 0.55);
    tl.fromTo(r.cta.pill, { opacity: 0, scale: 0.85, y: u * 2 }, { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: "back.out(1.7)" }, t + 0.85);
    tl.fromTo(r.cta.ad, { opacity: 0, y: u * 2 }, { opacity: 1, y: 0, duration: 0.7 }, t + 1.2);
    return t + 1.9;
  };

  /* standard ending: outro lifts + CTA + fade; intro gently breathes */
  RP.brandEnd = function (tl, r, tLock) {
    const D = RP.duration;
    if (RP.mode === "outro" && r.cta) {
      RP.brandCtaIn(tl, r, Math.min(Math.max(tLock, 2.2), D - 4.2));
      tl.to("#scene", { opacity: 0, duration: 0.55, ease: "power1.in" }, D - 0.55);
    } else {
      tl.fromTo(r.c, { scale: 1 }, { scale: 1.025, duration: Math.max(0.5, D - tLock), ease: "none", immediateRender: false }, tLock);
    }
  };

  /* element box relative to #root (includes current transforms) */
  RP.box = function (el) {
    const rr = RP.$("#root").getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - rr.left, y: b.top - rr.top, w: b.width, h: b.height, cx: b.left - rr.left + b.width / 2, cy: b.top - rr.top + b.height / 2 };
  };
  /* map a point in logo viewBox units to #root pixels */
  RP.logoPt = function (logo, x, y) {
    const b = RP.box(logo);
    return [b.x + (x / RP.LOGO.w) * b.w, b.y + (y / RP.LOGO.h) * b.h];
  };
  RP.HEXCLIP = "polygon(50% 0, 100% 24.2%, 100% 75.8%, 50% 100%, 0 75.8%, 0 24.2%)";

  /* reusable backgrounds */
  RP.navyBg = (p) => RP.el("div", { class: "full", style: { background: "radial-gradient(ellipse at 50% 46%, #26306f 0%, #1B2250 38%, #090C22 100%)" } }, p || RP.$("#scene"));
  RP.ivoryBg = (p) => RP.el("div", { class: "full", style: { background: "radial-gradient(ellipse at 50% 45%, #FFFDF6 0%, #F6F0E3 50%, #E9DDC2 100%)" } }, p || RP.$("#scene"));
  RP.dust = function (tl, parent, n, seed, col) {
    const W = RP.W, H = RP.H, u = RP.u, D = RP.duration, r = RP.rng(seed || 11);
    const box = RP.el("div", { class: "full", style: { pointerEvents: "none", zIndex: 40 } }, parent || RP.$("#scene"));
    for (let i = 0; i < n; i++) {
      const s = u * (0.35 + r() * 0.9);
      const e = RP.el("i", { style: { position: "absolute", borderRadius: "50%", width: s + "px", height: s + "px", left: r() * W + "px", top: (0.15 + r() * 0.8) * H + "px",
        background: `radial-gradient(circle, #fff6d8 0%, ${col || "#ECCF92"} 35%, rgba(201,164,92,0) 70%)` } }, box);
      const rise = u * (6 + r() * 14), drift = u * (r() - 0.5) * 6, dl = r() * 1.5, a = 0.25 + r() * 0.65;
      tl.fromTo(e, { opacity: 0 }, { opacity: a, duration: 0.8 }, 0.3 + dl);
      tl.fromTo(e, { y: 0, x: 0 }, { y: -rise, x: drift, duration: D - 0.3 - dl, ease: "none" }, 0.3 + dl);
    }
    return box;
  };
})();
