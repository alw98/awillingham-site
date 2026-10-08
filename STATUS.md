# Interactive gallery status

Updated 2026-10-08 (America/Chicago).

## Actual progress

The C#/React application builds and runs locally. The legacy MVC/Webpack app and
AWS hooks were removed at the user's explicit request after local parity acceptance. See [foundation revision 2](docs/contracts/FOUNDATION.md)
and [integration evidence](docs/tasks/M1-04.md). Its shell, gallery metadata,
theme preferences/full color editor, HTTP host, production image and product CI
are implemented. The replacement now runs all 15 presets, restores original
gear/About flows, imports saved themes explicitly and calculates Euler 1–10.
See the parity restoration evidence below. A functioning timer, PostgreSQL/EF
Core, external login and Hetzner deployment remain later work.

[BACKLOG.md](BACKLOG.md) alone owns task states. [NEXT_STEPS.md](NEXT_STEPS.md)
describes the next implementation; [architecture](docs/architecture.md) records
the agreed direction and remaining choices.

| Area | Actual state |
| --- | --- |
| Application | .NET 10 host and React 19/strict TypeScript/Vite client under `src/`; sole solution `Site.slnx` |
| Gallery | 15 Canvas2D presets, 14 original URL aliases, animated visible previews, gear Settings and top About |
| Theme/Euler | 26-color bubble editor, versioned recovery/explicit ThemeStore import, cancellable Euler 1–10 workers |
| Timer | Original Add Item prototype; no functioning countdown |
| Data/auth | Browser local storage; no PostgreSQL, EF Core or login |
| Hosting | Local publish/container definition and product CI; remote deployment not inspected or performed |
| Legacy retirement | MVC/Webpack application, root assets/config and AWS hooks removed under user-authorized OPS-03; historical source in Git |
| Agent workflow | Configuration validated; no live parallel batch or independent product acceptance claimed |

Earlier sections below are chronological evidence. Legacy files and commands in
those records describe historical revisions, not the current repository.

## Earlier preparation boundary and preserved work

Earlier preparation inspected HEAD: `36c308a` (`Added AGENTS.md`), on `main`. The earlier source
baseline was `5c9f75a` (`Tetris`). At entry, `AGENTS.md` was modified and `.codex/`,
`.agents/`, and `docs/` contained untracked setup. The setup included unrelated
project names/commands, broken documentation references, and an empty skill.
This preparation adapts those files in place and preserves their model/cap policy.
No user changes were reset, staged, committed, or silently included in a worktree
base. No feature agents, services, databases, provider accounts, or cloud resources
were launched by this preparation.

The three supplied reference documents informed the stable-ID backlog,
dependency-first sequence, evidence-based status, and isolated-agent workflow.
Their project-specific features, task states, revisions, and test results do not
apply to this website. Planning priority and roadmap text are not runtime evidence.

## Earlier application baseline

These checks ran earlier in this conversation on 2026-10-07 against source
baseline `5c9f75a` and existing dependencies. They are carried-forward evidence,
not fresh checks of the repository-preparation candidate.

| Check | Recorded result |
| --- | --- |
| .NET Release build, no restore | Pass, 0 warnings/errors; preview-SDK informational message |
| Jest | 1 suite, 31 tests passed; heap tests only |
| Existing lint command | Pass with one unused-variable warning; TSX omitted |
| Development Webpack bundle | Pass; installed `ts-loader` skips dependency declaration checking |
| Standalone `tsc --noEmit` | Fail: 21 dependency declaration errors, Router 5 type package alongside Router 6 and older React declarations |

Observed environment: Windows/PowerShell, .NET SDK
`10.0.100-rc.1.25451.107`, Node `24.8.0`, npm `11.6.0`.
Clean installation, production frontend build, current-browser behavior, OAuth,
PostgreSQL, recovery, and remote hosting are not established by those results.

## Earlier repository-preparation validation

OPS-01 is complete for preparation, not for live parallel feature execution.
That preparation was an uncommitted working-tree candidate based on `36c308a`;
its scoped SHA-256 manifest is `.agent-artifacts/preparation-validation/manifest.json`.
It was subsequently committed in `07db3fe`, before this M1-01 task began.
The original workflow/role templates are retained under
`.agent-artifacts/preparation-input/`. These local artifacts are ignored and are
not substitutes for a committed feature base.

| Check | Actual result on the preparation candidate |
| --- | --- |
| `node Scripts/check-repo.mjs` | Passed: 18 guidance files, 28 stable task IDs; local links, entry points, states/dependencies/cycles, skill entry, whitespace, and copied-project residue checked |
| `node --test Scripts/check-repo.test.mjs` | All 5 checks passed: valid guidance, broken link, unknown dependency, dependency cycle, and premature Ready state |
| Python 3.13 `tomllib` plus role/policy assertions | All 9 TOML files parsed; 8 role identities/instructions and preserved model/effort/sandbox settings, primary model, and child cap verified |
| Official skill `quick_validate.py` | `add-sketch` passed; local references also passed repository validation |
| Repository CI YAML/local step check | YAML parsed; triggers/read-only token configuration inspected; its TOML step executed locally. Hosted GitHub Actions was not run |
| .NET Release build/no restore with nested compile-error probes | Passed, 0 warnings/errors, preview-SDK message. Temporary `#error` sources in both `.worktrees` and `.agent-artifacts` were excluded; owned probe files/directories removed |
| Diff/ignore review | Tracked whitespace check passed; agent checkouts/evidence and local `.env` ignored; `.env.example` remains available to track |

The official skill validator initially could not import PyYAML. Cached PyYAML
6.0.3 was installed only in ignored `.agent-artifacts/preparation-tools`, then the
validator passed. Global Python and application dependency files were unchanged.
Product/browser/clean-install/publish/container checks were not rerun for this
preparation; no source feature behavior was changed. The one backend project edit
only excludes nested agent worktrees/evidence from default build items.

The copied empty plant skill was replaced with `add-sketch`; role/workflow guidance
now names this website and actual npm/.NET paths. The legacy `README` became
`README.md`. Product source, tracked local configuration, dependency pins, and
legacy deployment scripts remain available for their explicit migration tickets.

## M1-01 validation

Started from clean `main` at `07db3fe363465e3c9c842ca8b9857cbd9c517f63`
(`Agents`). The preparation files are now in that committed base. M1-01 is a new
uncommitted setup-only candidate; its scoped final hashes are recorded in
`.agent-artifacts/M1-01/manifest.json`. No user work was staged/reset/stashed or
committed, no child agents/worktrees were launched, and legacy application
dependencies, credentials and browser storage were unchanged.

Deliverables: foundation revision 1, exact toolchain/package manifest, ordered
15-preset inventory with unique new slugs and the first Times Tables legacy
destination, both executable lane assignments, default-item exclusions for new
source/tests/output, generated-output ignore rules, source inventory check and
its repository CI step. Current source confirms Bouncy DVD is active; earlier
prose omitted it. M3-03 now owns that port instead of deferred EXP-01.

| Check | Actual result |
| --- | --- |
| Official .NET/Node/npm/NuGet metadata | Released SDK 10.0.401/runtime 10.0.12, Node 24.21.0 LTS/npm 11.19.0 and all frozen direct package versions verified; TypeScript 6/ESLint 9 selected to satisfy plugin peers |
| Disposable strict npm lock resolution | Passed on checksum-verified Node 24.21.0/npm 11.19.0 with strict peer dependencies and engines, scripts disabled. All direct pins match the contract; 403 lock entries. Only ignored task output changed |
| `node Scripts/check-foundation.mjs` | Passed: current registration order, inherited legacy names, 15 presets/14 legacy routes, unique new IDs/slugs, exact pins and all five root exclusions |
| Legacy Release build/no restore with temporary probes | Passed, 0 warnings/errors plus preview-SDK notice. Deliberate C# errors and Razor/JSON content under src, tests, .artifacts, .worktrees and .agent-artifacts were excluded; owned probes removed |
| Evaluated default items | No probes in Compile, Content, None, EmbeddedResource or RazorGenerate; evaluated output and build log retained in ignored evidence |
| Repository guidance and regression checks | `node Scripts/check-repo.mjs`, all 5 `node --test Scripts/check-repo.test.mjs` cases and `git diff --check` passed on the final candidate |

The first npm probe on installed Node 24.8.0 reported engine warnings; validation
was repeated using the pinned isolated toolchain with engine checking enforced.
The installed .NET preview SDK was used only for legacy isolation/build evidence;
the selected released SDK and future backend test packages were not installed or
run. No new application clean install, typecheck, frontend build, browser,
container or independent parallel product acceptance is claimed. M1-02/M1-03 and
M1-04 explicitly own those gates. Hosted CI has not been run.

## M1 implementation validation

Implemented sequentially from `07db3fe` plus the preserved M1-01 working tree.
No staging, commit, reset, child agents or parallel worktrees were performed.
The current source/lockfile candidate is uncommitted. Contract revision 2 amends
only incompatible installation/test pins: supported ESLint 10 and axe browser
checks replace the obsolete ESLint 9/unsupported jsx-a11y combination; explicit
isbot prevents Router's automatic install; native assertions avoid jest-dom's
Vitest 5 declaration mismatch; xunit.v3 uses the .NET 10 MTP runner. Strict
library checking and peer/engine enforcement remain enabled.

| Check | Actual result |
| --- | --- |
| Windows clean release pipeline | Passed on isolated checksum-verified SDK 10.0.401 and Node 24.21.0/npm 11.19.0; clean strict npm install, strict types including library declarations, TSX lint with zero warnings, 19 frontend tests, production client build, locked restore, zero-warning C# build, 34 integration tests and publish |
| Linux clean release container | Passed same pipeline from allowlisted source context, digest-pinned bases; final image runs UID 1654 and contains no Node/source/legacy configuration |
| Production Chromium | All 7 checks passed: 20 public/detail routes, 14 aliases, unknown URLs, filter/search, focus, themes/reload, reduced motion, malformed/denied storage and explicit recovery, HTTP/cache/HEAD/error behavior; no console/hydration errors in navigation flow |
| Accessibility and visual QA | axe WCAG 2 A/AA and 2.1 AA checks passed for seven pages at desktop/320px plus light theme; desktop/mobile release screenshots inspected |
| Development proxy | Documented Development API command and Vite started on 5200/5300; proxied readiness returned 200 JSON, unknown API 404 ProblemDetails, client gallery 200, API-only client route 404 |
| Retained legacy backend | Restore and Release build passed with pinned SDK 10.0.401, zero warnings/errors; real nested application/test projects excluded |
| Published app and repository | Standalone published Production app started and returned healthy readiness; repository guidance check (23 files/28 tasks), all 5 guard tests, actual pin/lock checks, product CI YAML parsing and whitespace checks passed |

Local release image `gallery:m1` is available; preview container
`gallery-m1-codex` listens only at `http://127.0.0.1:5400`. It is disposable:
`docker rm -f gallery-m1-codex` stops/removes only that container. Ignored evidence
is under `.agent-artifacts/M1`; release output is `.artifacts/site/publish`.
See [M1-04](docs/tasks/M1-04.md) and README for reproducible commands.
Final source hashes and image identity are recorded in the ignored
`.agent-artifacts/M1/manifest.json`; no secrets or generated dependencies are
included. Temporary development/publish processes were stopped; the preview
container remains available.

Product CI is implemented but has not run on hosted Actions. Local execution is
Windows x64 and Linux amd64/Chromium; other architectures/browsers are unverified.
This sequential implementation has no independent agent review/QA evidence and
does not close OPS-02. Automated axe checks do not prove complete accessibility.
Sketch execution, full feature parity, legacy data imports, accounts, database,
and remote hosting remain outside this foundation. Legacy frontend failures are
unchanged; new strict client checks pass.

## UI-01 original style and bubble editor

At the user's request, restored the original compact header/logo/navigation,
Rubik font, blue palette families, pill buttons and centered home text/gear GIF.
The earlier editorial redesign has been replaced. Original assets were copied
into the replacement source; fonts are vendored with SIL licensing. Default
text/button combinations keep readable contrast rather than reproducing the
legacy light theme's low-contrast states.

Colors now supplies all 26 draft controls: original palette families/shades,
custom hex/rgb/rgba input, transparent outlines, primary/secondary sample text
and normal/hover/pressed button previews. Bubbles preview draft colors; Save
applies/persists the validated custom theme, Discard restores active colors.
Invalid values cannot be saved. Existing malformed/denied/quota recovery remains;
legacy keys and existing valid custom preference data are preserved.

The decorative canvas is effect-only, bounded to 120 bubbles/DPR 2, elapsed-time
driven, pauses when hidden/reduced motion is requested, repaints frozen previews
on color changes, resizes and disposes its frame/listeners on route changes.
It introduces no p5 dependency or global renderer state. M2 still owns the sketch
runtime; M3-05 still owns explicit legacy import and sketch theme inputs.

Validation: strict types and zero-warning TSX lint passed; 22 frontend tests and
34 backend tests passed; Linux production build/publish passed. All 10 Chromium
checks passed against the release image, including draft/save/discard/validation,
reload/navigation, bubble freeze/repaint/resize/disposal, all routes and HTTP
rules. axe checks cover desktop/320px and an expanded palette picker; screenshots
of home and Colors were inspected. Direct Production loads also verified local
font/image loading, the bundled license (200), and no console/page/resource errors.
Hosted CI and other browsers remain unverified.
The user-facing preview remains `http://127.0.0.1:5400/colors` in the owned
`gallery-m1-codex` container. Changes remain uncommitted, with no child agents.
Final UI source/image evidence is in `.agent-artifacts/UI-01/manifest.json`.

## UI-02 plain product copy

Removed added slogans, poetic headings, introductions and decorative copy from
Home, Gallery, Colors, sketch details, Euler, Timer, loading, errors and missing
pages. Sketch descriptions now state their behavior directly. Page names, control
labels, validation/recovery instructions and availability status remain. Recorded
the user's copy preference in AGENTS.md; original styling and bubble/color behavior
are preserved. Types, zero-warning lint, 22 frontend tests, production build and
10 Chromium checks passed. The owned preview container is updated; source changes
remain uncommitted. Hosted CI was not run.

The user subsequently requested the original Home title/introduction back.
Restored its original two sentences; other simplified product copy is retained.

## Gallery preview animation correction

Removed the scheduler's four-preview cap after reproducing seven visible animated
cards with only four running. Every visible enabled preview now advances at 30fps;
offscreen/hidden instances, reduced-motion previews and static presets still pause.
Sketch runtime revision 2 records this policy. The browser regression check asserts
that all eligible visible previews run and advance, then verifies scrolling,
document visibility, reduced motion and navigation cleanup.

Strict types, zero-warning lint, all 40 frontend tests, all six gallery Chromium
checks and the production frontend build passed. Browser checks used disposable
storage on the isolated development server at port 5301; that server was stopped.
The initial regression check failed with expected 7 versus actual 4 before the
fix. Evidence is under `.agent-artifacts/preview-animation`. These checks do not
establish a new release image or hosted CI result.

## Previous-version parity audit (2026-10-08)

**Historical audit, before the restoration below: parity was incomplete.** Compared the retained original at `07db3fe` with the
current uncommitted replacement, rebuilding the original Webpack bundle from
source first. Both ran locally with separate disposable Chromium storage:
original HTTPS port 5501 and replacement Vite port 5502. This is a source and
development-browser audit, not acceptance of a published release or cutover.
No application behavior was changed during this audit.

### Coverage and evidence

- Captured 46 route observations and screenshots: both versions' five main
  pages, all 15 preset entries, and Gallery/Tetris/Colors at 375px. Desktop was
  1280x900. All observations returned HTTP 200; none had document-level
  horizontal overflow. Some original pages scroll inside a container, so their
  screenshots do not capture all content below that container's viewport.
- All 15 replacement gallery canvases mounted without an error state. All 14
  unique old gallery aliases redirected to the expected new slug, preserving
  query strings and fragments. The original two Times Tables entries share
  `/gallery/TimesTables`: original detail observations therefore cover that
  route twice; the second preset was compared through source/gallery inventory.
  The replacement supplies two distinct working detail routes.
- Browser probes compared held-key movement, option retention across SPA
  navigation, Times Tables radius output, and legacy storage handling. The old
  Euler page displayed all ten calculated answers; the replacement displayed
  its availability placeholder.
- Six representative shared assets were byte-identical: the DVD logo, both
  edge images, both home gear GIFs and dark AW logo. This is not an exhaustive
  asset hash audit. Rubik and the original home introduction remain present.
- Evidence is in ignored `.agent-artifacts/parity-check`: `audit.mjs`,
  `observations.json`, 46 PNGs, `supplement.mjs` and `supplement.json`.
  The supplement fingerprints 178 original/replacement application source files.
  All six existing gallery Chromium checks passed against port 5502 (11.4s).

### Functional findings

Severity describes user impact here; task priorities/states remain in BACKLOG.
Findings with browser reproductions are distinguished from source comparisons.

| Finding | Impact, reproduction and evidence | Existing owner |
| --- | --- | --- |
| PAR-01: Euler execution missing — high | Open `/projecteuler`: the original renders problems 1–10 and their answers; the replacement only says “Not yet available.” Confirmed in Chromium and [Euler page source](src/Site.Web/app/features/euler/euler-page.tsx). | M3-07 |
| PAR-02: Legacy custom theme is not imported — high | Seed a valid original `ThemeStore` with custom primary background `#123456`, then open replacement Colors. It uses default `#06121a` and offers no import. Original `ThemeStore` and `TimerStore` strings remain unchanged, so this is missing migration behavior, not deletion. See [preferences](src/Site.Web/app/features/themes/preferences.ts). | M3-05 |
| PAR-03: Tetris custom held-key repeat lost — high | Hold A for 650ms using one keydown followed by keyup: original moved about four cells; replacement moved one. Original implements a 200ms delay and 50ms repeat interval; [new input handling](src/Site.Web/app/features/gallery/sketches/canvas-host.tsx) only handles incoming keydown events. Native OS repeat may move the new piece, but its timing now depends on the platform. | M2-04 |
| PAR-04: Sketch options reset during navigation — medium | Set animated Times Tables change rate to zero, navigate via Gallery, then reopen it. Original retains zero; replacement restores 0.01. [SketchView](src/Site.Web/app/features/gallery/sketches/sketch-view.tsx) initializes local state from defaults on each mount. This concerns in-session retention, not persistence across browser reloads. | M2-02, M3-08 |
| PAR-05: Times Tables radius has an ineffective range — medium | Pause animated Times Tables at desktop size, set radius to 500 then 600: labels update but the canvas raster is identical. [Geometry](src/Site.Web/app/features/gallery/sketches/geometry.ts) clamps radius to 44% of the smaller canvas dimension (297px in this probe), while the UI permits up to 1000. Original drawing uses the chosen radius directly. | M3-01 |
| PAR-06: Times Tables theme color behavior changed — medium | Source comparison: original defaults to current primary text color until an explicit line color is supplied; [new definitions](src/Site.Web/app/features/gallery/sketches/definitions.ts) hard-code `#1dccd8`. Screenshots show original pale lines versus replacement cyan lines. Theme-linked default line coloring is lost. | M3-01, M3-05 |
| PAR-07: Sine circle editing is restricted — medium | Original [Sine options](https://github.com/alw98/awillingham-site/blob/07db3fe363465e3c9c842ca8b9857cbd9c517f63/Web/web-app/src/Components/Sketches/SinSum/SinSumOptions.tsx) allow adding circles, deleting any circle, and extending frequency/amplitude bounds. New definitions use eight fixed slots and fixed ranges; counts above eight, arbitrary deletion and extended amplitudes are unavailable. This finding is based on source/control inventory. | M3-01 |
| PAR-08: Field grid controls change different behavior — medium | Original [Field](https://github.com/alw98/awillingham-site/blob/07db3fe363465e3c9c842ca8b9857cbd9c517f63/Web/web-app/src/Models/Sketches/ParticleField/Field.ts) samples particle forces from a width-by-height grid. New [field engine](src/Site.Web/app/features/gallery/sketches/field.ts) computes forces independently of grid columns/rows; those settings only affect drawing. Custom seeded noise also replaces p5 noise. Grid resolution no longer changes particle motion in the original way. Source comparison; exact trajectory equivalence was not measured. | M3-02 |
| PAR-09: Drawn Field accumulation changed — medium | Original keeps drawing over previous translucent strokes when background clearing is disabled. The new host fills the background every frame and the field renderer redraws a bounded path once. This changes buildup/brightness and long-running history, despite retaining the Clear background control. Source comparison; long-duration output has not been accepted. | M3-02 |
| PAR-10: About content and attribution absent — medium | Original sketch pages expose About panels; the replacement has none. This also drops factual explanations and the [Times Tables Mathologer credit/link](https://github.com/alw98/awillingham-site/blob/07db3fe363465e3c9c842ca8b9857cbd9c517f63/Web/web-app/src/Components/Sketches/TimesTables/TimesTablesAbout.tsx). Preserve useful explanations/credits in plain copy; reinstating rejected decorative prose or original TODO text is not required. | M2-04, M3-01–M3-04, M3-08 |

### Preset and visual comparison

Presence means the replacement mounts and draws; it does not mean exact
algorithm, control, appearance or performance parity has passed. Random original
sketches were not seed-aligned with the replacement, so screenshot differences
alone do not establish algorithm defects.

| Replacement preset | Observed coverage and remaining differences |
| --- | --- |
| `tetris` | Falling blocks and original keyboard mappings remain; focus, touch buttons, pause/restart, grid and drop-speed setting were added. Held-key timing differs (PAR-03). |
| `stained-glass` | Mirrored strips and principal step/count controls remain. Show grid draws lines instead of the original dots; initial warm-up and seeded generation change the presentation. |
| `snow-globe` | Matter.js globe remains; new gravity/wind/count and Shake controls. Preview cap is 120 flakes versus original 1000, visibly reducing density. Full default remains 1000; forces and boundary rendering differ. |
| `skyscrapers` | Generated buildings and incremental outline remain. Sweep implementation, colors and preview scaling differ from the original heap implementation. Final geometry across matching fixtures still needs acceptance. |
| `particle-field` | Particle/trail display and pointer spawning present; field sampling/noise and grid behavior differ (PAR-08). |
| `fireworks` | Rockets, bursts, spawning and 14 options present. New bounded particle counts/seeded generation need matched timing, lifetime and visual acceptance; route presence is not proof of equivalent physics. |
| `times-tables-animated` | Chords, multiplier animation and principal options present; radius and theme defaults differ (PAR-05/06). |
| `edge-detection-agate` | Same source image and left/up grayscale-difference operator; worker processing and layout changed. Source input is capped at 1024px in the new image pipeline; exact fixture output remains an acceptance gate. |
| `edge-detection` | Same conclusions as agate; naturally static output is expected. |
| `flow-field` | Animated vector display present; field sampling/noise/grid semantics differ (PAR-08). |
| `drawn-field` | Drawing and pointer spawning present; field forces and accumulated-stroke rendering differ (PAR-08/09). |
| `times-tables-static` | Separately accessible with ten points and zero multiplier rate; old detail URL collided with animated preset. Naturally static by default; shares radius/color findings. |
| `sine-sums` | Epicycles, trace and principal controls present; fixed slots/ranges and initial trace warm-up differ (PAR-07). |
| `sine-sums-mixed` | Mixed defaults present; same editing restrictions. Original Settings crashes on its default amplitude 0.05 being below slider minimum 0.1; new minimum 0.01 avoids that baseline bug. |
| `bouncy-dvd` | Identical DVD asset and bouncing behavior present. New size/speed controls; alpha-mask/tint and border treatment differ. |

The styling remains approximate. Gallery adds search/filter controls, card
titles/descriptions and a different spacing/layout. Full sketch pages replace
the original viewport-sized canvas and overlay panels with a heading, controls
below the canvas and an options column. At 1280x900 the observed original canvas
was 1280x852 versus replacement 796x675; at mobile Tetris it was 375x764 versus
343x527.8. This materially changes the available drawing area. The Colors editor
retains all 26 token controls and decorative bubbles but uses a different panel
layout and much larger visible bubbles. Home retains its wording/assets with
changed typography, line breaks and spacing. Original styling should not be
described as pixel-identical.

### Intentional changes, baseline limits and follow-up

Static edges and the still Times Tables preset do not need continuous animation.
The runtime also intentionally pauses hidden/offscreen/reduced-motion previews
and bounds work. New accessibility/input controls, unique preset URLs and safe
storage recovery are improvements; resource bounds still need visual acceptance.
The original Timer was already a placeholder, with only an Add Item panel. The
replacement loses that affordance, but a working countdown was not removed;
timer completion remains M3-06. Database, OAuth and new hosting were absent from
the original and are not parity regressions.

No replacement page errors were recorded in this warmed audit. The original
mixed-sine Settings error described above was observed twice. This audit does not
prove every control value, clearing/rotation case, long-running simulation,
performance budget, complete accessibility, browser beyond Chromium, or a newly
published production build. The six existing gallery checks cover their specific
lifecycle/input/visibility/theme/worker scenarios, not complete old/new parity.

M2/M3 backlog states have not been advanced. Some overview guidance still says
sketches are placeholders even though the current candidate contains real
renderers; reconcile that wording with feature acceptance evidence. Resolve the
high-impact findings first, then compare matched fixtures and accept intentional
visual/control changes before M3-08 cutover. Retain legacy source and deployment
hooks until that gate is satisfied. The two audit-owned servers were stopped;
the user's existing development server was left alone.

## Original parity restoration (2026-10-08)

Sequential implementation in the existing dirty candidate at base
`07db3fe363465e3c9c842ca8b9857cbd9c517f63`. The original audit above is retained
as historical evidence. All ten reported functional regressions are repaired;
this is local original-feature acceptance, not remote deployment or M3-08 cutover.
[Sketch runtime revision 3](docs/contracts/SKETCH_RUNTIME.md) records the updated
lifecycle/configuration and UI contracts.

| Audit findings | Implemented and checked behavior |
| --- | --- |
| PAR-01 | Original ten Euler problem texts/order and known answers; worker completion, failure, cancellation, retry and navigation cleanup. |
| PAR-02 | Explicit validated saved-theme import with preview, no overwrite of a new custom theme, recoverable quota failure and unchanged original ThemeStore/TimerStore bytes. |
| PAR-03 | Original 200ms/50ms held-key movement repeat, independent of OS repeat; keyup, focus loss, pause and document hiding release input. |
| PAR-04 | Full-page options retained by slug across SPA navigation; previews retain independent defaults. Reload resets sketch settings as before. |
| PAR-05/06 | Times Tables uses the actual chosen radius and theme primary text color by default; palette/custom overrides and return-to-theme control. |
| PAR-07 | Add circles beyond eight, delete any index or all circles, extend frequency/amplitude values, and reset defaults. |
| PAR-08 | Quantized grid resolution affects forces; four-octave p5 noise matches original seeded fixtures to 14 decimal places. |
| PAR-09 | A bounded backing canvas accumulates original translucent Drawn Field strokes; browser checks prove old strokes survive later updates. |
| PAR-10 | Factual About panels and Mathologer attribution restored, with About at the top and settings behind the original gear. |

Full pages again use the entire area under the 3rem header: 1280x852 at a
1280x900 viewport. Gear/About dialogs scroll, support Escape, trap focus and
return focus to their opener. The gallery returns to bare canvas cards; filters
are tucked into a disclosure. Original Rubik weight, moon icon, centered home
introduction and unboxed color editor are restored. All 26 color controls,
draft bubbles, safe recovery and accessible inputs remain.

Additional sketch corrections restore Snow Globe's 1000-flake previews and
original forces/border/flake treatment, glass grid dots and rectangular strips,
the incremental skyline heap walk, original firework spawning direction/timing,
DVD image tint/border, original sine scale/defaults and edge-image layout. Timer
again exposes its original Add Item prototype; countdown implementation is still
M3-06. Legacy source and deployment hooks were still present during that run;
the subsequent user-authorized retirement is recorded below.

Validation against the published Production artifact on isolated port 5503 and
disposable Chromium storage:

- `node Scripts/build-site.mjs --configuration Release`: strict clean install,
  types, lint, 49 frontend tests, production prerender/build, locked restore,
  backend build with zero warnings/errors, 34 backend tests and publish passed.
- `SITE_BASE_URL=http://127.0.0.1:5503 npm --prefix src/Site.Web run test:browser`:
  24 Chromium checks passed, covering all 15 canvases/settings, 14 old aliases,
  animation visibility/disposal, focused/held inputs, resizing, theme changes,
  image/Euler worker cleanup, recovery, import, HTTP/cache behavior and default
  desktop/mobile accessibility. Every preset's Settings also passed axe checks.
- Repository/foundation checks and all five repository-check regression tests
  passed. The fixture now includes implementation/editor files linked by guidance
  and exercises the current unfinished cutover dependency.
- Default-load observation: all 12 animated previews visible at 1280x2100 advanced
  59 frames over approximately two seconds; three naturally static presets stayed
  still. Particle Field and Snow Globe full pages advanced 121/120 frames.
  Observed rAF median/p95 was approximately 16.7ms. This is a local headless
  observation, not a cross-device performance guarantee or sustained stress test.

Evidence is under ignored `.agent-artifacts/parity-restoration` (build/browser
logs, screenshots, noise fixtures and performance observations), with the browser
report/screenshots under `.agent-artifacts/M1/browser`. The generated release
manifest identifies source SHA-256
`d9659379b36098ec4785fc26ba082e95a2a8d4b954bdab75af027940dd8e7391`.
The final browser run passed all 24 checks in 18.6s. No generated output is committed.

Intentional differences remain: native Canvas2D with deterministic seeds rather
than p5's unseeded random runs; fixed elapsed-time updates, offscreen/hidden pause,
reduced-motion static views, bounded work, keyboard-accessible dialogs, extra
pause/reset/action controls, unique URLs for the two Times Tables presets and safe
storage validation. Sine editing is bounded at 1024 circles/finite numeric values;
firework/glass/image bounds remain in the runtime contract. Random frames are not
pixel-identical; every extreme control combination, prolonged memory/load behavior,
other browsers and hosted CI/deployment have not been exhaustively verified.

## Decisions and open choices

- Target: feature-oriented ASP.NET Core/.NET 10 plus React 19/strict TypeScript,
  Vite, React Router, CSS tokens/modules, and an isolated sketch runtime.
- Keep anonymous/local features usable without a database or external login.
- Future data: PostgreSQL with EF Core/Npgsql; migrations and shared data contracts
  have one owner. Login maps external provider identities to stable local users.
- Future login: server-handled OAuth/OIDC and secure cookie sessions. Provider
  selection, account-linking rules, session policy, and provider registration
  details remain implementation decisions under AUTH-01.
- Future hosting: one release image on Hetzner with Compose/Caddy initially.
  Region, domain/DNS, VM size/CPU architecture, backup destination, recovery
  objectives, and deployment access remain unset. No purchasing or provisioning
  is part of repository preparation.
- SDK/Node/package versions, routes, persistence shapes/import policy, theme tokens,
  HTTP/static rules and lane ownership are frozen in foundation revision 2.
  Runtime pins, locks and app projects are implemented. The legacy source has
  since been retired; earlier backend/frontend checks remain historical evidence.

## Limits and next action

File edits and repository checks run in the standard sandbox. On this host,
React Router/Vite commands inside that runner encountered a CommonJS loading
error (`require is not defined`); the identical pinned commands passed with
approved outside-sandbox execution. Release and browser evidence above uses
that execution mode. No repository permission configuration was changed.

The current application has strict types, TSX lint and browser coverage. Historical
legacy build failures do not apply to its release path. Hosted CI, independent
parallel review/QA and remote deployment are not claimed.

## User-authorized legacy retirement (2026-10-08)

Following approval of the parity screenshots, the user explicitly requested all
old code be removed, regression checks completed, and the finished repository
committed once. This overrides the earlier M3-08 source-retention prerequisite;
M3-06 and broader remote release acceptance remain separate future work.

Removed the root MVC project/solution and bootstrap, Controllers/Views/Extensions,
old configuration and launch profiles, React 18/Webpack/MobX/p5 client and its
lockfile, root static assets/shaders, and AWS CodeDeploy/nginx/systemd hooks.
Also removed obsolete generated legacy output and unused placeholder components.
The sole solution is `Site.slnx`, containing the current server and backend tests.

All six reused image assets were checked byte-for-byte before removal. Required
images, Rubik fonts and its license remain in the current client. The original
client GPL license is preserved at root `LICENSE`. The shared gallery inventory
keeps all 15 IDs/slugs and 14 old names while dropping obsolete source paths/store
symbols. No browser data was reset; old aliases and explicit theme import remain.
Historical source is recoverable at `07db3fe363465e3c9c842ca8b9857cbd9c517f63`;
README documents separate-checkout recovery without disturbing the current app.

README, AGENTS, architecture, workflow, skill and role instructions now describe
the sole current application. Role/model/cap settings are preserved. Earlier M1
records are explicitly historical. Repository guards validate the frozen URL map,
exact pins/locks, solution projects and absence of retired entry points. CI uses
the pinned Node version. Generated output and local credentials remain ignored.

The final regression audit also corrected a direct-load navigation bug: the
shared SPA fallback previously left Home underlined on Colors, Euler, Timer and
sketch detail routes. Navigation stays neutral during hydration and then marks
the actual browser route. Chromium now asserts the current navigation item on
every canonical page. Existing keyboard/focus behavior remains covered.

Browser screenshots now use Playwright's per-test output directory rather than
relative paths inside the client source. Earlier nested evidence was moved into
ignored root task output. Release fingerprints and Docker context exclude nested
agent/build/test evidence, worktrees and Git data. The current source fingerprint
was checked against the release again after browser tests, confirming that test
output no longer changes the release input identity.

Fresh verification after removal:

- Clean release pipeline: strict npm installation, types, TSX lint, 49 frontend
  tests, production prerender/build, locked restore, backend build with zero
  warnings/errors, 34 backend tests and publish all passed.
- Production artifact on isolated port 5503, disposable Chromium storage: all
  24 browser checks passed (21.6s). Coverage includes every preset/Settings,
  animated previews and lifecycle cleanup, old URLs/direct routes, original
  controls, viewport/mobile layout, theme recovery/import, workers, accessibility
  and HTTP/cache behavior.
- Repository/foundation checks, five repository-check regression tests, nine TOML
  parses and Git whitespace checks passed.
- Docker daemon was unavailable (`dockerDesktopLinuxEngine` pipe absent), so a
  fresh container build/run was not verified. Local publish and browser checks
  passed; hosted CI, other browsers and remote deployment are not claimed.

Release input SHA-256: `8725367025ed7c7fcfb1a95718ffffef45c8939b2ed870ed2293a49ac7c76525`.
Logs: ignored `.agent-artifacts/retirement-build.log` and
`.agent-artifacts/retirement-browser.log`; browser screenshots/report remain under
`.agent-artifacts/M1/browser`. No generated output is included in the commit.
