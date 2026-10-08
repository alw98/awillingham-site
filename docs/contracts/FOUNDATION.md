# Application contracts

## Build and ownership

The application lives in `src/Site.Server` and `src/Site.Web`; `Site.slnx`
contains the server and backend tests. Commands are in [README](../../README.md).
SDK and npm versions come from `global.json` and the client `package.json`;
`.node-version`, package families, Docker images and committed locks must agree.
Strict TypeScript includes library declarations; lint covers TSX and fails warnings.

`Scripts/build-site.mjs` installs, checks and builds the client, then restores,
builds, tests and publishes .NET to `.artifacts/site/publish`. Copy the complete
client build into generated server `wwwroot` before evaluating server items.
No dependency trees, worktrees, credentials or generated evidence enter release
inputs. Docker uses an allowlisted context and a nonroot runtime without Node.
Shared ownership for an invoked parallel batch follows [the workflow](../AGENT_WORKFLOW.md).

## Routes and rendering

Public pages: `/`, `/gallery`, `/colors`, `/projecteuler`, `/timer` and
`/gallery/:slug`. The client [catalog](../../src/Site.Web/app/features/gallery/catalog.ts)
owns 15 unique slugs and display metadata. The server has no gallery registry.
Unknown paths show Not Found; there are no old-link aliases or redirects.
Imported images/fonts and their licenses live in `app/assets`; Vite hashes assets.
Sketch behavior follows [the runtime contract](SKETCH_RUNTIME.md).

Router has `ssr: false`, prerenders Home/Gallery and emits `index.html`,
`gallery/index.html`, `__spa-fallback.html` and associated assets. Production
validates those files at startup. Development defaults to ApiOnly at port 5200;
Vite runs at 5300 and proxies `/api`, `/auth`, `/health`. `SITE_DEV_API_TARGET`
overrides that server target. Production/browser checks default to port 5400.

## HTTP and configuration

- Real endpoints take precedence. `/api`, `/auth`, `/health` are reserved
  case-insensitively; their misses return JSON errors, never HTML.
- Serve real files with explicit MIME types. No directory listings or unknown
  file types. GET/HEAD accepting HTML (including absent Accept or `*/*`) receive
  prerendered Home/Gallery or the SPA fallback for other extensionless paths.
- Unknown client paths return HTML/200 and render Not Found. Missing `/assets`
  or paths with a dot in any segment, non-HTML requests and unmatched methods
  return 404. Unsupported methods on mapped endpoints return 405 with Allow.
- HEAD returns GET headers/status without a body. HTML, prerender `.data` and
  unhashed assets use `no-cache`; successful hashed assets use one-year immutable
  caching. Missing files never receive immutable caching.
- `/health/live` and `/health/ready` return `{"status":"healthy"}`/200 or
  `{"status":"unhealthy"}`/503 and `no-store`. Readiness checks integrated assets.
- API errors use `application/problem+json`: `type`, `title`, `status`, path-only
  `instance`, `code`, `traceId`, and validation field arrays when applicable.
  Unexpected errors omit exception details, credentials, query and filesystem paths.
- Static paths stay inside the web root. Trusted forwarded headers require
  explicit proxy IPs; TLS belongs at the edge. No credentials enter `VITE_*`.

## Preferences

`aw.gallery.preferences.v1` stores validated appearance, custom colors and motion.
[preferences.ts](../../src/Site.Web/app/features/themes/preferences.ts) defines
the version and all 26 colors. Unused top-level fields are ignored; theme fields
remain strict. No old-site storage is read or imported.

Missing data loads defaults. Malformed, oversized, unsupported-version or invalid
data stays untouched; temporary changes work until explicit recovery/reset.
Storage denial/quota failures remain recoverable. Colors previews drafts and
bubbles; Save applies/persists, Discard restores active values. CSS tokens and
canvas theme inputs agree. Persist no engines, workers, listeners or handles.
Tests use disposable storage and never clear the user's browser data.

Run the clean release and Chromium suite after product changes; repository checks
cover guidance, task dependencies, pins and build boundaries. Record unavailable
checks in [STATUS](../../STATUS.md); [BACKLOG](../../BACKLOG.md) owns task states.
