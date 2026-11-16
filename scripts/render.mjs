// Render every composition listed in dist/manifest.json with HyperFrames,
// then mix the synthesised sound design and make a contact sheet.
// usage: node scripts/render.mjs [--quality standard] [--workers auto]
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = Object.fromEntries(
  process.argv.slice(2).reduce((a, v, i, arr) => (v.startsWith("--") ? [...a, [v.slice(2), arr[i + 1]]] : a), [])
);
const QUALITY = args.quality || "standard";
const DIST = path.resolve("dist");
const OUT = path.resolve(args.out || "out");
const AUDIO = path.resolve("assets/audio");
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, "manifest.json"), "utf8"));
fs.mkdirSync(path.join(OUT, "sheets"), { recursive: true });
fs.mkdirSync(path.join(OUT, "_silent"), { recursive: true });

const run = (cmd, a, opts = {}) => {
  const r = spawnSync(cmd, a, { stdio: "inherit", ...opts });
  return r.status === 0;
};
const report = [];
// show the full lint report once per job (render continues on lint issues)
run("npx", ["hyperframes", "lint"], { cwd: DIST });
for (const v of manifest) {
  const t0 = Date.now();
  const dir = path.join(OUT, v.group, `${v.model}-${v.slug}`);
  fs.mkdirSync(dir, { recursive: true });
  const silent = path.join(OUT, "_silent", `${v.name}.mp4`);
  const final = path.join(dir, `${v.name}.mp4`);
  console.log(`\n▶ ${v.name}  (${v.W}x${v.H}, ${v.duration}s)`);
  const renderArgs = ["hyperframes", "render", "--composition", `v/${v.name}.html`, "--output", silent,
    "--quality", QUALITY, "--fps", "30"];
  if (args.workers) renderArgs.push("--workers", args.workers);
  let ok = run("npx", renderArgs, { cwd: DIST });
  if (ok) ok = run("python3", [path.resolve("scripts/mix.py"), silent, final, String(v.duration), JSON.stringify(v.audio || null), AUDIO]);
  if (ok && v.alpha) {
    run("npx", ["hyperframes", "render", "--composition", `v/${v.name}.html`, "--format", "mov", "--output", final.replace(/\.mp4$/, ".mov"), "--fps", "30"], { cwd: DIST });
    run("npx", ["hyperframes", "render", "--composition", `v/${v.name}.html`, "--format", "webm", "--output", final.replace(/\.mp4$/, ".webm"), "--fps", "30"], { cwd: DIST });
  }
  if (ok) {
    // 6-frame contact sheet + poster (last-but-one second)
    const n = 6, step = v.duration / n;
    const sel = Array.from({ length: n }, (_, i) => `lt(prev_pts*TB\\,${(step * (i + 0.5)).toFixed(2)})*gte(pts*TB\\,${(step * (i + 0.5)).toFixed(2)})`).join("+");
    const sc = v.W > v.H ? 480 : 270;
    run("ffmpeg", ["-loglevel", "error", "-y", "-i", final, "-vf", `select='${sel}',scale=${sc}:-1,tile=${n}x1`, "-frames:v", "1", "-q:v", "4", path.join(OUT, "sheets", `${v.name}.jpg`)]);
    run("ffmpeg", ["-loglevel", "error", "-y", "-ss", String(Math.max(0, v.duration - 1.2)), "-i", final, "-frames:v", "1", "-vf", "scale=540:-1", "-q:v", "3", path.join(dir, `${v.name}.jpg`)]);
  }
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  report.push({ name: v.name, ok, secs: +secs });
  console.log(`${ok ? "✓" : "✗"} ${v.name} in ${secs}s`);
}
fs.rmSync(path.join(OUT, "_silent"), { recursive: true, force: true });
fs.writeFileSync(path.join(OUT, `report-${manifest[0]?.model || "x"}.json`), JSON.stringify(report, null, 1));
const failed = report.filter((r) => !r.ok);
console.log(`\n${report.length - failed.length}/${report.length} rendered`);
if (failed.length) process.exit(1);
