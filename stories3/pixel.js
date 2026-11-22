/* «رویال آرکید» — 25 pixel stories. Canvas 270x480 drawn per frame, scaled x4 (crisp pixels).
   Safe area in canvas units: y 62..387. All sprites are original Royal Pars designs. */
(function () {
  const SP = {
    heroA: ["....hhhh....", "...hhhhhh...", "...hffffh...", "...fkffkf...", "...ffffff...", "....ffff....", "...nnnnnn.y.", "..nnnnnnnyyy", "..fnnnnnnyyy", "...nnnnn.yyy", "...nnnnn....", "...kk..kk...", "...kk..kk...", "..kkk..kkk.."],
    heroB: ["....hhhh....", "...hhhhhh...", "...hffffh...", "...fkffkf...", "...ffffff...", "....ffff....", "...nnnnnn.y.", "..nnnnnnnyyy", "..fnnnnnnyyy", "...nnnnn.yyy", "...nnnnn....", "....kkkk....", "....kkkk....", "...kkk.kkk.."],
    coin: ["..yyyy..", ".yllllyy", "yllyylyy", "yllyylyy", "yllyylyy", "yllyylyy", ".yyyyyy.", "..yyyy.."],
    gift: ["...r..r...", "....rr....", "yyyyrryyyy", "yyyyrryyyy", "rrrrrrrrrr", "yyyyrryyyy", "yyyyrryyyy", "yyyyrryyyy", "yyyyrryyyy", "yyyyrryyyy"],
    tag: ["...yyyyyy..", "..yyyyyyyy.", ".yykyyyykyy", "yyyyyyyyyyy", "yyykkkkkyyy", "yyyyyyyyyyy", ".yy.yy.yy..", "y...y...y.."],
    ship: ["......y......", ".....yyy.....", ".....ywy.....", "....yyyyy....", "..y.yyyyy.y..", ".yyyyyyyyyyy.", "yyyyyrrryyyyy", "yy...r.r...yy"],
    star: ["...y...", "...y...", "..yyy..", "yyyyyyy", "..yyy..", ".yy.yy.", "y.....y"],
    heart: [".rr.rr.", "rrrrrrr", "rrrrrrr", ".rrrrr.", "..rrr..", "...r..."],
    bag: ["..kkkk..", ".k....k.", "yyyyyyyy", "yyyyyyyy", "yykyykyy", "yyyyyyyy", "yyyyyyyy", "yyyyyyyy", "gggggggg"],
    shoe: ["........", "..kk....", "..kwk...", "..kwwk..", "..kwwwkk", ".kwwwwwwk", "kkkkkkkkk"],
    phone: [".kkkkk.", "kcccccck", "kcccccck", "kcccccck", "kcccccck", "kcccccck", "kkkwkkk"],
    perf: ["..ss..", "..ss..", ".kkkk.", "kyyyyk", "kyllyk", "kyyyyk", "kyyyyk", ".kkkk."],
    watch: [".kk.", "kyyk", "kwwk", "kyyk", ".kk."],
    npc: ["....hhhh....", "...hhhhhh...", "...hffffh...", "...fkffkf...", "...ffffff...", "...ffrrff...", "....ffff....", "..wwwwwwww..", "..wwrrrrww..", "..fwrrrrwf..", "...wrrrrw...", "...wrrrrw...", "...kk..kk...", "..kkk..kkk.."],
    trophy: ["yyyyyyy", "ylyyyly", ".yyyyy.", "..yyy..", "...y...", "..yyy..", ".kkkkk."],
    crown: ["y..y..y", "yy.y.yy", "yyyyyyy", "ywyrywy", "yyyyyyy"],
  };
  const heroFrame = (t) => (Math.floor(t * 8) % 2 ? SP.heroA : SP.heroB);
  const SKIN = { f: "#F2C29B", h: "#3B2A1E" };
  const setup = (c) => Object.assign(c.PAL, SKIN);
  const lerp = (a, b, k) => a + (b - a) * Math.max(0, Math.min(1, k));
  const ease = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.pow(1 - k, 3));
  const blink = (t, p) => Math.floor(t / (p || 0.5)) % 2 === 0;
  const stars = (c, g, w, h, t, n, seed) => { const r = c.RP.rng(seed || 5); for (let i = 0; i < (n || 60); i++) { const x = (r() * w) | 0, y = (r() * h) | 0, ph = r() * 6; if (Math.sin(t * 3 + ph) > -0.3) { g.fillStyle = i % 7 ? "#888" : "#FFD21F"; g.fillRect(x, y, 1, 1); } } };
  const banner = (c, g, txt, y, o) => { o = o || {}; const w = c.ptext(g, txt, -999, -999, o); const pw = w + 16; c.box(g, 135 - pw / 2, y - (o.size || 16) * 0.9, pw, (o.size || 16) * 1.8, o.bg || "#0A0A0A", o.border || "#FFD21F"); c.ptext(g, txt, 135, y, o); };
  const fa = (s) => (/(^|\s)تا(\s|$)/.test(s) ? "Vazirmatn" : undefined);   // «تا» reads wrong in Fanavari
  const burst = (g, x, y, k, col, n) => { for (let i = 0; i < (n || 12); i++) { const a = (i / (n || 12)) * Math.PI * 2, d = k * 26; g.fillStyle = i % 2 ? col || "#FFD21F" : "#fff"; g.fillRect(Math.round(x + Math.cos(a) * d), Math.round(y + Math.sin(a) * d), 2, 2); } };
  const def = (id, fn) => S3.def(id, (c) => { setup(c); fn(c); });

  /* X01 boot screen */
  def("X01", (c) => {
    const L = ["ROYAL OS v1405.9", "CHECKING FLOORS ....... 7 OK", "LOADING BRANDS ........ 18 OK", "DISCOUNTS ............. READY", "GIFTS ................. READY", "ROYAL FRIDAY .......... ARMED"];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#020302"; g.fillRect(0, 0, w, h);
      if (t < 0.6) { const k = ease(t / 0.6); g.fillStyle = "#fff"; g.fillRect(135 - 135 * k, 239, 270 * k, 2); return; }
      L.forEach((s, i) => { const t0 = 0.7 + i * 0.4; if (t < t0) return; const n = Math.min(s.length, Math.floor((t - t0) * 60)); c.ptext(g, s.slice(0, n) || " ", 18, 84 + i * 14, { size: 9, font: "Courier New", color: i === 5 ? "#FFD21F" : "#9CFF9C", align: "left" }); });
      if (t > 3.2) { const k = Math.min(1, (t - 3.2) / 1.6); c.box(g, 35, 190, 200, 10, "#111", "#9CFF9C"); g.fillStyle = "#FFD21F"; g.fillRect(36, 191, Math.floor(198 * k), 8); c.ptext(g, Math.floor(k * 100) + "%", 135, 212, { size: 9, font: "Courier New", color: "#9CFF9C" }); }
      if (t > 5.1) {
        const k = ease((t - 5.1) / 0.6);
        g.fillStyle = "rgba(2,3,2,.92)"; g.fillRect(0, 70, w, 280);
        const glow = (Math.sin(t * 6) + 1) / 2;
        c.ptext(g, "رویال ویک", 135, 210 - 20 * k, { size: 34, color: "#FFD21F", shadow: glow > 0.5 ? "#7a5d00" : "#3d2e00" });
        if (t > 5.8) c.ptext(g, "سیستم رویالی آماده‌ست", 135, 250, { size: 15, color: "#fff" });
        if (t > 6.3 && blink(t, 0.35)) c.ptext(g, "PRESS START", 135, 290, { size: 10, color: "#9CFF9C" });
      }
    });
    c.crt(); c.frame({ footT: 6.4 });
  });

  /* X02 insert coin */
  def("X02", (c) => {
    c.proc((g, t, w, h) => {
      g.fillStyle = "#06060a"; g.fillRect(0, 0, w, h); stars(c, g, w, h, t, 90, 2);
      c.ptext(g, "ROYAL", 135, 110, { size: 30, color: "#FFD21F", shadow: "#7a5d00" });
      c.ptext(g, "WEEK", 135, 142, { size: 30, color: "#fff", shadow: "#555" });
      if (t < 2.2 && blink(t, 0.4)) c.ptext(g, "INSERT COIN", 135, 200, { size: 12, color: "#E8262B" });
      c.box(g, 120, 236, 30, 22, "#222", "#FFD21F"); g.fillStyle = "#000"; g.fillRect(133, 240, 4, 14);
      if (t > 1.6 && t < 2.3) { const y = lerp(150, 238, (t - 1.6) / 0.6); c.spr(g, SP.coin, 127, y, 2); }
      if (t > 2.3 && t < 2.5) { g.fillStyle = "rgba(255,255,255,.7)"; g.fillRect(0, 0, w, h); }
      if (t > 2.5) { c.ptext(g, "1 PLAYER", 135, 200, { size: 12, color: "#9CFF9C" }); c.ptext(g, "رویال ویک", 135, 290, { size: 26, color: "#FFD21F" }); }
      if (t > 3.1) c.ptext(g, "۳ تا ۹ آذر", 135, 325, { size: 16, color: "#fff", font: "Vazirmatn" });
      if (t > 3.6 && blink(t, 0.3)) c.ptext(g, "PRESS START", 135, 360, { size: 10, color: "#FFD21F" });
    });
    c.crt(); c.frame({ footT: 3.8 });
  });

  /* X03 pixel elevator through 7 floors */
  def("X03", (c) => {
    const F = c.S.floors || [["همکف", "نینجا هوم"], ["۱", "بارگلو"], ["۲", "کالکشن"], ["۳", "زرسان"], ["۴", "گاراژ استور"], ["۵", "بی‌بی‌شاپ"], ["۶", "فودکورت"]];
    const fh = 34, base = 330;
    c.proc((g, t, w, h) => {
      g.fillStyle = "#0b0b12"; g.fillRect(0, 0, w, h);
      const lvl = Math.min(6, Math.max(0, (t - 0.6) / 0.62));
      const cur = Math.floor(lvl + 0.001);
      for (let i = 0; i < 7; i++) {
        const y = base - (i + 1) * fh, lit = i <= cur && t > 0.6;
        c.box(g, 20, y, 230, fh - 2, lit ? "#1d1a07" : "#121212", lit ? "#FFD21F" : "#333");
        c.ptext(g, F[i][0], 238, y + fh / 2, { size: 11, color: lit ? "#FFD21F" : "#666", align: "right" });
        if (lit) c.ptext(g, F[i][1], 175, y + fh / 2, { size: 12, color: "#fff", align: "right" });
        for (let k = 0; k < 4; k++) { g.fillStyle = lit ? (k % 2 ? "#FFD21F" : "#fff") : "#2a2a2a"; g.fillRect(30 + k * 8, y + 6, 4, 6); }
      }
      g.fillStyle = "#222"; g.fillRect(70, base - 7 * fh, 34, 7 * fh);
      const cy = base - (lvl + 1) * fh + 2;
      c.box(g, 72, cy, 30, fh - 6, "#333", "#FFD21F"); c.spr(g, heroFrame(0), 81, cy + 6, 1.5);
      g.fillStyle = "#FFD21F"; g.fillRect(86, base - 7 * fh - 8, 2, cy - (base - 7 * fh - 8));
      if (t > 5.2) banner(c, g, "همه طبقه‌ها رویالیه", 82, { size: 15, color: "#FFD21F" });
    });
    c.frame({ footT: 5.4 });
  });

  /* X04 platformer: run, jump, coins, ? block -> 50% */
  def("X04", (c) => {
    const jumps = [1.0, 2.1, 3.3], coins = [[150, 0], [230, 0], [330, 1], [420, 0], [520, 1]], q = 640;
    c.proc((g, t, w, h) => {
      const sx = Math.min(t, 5) * 90;
      for (let y = 0; y < h; y += 4) { g.fillStyle = y < 200 ? "#14183d" : y < 300 ? "#1B2250" : "#0e1330"; g.fillRect(0, y, w, 4); }
      for (let i = 0; i < 8; i++) { const x = ((i * 70 - sx * 0.3) % 360 + 360) % 360 - 40; g.fillStyle = "#26306f"; g.beginPath(); g.moveTo(x, 300); g.lineTo(x + 40, 250); g.lineTo(x + 80, 300); g.fill(); }
      for (let x = -((sx | 0) % 16); x < w; x += 16) { c.box(g, x, 300, 16, 16, "#9C6B3B", "#5a3c1e"); g.fillStyle = "#7BC86C"; g.fillRect(x, 300, 16, 3); }
      let jy = 0; jumps.forEach((j) => { if (t > j && t < j + 0.6) { const k = (t - j) / 0.6; jy = Math.min(jy, -Math.sin(k * Math.PI) * 44); } });
      if (t > 4.6 && t < 5.2) { const k = (t - 4.6) / 0.6; jy = -Math.sin(k * Math.PI) * 52; }
      let score = 0;
      coins.forEach(([x, hi], i) => { const cx = x - sx, cy = hi ? 226 : 256; const got = cx < 84; if (got) { score += 10; if (cx > 54) burst(g, 84, cy, (84 - cx) / 30); return; } c.spr(g, SP.coin, cx, cy + Math.sin(t * 6 + i) * 2, 2); });
      const qx = q - sx; if (qx > -20) { c.box(g, qx, 196, 20, 20, t > 4.9 ? "#9C6B3B" : "#FFD21F", "#7a5d00"); if (t < 4.9) c.ptext(g, "?", qx + 10, 206, { size: 11, color: "#0A0A0A", font: "Courier New" }); }
      c.spr(g, heroFrame(t), 66, 272 + jy, 2);
      c.ptext(g, "SCORE " + String(score).padStart(4, "0"), 18, 96, { size: 10, font: "Courier New", color: "#fff", align: "left" });
      if (t > 4.95) { const k = ease((t - 4.95) / 0.5); c.ptext(g, "۵۰٪", 135, 190 - 70 * k, { size: 56, color: "#FFD21F", shadow: "#E8262B" }); }
      if (t > 6) banner(c, g, "پاور آپ رویالی!", 330 - 210, { size: 14, color: "#fff" });
    });
    c.frame({ footT: 6 });
  });

  /* X05 price-tag invaders */
  def("X05", (c) => {
    const kills = []; for (let i = 0; i < 15; i++) kills.push(1.0 + i * 0.28);
    c.proc((g, t, w, h) => {
      g.fillStyle = "#05050a"; g.fillRect(0, 0, w, h); stars(c, g, w, h, t, 70, 9);
      const off = Math.sin(t * 1.6) * 24, drop = Math.min(t, 5) * 4;
      let dead = 0;
      for (let row = 0; row < 3; row++) for (let col = 0; col < 5; col++) {
        const i = row * 5 + col, x = 45 + col * 38 + off, y = 95 + row * 26 + drop, kt = kills[i];
        if (t > kt + 0.25) { dead++; continue; }
        if (t > kt) { burst(g, x + 5, y + 4, (t - kt) / 0.25, "#E8262B"); continue; }
        c.spr(g, SP.tag, x - 4, y - 2, 2);
      }
      const nx = kills.findIndex((k) => k > t), tx = nx < 0 ? 135 : 45 + (nx % 5) * 38 + off + 5;
      const shipX = lerp(135, tx, 0.85) - 6;
      c.spr(g, SP.ship, shipX - 6, 320, 2);
      kills.forEach((k) => { if (t > k - 0.25 && t < k) { const by = lerp(326, 100, (t - (k - 0.25)) / 0.25); g.fillStyle = "#FFD21F"; g.fillRect(shipX + 6, by, 1, 5); } });
      c.ptext(g, "SCORE " + String(dead * 100).padStart(5, "0"), 18, 96, { size: 9, font: "Courier New", color: "#fff", align: "left" });
      if (t > 5.4) { banner(c, g, "قیمت‌های بالا", 200, { size: 18, color: "#FFD21F" }); c.ptext(g, "نابود شد!", 135, 236, { size: 18, color: "#fff" }); }
    });
    c.crt(); c.frame({ footT: 5.6 });
  });

  /* X06 falling blocks build a percent sign */
  def("X06", (c) => {
    const P = ["##......##", "##.....##.", "......##..", ".....##...", "....##....", "...##.....", "..##......", ".##.....##", "##......##"];
    const cells = []; P.forEach((row, j) => row.split("").forEach((ch, i) => { if (ch === "#") cells.push([i, j]); }));
    cells.sort((a, b) => b[1] - a[1] || a[0] - b[0]);
    const cs = 18, ox = 135 - 5 * cs, oy = 110;
    c.proc((g, t, w, h) => {
      g.fillStyle = "#0b0b0b"; g.fillRect(0, 0, w, h);
      g.strokeStyle = "#1e1e1e"; for (let x = 0; x <= 10; x++) { g.fillStyle = "#1a1a1a"; g.fillRect(ox + x * cs, oy, 1, 9 * cs); }
      c.box(g, ox - 3, oy + 9 * cs, 10 * cs + 6, 3, "#FFD21F");
      cells.forEach(([i, j], n) => { const t0 = 0.3 + n * 0.11; if (t < t0) return; const k = Math.min(1, (t - t0) / 0.22); const y = lerp(30, oy + j * cs, k * k);
        const col = n % 5 === 0 ? "#E8262B" : n % 2 ? "#FFD21F" : "#FFFFFF"; c.box(g, ox + i * cs + 1, y + 1, cs - 2, cs - 2, col, "#000"); g.fillStyle = "rgba(255,255,255,.5)"; g.fillRect(ox + i * cs + 2, y + 2, cs - 6, 2); });
      const tEnd = 0.3 + cells.length * 0.11 + 0.3;
      if (t > tEnd && t < tEnd + 0.3 && blink(t, 0.08)) { g.fillStyle = "rgba(255,255,255,.6)"; g.fillRect(ox, oy, 10 * cs, 9 * cs); }
      if (t > tEnd + 0.3) { banner(c, g, "رویال ویک", 300, { size: 22, color: "#FFD21F" }); c.ptext(g, "تخفیف‌ها جفت‌وجوره!", 135, 338, { size: 13, color: "#fff" }); }
    });
    c.frame({ footT: 6.2 });
  });

  /* X07 claw machine grabs a gift */
  def("X07", (c) => {
    c.proc((g, t, w, h) => {
      g.fillStyle = "#110a1a"; g.fillRect(0, 0, w, h);
      c.box(g, 30, 70, 210, 250, "#1a1530", "#FFD21F"); g.fillStyle = "rgba(127,214,255,.08)"; g.fillRect(31, 71, 208, 248);
      const pile = [[50, 290, "gift"], [80, 292, "bag"], [110, 288, "gift"], [140, 292, "perf"], [170, 290, "gift"], [200, 292, "bag"]];
      const gx = t < 1 ? lerp(60, 140, ease(t)) : 140, down = t < 1.2 ? 0 : t < 2.0 ? (t - 1.2) / 0.8 : t < 2.4 ? 1 : t < 3.2 ? 1 - (t - 2.4) / 0.8 : 0;
      const cx = t < 3.2 ? gx : t < 4.2 ? lerp(140, 205, ease((t - 3.2) / 1)) : 205, cy = 82 + down * 196;
      g.fillStyle = "#888"; g.fillRect(cx, 72, 2, cy - 72);
      const closed = t > 2.2; c.box(g, cx - 8, cy, 18, 6, "#bbb");
      g.fillStyle = "#bbb"; g.fillRect(cx - 9 + (closed ? 3 : 0), cy + 6, 2, 10); g.fillRect(cx + 9 - (closed ? 3 : 0), cy + 6, 2, 10);
      pile.forEach(([x, y, s], i) => { if (i === 3 && t > 2.2) return; c.spr(g, SP[s], x, y, 1.3); });
      if (t > 2.2 && t < 4.6) c.spr(g, SP.gift, cx - 6, cy + 10, 1.3);
      c.box(g, 190, 300, 40, 20, "#000", "#FFD21F");
      if (t > 4.6) { const k = ease((t - 4.6) / 0.4); c.spr(g, SP.gift, 120, lerp(300, 170, k), 3); burst(g, 135, 185, Math.min(1, (t - 4.6) / 0.4), "#FFD21F", 16); }
      if (t > 5.2) banner(c, g, "خریدت هدیه داره", 270, { size: 17, color: "#FFD21F" });
    });
    c.frame({ footT: 5.4 });
  });

  /* X08 capsule machine */
  def("X08", (c) => {
    const br = c.S.brand || "کالکشن", off = c.S.offer || "تا ۵۰٪";
    c.proc((g, t, w, h) => {
      g.fillStyle = "#0d0710"; g.fillRect(0, 0, w, h);
      g.fillStyle = "#E8262B"; g.fillRect(85, 200, 100, 110); c.box(g, 100, 280, 70, 18, "#111", "#FFD21F");
      g.fillStyle = "#cfe9ff"; g.beginPath(); g.arc(135, 150, 56, 0, Math.PI * 2); g.fill(); g.fillStyle = "#0d0710"; g.beginPath(); g.arc(135, 150, 52, 0, Math.PI * 2); g.fill();
      const r = c.RP.rng(4); for (let i = 0; i < 14; i++) { const a = r() * 6.28, d = r() * 40; const x = 135 + Math.cos(a) * d, y = 160 + Math.sin(a) * d * 0.6; g.fillStyle = ["#FFD21F", "#fff", "#E8262B", "#7FD6FF"][i % 4]; g.beginPath(); g.arc(x, y, 7, 0, 6.28); g.fill(); }
      const ang = t < 1.8 ? t * 4 : 7.2; g.save(); g.translate(135, 238); g.rotate(ang); g.fillStyle = "#FFD21F"; g.fillRect(-16, -3, 32, 6); g.restore(); c.box(g, 131, 234, 8, 8, "#fff");
      if (t > 1.8) { const k = Math.min(1, (t - 1.8) / 0.4), y = lerp(270, 330, k); g.fillStyle = "#FFD21F"; g.beginPath(); g.arc(135, y, 12, Math.PI, 0); g.fill(); g.fillStyle = "#fff"; g.beginPath(); g.arc(135, y, 12, 0, Math.PI); g.fill(); }
      if (t > 2.6) { const k = ease((t - 2.6) / 0.5); g.fillStyle = "rgba(13,7,16,.85)"; g.fillRect(0, 60, w, 330); burst(g, 135, 200, k, "#FFD21F", 20);
        c.ptext(g, br, 135, 170, { size: 26, color: "#fff" }); c.ptext(g, off, 135, 220, { size: 34, color: "#FFD21F", font: fa(off), shadow: "#7a5d00" }); }
      if (t > 3.6) c.ptext(g, "شانس رویالیت رو امتحان کن", 135, 280, { size: 13, color: "#fff" });
    });
    c.frame({ footT: 3.8 });
  });

  /* X09 RPG dialogue with the shopkeeper; Persian typed word by word */
  def("X09", (c) => {
    const lines = ["سلام رویالی!", "امروز چی لازم داری؟"], opts = ["تخفیف", "هدیه", "بازی"];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#1b1426"; g.fillRect(0, 0, w, h);
      for (let s = 0; s < 3; s++) { c.box(g, 20, 90 + s * 44, 230, 4, "#9C6B3B"); for (let i = 0; i < 9; i++) c.spr(g, [SP.bag, SP.perf, SP.shoe][(i + s) % 3], 28 + i * 24, 78 + s * 44 - (i % 2) * 2, 1); }
      c.box(g, 20, 220, 230, 16, "#9C6B3B", "#5a3c1e");
      c.spr(g, SP.npc, 110, 170 + Math.round(Math.sin(t * 4)), 3);
      c.box(g, 14, 250, 242, 90, "#0A0A0A", "#fff"); c.box(g, 16, 252, 238, 86, "#0A0A0A", "#FFD21F");
      c.ptext(g, "فروشنده", 240, 262, { size: 10, color: "#FFD21F", align: "right" });
      lines.forEach((ln, i) => { const t0 = 0.6 + i * 1.3, ws = ln.split(" "), n = Math.min(ws.length, Math.floor((t - t0) / 0.28) + 1); if (t < t0) return; c.ptext(g, ws.slice(0, n).join(" "), 240, 284 + i * 22, { size: 14, color: "#fff", align: "right" }); });
      if (t > 3.6) { c.box(g, 150, 160, 100, 70, "#0A0A0A", "#fff"); const sel = t < 4.4 ? 0 : t < 5.0 ? 1 : 0;
        opts.forEach((o, i) => { c.ptext(g, o, 225, 176 + i * 20, { size: 13, color: i === sel ? "#FFD21F" : "#fff", align: "right" }); if (i === sel && blink(t, 0.25)) c.ptext(g, "◀", 240, 176 + i * 20, { size: 10, color: "#FFD21F", font: "Vazirmatn" }); }); }
      if (t > 5.6) { g.fillStyle = "rgba(0,0,0,.75)"; g.fillRect(0, 60, w, 300); banner(c, g, "تخفیف‌های رویالی!", 200, { size: 18, color: "#FFD21F" }); }
    });
    c.frame({ footT: 5.8 });
  });

  /* X10 level select map: 7 days */
  def("X10", (c) => {
    const today = c.S.today || 3, names = ["۳ آذر", "۴ آذر", "۵ آذر", "جمعه", "۷ آذر", "۸ آذر", "۹ آذر"];
    const P = [[60, 340], [150, 315], [215, 275], [140, 240], [60, 200], [140, 160], [215, 120]];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#0e1a10"; g.fillRect(0, 0, w, h); const r = c.RP.rng(8); for (let i = 0; i < 80; i++) { g.fillStyle = i % 3 ? "#163a1c" : "#1f4d25"; g.fillRect((r() * w) | 0, (r() * h) | 0, 3, 3); }
      const vis = Math.min(7, Math.floor(t / 0.3) + 1);
      for (let i = 0; i < vis - 1; i++) { const [x1, y1] = P[i], [x2, y2] = P[i + 1]; for (let k = 0; k <= 1; k += 0.08) { g.fillStyle = "#FFD21F"; g.fillRect(lerp(x1, x2, k) | 0, lerp(y1, y2, k) | 0, 2, 2); } }
      for (let i = 0; i < vis; i++) { const [x, y] = P[i], done = i < today - 1, cur = i === today - 1, boss = i === 3;
        c.box(g, x - 10, y - 10, 20, 20, done ? "#FFD21F" : cur ? (blink(t, 0.3) ? "#fff" : "#FFD21F") : "#333", "#000");
        if (boss) c.spr(g, SP.crown, x - 3, y - 20, 1); if (done) c.ptext(g, "✓", x, y, { size: 10, color: "#0A0A0A", font: "Vazirmatn" });
        c.ptext(g, names[i], x, y + 18, { size: 9, color: "#fff" }); }
      const [hx, hy] = P[today - 1]; c.spr(g, heroFrame(t), hx - 12, hy - 48, 2);
      c.ptext(g, "مرحله " + "۱۲۳۴۵۶۷"[today - 1] + " از ۷", 135, 80, { size: 16, color: "#FFD21F" });
      if (t > 3) c.ptext(g, "جمعه: مرحله رئیس!", 135, 104, { size: 12, color: "#fff" });
    });
    c.frame({ footT: 3.2 });
  });

  /* X11 boss fight vs «high prices» */
  def("X11", (c) => {
    const hits = [[1.4, "تخفیف"], [2.4, "هدیه"], [3.4, "×۲"]];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#14060a"; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 6) { g.fillStyle = "#1c0a10"; g.fillRect(0, y, w, 2); }
      const hp = 1 - hits.filter(([ht]) => t > ht + 0.3).length / 3;
      c.ptext(g, "رئیس: قیمت‌های گرون", 135, 76, { size: 12, color: "#fff" });
      c.box(g, 35, 88, 200, 8, "#300", "#fff"); g.fillStyle = "#E8262B"; g.fillRect(36, 89, Math.floor(198 * hp), 6);
      const dead = t > 3.9, shake = hits.some(([ht]) => t > ht + 0.3 && t < ht + 0.5) ? Math.round(Math.sin(t * 90) * 3) : 0;
      if (!dead || blink(t, 0.08)) if (t < 4.6) { c.spr(g, SP.tag, 92 + shake, 120, 8); g.fillStyle = "#E8262B"; g.fillRect(116 + shake, 142, 8, 6); g.fillRect(148 + shake, 142, 8, 6); }
      if (t > 4.6 && t < 5.2) for (let i = 0; i < 4; i++) burst(g, 135 + (i - 1.5) * 20, 160, (t - 4.6) / 0.6 + i * 0.1, i % 2 ? "#FFD21F" : "#E8262B", 14);
      c.spr(g, heroFrame(t), 125, 300, 2);
      hits.forEach(([ht, word]) => { if (t > ht - 0.3 && t < ht + 0.3) { const k = (t - (ht - 0.3)) / 0.6; c.ptext(g, word, 135, lerp(290, 150, k), { size: 16, color: "#FFD21F", font: fa(word) }); } });
      if (t > 5.2) { c.ptext(g, "K.O.", 135, 170, { size: 40, color: "#FFD21F", shadow: "#E8262B" }); c.ptext(g, "ROYAL FRIDAY", 135, 222, { size: 16, color: "#fff" }); c.ptext(g, "جمعه ۶ آذر", 135, 252, { size: 16, color: "#FFD21F" }); }
    });
    c.frame({ footT: 5.4 });
  });

  /* X12 inventory screen */
  def("X12", (c) => {
    const items = [["bag", "کیف", "تا ۵۰٪"], ["shoe", "کفش", "تا ۲۰٪"], ["perf", "عطر", "هدیه"], ["phone", "گوشی", "جانبی هدیه"], ["watch", "ساعت", "تا ۲۰٪"], ["gift", "کادو", "با خرید"]];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#0c0f1e"; g.fillRect(0, 0, w, h); c.ptext(g, "کوله رویالی", 135, 84, { size: 18, color: "#FFD21F" });
      const sel = Math.min(5, Math.floor(Math.max(0, t - 0.8) / 0.75));
      items.forEach(([s, n], i) => { const x = 40 + (i % 3) * 68, y = 110 + Math.floor(i / 3) * 68; c.box(g, x, y, 56, 56, i === sel ? "#2a2410" : "#151a33", i === sel ? "#FFD21F" : "#3a417f"); c.spr(g, SP[s], x + 16, y + 16, 3); });
      const [, n, st] = items[sel]; c.box(g, 30, 260, 210, 70, "#0A0A0A", "#fff");
      c.ptext(g, n, 228, 280, { size: 16, color: "#fff", align: "right" }); c.ptext(g, "+ " + st, 228, 308, { size: 15, color: "#FFD21F", align: "right", font: fa(st) });
    });
    c.frame({ footT: 4.6 });
  });

  /* X13 achievements unlocked */
  def("X13", (c) => {
    const A = ["مهمان رویال", "شوالیه رویال", "شاهزاده رویال", "پادشاه هفته"];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#08080c"; g.fillRect(0, 0, w, h); stars(c, g, w, h, t, 60, 13);
      A.forEach((a, i) => { const t0 = 0.4 + i * 1.1; if (t < t0) return; const k = ease((t - t0) / 0.35), y = 90 + i * 62, x = lerp(300, 30, k);
        c.box(g, x, y, 210, 48, i === 3 ? "#2a2208" : "#141414", i === 3 ? "#FFD21F" : "#666"); c.spr(g, SP.trophy, x + 12, y + 14, 3);
        c.ptext(g, "دستاورد باز شد", x + 198, y + 14, { size: 9, color: "#FFD21F", align: "right" }); c.ptext(g, a, x + 198, y + 32, { size: 15, color: "#fff", align: "right" }); });
    });
    c.frame({ footT: 4.8 });
  });

  /* X14 pixel countdown 3-2-1, digits burst into pixels */
  def("X14", (c) => {
    c.proc((g, t, w, h) => {
      g.fillStyle = "#050505"; g.fillRect(0, 0, w, h);
      ["۳", "۲", "۱"].forEach((d, i) => { const t0 = 0.3 + i * 1.2; if (t < t0 || t > t0 + 1.2) return; const k = (t - t0);
        if (k < 0.9) c.ptext(g, d, 135, 210, { size: 140, color: i === 2 ? "#E8262B" : "#FFD21F", font: "Vazirmatn", shadow: "#333" });
        else { const r = c.RP.rng(i + 3); for (let p = 0; p < 90; p++) { const a = r() * 6.28, sp = 30 + r() * 140, kk = (k - 0.9) / 0.3; g.fillStyle = p % 3 ? "#FFD21F" : "#fff"; g.fillRect(135 + Math.cos(a) * sp * kk, 210 + Math.sin(a) * sp * kk, 3, 3); } } });
      if (t > 3.9) { c.ptext(g, "شروع شد!", 135, 200, { size: 34, color: "#FFD21F" }); c.ptext(g, "رویال ویک", 135, 250, { size: 20, color: "#fff" }); }
    });
    c.frame({ footT: 4 });
  });

  /* X15 game over -> continue? -> last day */
  def("X15", (c) => {
    c.proc((g, t, w, h) => {
      g.fillStyle = "#050505"; g.fillRect(0, 0, w, h);
      if (t < 1.6) { if (blink(t, 0.25) || t > 0.8) c.ptext(g, "GAME OVER", 135, 200, { size: 26, color: "#E8262B" }); return; }
      c.ptext(g, "ادامه می‌دی؟", 135, 140, { size: 22, color: "#fff" });
      const n = Math.max(1, 9 - Math.floor((t - 1.6) / 0.25)); if (t < 3.8) c.ptext(g, "۹۸۷۶۵۴۳۲۱"[9 - n], 135, 210, { size: 60, color: "#FFD21F", font: "Vazirmatn" });
      if (t > 3.8) { c.ptext(g, "▶ بله", 135, 210, { size: 26, color: "#FFD21F", font: "Vazirmatn" }); }
      if (t > 4.5) { banner(c, g, "آخرین روز رویال ویک", 280, { size: 16, color: "#FFD21F", bg: "#300" }); }
    });
    c.crt(); c.frame({ footT: 4.6 });
  });

  /* X16 high score table */
  def("X16", (c) => {
    const R = [["۱", "پادشاه هفته", "۹۸۰"], ["۲", "شاهزاده", "۸۲۰"], ["۳", "شاهزاده", "۷۶۰"], ["۴", "شوالیه", "۵۴۰"], ["۵", "شوالیه", "۴۹۰"]];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#060812"; g.fillRect(0, 0, w, h); c.ptext(g, "HIGH SCORE", 135, 84, { size: 18, color: "#FFD21F" });
      R.forEach((row, i) => { const t0 = 0.4 + i * 0.35; if (t < t0) return; const y = 120 + i * 30, col = i === 0 ? "#FFD21F" : "#fff";
        c.ptext(g, row[0], 238, y, { size: 14, color: col, align: "right" }); c.ptext(g, row[1], 205, y, { size: 14, color: col, align: "right" }); c.ptext(g, row[2], 40, y, { size: 14, color: col, align: "left" }); });
      if (t > 2.6 && blink(t, 0.3)) c.ptext(g, "جای تو خالیه!", 135, 300, { size: 18, color: "#FFD21F" });
    });
    c.frame({ footT: 2.8 });
  });

  /* X17 Ahvaz skyline: day -> night, mall glows */
  def("X17", (c) => {
    const r0 = c.RP.rng(17), B = []; for (let x = 0; x < 270; x += 14 + ((r0() * 10) | 0)) B.push([x, 40 + ((r0() * 90) | 0), 12 + ((r0() * 8) | 0)]);
    c.proc((g, t, w, h) => {
      const k = Math.min(1, t / 4);
      const sky = [[120, 180, 230], [240, 140, 70], [20, 22, 55]], a = k < 0.5 ? sky[0] : sky[1], b = k < 0.5 ? sky[1] : sky[2], kk = k < 0.5 ? k * 2 : (k - 0.5) * 2;
      for (let y = 0; y < 330; y += 4) { const m = y / 330; g.fillStyle = `rgb(${lerp(a[0], b[0], kk) * (1 - m * 0.3) | 0},${lerp(a[1], b[1], kk) * (1 - m * 0.3) | 0},${lerp(a[2], b[2], kk) | 0})`; g.fillRect(0, y, w, 4); }
      if (k > 0.7) stars(c, g, w, 180, t, 50, 3);
      B.forEach(([x, bh, bw], i) => { g.fillStyle = "#14121e"; g.fillRect(x, 300 - bh, bw, bh); for (let wy = 300 - bh + 4; wy < 296; wy += 6) for (let wx = x + 2; wx < x + bw - 2; wx += 4) if (k > 0.55 && ((wx * 7 + wy * 3 + i) % 5) < 2) { g.fillStyle = "#FFD21F"; g.fillRect(wx, wy, 2, 2); } });
      g.fillStyle = "#0e0c16"; g.fillRect(105, 170, 60, 130); if (k > 0.6) { g.fillStyle = "#FFD21F"; g.fillRect(110, 176, 50, 10); c.ptext(g, "ROYAL", 135, 181, { size: 8, color: "#0A0A0A" }); g.fillStyle = "rgba(255,210,31,.18)"; g.beginPath(); g.arc(135, 220, 70, 0, 6.28); g.fill(); }
      g.fillStyle = "#1c2a55"; g.fillRect(0, 300, w, 40); g.strokeStyle = "#ddd"; g.lineWidth = 2; g.beginPath(); for (let x = 10; x <= 260; x += 2) { const yy = 300 - Math.sin(((x - 10) / 250) * Math.PI) * 26; x === 10 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke();
      for (let x = 20; x < 260; x += 20) { g.fillStyle = "#ddd"; g.fillRect(x, 300 - Math.sin(((x - 10) / 250) * Math.PI) * 26, 1, 26); }
      if (k > 0.95) { banner(c, g, "شب‌های رویالی", 100, { size: 20, color: "#FFD21F" }); }
    });
    c.frame({ footT: 4.4 });
  });

  /* X18 pixel drummer on the beat (100 bpm) */
  def("X18", (c) => {
    const bt = 0.6;
    c.proc((g, t, w, h) => {
      g.fillStyle = "#0a0712"; g.fillRect(0, 0, w, h);
      const hit = (t % bt) < 0.12;
      g.fillStyle = hit ? "rgba(255,210,31,.25)" : "rgba(255,210,31,.08)"; g.beginPath(); g.moveTo(135, 60); g.lineTo(60, 300); g.lineTo(210, 300); g.fill();
      c.box(g, 95, 250, 80, 40, "#E8262B", "#000"); g.fillStyle = "#fff"; g.fillRect(100, 255, 70, 4);
      c.box(g, 60, 235, 30, 16, "#ddd", "#000"); c.box(g, 180, 235, 30, 16, "#ddd", "#000"); g.fillStyle = "#FFD21F"; g.fillRect(55, hit ? 210 : 214, 40, 3); g.fillRect(175, hit ? 214 : 210, 40, 3);
      c.spr(g, SP.npc.map((s) => s.replace(/r/g, "k").replace(/w/g, "p")), 117, 190, 3);
      g.fillStyle = "#F2C29B"; g.fillRect(hit ? 100 : 110, hit ? 222 : 212, 14, 4); g.fillRect(hit ? 160 : 152, hit ? 212 : 222, 14, 4);
      for (let i = 0; i < 18; i++) { const v = (Math.sin(t * 9 + i * 1.7) * 0.5 + 0.5) * (hit ? 1 : 0.6); g.fillStyle = i % 3 ? "#FFD21F" : "#fff"; g.fillRect(28 + i * 12, 330 - v * 30, 8, v * 30); }
      c.ptext(g, "اجرای زنده", 135, 90, { size: 22, color: "#FFD21F" }); c.ptext(g, "پنجشنبه، جمعه، شنبه", 135, 122, { size: 14, color: "#fff" });
    });
    c.frame({ footT: 2 });
  });

  /* X19 motorbike race to the finish line */
  def("X19", (c) => {
    c.proc((g, t, w, h) => {
      const v = Math.min(t, 4.5) * 140;
      for (let y = 0; y < 220; y += 4) { g.fillStyle = y < 120 ? "#f39a4b" : "#e8762b"; g.fillRect(0, y, w, 4); }
      g.fillStyle = "#FFD21F"; g.beginPath(); g.arc(200, 150, 26, 0, 6.28); g.fill();
      for (let i = 0; i < 6; i++) { const x = ((i * 60 - v * 0.2) % 360 + 360) % 360 - 40; g.fillStyle = "#7a3b1b"; g.fillRect(x, 190, 40, 30); }
      g.fillStyle = "#222"; g.fillRect(0, 220, w, 110); for (let x = -(v % 40); x < w; x += 40) { g.fillStyle = "#FFD21F"; g.fillRect(x, 272, 20, 4); }
      const fx = 600 - v; if (fx > -20) { for (let j = 0; j < 12; j++) for (let i = 0; i < 2; i++) { g.fillStyle = (i + j) % 2 ? "#fff" : "#000"; g.fillRect(fx + i * 5, 222 + j * 9, 5, 9); } }
      const bx = 70, by = 250 + Math.round(Math.sin(t * 20));
      g.fillStyle = "#0A0A0A"; g.beginPath(); g.arc(bx, by + 18, 9, 0, 6.28); g.arc(bx + 40, by + 18, 9, 0, 6.28); g.fill();
      g.fillStyle = "#777"; g.beginPath(); g.arc(bx, by + 18, 4, 0, 6.28); g.arc(bx + 40, by + 18, 4, 0, 6.28); g.fill();
      c.box(g, bx + 4, by + 4, 34, 8, "#FFD21F", "#000"); c.box(g, bx + 30, by - 2, 10, 6, "#E8262B"); c.spr(g, SP.heroA.slice(0, 9), bx + 10, by - 24, 2);
      for (let i = 0; i < 5; i++) { g.fillStyle = "rgba(200,200,200,.5)"; g.fillRect(bx - 8 - i * 7, by + 14 + ((i * 3 + Math.floor(t * 10)) % 5), 4, 4); }
      if (t > 4.6) { g.fillStyle = "rgba(0,0,0,.7)"; g.fillRect(0, 60, w, 140); c.ptext(g, "جایزه بزرگ", 135, 100, { size: 24, color: "#FFD21F" }); c.ptext(g, "موتورسیکلت", 135, 140, { size: 22, color: "#fff" }); c.ptext(g, "قرعه‌کشی تا یلدا", 135, 176, { size: 13, color: "#FFD21F" }); }
    });
    c.frame({ footT: 4.8 });
  });

  /* X20 dithered pixels resolve into the real shop photo */
  def("X20", (c) => {
    const ph = c.S.photo || "shops/s12";
    c.need = [ph];
    c.after = (imgs) => {
      const steps = [[45, 80], [90, 160], [180, 320]].map(([w, h]) => c.dither(imgs[0], w, h, "#0A0A0A", "#FFD21F", 1.1));
      c.proc((g, t, w, h) => { const k = t < 1.2 ? 0 : t < 2.2 ? 1 : 2; g.drawImage(steps[k], 0, 0, w, h); });
      const real = c.img(ph, null, { zIndex: 10, opacity: 0 }); c.tl.to(real, { opacity: 1, duration: 0.6 }, 3.0);
      const col = c.col(1050, 1330); const tt = c.title(col, "اینجا [[واقعیه!]]", { px: 140 }); c.rise(tt.words, 3.5);
      c.layer({ zIndex: 11, background: "linear-gradient(180deg, rgba(0,0,0,.5), rgba(0,0,0,0) 30%, rgba(0,0,0,0) 50%, rgba(0,0,0,.85))", opacity: 0 }).id = "x20sh";
      c.tl.to("#x20sh", { opacity: 1, duration: 0.5 }, 3.2);
      c.frame({ footT: 3.8 });
    };
  });

  /* X21 handheld console (original «ROYAL BOY» design) */
  def("X21", (c) => {
    const G = ["#0f380f", "#306230", "#8bac0f", "#9bbc0f"];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#0b0b0b"; g.fillRect(0, 0, w, h);
      c.box(g, 45, 70, 180, 300, "#FFD21F", "#7a5d00"); c.box(g, 60, 86, 150, 130, "#555", "#333"); c.box(g, 70, 96, 130, 110, G[3]);
      c.ptext(g, "ROYAL BOY", 135, 230, { size: 10, color: "#0A0A0A" });
      g.fillStyle = "#0A0A0A"; g.fillRect(70, 270, 30, 10); g.fillRect(80, 260, 10, 30);
      const press = (t % 1.2) < 0.15 && t > 2; g.fillStyle = press ? "#7a0000" : "#E8262B"; g.beginPath(); g.arc(185, 265, 10, 0, 6.28); g.fill(); g.beginPath(); g.arc(160, 280, 10, 0, 6.28); g.fill();
      c.ptext(g, "A", 185, 266, { size: 8, color: "#fff" });
      const k = Math.min(1, t / 1.5); c.ptext(g, "رویال ویک", 135, 125 + (1 - k) * 40, { size: 18, color: G[0] });
      if (t > 1.6) c.ptext(g, "تخفیف", 135, 155, { size: 16, color: G[1] });
      if (t > 2.2) c.ptext(g, blink(t, 0.4) ? "+ هدیه" : "+ بازی", 135, 182, { size: 14, color: G[0] });
      if (t > 3.2) c.ptext(g, "دکمه A رو بزن", 135, 330, { size: 13, color: "#fff" });
    });
    c.frame({ footT: 3.4 });
  });

  /* X22 loading Royal Friday… (99% joke) */
  def("X22", (c) => {
    c.proc((g, t, w, h) => {
      g.fillStyle = "#06060a"; g.fillRect(0, 0, w, h);
      c.ptext(g, "LOADING ROYAL FRIDAY", 135, 140, { size: 11, color: "#fff" });
      const p = t < 2.4 ? ease(t / 2.4) * 0.99 : t < 4.4 ? 0.99 : 1;
      c.box(g, 35, 170, 200, 16, "#111", "#FFD21F"); g.fillStyle = "#FFD21F"; for (let x = 0; x < Math.floor(198 * p); x += 6) g.fillRect(36 + x, 171, 5, 14);
      c.ptext(g, Math.floor(p * 100) + "%", 135, 200, { size: 12, color: "#FFD21F" });
      if (t > 2.4 && t < 4.4) { c.ptext(g, "...", 135, 225, { size: 12, color: "#fff" }); const a = t * 8; g.fillStyle = "#FFD21F"; g.fillRect(135 + Math.cos(a) * 10, 250 + Math.sin(a) * 10, 3, 3); c.ptext(g, "یه کم صبر…", 135, 280, { size: 13, color: "#999" }); }
      if (t > 4.4) { burst(g, 135, 178, Math.min(1, (t - 4.4) / 0.4) * 3, "#FFD21F", 24); if (t > 4.7) { banner(c, g, "جمعه رسید!", 250, { size: 24, color: "#FFD21F" }); c.ptext(g, "جمعه ۶ آذر", 135, 300, { size: 14, color: "#fff" }); } }
    });
    c.frame({ footT: 4.8 });
  });

  /* X23 snake eats royal stamps */
  def("X23", (c) => {
    const cs = 12, cols = 18, rows = 18, ox = 27, oy = 84;
    const path = []; let x = 2, y = 9; const dirs = "RRRRRRUUUURRRRDDDDDDDLLLLLLLLUUUUURRRRRRRRRR";
    path.push([x, y]); for (const d of dirs) { if (d === "R") x++; if (d === "L") x--; if (d === "U") y--; if (d === "D") y++; path.push([x, y]); }
    const food = [8, 16, 24, 33, 42];
    c.proc((g, t, w, h) => {
      g.fillStyle = "#0b120b"; g.fillRect(0, 0, w, h); c.box(g, ox - 2, oy - 2, cols * cs + 4, rows * cs + 4, "#0f1f0f", "#9CFF9C");
      const step = Math.min(path.length - 1, Math.floor(t / 0.11)), eaten = food.filter((f) => f <= step).length, len = 3 + eaten * 3;
      food.forEach((f) => { if (f > step) { const [fx, fy] = path[f]; c.box(g, ox + fx * cs + 2, oy + fy * cs + 2, cs - 4, cs - 4, "#FFD21F"); } });
      for (let i = Math.max(0, step - len); i <= step; i++) { const [sx, sy] = path[i]; c.box(g, ox + sx * cs + 1, oy + sy * cs + 1, cs - 2, cs - 2, i === step ? "#fff" : "#9CFF9C"); }
      c.ptext(g, "امتیاز " + ["۰", "۱۰", "۳۰", "۶۰", "۹۰", "۱۵۰"][eaten], 135, 72, { size: 13, color: "#9CFF9C" });
      if (t > 5) banner(c, g, "امتیاز جمع کن، رویالی شو", 330, { size: 13, color: "#FFD21F" });
    });
    c.crt(); c.frame({ footT: 5.1 });
  });

  /* X24 photo mosaic assembles the hexagon badge */
  def("X24", (c) => {
    const ph = ["shops/s01", "shops/s07", "shops/s12", "shops/s14", "shops/s20", "shops/s24", "shops/s25", "shops/s29", "shops/s31", "shops/s05"];
    c.need = ph;
    c.after = (imgs) => {
      const thumbs = imgs.map((im) => c.coverCanvas(im, 10, 10)), ts = 10, cells = [];
      for (let y = 70; y < 330; y += ts) for (let x = 40; x < 230; x += ts) { const dx = Math.abs(x + 5 - 135) / 95, dy = (y + 5 - 200) / 130; if (Math.abs(dy) < 1 && dx < 1 - Math.max(0, Math.abs(dy) - 0.45) * 1.6) cells.push([x, y]); }
      const r = c.RP.rng(24);
      const from = cells.map(() => [r() * 270, r() * 480, r()]);
      c.proc((g, t, w, h) => {
        g.fillStyle = "#0A0A0A"; g.fillRect(0, 0, w, h);
        cells.forEach(([x, y], i) => { const k = ease((t - 0.2 - from[i][2] * 1.6) / 0.8); const px = lerp(from[i][0], x, k), py = lerp(from[i][1], y, k); g.drawImage(thumbs[i % thumbs.length], px, py, ts, ts); });
        if (t > 3.2) { g.fillStyle = `rgba(255,210,31,${Math.min(0.55, (t - 3.2) * 0.8)})`; cells.forEach(([x, y]) => g.fillRect(x, y, ts, ts)); c.ptext(g, "R", 135, 200, { size: 90, color: "#0A0A0A", font: "Horizon" }); }
        if (t > 3.8) c.ptext(g, "همه فروشگاه‌ها، یک خانه", 135, 355, { size: 14, color: "#FFD21F" });
      });
      c.frame({ footT: 4 });
    };
  });

  /* X25 ASCII render pass -> photo */
  def("X25", (c) => {
    const ph = c.S.photo || "shops/s28";
    c.need = [ph];
    c.after = (imgs) => {
      const cols = 54, rows = 96, small = c.coverCanvas(imgs[0], cols, rows), d = small.getContext("2d").getImageData(0, 0, cols, rows).data, ramp = " .:-=+*#%@";
      const lum = []; for (let i = 0; i < cols * rows; i++) lum.push((0.3 * d[i * 4] + 0.59 * d[i * 4 + 1] + 0.11 * d[i * 4 + 2]) / 255);
      c.proc((g, t, w, h) => {
        g.fillStyle = "#050805"; g.fillRect(0, 0, w * 4, h * 4); g.font = "bold 20px 'Courier New'"; g.textBaseline = "top";
        const wave = t < 2.6 ? -1 : (t - 2.6) / 1.4;
        for (let y = 0; y < rows; y++) { if (y / rows < wave) continue; for (let x = 0; x < cols; x++) { const v = lum[y * cols + x], ch = ramp[Math.min(9, Math.floor(v * 10))];
          g.fillStyle = v > 0.6 ? "#FFD21F" : "#9CFF9C"; g.fillText(ch, x * 20, y * 20); } }
      }, { w: 1080, h: 1920, smooth: true });
      const real = c.img(ph, null, { zIndex: 4 }); c.tl.fromTo(real, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.4, ease: "none" }, 2.6);
      real.style.zIndex = 4; c.sc.querySelector("canvas").style.zIndex = 5;
      const tag = c.el("div", "s3-mono", null, "BLACK_FRIDAY.exe", { position: "absolute", top: "420px", left: "90px", fontSize: "56px", color: "#9CFF9C", zIndex: 20, background: "rgba(0,0,0,.7)", padding: "8px 18px" });
      c.fadeUp(tag, 0.3);
      const col = c.col(1080, 1330); const tt = c.title(col, "رویال ویک|[[اجرا شد]]", { px: 130 }); c.rise(tt.words, 4.2);
      c.layer({ zIndex: 12, background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.85))" });
      c.frame({ footT: 4.4 });
    };
  });
})();
