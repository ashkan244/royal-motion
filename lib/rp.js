/* Royal Pars motion runtime — shared helpers for every model.
   Contract with HyperFrames: one paused GSAP timeline, registered under the
   composition id, finite length == data-duration, no wall clock, seeded random. */
(function () {
  "use strict";
  const C = JSON.parse(document.getElementById("rp-config").textContent);
  const RP = (window.RP = Object.assign({}, C));
  const W = C.W, H = C.H;
  RP.u = Math.min(W, H) / 100;              // 1u = 1% of the short side
  RP.L = Math.max(W, H) / 100;              // 1L = 1% of the long side
  RP.portrait = H > W * 1.1;
  RP.landscape = W > H * 1.1;
  RP.square = !RP.portrait && !RP.landscape;
  RP.cx = W / 2; RP.cy = H / 2;
  RP.NS = "http://www.w3.org/2000/svg";
  RP.T = C.texts; RP.K = C.colors;

  RP.$ = (s, r) => (r || document).querySelector(s);
  RP.$$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  RP.rng = function (seed) {
    let a = (seed || 1) >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  RP.faNum = (s) => String(s).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);

  RP.el = function (tag, attrs, parent, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "style" && typeof attrs[k] === "object") Object.assign(e.style, attrs[k]);
      else if (k === "class") e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    if (html != null) e.innerHTML = html;
    if (parent) parent.appendChild(e);
    return e;
  };
  RP.svgEl = function (tag, attrs, parent) {
    const e = document.createElementNS(RP.NS, tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };

  /* Split a Persian line into masked words (never letters). Returns inner spans. */
  RP.words = function (el) {
    const txt = el.textContent.trim();
    el.textContent = "";
    const parts = txt.split(/ +/);
    const out = [];
    parts.forEach(function (w, i) {
      const o = document.createElement("span"); o.className = "w";
      const n = document.createElement("span"); n.className = "wi"; n.textContent = w;
      o.appendChild(n); el.appendChild(o); out.push(n);
      if (i < parts.length - 1) el.appendChild(document.createTextNode(" "));
    });
    return out;
  };
  /* Latin only: split into letters. */
  RP.letters = function (el) {
    const txt = el.textContent; el.textContent = "";
    return Array.from(txt).map(function (c) {
      const s = document.createElement("span"); s.className = "ch";
      s.textContent = c === " " ? " " : c; el.appendChild(s); return s;
    });
  };

  /* Hexagon helpers (pointy top, like the logo) */
  RP.hexPts = function (cx, cy, r, rot) {
    const pts = [];
    for (let k = 0; k < 6; k++) {
      const a = ((-90 + 60 * k + (rot || 0)) * Math.PI) / 180;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return pts;
  };
  RP.hexPath = (cx, cy, r, rot) => "M" + RP.hexPts(cx, cy, r, rot).map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L") + "Z";
  /* tall hexagon like the logo badge (w x h), centred on cx,cy */
  RP.badgePath = function (cx, cy, w, h) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, s = w * 0.41;
    return `M${cx} ${y0}L${x1} ${y0 + s}L${x1} ${y1 - s}L${cx} ${y1}L${x0} ${y1 - s}L${x0} ${y0 + s}Z`;
  };
  RP.honeycomb = function (w, h, r) {
    const dx = Math.sqrt(3) * r, dy = 1.5 * r; let d = "";
    for (let row = -1, y = 0; y < h + r * 2; row++, y = row * dy)
      for (let x = (row % 2 ? dx / 2 : 0) - dx; x < w + dx; x += dx) d += RP.hexPath(x, y, r);
    return d;
  };

  /* The Royal Pars badge. viewBox matches the official logo proportions. */
  RP.LOGO = {
    outer: "M37.44 1.04L73.92 30.97L73.92 93.95L37.44 123.88L0.96 93.95L0.96 30.97Z",
    inner: "M37.44 5.10L70.18 32.53L70.18 92.39L37.44 119.83L4.70 92.39L4.70 32.53Z",
    mono: [
      "M25.90 39.39L25.90 94.26M29.33 39.39L29.33 94.26M22.47 39.39L34.95 39.39M25.90 67.76L34.95 67.76M21.85 94.57L38.06 94.57",
      "M34.95 31.28L34.95 94.26M31.20 31.28L38.69 31.28",
      "M34.95 31.28L43.05 31.28C49.29 31.28 52.40 34.40 52.40 40.64L52.40 59.03C52.40 65.27 49.29 68.38 43.05 68.38L34.95 68.38",
      "M38.37 35.03L42.74 35.03C46.69 35.03 48.66 37.00 48.66 40.95L48.66 58.72C48.66 62.67 46.69 64.64 42.74 64.64L38.37 64.64L38.37 35.03",
      "M39.93 68.38L44.61 94.26M41.18 94.57L49.91 94.57",
    ],
    vb: "0 0 74.9 124.9", w: 74.9, h: 124.9,
  };
  /* returns an <svg> element; parts carry classes lg-outer, lg-inner, lg-mono, lg-m */
  RP.logo = function (o) {
    o = o || {};
    const svg = RP.svgEl("svg", { viewBox: RP.LOGO.vb, class: "rp-logo" + (o.cls ? " " + o.cls : "") });
    if (o.height) { svg.style.height = o.height + "px"; svg.style.width = (o.height * RP.LOGO.w / RP.LOGO.h) + "px"; }
    RP.svgEl("path", { d: RP.LOGO.outer, class: "lg-outer", fill: o.outerFill || "none", stroke: o.outerStroke || C.colors.gold, "stroke-width": o.outerWidth || 1.1, "stroke-linejoin": "round" }, svg);
    RP.svgEl("path", { d: RP.LOGO.inner, class: "lg-inner", fill: o.innerFill || C.colors.navy, stroke: o.innerStroke || "none", "stroke-width": o.innerWidth || 0.6 }, svg);
    const g = RP.svgEl("g", { class: "lg-mono", fill: "none", stroke: o.mono || C.colors.gold, "stroke-width": o.monoWidth || 1.5, "stroke-linecap": "round", "stroke-linejoin": "round" }, svg);
    RP.LOGO.mono.forEach((d) => RP.svgEl("path", { d: d, class: "lg-m" }, g));
    if (o.parent) o.parent.appendChild(svg);
    return svg;
  };

  /* prepare stroke drawing: returns lengths; animate strokeDashoffset -> 0 */
  RP.dash = function (els) {
    return (Array.isArray(els) ? els : [els]).map(function (p) {
      const len = p.getTotalLength();
      p.style.strokeDasharray = len + " " + (len + 1);
      p.style.strokeDashoffset = len;
      return len;
    });
  };

  /* seeded film grain as a tiled background (cheap; position is stepped on the timeline) */
  RP.grain = function (parent, seed, opacity) {
    const c = document.createElement("canvas"); c.width = c.height = 192;
    const x = c.getContext("2d"), img = x.createImageData(192, 192), r = RP.rng(seed || 7);
    for (let i = 0; i < img.data.length; i += 4) { const v = (r() * 255) | 0; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
    x.putImageData(img, 0, 0);
    const d = RP.el("div", { class: "grain" }, parent);
    d.style.backgroundImage = "url(" + c.toDataURL() + ")";
    if (opacity != null) d.style.opacity = opacity;
    return d;
  };
  RP.grainSteps = function (tl, g, dur) {
    const r = RP.rng(99);
    for (let t = 0; t < dur; t += 1 / 12) tl.set(g, { x: (r() * 180) | 0, y: (r() * 180) | 0 }, t);
  };

  /* seeded particle field */
  RP.particles = function (parent, n, seed, make) {
    const r = RP.rng(seed || 3), out = [];
    for (let i = 0; i < n; i++) out.push(make(r, i));
    return out;
  };

  /* wait for every face we use, then build and register */
  RP.run = function (build) {
    const faces = ['700 40px "Fanavari"', '400 40px "Fanavari"', '700 40px "Vazirmatn"', '400 40px "Vazirmatn"', '400 40px "Horizon"', '400 40px "HorizonOutline"'];
    const sample = "رویال پارس ۰۱۲۳۴۵۶۷۸۹ ROYAL PARS 0123456789%";
    Promise.all(faces.map((f) => document.fonts.load(f, sample).catch(() => null))).then(function () {
      const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
      build(tl, RP);
      tl.set({}, {}, C.duration);              // pad to exact length
      window.__timelines = window.__timelines || {};
      window.__timelines[C.id] = tl;
      const m = /[?&]t=([\d.]+)/.exec(location.search);   // local still preview
      if (m) { tl.seek(Math.min(parseFloat(m[1]), C.duration - 0.001), false); document.documentElement.setAttribute("data-rp-ready", "1"); }
    });
  };
})();

/* ---------- Royal Week shared end card ---------- */
(function () {
  const RP = window.RP;
  const IG = (c) => `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1.1" fill="${c}" stroke="none"/></svg>`;
  /* build the card; opts: {theme:'dark'|'yellow', slogan, links:bool, date:bool, parent} */
  RP.rwCard = function (o) {
    o = o || {};
    const T = RP.T, K = RP.K, dark = (o.theme || "dark") === "dark";
    const fg = dark ? K.rwYellow : K.rwBlack;
    const c = RP.el("div", { class: "rwc " + (dark ? "dark" : "yellow") }, o.parent || RP.$("#scene"));
    const badge = RP.el("div", { class: "rwc-badge" }, c);
    const logo = RP.logo({ parent: badge, outerStroke: fg, outerWidth: 1.4, innerFill: dark ? K.rwBlack : K.rwYellow, innerStroke: fg, innerWidth: .6, mono: fg, monoWidth: 1.8 });
    RP.el("span", {}, badge, T.enShort);
    const title = RP.el("div", { class: "rwc-title" }, c, T.rwName);
    const en = RP.el("div", { class: "rwc-en" }, c, T.rwEn);
    const slogan = RP.el("div", { class: "rwc-slogan" }, c, o.slogan || T.rwS1);
    const date = o.date === false ? null : RP.el("div", { class: "rwc-date" }, c, o.dateText || (T.rwStart + " · " + T.faName));
    let links = null, chips = [];
    if (o.links) {
      links = RP.el("div", { class: "rwc-links" }, c);
      chips.push(RP.el("div", { class: "rwc-chip site" }, links, T.rwSite));
      chips.push(RP.el("div", { class: "rwc-chip ig" }, links, IG(dark ? K.rwYellow : K.rwBlack) + "<span>" + T.ig + "</span>"));
    }
    const titleWords = RP.words(title), sloganWords = RP.words(slogan);
    gsap.set(c, { yPercent: -50, autoAlpha: 0 });
    if (o.offsetY) gsap.set(c, { y: o.offsetY });
    return { c, badge, logo, title, titleWords, en, slogan, sloganWords, date, links, chips };
  };
  /* animate it in at time t; style: 'slam' | 'rise' */
  RP.rwCardIn = function (tl, r, t, style) {
    const u = RP.u;
    tl.set(r.c, { autoAlpha: 1 }, t);
    tl.fromTo(r.badge, { opacity: 0, y: -u * 3 }, { opacity: 1, y: 0, duration: .5 }, t);
    if (style === "rise") tl.fromTo(r.titleWords, { yPercent: 120 }, { yPercent: 0, duration: .7, ease: "power4.out", stagger: .1 }, t + .05);
    else tl.fromTo(r.title, { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: .45, ease: "expo.out" }, t + .05);
    tl.fromTo(r.en, { opacity: 0, letterSpacing: "1.2em" }, { opacity: 1, letterSpacing: "0.5em", duration: .8 }, t + .3);
    tl.fromTo(r.slogan, { scaleX: 0 }, { scaleX: 1, duration: .45, ease: "power3.inOut", transformOrigin: "100% 50%" }, t + .45);
    tl.fromTo(r.sloganWords, { yPercent: 120 }, { yPercent: 0, duration: .55, ease: "power4.out", stagger: .07 }, t + .7);
    if (r.date) tl.fromTo(r.date, { opacity: 0, y: u * 2 }, { opacity: 1, y: 0, duration: .5 }, t + .95);
    if (r.chips.length) tl.fromTo(r.chips, { opacity: 0, scale: .7 }, { opacity: 1, scale: 1, duration: .5, ease: "back.out(2)", stagger: .12 }, t + 1.2);
    return t + 1.6;
  };
  /* gentle pulse to keep the hold alive */
  RP.hold = function (tl, el, t, d, amt) {
    tl.fromTo(el, { scale: 1 }, { scale: 1 + (amt || 0.025), duration: d, ease: "sine.inOut" }, t);
  };
})();
