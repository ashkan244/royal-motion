// Build a static review gallery (GitHub Pages). Videos stream from the release assets.
// usage: node scripts/gallery.mjs <outDir> <siteDir> <owner/repo> <tag>
import fs from "node:fs";
import path from "node:path";

const [OUT, SITE, REPO, TAG] = process.argv.slice(2);
fs.mkdirSync(path.join(SITE, "img"), { recursive: true });
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
const files = fs.existsSync(OUT) ? walk(OUT) : [];
const vids = files.filter((f) => f.endsWith(".mp4"));
const models = {};
for (const f of vids) {
  const name = path.basename(f, ".mp4");
  const [head, mode, aspect] = name.split("__");
  const id = head.split("-")[0];
  const group = path.basename(path.dirname(path.dirname(f)));
  const poster = f.replace(/\.mp4$/, ".jpg");
  if (fs.existsSync(poster)) fs.copyFileSync(poster, path.join(SITE, "img", `${name}.jpg`));
  (models[head] ||= { id, head, group, items: [] }).items.push({ name, mode, aspect });
}
const order = { "9x16": 0, "4x5": 1, "16x9": 2 };
const url = (n) => `https://github.com/${REPO}/releases/download/${TAG}/${n}.mp4`;
const cards = Object.values(models).sort((a, b) => a.head.localeCompare(b.head)).map((m) => {
  m.items.sort((a, b) => (a.mode > b.mode ? 1 : -1) || order[a.aspect] - order[b.aspect]);
  const first = m.items.find((i) => i.aspect === "9x16") || m.items[0];
  const links = m.items.map((i) => `<a href="${url(i.name)}" download>${i.mode} · ${i.aspect}</a>`).join("");
  return `<article class="card ${m.group}"><video controls preload="none" playsinline poster="img/${first.name}.jpg" src="${url(first.name)}"></video>
<h3>${m.head}</h3><div class="dl">${links}</div></article>`;
}).join("\n");
const html = `<!doctype html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Royal Motion Gallery</title><style>
:root{--bg:#0d1030;--fg:#f6f0e3;--gold:#c9a45c;--card:#161b45}
body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.6 system-ui,Tahoma,sans-serif}
header{padding:28px 16px;text-align:center;border-bottom:1px solid #2a3070}h1{margin:0;color:var(--gold);font-size:22px}
nav{display:flex;gap:8px;justify-content:center;margin-top:12px}nav button{background:var(--card);color:var(--fg);border:1px solid #333a80;border-radius:20px;padding:6px 14px;cursor:pointer}
main{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;padding:16px;max-width:1400px;margin:auto}
.card{background:var(--card);border-radius:12px;overflow:hidden}.card video{width:100%;aspect-ratio:9/16;background:#000;display:block}
.card h3{margin:8px 12px 2px;font-size:14px;direction:ltr;text-align:left}.dl{display:flex;flex-wrap:wrap;gap:6px;padding:6px 12px 12px;direction:ltr}
.dl a{font-size:12px;color:var(--gold);text-decoration:none;border:1px solid #3a417f;border-radius:6px;padding:2px 6px}
.royalweek{background:#1d1a0a}.stories{background:#14120a}.royalweek h3{color:#ffd21f}
</style></head><body><header><h1>گالری موشن‌گرافیک رویال پارس</h1><div>${Object.keys(models).length} مدل · ${vids.length} ویدیو · ${TAG}</div>
<nav><button data-f="all">همه</button><button data-f="brand">برند</button><button data-f="royalweek">رویال ویک</button><button data-f="stories">۱۰۰ استوری</button></nav></header>
<main>${cards}</main><script>document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>document.querySelectorAll('.card').forEach(c=>c.style.display=(b.dataset.f==='all'||c.classList.contains(b.dataset.f))?'':'none'))</script></body></html>`;
fs.writeFileSync(path.join(SITE, "index.html"), html);
console.log(`gallery: ${Object.keys(models).length} models, ${vids.length} videos`);
