# Status

Updated 2026-10-08. [BACKLOG](BACKLOG.md) owns task states.

## Application

- .NET 10 host and React 19/strict TypeScript/Vite client under `src/`.
- Fifteen Canvas2D presets; Matter.js is isolated to Snow Globe. Visible animated
  previews run, hidden/offscreen work pauses, and settings survive SPA navigation.
- Full-page canvases, gear Settings, top About, original Rubik styling and assets.
- 26-color bubble editor, validated current preferences and recoverable storage
  errors. No old-site data imports, URL aliases or redirects.
- Cancellable Euler 1–10 workers. Timer remains an Add Item prototype.
- One solution, clean release pipeline, nonroot container and product CI.
  PostgreSQL, external login and Hetzner hosting are future work.

## Simplification

React owns one catalog and uses each slug as its identity. Removed the migration
catalog, server registry, redirects, old-theme importer, unused saved-preset
format, placeholder feature flags and duplicate dependency manifest. Build versions
come from SDK/package files and locks. Historical task contracts and repeated
migration narratives were removed; unused/duplicate gallery styles were trimmed.
Existing current preferences retain their colors and motion settings.

## Verification

The simplified release passed on isolated port 5503 with disposable storage:

- Clean install, strict types/lint, 44 frontend tests, production client build,
  locked restore, zero-warning .NET build, 32 backend tests and publish.
- All 24 Chromium checks: every sketch, animation/input, session settings,
  themes/recovery, workers/disposal, routes, mobile accessibility and HTTP/cache.
- Twelve desktop/mobile appearance comparisons across six routes. Ten screenshots
  are pixel-identical; Colors has identical layout/styles with randomized bubbles.
- Repository/toolchain checks, five repository-check tests, nine agent TOML files
  and whitespace checks passed. Agent model/capacity policy is unchanged.
- Release source fingerprint still matches after browser checks.

Seeded Canvas2D frames differ from the former random p5 renderer. Intentional
behavior includes elapsed-time updates, reduced-motion views, resource bounds
and accessible dialogs. Extreme configurations and sustained cross-device load
are not exhaustively verified. Hosted CI, other browsers and remote deployment
have not run on this candidate. The Docker daemon was unavailable for the last
container rerun. Build logs and browser evidence stay in ignored `.agent-artifacts`.
