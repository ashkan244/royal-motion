/* Royal stories v3 core: helpers shared by every v3 story.
   A story is S3.def(id, (c) => { ... }) and uses the c.* toolkit below. Boot (boot.js) calls it. */
window.S3 = { reg: {}, def(id, fn) { this.reg[id] = fn; } };
S3.make = function (tl, RP) {
  const S = RP.params, W = RP.W, H = RP.H, D = RP.duration, K = RP.K, T = RP.T;
  const sc = RP.$("#scene");
  const Y = "#FFD21F", BK = "#0A0A0A", RED = "#E8262B", GOLD = "#C9A45C", NAVY = "#1B2250", IV = "#F6F0E3";
  const r = RP.rng((S.id || "x").split("").reduce((a, ch) => a * 31 + ch.charCodeAt(0), 7) >>> 0);
  const fixTa = (h) => (typeof h === "string" && h.indexOf("<") < 0 ? h.replace(/(^|\s)تا(?=\s|$)/g, '$1<span class="ta">تا</span>') : h);
  const c = { tl, RP, S, W, H, D, K, T, sc, r, Y, BK, RED, GOLD, NAVY, IV, b: 60 / 128 };

  /* ---------- DOM ---------- */
  c.el = (tag, cls, parent, html, style) => { const e = RP.el(tag, cls ? { class: cls } : {}, parent || sc, fixTa(html)); if (style) Object.assign(e.style, style); return e; };
  c.layer = (style, parent) => c.el("div", "s3-l", parent, null, style || {});
  c.img = (src, parent, style) => { const i = c.el("img", null, parent, null, Object.assign({ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }, style || {})); i.src = c.src(src); return i; };
  c.src = (n) => `../assets/img/${n.includes("/") ? n : "photos/" + n}.${n.endsWith(".png") ? "" : "jpg"}`.replace(/\.$/, "");
  c.fit = (e, maxW, maxH, maxPx) => RP.fit(e, maxW, maxH, maxPx);
  /* show a layer only during [t0, t1) */
  c.win = (e, t0, t1) => { gsap.set(e, { autoAlpha: t0 <= 0 ? 1 : 0 }); if (t0 > 0) tl.set(e, { autoAlpha: 1 }, t0); if (t1 != null && t1 < D) tl.set(e, { autoAlpha: 0 }, t1); return e; };
  c.scene = (t0, t1, style) => c.win(c.layer(style), t0, t1);

  /* Persian title: words (never letters), [[keyword]] in accent, lines split by | ; returns {box, words, keys, lines} */
  c.title = function (parent, text, o) {
    o = o || {};
    const box = c.el("div", null, parent, null, { display: "flex", flexDirection: "column", alignItems: o.align || "center", gap: (o.gap || 4) + "px" });
    const words = [], keys = [], lines = [];
    String(text).split("|").forEach((ln) => {
      const d = c.el("div", "s3-t", box, null, { color: o.color || "#fff" });
      let key = false;
      ln.split(" ").filter(Boolean).forEach((w, i, arr) => {
        const k = key || w.includes("[["); if (w.includes("[[")) key = true; if (w.includes("]]")) key = false;
        w = w.replace(/\[\[|\]\]/g, "");
        const o1 = c.el("span", "w", d), wi = c.el("span", "wi" + (w === "تا" ? " ta" : ""), o1, w);
        if (/^[+×\-]/.test(w)) { wi.style.direction = "ltr"; wi.style.unicodeBidi = "isolate"; }
        if (k) { wi.style.color = o.key || Y; keys.push(wi); }
        words.push(wi);
        if (i < arr.length - 1) d.appendChild(document.createTextNode(" "));
      });
      lines.push(d);
    });
    let px = o.px || 160;
    lines.forEach((d) => (px = Math.min(px, c.fit(d, o.maxW || 880, null, o.px || 160))));
    lines.forEach((d) => (d.style.fontSize = px + "px"));
    return { box, words, keys, lines, px };
  };
  c.rise = (words, t, st) => tl.fromTo(words, { yPercent: 120 }, { yPercent: 0, duration: 0.55, ease: "power4.out", stagger: st || 0.07 }, t);
  c.slam = (e, t, from) => tl.fromTo(e, Object.assign({ scale: 2, opacity: 0 }, from || {}), { scale: 1, opacity: 1, rotation: 0, duration: 0.22, ease: "power4.in" }, t);
  c.pop = (e, t, d) => tl.fromTo(e, { scale: 0.3, opacity: 0 }, { scale: 1, opacity: 1, duration: d || 0.4, ease: "back.out(2.2)" }, t);
  c.fadeUp = (e, t, d) => tl.fromTo(e, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: d || 0.5 }, t);
  c.strip = (parent, text, o) => { o = o || {}; const s = c.el("div", "s3-strip", parent, text, { background: o.bg || Y, color: o.color || BK, fontSize: (o.px || 100) + "px", transform: `rotate(${o.rot || 0}deg)` }); c.fit(s, o.maxW || 880, null, o.px || 100); return s; };
  c.col = (top, bot, style) => c.el("div", "s3-col", sc, null, Object.assign({ top: top + "px", height: bot - top + "px" }, style || {}));
  c.shake = (t, a, target) => tl.fromTo(target || sc, { x: 0, y: 0 }, { keyframes: { x: [a, -a * 0.8, a * 0.5, -a * 0.2, 0], y: [-a * 0.6, a * 0.5, -a * 0.3, 0, 0] }, duration: 0.28, ease: "none", immediateRender: false }, t);
  c.flash = (t, col, peak) => { const f = c.layer({ background: col || "#fff", zIndex: 90, opacity: 0 }); tl.fromTo(f, { opacity: 0 }, { keyframes: { opacity: [0, peak || 0.9, 0] }, duration: 0.32, ease: "none" }, t); return f; };
  c.push = (e, t, amt) => tl.fromTo(e, { scale: 1 }, { scale: 1 + (amt || 0.04), duration: Math.max(0.5, D - t), ease: "none", immediateRender: false }, t);
  c.grain = (op) => { const g = RP.grain(sc, 13, op == null ? 0.06 : op); g.style.zIndex = 75; RP.grainSteps(tl, g, D); return g; };
  c.dust = (n, col) => { for (let i = 0; i < n; i++) { const s = 5 + r() * 9; const p = c.el("i", null, sc, null, { position: "absolute", width: s + "px", height: s + "px", borderRadius: "50%", zIndex: 25, left: r() * W + "px", top: 300 + r() * 1250 + "px", background: `radial-gradient(circle, #fff 0%, ${col || "#FFE58A"} 40%, rgba(255,210,31,0) 70%)` });
    tl.fromTo(p, { opacity: 0, y: 0 }, { opacity: 0.3 + r() * 0.7, y: -(40 + r() * 140), duration: D, ease: "none" }, 0); } };
  /* hard cut covered by a quick colour wipe */
  c.wipe = (t, col, dir) => { const p = c.layer({ background: col || Y, zIndex: 85 }); gsap.set(p, { autoAlpha: 0 }); tl.set(p, { autoAlpha: 1 }, t - 0.16);
    tl.fromTo(p, { xPercent: (dir || 1) * 105 }, { xPercent: 0, duration: 0.16, ease: "power3.in", immediateRender: false }, t - 0.16); tl.to(p, { xPercent: -(dir || 1) * 105, duration: 0.2, ease: "power3.out" }, t); tl.set(p, { autoAlpha: 0 }, t + 0.21); };

  /* ---------- frame (top tag + date pill + CTA) ---------- */
  c.frame = function (o) {
    o = o || {};
    const dark = o.dark !== false;
    const top = c.el("div", "s3-top");
    c.el("div", "s3-tag", top, S.tagEn || "ROYAL WEEK", { color: dark ? Y : BK });
    c.el("div", "s3-pill", top, S.pill || T.rwStart, { background: dark ? Y : BK, color: dark ? BK : Y });
    tl.fromTo(top, { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.45 }, o.t0 || 0.05);
    if (S.sticker || o.noFoot) return;
    const foot = c.el("div", "s3-foot");
    const lines = S.foot || ["مرکز خرید رویال پارس", "royalweek.ir"];
    const fs = lines.map((l, i) => c.el("div", /[a-z@]/i.test(l) ? "lat" : "fa", foot, l, { color: i === 0 ? (dark ? "#fff" : BK) : (dark ? Y : BK) }));
    tl.fromTo(fs, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 }, o.footT != null ? o.footT : Math.min(1.4, D - 2.2));
  };

  /* ---------- procedural canvas: draw(g, t, w, h) is called for every rendered frame ---------- */
  c.proc = function (draw, o) {
    o = o || {};
    const w = o.w || 270, h = o.h || 480;
    const cv = c.el("canvas", "s3-c" + (o.smooth ? "" : " s3-px"), o.parent || sc, null, Object.assign({ zIndex: o.z || 5 }, o.style || {}));
    cv.width = w; cv.height = h;
    const g = cv.getContext("2d"); g.imageSmoothingEnabled = !!o.smooth;
    const st = { t: 0 };
    const paint = () => { g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, w, h); draw(g, st.t, w, h); };
    paint();
    tl.fromTo(st, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: paint, immediateRender: true }, 0);
    return cv;
  };

  /* ---------- pixel toolkit ---------- */
  const PAL = { k: BK, y: Y, w: "#FFFFFF", r: RED, g: GOLD, n: NAVY, s: "#5A5A5A", l: "#FFF1A6", d: "#232323", o: "#FF9F1C", b: "#3A7BD5", e: "#2E2E2E", c: "#7FD6FF", p: "#B86BFF", G: "#7BC86C", m: "#9C6B3B" };
  c.PAL = PAL;
  /* sprite: array of strings, '.' = transparent, chars index PAL */
  c.spr = function (g, map, x, y, s, flip) {
    s = s || 1;
    for (let j = 0; j < map.length; j++) for (let i = 0; i < map[j].length; i++) {
      const ch = map[j][flip ? map[j].length - 1 - i : i]; if (ch === "." || ch === " ") continue;
      g.fillStyle = PAL[ch] || ch; g.fillRect(Math.round(x + i * s), Math.round(y + j * s), s, s);
    }
  };
  /* crisp pixel text (works for Persian: shaped by the browser, then thresholded so edges stay hard) */
  const tcache = {};
  c.ptext = function (g, str, x, y, o) {
    o = o || {};
    const size = o.size || 16, col = o.color || "#fff", font = o.font || (/[A-Za-z0-9]/.test(str) && !/[؀-ۿ]/.test(str) ? "Horizon" : "Fanavari");
    const key = [str, size, col, font, o.weight || 700].join("|");
    let cv = tcache[key];
    if (!cv) {
      const m = document.createElement("canvas").getContext("2d");
      m.font = `${o.weight || 700} ${size}px "${font}", "Vazirmatn"`;
      const tw = Math.ceil(m.measureText(str).width) + 4, th = Math.ceil(size * 1.6);
      cv = document.createElement("canvas"); cv.width = tw; cv.height = th;
      const q = cv.getContext("2d"); q.font = m.font; q.textBaseline = "middle"; q.direction = /[؀-ۿ]/.test(str) ? "rtl" : "ltr";
      q.textAlign = q.direction === "rtl" ? "right" : "left"; q.fillStyle = col; q.fillText(str, q.direction === "rtl" ? tw - 2 : 2, th / 2);
      const id = q.getImageData(0, 0, tw, th), d = id.data;
      const hx = col.length === 4 ? "#" + col[1] + col[1] + col[2] + col[2] + col[3] + col[3] : col, rgb = hx.match(/\w\w/g).map((v) => parseInt(v, 16));
      for (let i = 0; i < d.length; i += 4) { const on = d[i + 3] > 105; d[i] = rgb[0]; d[i + 1] = rgb[1]; d[i + 2] = rgb[2]; d[i + 3] = on ? 255 : 0; }
      q.putImageData(id, 0, 0); tcache[key] = cv;
    }
    const ax = o.align === "left" ? 0 : o.align === "right" ? cv.width : cv.width / 2;
    if (o.shadow) { g.globalAlpha = 1; g.drawImage(tintCache(cv, o.shadow), Math.round(x - ax + 1), Math.round(y - cv.height / 2 + 1)); }
    g.drawImage(cv, Math.round(x - ax), Math.round(y - cv.height / 2));
    return cv.width;
  };
  const tints = new Map();
  function tintCache(cv, col) { const k = cv; if (tints.has(k)) return tints.get(k); const t = document.createElement("canvas"); t.width = cv.width; t.height = cv.height; const q = t.getContext("2d"); q.drawImage(cv, 0, 0); q.globalCompositeOperation = "source-in"; q.fillStyle = col; q.fillRect(0, 0, t.width, t.height); tints.set(k, t); return t; }
  c.box = (g, x, y, w, h, fill, border) => { if (border) { g.fillStyle = border; g.fillRect(x - 1, y - 1, w + 2, h + 2); } g.fillStyle = fill; g.fillRect(x, y, w, h); };
  /* image -> low-res ordered (Bayer 4x4) dither in two colours; returns a canvas */
  const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
  c.dither = function (imgEl, w, h, dark, light, amount) {
    const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const q = cv.getContext("2d");
    const ir = imgEl.naturalWidth / imgEl.naturalHeight, cr = w / h; let sx = 0, sy = 0, sw = imgEl.naturalWidth, sh = imgEl.naturalHeight;
    if (ir > cr) { sw = sh * cr; sx = (imgEl.naturalWidth - sw) / 2; } else { sh = sw / cr; sy = (imgEl.naturalHeight - sh) / 2; }
    q.drawImage(imgEl, sx, sy, sw, sh, 0, 0, w, h);
    const id = q.getImageData(0, 0, w, h), d = id.data, A = (dark || BK).match(/\w\w/g).map((v) => parseInt(v, 16)), B = (light || Y).match(/\w\w/g).map((v) => parseInt(v, 16));
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4, lum = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      const th = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16, on = lum * (amount || 1.05) > th, C = on ? B : A;
      d[i] = C[0]; d[i + 1] = C[1]; d[i + 2] = C[2]; d[i + 3] = 255;
    }
    q.putImageData(id, 0, 0); return cv;
  };
  /* images used by canvases must be loaded before the timeline is built */
  c.loadImgs = (list) => Promise.all(list.map((n) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(i); i.src = c.src(n); })));
  c.crt = (z) => { const e = c.layer({ zIndex: z || 70 }); e.className = "s3-crt"; return e; };

  /* ---------- tiny WebGL runner: fragment shader with u_t (s), u_res, optional u_tex ---------- */
  c.gl = function (frag, o) {
    o = o || {};
    const w = o.w || 360, h = o.h || 640;
    const cv = c.el("canvas", "s3-c", o.parent || sc, null, Object.assign({ zIndex: o.z || 2 }, o.style || {}));
    cv.width = w; cv.height = h;
    const gl = cv.getContext("webgl", { preserveDrawingBuffer: true, antialias: false });
    if (!gl) { cv.style.background = o.fallback || "radial-gradient(circle at 50% 40%, #6b4d12, #0a0805)"; return cv; }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s)); return s; };
    const p = gl.createProgram();
    gl.attachShader(p, sh(gl.VERTEX_SHADER, "attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}"));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, "precision mediump float;varying vec2 v;uniform float u_t;uniform vec2 u_res;uniform sampler2D u_tex;uniform sampler2D u_tex2;uniform float u_k;\n" + frag));
    gl.linkProgram(p); gl.useProgram(p);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(p, "a"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = (img, unit, name) => { if (!img) return; const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T].forEach((k) => gl.texParameteri(gl.TEXTURE_2D, k, gl.CLAMP_TO_EDGE)); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.uniform1i(gl.getUniformLocation(p, name), unit); };
    tex(o.tex, 0, "u_tex"); tex(o.tex2, 1, "u_tex2");
    const ut = gl.getUniformLocation(p, "u_t"), ur = gl.getUniformLocation(p, "u_res"), uk = gl.getUniformLocation(p, "u_k");
    const st = { t: 0 };
    const paint = () => { gl.viewport(0, 0, w, h); gl.uniform1f(ut, st.t); gl.uniform2f(ur, w, h); gl.uniform1f(uk, o.k ? o.k(st.t) : 0); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
    paint();
    tl.fromTo(st, { t: 0 }, { t: D, duration: D, ease: "none", onUpdate: paint, immediateRender: true }, 0);
    return cv;
  };
  /* image cover-crop into a canvas of w x h (for GL textures) */
  c.coverCanvas = (img, w, h) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const q = cv.getContext("2d");
    const ir = img.naturalWidth / img.naturalHeight, cr = w / h; let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
    if (ir > cr) { sw = sh * cr; sx = (img.naturalWidth - sw) / 2; } else { sh = sw / cr; sy = (img.naturalHeight - sh) / 2; }
    q.drawImage(img, sx, sy, sw, sh, 0, 0, w, h); return cv; };
  return c;
};
