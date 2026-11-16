# Royal Motion

Intro / outro motion graphics for **Royal Pars Shopping Center** (Ahvaz) and the **Royal Week** campaign,
written as HTML + GSAP and rendered with [HyperFrames](https://github.com/heygen-com/hyperframes)
on GitHub Actions.

- `models/<ID>-<slug>/` — one parametric design: `meta.json` (modes, durations, sound design), `scene.html`, `scene.css`, `scene.js`
- `lib/` — shared runtime (logo, Persian-safe word animation, hexagon helpers, seeded random)
- `scripts/build.mjs` — expands every model × mode (intro/outro) × aspect (9:16, 4:5, 16:9) into a standalone composition
- `scripts/synth.py` — synthesises the whole sound kit (no samples, nothing to license)
- `scripts/render.mjs` — renders, mixes audio, writes contact sheets
- `.github/workflows/render.yml` — matrix render, one job per model; optional Release + Pages gallery

Run: **Actions → render → Run workflow** (models: `all`, `RW*`, `B01,RW02` …).

Persian text is animated by whole words only — splitting into letters would break letter joining.

Brand assets © Royal Pars Shopping Center. Commercial fonts are stored encrypted (`assets/fonts-private.tgz.gpg`);
Vazirmatn is OFL. Code: MIT.
