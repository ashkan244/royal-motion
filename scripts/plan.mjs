// Decide which models a workflow run renders. Prints `models=<json array>` for $GITHUB_OUTPUT.
// usage: node scripts/plan.mjs <all|changed|B01,RW02,...>
import fs from "node:fs";
import { execSync } from "node:child_process";

const sel = (process.argv[2] || "changed").trim();
const all = fs.readdirSync("models").filter((d) => fs.existsSync(`models/${d}/meta.json`))
  .map((d) => JSON.parse(fs.readFileSync(`models/${d}/meta.json`, "utf8")).id).sort();
let ids;
if (sel === "all") ids = all;
else if (sel === "changed") {
  let files = [];
  try { files = execSync("git diff --name-only HEAD~1 HEAD", { encoding: "utf8" }).split("\n").filter(Boolean); } catch { files = []; }
  const shared = files.some((f) => /^(lib|brand|scripts)\//.test(f));
  if (shared || !files.length) ids = all;
  else {
    const dirs = new Set(files.filter((f) => f.startsWith("models/")).map((f) => f.split("/")[1]));
    ids = all.filter((id) => [...dirs].some((d) => d.toUpperCase().startsWith(id + "-")));
  }
} else {
  const want = sel.split(/[,\s]+/).map((s) => s.toUpperCase()).filter(Boolean);
  ids = all.filter((id) => want.some((w) => id === w || (w.endsWith("*") && id.startsWith(w.slice(0, -1)))));
}
console.log(`models=${JSON.stringify(ids)}`);
