// Build every model × mode × aspect into a standalone HyperFrames composition.
// usage: node scripts/build.mjs [--only RW01,RW02|all] [--out dist] [--aspects 9x16,16x9]
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), [])
);
const ROOT = process.cwd();
const OUT = path.resolve(args.out || "dist");
const ONLY = !args.only || args.only === "all" ? null : new Set(args.only.split(",").map((s) => s.trim().toUpperCase()));
const ONLY_ASPECTS = args.aspects ? new Set(args.aspects.split(",")) : null;
const ASPECTS = { "9x16": [1080, 1920], "4x5": [1080, 1350], "16x9": [1920, 1080], "1x1": [1080, 1080] };
const FPS = 30;

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");
const brand = JSON.parse(read("brand/brand.json"));
const opt = (p) => (fs.existsSync(path.join(ROOT, p)) ? "\n" + read(p) : "");
const LIB_CSS = read("lib/rp.css") + "\n" + read("lib/brand.css") + opt("lib/layout.css");
const LIB_JS = read("lib/rp.js") + "\n" + read("lib/brand.js") + opt("lib/layout.js");

// audio presets: meta.audio = {preset, hit:[introHit, outroHit], cta, extra:{intro:[], outro:[]}}
const PRESETS = {
  lux: { bed: ["lux_pad", 0.5], hit: [["riser_soft", -1.8, 0.4], ["shimmer", 0, 0.6], ["impact_soft", 0.05, 0.65], ["whoosh_soft", 0.3, 0.3]] },
  bright: { bed: ["bright_pad", 0.55], hit: [["whoosh", -0.45, 0.45], ["impact_soft", 0, 0.6], ["shimmer", 0.05, 0.45]] },
  soft: { bed: ["lux_pad", 0.55], hit: [["whoosh_soft", -0.6, 0.35], ["shimmer_low", 0, 0.5]] },
  punch: { bed: ["bright_pad", 0.5], hit: [["whoosh", -0.4, 0.55], ["impact", 0, 0.7], ["shimmer", 0.05, 0.4]] },
};
const CTA_CUES = [["whoosh_soft", 0, 0.4], ["pop_soft", 0.85, 0.35], ["pop_soft", 1.2, 0.3]];
function expandAudio(a, mode, duration) {
  if (!a || !a.preset) return (a && (a[mode] || a.all)) || null;
  const p = PRESETS[a.preset];
  const hit = Array.isArray(a.hit) ? a.hit[mode === "outro" ? 1 : 0] ?? a.hit[0] : a.hit;
  const cues = [];
  if (hit != null) for (const [n, dt, g] of p.hit) if (hit + dt >= 0) cues.push([n, +(hit + dt).toFixed(2), g]);
  if (mode === "outro") {
    const cta = a.cta ?? Math.min(Math.max((hit ?? 2) + 1.2, 2.2), duration - 4.2);
    for (const [n, dt, g] of CTA_CUES) cues.push([n, +(cta + dt).toFixed(2), g]);
  }
  for (const c of (a.extra && a.extra[mode]) || []) cues.push(c);
  return { bed: a.bed || p.bed, cues };
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, "v"), { recursive: true });

// assets are shared by every composition: dist/assets/...
for (const sub of ["fonts", "private", "vendor", "audio", "img"]) {
  const src = path.join(ROOT, "assets", sub);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(OUT, "assets", sub), { recursive: true });
}

const manifest = [];
const dirs = fs.readdirSync(path.join(ROOT, "models")).filter((d) => fs.existsSync(path.join(ROOT, "models", d, "meta.json"))).sort();
for (const d of dirs) {
  const base = path.join("models", d);
  const meta = JSON.parse(read(path.join(base, "meta.json")));
  if (ONLY && !ONLY.has(meta.id.toUpperCase())) continue;
  const html = fs.existsSync(path.join(ROOT, base, "scene.html")) ? read(path.join(base, "scene.html")) : "";
  const css = fs.existsSync(path.join(ROOT, base, "scene.css")) ? read(path.join(base, "scene.css")) : "";
  const js = read(path.join(base, "scene.js"));
  const aspects = (meta.aspects || ["9x16", "4x5", "16x9"]).filter((a) => !ONLY_ASPECTS || ONLY_ASPECTS.has(a));
  let variants = meta.variants || [{}];
  if (meta.variantsFrom && fs.existsSync(path.join(ROOT, meta.variantsFrom))) {
    const rows = JSON.parse(read(meta.variantsFrom));
    if (Array.isArray(rows) && rows.length) variants = rows;
  }
  const extraScripts = (meta.scripts || []).map((s) => `<script src="../assets/vendor/${s}"></script>`).join(" ");
  for (const [mode, duration] of Object.entries(meta.modes)) {
    for (const aspect of aspects) {
      for (const variant of variants) {
        const [W, H] = ASPECTS[aspect];
        const vtag = variant.tag ? `-${variant.tag}` : "";
        const name = `${meta.id}-${meta.slug}${vtag}__${mode}__${aspect}`;
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const u = Math.min(W, H) / 100, L = Math.max(W, H) / 100;
        const config = {
          id, name, model: meta.id, slug: meta.slug, group: meta.group, theme: meta.theme,
          mode, aspect, W, H, fps: FPS, duration,
          texts: { ...brand.texts, ...(meta.texts || {}), ...(variant.texts || {}) },
          colors: brand.colors, params: { ...(meta.params || {}), ...(variant.params || {}) },
        };
        const doc = `<!doctype html>
<html lang="fa">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<title>${name}</title>
<script src="../assets/vendor/gsap.min.js"></script>
${extraScripts}
<style>
:root { --W: ${W}px; --H: ${H}px; --u: ${u}px; --L: ${L}px; }
${LIB_CSS}
${css}
${meta.alpha ? "html, body, #root { background: transparent !important; }" : ""}
</style>
</head>
<body>
<div id="root" data-composition-id="${id}" data-start="0" data-duration="${duration}" data-width="${W}" data-height="${H}" data-fps="${FPS}" class="theme-${meta.theme} mode-${mode} asp-${aspect}${RP_orient(W, H)}">
<section id="scene" class="clip" data-start="0" data-duration="${duration}" data-track-index="0">
${html}
</section>
</div>
<script type="application/json" id="rp-config">${JSON.stringify(config).replace(/</g, "\\u003c")}</script>
<script>
${LIB_JS}
</script>
<script>
${js}
</script>
</body>
</html>
`;
        fs.writeFileSync(path.join(OUT, "v", `${name}.html`), doc);
        manifest.push({
          name, model: meta.id, slug: meta.slug, title: meta.title, group: meta.group, mode, aspect, W, H, duration,
          alpha: !!meta.alpha, audio: expandAudio(meta.audio, mode, duration),
        });
      }
    }
  }
}
function RP_orient(W, H) { return H > W * 1.1 ? " portrait" : W > H * 1.1 ? " landscape" : " squareish"; }

// HyperFrames treats the folder as a project: give it a root index.html (first variant)
if (manifest.length) {
  const first = fs.readFileSync(path.join(OUT, "v", `${manifest[0].name}.html`), "utf8");
  fs.writeFileSync(path.join(OUT, "index.html"), first.replaceAll("../assets/", "assets/"));
}
fs.writeFileSync(path.join(OUT, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`built ${manifest.length} compositions from ${new Set(manifest.map((m) => m.model)).size} models -> ${OUT}`);
