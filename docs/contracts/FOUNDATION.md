# Foundation contract, revision 2

Initially frozen for M1-01; amended during sequential M1 implementation on
2026-10-07 (America/Chicago), from source
`07db3fe363465e3c9c842ca8b9857cbd9c517f63`. The primary agent owns this contract.
The [architecture](../architecture.md) supplies the overall direction;
[BACKLOG](../../BACKLOG.md) alone owns states. Changes to this contract require
one coordinator to revise affected lane records before implementation proceeds.
This remains the foundation specification; STATUS records current product evidence.
Retirement amendment, 2026-10-08: the user authorized removal of legacy source
and AWS hooks after local parity acceptance. Current operational rules below
reflect that removal; earlier M1 task records remain historical evidence.

## Toolchain and reproducibility

[The version manifest](foundation-toolchain.json) is the exact initial dependency
set. Use .NET SDK **10.0.401**, `net10.0`/C# 14, ASP.NET Core runtime **10.0.12**,
Node **24.21.0 LTS**, npm **11.19.0**. React/DOM/types are **19.3.0**; Router,
`@react-router/dev` and `@react-router/node` are **8.4.0**; Vite **8.3.3**;
TypeScript **6.0.3**; Vitest **5.0.3**; ESLint **10.12.0** with flat configuration.
TypeScript 7 exceeds the selected typescript-eslint peer range. Clean installation
showed ESLint 9 is unsupported, so revision 2 uses ESLint 10 and omits the
incompatible jsx-a11y plugin. Browser accessibility checks use axe-core instead.
`isbot` **5.2.2** is explicitly pinned for Router's build-time renderer, preventing
the CLI from modifying dependencies during type generation. No
`@types/react-router-dom` package belongs in the new app.

Verified sources: [.NET downloads](https://dotnet.microsoft.com/en-us/download/dotnet/10.0),
[.NET release metadata](https://builds.dotnet.microsoft.com/dotnet/release-metadata/10.0/releases.json),
[Node release metadata](https://nodejs.org/dist/index.json),
[npm registry metadata](https://registry.npmjs.org/), and
[NuGet metadata](https://api.nuget.org/v3/index.json). Direct metadata checks on
the freeze date establish release availability, engines, and peers; they do not
replace clean-install/build/test evidence in M1-02/M1-03.

Install the exact SDK from Microsoft's platform installer and the exact Node
distribution from nodejs.org; verify Node's archive against its `SHASUMS256.txt`.
The coordinator introduces root `global.json` (`version: 10.0.401`,
`rollForward: disable`, `allowPrerelease: false`), `.node-version` (`24.21.0`),
and `.npmrc` (`save-exact=true`, `engine-strict=true`) before lane implementation.
Do not change the user's global SDK/Node installation. The root pin governs
`Site.slnx` and its server/test projects.

New `src/Site.Web/package.json` uses `type: module`, exact manifest versions,
`engines.node: 24.21.0`, `engines.npm: 11.19.0`, and
`packageManager: npm@11.19.0`. One coordinator generates and owns its
`package-lock.json` v3. Use `npm ci`, with development dependencies and no legacy
peer workaround. Revision 2 omits jest-dom: its Vitest augmentation disagrees
with Vitest 5; Testing Library queries and native assertions retain strict library
checking. C# tests use xunit.v3 4.0.1 and Microsoft.AspNetCore.Mvc.Testing 10.0.12,
with Microsoft.Testing.Platform selected in global.json. Invoke `dotnet test
--project ...`; no legacy test SDK/adapter is needed. C# projects use committed
`packages.lock.json` files; CI uses `dotnet restore --locked-mode`.
The client owns one npm lockfile. Matter.js is pinned for Snow Globe; p5 is not
a runtime dependency. EF, Npgsql, auth handlers and API generators are introduced
only with the future feature that needs them.

## Layout and build isolation

| Path | Responsibility and owner |
| --- | --- |
| `src/Site.Server/**` | M1-02: `Site.Server` namespace, Minimal API composition, options, HTTP policies, testable public `Program` entry |
| `tests/Site.Server.Tests/**` | M1-02: `Site.Server.Tests`, xUnit/WebApplicationFactory; own `bin`/`obj` |
| `src/Site.Web/app/**` | M1-03: Router root/routes, `features/{gallery,themes,timer,euler}`, shared UI/tokens/storage validation |
| `src/Site.Web/public/**` | M1-03: approved public assets; no secrets or legacy configuration |
| `src/Site.Web/{package.json,package-lock.json,.npmrc,react-router.config.ts,vite.config.ts,tsconfig.json,eslint.config.js,vitest.config.ts}` | Coordinator: freeze before worktree creation; frontend owner proposes necessary changes |
| `src/Site.Web/build/**`, `.react-router/**`, `node_modules/**` | Generated in that client checkout; ignored |
| `src/Site.Server/wwwroot/**` | Generated production client copy; ignored; coordinator/M1-04 only |
| `tests/browser/**`, `src/Site.Web/playwright.config.ts` | Coordinator/M1-04: browser scenarios, dependency resolution from new client |
| `Site.slnx`, root pins/scripts, `.github/workflows/**`, `Dockerfile`, `.dockerignore`, `.artifacts/**` | Coordinator: solution, reproducible build/publish/CI/image and isolated evidence |
| `docs/contracts/**`, `docs/tasks/**`, planning documents and `.gitignore` | Coordinator: shared contracts, tracking, integration and legacy compatibility |

`Site.slnx` is the single solution and contains only the current server and tests.
No root project remains. The server must not glob sibling client sources,
worktrees, evidence or arbitrary repository files. Use explicit project/solution
paths in automation. Generated client assets and release output stay ignored.

## Public pages, presets and assets

Keep `/`, `/gallery`, `/colors`, `/projecteuler`, and `/timer` as public URLs and
navigation labels Home, Gallery, Theme, Project Euler, Timer. M1 includes real
navigation and honest feature placeholders, with no live sketch engines, theme
editor, countdown, or Euler execution claims. `/gallery/:slug` uses the fixed
slugs below. Unknown slugs and paths show an accessible Not Found page with Home
and Gallery links; they no longer silently redirect to Home.

[The ordered gallery inventory](legacy-gallery.json) freezes all **15 active
presets and 14 distinct legacy sketch URLs**. `sketchId` identifies an engine
family, `presetId` identifies a default independently of display labels and
configuration schema version, and `slug` identifies its public page. IDs/slugs
are immutable once published. New labels can change without breaking links.

| Legacy path under `/gallery/` | New path under `/gallery/` | Preset ID |
| --- | --- | --- |
| `Tetris` | `tetris` | `tetris.classic` |
| `StainedGlass` | `stained-glass` | `stained-glass.default` |
| `SnowGlobe` | `snow-globe` | `snow-globe.default` |
| `SkyscrapersImproved` | `skyscrapers` | `skyscrapers.improved` |
| `ParticleField` | `particle-field` | `particle-field.particles` |
| `Fireworks` | `fireworks` | `fireworks.default` |
| `TimesTables` (first registration) | `times-tables-animated` | `times-tables.animated` |
| `AgateSimpleEdgeDetection` | `edge-detection-agate` | `edge-detection.agate` |
| `SimpleSimpleEdgeDetection` | `edge-detection` | `edge-detection.default` |
| `FlowField` | `flow-field` | `particle-field.flow` |
| `DrawnField` | `drawn-field` | `particle-field.drawn` |
| `TimesTables` (second registration) | `times-tables-static` | `times-tables.static` |
| `SinSums` | `sine-sums` | `sine-sums.harmonic` |
| `SinSums2` | `sine-sums-mixed` | `sine-sums.mixed` |
| `BouncyDVD` | `bouncy-dvd` | `bouncy-dvd.default` |

The first Times Tables registration has 100 points and animation rate 0.01; the
second has 10 points and rate 0. Existing links from either preview resolve to
the first equal-ranked route in source order. Preserve that destination:
`/gallery/TimesTables` maps only to `times-tables-animated`. Expose the static
preset through its own new link. This is source-derived; the real-browser alias
check remains M1-04 acceptance. Bouncy DVD **is registered in the current source**,
despite earlier prose saying otherwise, and belongs in parity work under M3-03.
Canny, Purgatory and original Skyscrapers remain inactive under EXP-01.

M1-03 implements client aliases with replacement navigation; M1-04 adds server
308 redirects for the exact legacy paths, preserving query strings. Compare the
legacy path case-sensitively before redirecting, to avoid redirect loops for
`Tetris`/`tetris`. Canonical public routes have no trailing slash (except `/`);
redirect known trailing-slash variants to their canonical path. Do not reinterpret
arbitrary case variants, unregistered experiments, or user-supplied return URLs.

Required image/font assets are owned by `src/Site.Web/app/assets`, with Rubik's
license retained alongside its fonts. Imported assets use Vite hashing. Legacy
shell/bundles, unused icons/images, experimental shaders and root `wwwroot` were
removed under OPS-03. The 15-preset compatibility inventory retains stable IDs,
slugs and old URL names; obsolete source paths/store symbols are removed.
Inactive experiment source remains recoverable from Git history for EXP-01.

## Static output and HTTP contract

Use Router framework mode with `ssr: false` and `prerender: ['/', '/gallery']`.
Runtime rendering stays in the browser; build-time rendering is still required.
Follow the [Router prerender contract](https://reactrouter.com/how-to/pre-rendering)
and [SPA restrictions](https://reactrouter.com/how-to/spa): root/imports must be
SSR-safe, and server actions/headers are absent. No server loader is placed on a
route outside the prerender set; browser-owned behavior uses client loaders.
The build must output `build/client/index.html`, `gallery/index.html`, and
`__spa-fallback.html`; verify these names against the pinned Router build. Keep
any emitted `.data` files and `/assets/**` bytes intact when copying the client.
No Node renderer process is deployed.

M1-04 copies only `build/client/**` into a clean server `wwwroot` **before**
`dotnet publish`. API-only server development/test runs do not need these files.
Integrated production validates all three HTML files at startup and fails clearly
if assets are missing; readiness must never report a half-packaged application.

Routing order in the integrated host:

1. Serve `/health/live` and `/health/ready` (GET/HEAD); map actual endpoints first.
2. Reserve segment prefixes `/api`, `/auth`, `/health`, `/assets`, `/images`,
   `/shaders`, `/css`, `/js` case-insensitively. Unknown reserved requests never
   enter the HTML fallback. Auth remains unavailable until AUTH-01; its future
   callbacks must use `/auth/callback/{provider}` inside that reserved segment.
3. Apply exact legacy/public canonical redirects, then serve existing static files
   with explicit MIME types. Do not serve unknown file types or directory listings.
4. For GET/HEAD HTML navigation (`Accept: text/html` or `*/*`), serve prerendered
   Home/Gallery when matched, otherwise the SPA fallback for extensionless paths
   outside reserved segments. An unknown client URL returns fallback HTML/200
   and renders Not Found in the client (an intentional SPA soft 404).
5. Missing file-like paths (a dot in any path segment), non-navigation requests,
   and unmatched non-GET/HEAD requests return 404; never HTML fallback. Correctly
   mapped endpoints return 405 for unsupported methods. A HEAD has GET's status
   and headers but no body. Static path resolution cannot escape the web root.

`/api` and `/auth` misses always use `application/problem+json`, even when HTML
was requested. Use RFC 9457/ASP.NET Core ProblemDetails with `type: about:blank`,
standard HTTP `title`, numeric `status`, `instance` containing only the path,
and extension fields `code` and `traceId`. Codes initially are `not_found`,
`method_not_allowed`, `validation_failed`, `internal_error`, and (future)
`unauthenticated`/`forbidden`. Validation responses use 400 and an `errors`
property mapping field paths to arrays of safe messages. Unexpected failures
use 500 with no exception message, stack, credentials, or filesystem paths.
Use request-abort cancellation, structured server logs, and no response queries.
Test-only failing endpoints are added by the test factory, never production code.
No business API or dummy generated client is needed for M1.

Health success is JSON `{"status":"healthy"}` with status 200, failure is JSON
`{"status":"unhealthy"}` with status 503; both are `Cache-Control: no-store`.
Liveness tests process response; readiness checks only enabled dependencies and,
in integrated mode, packaged assets. No database/provider calls when disabled.
Unknown `/health/*` returns JSON 404. Other missing assets return bodyless 404.
All API/problem responses use `no-store`; HTML, prerender `.data`, and unhashed
public assets use `no-cache`; Vite content-hashed `/assets/*` use
`public, max-age=31536000, immutable`. Never cache an error as an immutable asset.

## Development, configuration and future services

| Resource | Assigned endpoint |
| --- | --- |
| Existing app | `https://localhost:7100` (unchanged) |
| M1-02 server lane | `http://127.0.0.1:5210`, API-only |
| M1-03 client lane | `http://127.0.0.1:5310`, `strictPort: true` |
| Integrated dev server/client | `http://127.0.0.1:5200` / `http://127.0.0.1:5300` |
| QA production artifact | Container HTTP 8080, published only to `127.0.0.1:5400` |

Vite proxies `/api`, `/health`, and `/auth` to the assigned backend; the coordinator
sets a server-only `SITE_DEV_API_TARGET` for each lane. Browser fetches are relative
same-origin URLs. No CORS policy or credential in `VITE_*`. Loopback development
uses HTTP with no 443 redirect; later OAuth dev HTTPS is AUTH-01's responsibility.
Public configuration is an explicit allowlist of genuinely needed values; M1
ships static false flags for unavailable account/sync features and no config API.
Never serialize bound server options into browser assets.

M1-02 binds/validates `Site:ClientMode` (`ApiOnly` or `Integrated`),
`Site:ClientAssetsPath` (default `wwwroot`, relative to and contained in content root),
`Features:Accounts:Enabled` and `Features:DataSync:Enabled` (default false).
Development/Testing default to ApiOnly; Production defaults to Integrated.
Reject unknown modes, missing integrated assets, and attempts to enable
unimplemented account/sync features with a clear startup diagnostic. Disabled
features do not register EF/provider clients or demand connection strings/secrets.
M1-04 adds trusted proxy options and production tests. Use only explicit trusted
proxy addresses/networks, never trust forwarded headers from arbitrary clients.
Production TLS/HSTS belongs at the trusted Caddy edge; the host listens on 8080.
No cloud host, TLS certificate, or provider account is provisioned in M1.

Future resources carry server-generated UUID `userId` ownership, never browser
keys, emails or provider subjects as ownership IDs. DATA-01 owns PostgreSQL/EF
Core 10/Npgsql and the single migration sequence. AUTH-01 owns server-handled
OIDC authorization code/PKCE (or provider-supported OAuth handler), HttpOnly
secure cookies, protected Data Protection keys, CSRF, session expiry, logout,
and unique `(provider, subject)` account mapping. No email auto-linking.
DATA-02 owns explicit local-to-account import, concurrency, isolation and cache
clearing on account switch. Anonymous storage remains usable with all disabled.
HOST-01 owns Compose/Caddy/secrets/runbook and backup choices; later release
authorization is separate from local M1 packaging.

When a real API is added, its C# owner emits versioned OpenAPI during build; the
coordinator freezes the document and pins `openapi-typescript`/`openapi-fetch`,
generating `app/generated/api.d.ts` with a repeatable script. CI regenerates and
requires no diff. Handwritten duplicate DTOs and hand edits to generated files
are disallowed; generation never substitutes for runtime validation/auth.

## Theme and browser-only lifecycle

CSS Modules consume shared custom properties. The immutable `ThemeColors` shape
preserves all legacy color fields, so import does not collapse button states:
`backgroundColor.{primary,secondary,tertiary,quaternary}`,
`textColor.{primary,secondary}`, `accentColor.{primary,secondary}`, and
`button.{backgroundColor,textColor,outlineColor,hoverBackgroundColor,hoverTextColor,
hoverOutlineColor,pressBackgroundColor,pressTextColor,pressOutlineColor}` each
with `{primary,secondary}`. These are exactly 26 color leaves, no arbitrary keys.

CSS names flatten these paths to kebab case with `--color-`, for example
`backgroundColor.primary` becomes `--color-background-primary`, and
`button.hoverTextColor.secondary` becomes `--color-button-hover-text-secondary`.
The following defaults restore the original palette families at the user's
request on 2026-10-08; default text/button contrast is retained. Storage/schema
and toolchain versions are unchanged.

| Token group | Dark | Light |
| --- | --- | --- |
| background primary/secondary | `#06121a` / `#122835` | `#faefdf` / `#d4d4d4` |
| background tertiary/quaternary | `#111111` / `#262626` | `#f1f1f1` / `#b9b9b9` |
| text | `#eff0fe` / `#d0d1fd` | `#001416` / `#020644` |
| accent | `#1dccd8` / `#d0d1fd` | `#06127c` / `#06127c` |
| button background | `#1f3f51` / `#262626` | `#faefdf` / `#0e1fb5` |
| button text | `#caf9ff` / `#f1f1f1` | `#463a21` / `#eff0fe` |
| button outline | `#77c1ed` / `none` | `#06127c` / `#1f3f51` |
| button hover background | `#075c61` / `#262626` | `#f1d08e` / `#262626` |
| button hover text | `#caf9ff` / `#f1f1f1` | `#2d2513` / `#f1f1f1` |
| button hover outline | `#77c1ed` / `#f1f1f1` | `#06127c` / `#f1f1f1` |
| button press background | `#f1f1f1` / `#262626` | `#faefdf` / `#262626` |
| button press text | `#262626` / `#f1f1f1` | `#463a21` / `#f1f1f1` |
| button press outline | `#262626` / `#f1f1f1` | `#06127c` / `#f1f1f1` |

Additional tokens: `--focus-ring` derives from primary accent;
`--font-body: Rubik, system-ui, sans-serif`; `--font-code: ui-monospace, monospace`;
spacing `--space-{1,2,3,4,6,8}` = `0.25,0.5,0.75,1,1.5,2rem`;
`--radius-control: 10rem`; `--motion-duration: 200ms` (0ms under reduced motion).
Rubik is vendored with its SIL license, also included in published output.
The compact original header/logo, centered home introduction and gear animation
replace the earlier editorial redesign. Gallery metadata/routes remain intact.

The Colors page now implements all 26 draft color controls, original palette
families/shades, custom hex/rgb/rgba values and transparent outlines. Its bubbles
preview draft colors immediately; Save applies/persists a validated custom theme,
Discard restores the active palette. Editing alone does not overwrite preferences.
Malformed/denied storage retains the same recovery and temporary-only behavior.
The decorative canvas mounts only in an effect, caps DPR at 2 and particles at
120, uses elapsed time, pauses for reduced motion/hidden documents and removes
its frame and listeners on unmount. It does not replace the future M2 runtime.
Legacy theme import and canvas theme inputs remain M3-05 work.

Prerender uses deterministic dark defaults. Preferences and media queries apply
after browser mount; no `window`, `document`, `localStorage`, p5 or Matter.js is
accessed during import/render on the build server. A browser storage service is
injected into load/save functions, catches access/quota failures, and continues
in memory with a visible recoverable status. Do not write defaults before reading.

M1 reserves a lazy sketch-module boundary under `features/gallery/sketches` and
renders placeholders only. M2-01 defines the detailed runtime interface. Each
future factory receives validated configuration, explicit theme, seed and clock,
and creates fresh mutable engine state for each preview/full page. The host owns
mount/update/resize/DPR/visibility/focus/pause/error/dispose; render-time frames
stay out of Zustand and persisted JSON. No singleton mutable defaults or p5
objects are serialized. The Router entry bootstraps the current application;
the legacy `window.InitApp()` shell has been retired.

## Persisted data, version 1

Three origin-local keys, each with a strict `{schemaVersion: 1, ...}` envelope:
`aw.gallery.preferences.v1`, `aw.gallery.schedules.v1`, `aw.gallery.presets.v1`.
Missing data loads defaults in memory. Parse errors, unknown versions, invalid
fields or oversized payloads never crash initialization or overwrite source
bytes. Expose recover/export/reset actions; reset requires an explicit action.
New valid data has strict keys and no functions, class instances, mutable engine
state or arbitrary prototype assignment. Dates are integer UTC epoch milliseconds;
IDs are UUIDs generated at creation/import; all numbers must be finite/safe.

| Envelope | Exact fields beyond `schemaVersion` |
| --- | --- |
| Preferences | `themeMode: 'dark' \| 'light' \| 'system' \| 'custom'`; `customTheme: ThemeColors \| null`; `motion: 'system' \| 'reduced'`; `legacyImport: {theme: 'pending' \| 'imported' \| 'declined', timer: 'pending' \| 'imported' \| 'declined'}` |
| Schedules | `schedules: Schedule[]`; `selectedScheduleId: UUID \| null`; `run: TimerRun \| null` |
| Presets | `presets: SavedPreset[]` |

Preferences default to dark/null/system with both imports pending; custom mode
requires non-null colors. Color values accept `#RGB`, `#RGBA`, `#RRGGBB`,
`#RRGGBBAA`, or numeric comma-form `rgb(r,g,b)`/`rgba(r,g,b,a)` (channels 0..255,
alpha 0..1). Outline fields additionally accept `none`, rendered as transparent.
No URLs, CSS variables or arbitrary CSS expressions. Unsupported old color text
remains recoverable in the untouched legacy value. Preference raw input <=256 KiB.

`Schedule = {id: UUID, name: string, items: {id: UUID, name: string,
durationMs: integer}[]}`. Names are nonblank, 1..120 characters, kept verbatim;
durations are 1000..86400000 ms, whole milliseconds. Up to 100 schedules and 200
items per schedule; an empty item list is allowed but cannot run. Item IDs are
unique within a schedule; schedule IDs are unique in the envelope. Selected ID
must exist or be null. Raw schedule input <=1 MiB.

`TimerRun = {scheduleId: UUID, status: 'idle' | 'running' | 'paused' | 'completed',
itemIndex: integer, deadlineEpochMs: integer | null, remainingMs: integer | null}`.
Schedule must exist. Idle/paused uses a valid item index, null deadline, remaining
0..that item's duration; running uses a valid index, a deadline and null remaining;
completed uses index equal to item count, null deadline, remaining 0. One run at
most. Editing/deleting a running schedule requires an explicit stop/reset before
saving. M3-06 implements timing from deadlines, including reload/background
catch-up across multiple items, bounded by the finite schedule. Never persist
interval handles, derive time from callback counts, or invent a running legacy
timer. Clock changes get a visible recovery/reset path.

`SavedPreset = {id: UUID, sketchId: string, presetId: string, name: string,
configVersion: positive integer, config: JsonObject, seed: uint32}`. IDs are unique;
names have the same limits; sketch/preset IDs match registered definitions.
Up to 200 saved presets, raw envelope <=1 MiB, each config <=64 KiB and nesting
depth <=16. Only finite JSON values; reject `__proto__`, `prototype`, `constructor`
keys recursively. Each definition must validate `config` against its own versioned
schema before use. M2-01 owns those algorithm-specific fields; an unknown
definition/version is retained for export and never instantiated. No saved presets
exist in the inspected legacy app, so there is no legacy preset auto-import.

Legacy migration is an **explicit local import** at M3-05/M3-06, offered only when
the corresponding new data is absent and its import decision is pending. M1 does
not consume, rewrite or delete `ThemeStore`/`TimerStore` values. Import parses only
allowlisted own fields, validates the entire proposed result, previews it, and
writes a new key before recording success. Failure/cancellation/quota errors leave
the old value and decision recoverable; no repeated overwrite of existing new data.

- `ThemeStore` currently contains `theme`, `colorPageThemeStore.theme`,
  `usingLightTheme`, `usingDefaultTheme`. Import actual `theme` as custom colors;
  do not infer colors from the flags (initial dark theme has `usingLightTheme=true`).
  The draft color-page object is not the saved active theme. Ignore other fields;
  never spread the legacy object into live state. Retain its original bytes.
- `TimerStore` contains `timerItems: {name,duration}[]` (duration in milliseconds)
  and `currentItem` (zero-based). Import a nonempty valid list into one schedule
  named `Imported schedule`, with fresh IDs; preserve a valid current index as
  idle, with full item duration. An empty list imports to an empty envelope. Invalid
  durations/names/index yield a recovery choice, without truncation or coercion.
  No countdown existed, so no deadline can be inferred. Retain original bytes.

M1-03 implements safe preference loading and theme selection, with fixtures
for missing/malformed/unknown-version/access-denied storage. UI-01 subsequently implements draft color editing and bubbles at the user's request;
legacy imports, sketch theme inputs, timers and saved presets remain later work.

Subsequent original-parity work implements sketch runtime revision 3, canvas
theme inputs and explicit ThemeStore import. Colors previews a validated legacy
theme and offers import only when no new custom theme exists and the decision
is pending. A single new preference write records colors and the decision;
failed writes retain the pending choice. Original bytes are never changed.
Timers and saved-preset persistence remain later work. See STATUS for evidence.

## Lane acceptance and integration order

Detailed assignments: [server lane](../tasks/M1-02.md),
[client lane](../tasks/M1-03.md). These are executable acceptance plans; neither
lane is launched by this contract. Before a parallel batch, record committed
contract/setup base SHA, separate absolute worktrees and actual agents, and freeze
shared bootstrap files/pins/lockfiles. An uncommitted manifest is sufficient for
this setup-only ticket, never a substitute for the committed batch base.

Integration order: shared bootstrap, M1-02 candidate, M1-03 candidate, then
M1-04 publish/proxy/container/CI. Review and QA of exact product candidates are
independent in an invoked batch; third child slot is used sequentially. The
coordinator owns resolving shared drift and rerunning combined checks.

Implemented commands (use the pinned toolchain):

```sh
dotnet restore Site.slnx --locked-mode
dotnet build Site.slnx --configuration Release --no-restore
dotnet test --project tests/Site.Server.Tests/Site.Server.Tests.csproj --configuration Release --no-build
npm --prefix src/Site.Web ci
npm --prefix src/Site.Web run typecheck
npm --prefix src/Site.Web run lint
npm --prefix src/Site.Web test -- --run
npm --prefix src/Site.Web run build
node Scripts/build-site.mjs --configuration Release
docker build -t gallery:m1 .
docker run --rm --name gallery-m1-qa -p 127.0.0.1:5400:8080 gallery:m1
npm --prefix src/Site.Web run test:browser
```

`typecheck` runs `react-router typegen && tsc --noEmit` with strict mode and
`skipLibCheck: false`; lint includes JS/TS/TSX and fails warnings; `build` runs
`react-router build`, not the typecheck implicitly. Vitest exercises behavior in
jsdom. Tests never read the user's real browser storage. Browser QA uses disposable
profiles/seeded fixtures under ignored `.agent-artifacts/<ticket>/<candidate>`.

M1-04 implements `Scripts/build-site.mjs`: clean only owned generated output,
install from locks, build client, copy matching assets, build/test/publish backend
to `.artifacts/site/publish`. Docker uses the same sequence in a multi-stage Linux
x64 image with exact .NET SDK/ASP.NET runtime and Node versions; coordinator records
immutable base digests then, runs a nonroot final image without Node/source/secrets,
and validates container liveness/readiness, route aliases, missing assets/API,
HTML cache headers and hashed-asset headers. The selected server/client revision
is built once and tested as the release artifact. No AWS hook is repurposed.

Product CI performs clean install/locked restore, repository validation, separate
type/lint/tests/production build, integrated browser checks and that release-image
smoke check. Backend tests cover API-only health, ProblemDetails, rejected feature
configuration, reserved paths and startup failures. Client tests cover routes,
error/loading/focus states and safe storage. Browser QA covers direct navigation,
aliases, refresh, keyboard focus, 320px/desktop layouts, themes/reload, missing
assets/API, console/hydration errors and absent feature claims. All are M1-04 gate
evidence; M1-01's documentation/exclusion checks do not establish product success.
