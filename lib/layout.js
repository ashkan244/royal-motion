/* ---------- v2: vertical-first layout + beat-locked scene helpers ----------
   RP.safe   : area clear of Instagram UI (reels/stories header, caption, buttons)
   RP.fit    : grow/shrink a single-line element so it fills a target width
   RP.bpm/RP.b(n): beat grid; scenes cut on beats
   RP.scene  : full-frame scene container shown only between two times
   RP.x3d    : extruded (stacked-shadow) type for depth                      */
(function () {
  const RP = window.RP, W = RP.W, H = RP.H;
  const m = RP.portrait ? { t: 0.13 * H, b: 0.22 * H, l: 0.12 * W, r: 0.12 * W }
    : RP.landscape ? { t: 0.07 * H, b: 0.09 * H, l: 0.06 * W, r: 0.06 * W }
    : { t: 0.07 * H, b: 0.09 * H, l: 0.07 * W, r: 0.07 * W };
  RP.safe = { x0: m.l, x1: W - m.r, y0: m.t, y1: H - m.b, w: W - m.l - m.r, h: H - m.t - m.b, cx: W / 2, cy: (m.t + H - m.b) / 2 };
  /* vertical bands inside the safe area: top kicker, hero, bottom CTA (fractions of safe.h) */
  RP.band = function (from, to) { const s = RP.safe; return { y0: s.y0 + s.h * from, y1: s.y0 + s.h * to, cy: s.y0 + s.h * (from + to) / 2, h: s.h * (to - from) }; };

  /* single-line fit: el must be in the DOM, white-space:nowrap */
  RP.fit = function (el, maxW, maxH, maxPx) {
    el.style.display = "inline-block"; el.style.whiteSpace = "nowrap";
    el.style.fontSize = "100px";
    const r = el.getBoundingClientRect();
    let f = maxW / Math.max(1, r.width);
    if (maxH) f = Math.min(f, maxH / Math.max(1, r.height));
    const px = Math.min(100 * f, maxPx || 9999);
    el.style.fontSize = px + "px";
    return px;
  };

  RP.bpm = (RP.params && RP.params.bpm) || 128;
  RP.beat = 60 / RP.bpm;
  RP.b = (n) => +(n * RP.beat).toFixed(4);

  /* a scene layer visible on [t0, t1) — hard cut by default */
  RP.scene = function (tl, t0, t1, parent) {
    const s = RP.el("div", { class: "scn" }, parent || RP.$("#scene"));
    gsap.set(s, { autoAlpha: t0 <= 0 ? 1 : 0 });
    if (t0 > 0) tl.set(s, { autoAlpha: 1 }, t0);
    if (t1 != null && t1 < RP.duration) tl.set(s, { autoAlpha: 0 }, t1);
    return s;
  };

  /* extruded type: n stacked offsets in `deep`, plus a soft ground shadow */
  RP.x3d = function (el, deep, n, dx, dy) {
    n = n || 10; dx = dx == null ? 0.55 : dx; dy = dy == null ? 0.8 : dy;
    const sh = [];
    for (let i = 1; i <= n; i++) sh.push(`${(i * dx).toFixed(1)}px ${(i * dy).toFixed(1)}px 0 ${deep}`);
    sh.push(`${(n * dx + 6).toFixed(1)}px ${(n * dy + 14).toFixed(1)}px 28px rgba(0,0,0,.55)`);
    el.style.textShadow = sh.join(",");
    return el;
  };

  /* beat punch: quick scale kick that settles (camera-like) */
  RP.punch = function (tl, el, t, amt, d) {
    tl.fromTo(el, { scale: 1 + (amt || 0.06) }, { scale: 1, duration: d || 0.32, ease: "power3.out", immediateRender: false }, t);
  };

  /* full-frame diagonal shutter wipe that covers a cut at time t */
  RP.shutter = function (tl, t, color, parent) {
    const p = RP.el("div", { class: "shutter" }, parent || RP.$("#scene"));
    p.style.background = color || "var(--y)";
    gsap.set(p, { xPercent: 110, skewX: -14, autoAlpha: 0 });
    tl.set(p, { autoAlpha: 1 }, t - 0.2);
    tl.fromTo(p, { xPercent: 110 }, { xPercent: 0, duration: 0.2, ease: "power3.in", immediateRender: false }, t - 0.2);
    tl.to(p, { xPercent: -115, duration: 0.24, ease: "power3.out" }, t);
    tl.set(p, { autoAlpha: 0 }, t + 0.25);
    return p;
  };

  /* caution tape strip with repeating text; returns {el, inner} (animate inner x for scrolling) */
  RP.tape = function (parent, text, o) {
    o = o || {};
    const t = RP.el("div", { class: "rtape" + (o.dark ? " dark" : "") }, parent);
    const inner = RP.el("div", { class: "rtape-in" }, t);
    const unit = `<span>${text}</span>`;
    inner.innerHTML = unit.repeat(o.repeat || 14);
    if (o.h) t.style.height = o.h + "px";
    return { el: t, inner };
  };
})();
