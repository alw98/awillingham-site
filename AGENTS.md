# Project guide for coding agents

## Start here

Read [README.md](README.md), [STATUS.md](STATUS.md), [NEXT_STEPS.md](NEXT_STEPS.md),
and [BACKLOG.md](BACKLOG.md) before implementation. BACKLOG alone owns task states;
STATUS records evidence and limits. [Target architecture](docs/architecture.md)
defines the accepted C#/React rebuild direction, including later PostgreSQL/EF
Core, external OAuth/OIDC login, and Hetzner hosting. Those features are planned,
not current runtime dependencies. Freeze shared contracts before parallel work.

Use [the agent workflow](docs/AGENT_WORKFLOW.md) and
[task template](docs/templates/AGENT_TASK.md) when a parallel batch is invoked.
Preparation and ordinary questions do not automatically launch a batch. Preserve
the existing role/model policy and the user's dirty work. At most three children
and two independent implementation lanes; the coordinator owns shared tracking,
contracts, migrations, pins/lockfiles, and integration unless explicitly delegated.
Assign absolute worktrees, owned paths/symbols, isolated outputs/ports/browser
storage, and disposable databases when relevant. Workers are not alone and must
preserve others' edits. Product candidates receive independent review/QA and
sequential integration with combined checks.

Run `node Scripts/check-repo.mjs` after repository guidance changes. It checks
local links, task dependencies, required entry points, and copied project residue;
it does not prove TOML runtime discovery, browser behavior, or live delegation.
The root .NET project excludes `.worktrees/` and `.agent-artifacts/` from default
items; Git ignore rules alone do not isolate build/publish globs. M1-01 must define
exclusions before adding new nested C# source projects.

The conventions below describe the existing application. New implementation
follows its accepted milestone contract and target architecture; do not invent
new-app commands or claim migration completion from planning documents.

## Current application snapshot

This file applies to the entire repository. It records the project as inspected on
2026-10-07, based on branch `main` at commit `5c9f75a` (`Tetris`). Recheck source and
configuration when making changes; the observations below are a dated baseline.

Armond Willingham's personal website is an ASP.NET Core MVC host serving a React
single-page application. Its main feature is a gallery of interactive p5 sketches,
alongside a theme editor, Project Euler solutions, and an unfinished timer.

## Stack and repository layout

- Backend: C#, `Microsoft.NET.Sdk.Web`, **`net10.0`**, nullable reference types and
  implicit usings enabled. Root namespace: `awillingham_site`.
- Backend packages: `AspNetCoreRateLimit` 4.0.2 and
  `Microsoft.Extensions.Hosting.Systemd` 6.0.0.
- Frontend: React 18, TypeScript 4.7, React Router 6, MobX 6, Inversify hooks,
  React JSS, p5, and Matter.js for the snow globe physics.
- Frontend tooling: npm with a committed lockfile, Webpack 5 and `ts-loader`,
  ESLint 8, Jest 28 and `ts-jest`. There is no frontend development server script.
- Application persistence is browser `localStorage`. No database, authentication
  implementation, or application data API is present in the inspected source.

| Location | Responsibility |
| --- | --- |
| `awillingham-site.csproj`, `awillingham-site.sln` | Backend project and solution |
| `Program.cs` | Configuration, service registration, middleware, host startup |
| `Extensions/` | MVC cache profiles, HTTPS, forwarded headers, rate-limit registration, routing |
| `Controllers/HomeController.cs` | SPA shell and an error action |
| `Views/Home/Index.cshtml` | HTML document, bundle inclusion, React mount point |
| `Config/AppOptions.cs`, `_config/` | Custom backend options and JSON overrides |
| `Web/web-app/` | npm project; run all frontend commands here |
| `Web/web-app/src/Components/` | Pages, navigation, inputs, sketch components and option panels |
| `Web/web-app/src/Models/` | Theme, timer and sketch models, Euler solvers, data-structure contracts |
| `Web/web-app/src/Stores/`, `Web/web-app/src/Utils/Stores.ts` | MobX stores, browser persistence, dependency injection setup |
| `Web/web-app/src/DataStructures/`, `Web/web-app/test/DataStructures/` | Heap implementation and its Jest tests |
| `Web/web-app/webpack/`, `Web/web-app/config/` | Frontend bundling and build-specific configuration |
| `wwwroot/` | Global CSS, images, GLSL shaders, generated frontend bundles |
| `Scripts/`, `DevOps/`, `appspec.yml` | Linux/AWS CodeDeploy, nginx and systemd deployment assets |

## Runtime architecture

1. ASP.NET Core serves static files from `wwwroot` and maps the catch-all
   `{*url}` MVC route to `HomeController.Index`. This supplies the HTML shell for
   direct visits to client routes.
2. The Razor view loads `/js/bundles/bundle.js`, creates `#root`, and invokes
   `window.InitApp()`. Keep this global initialization contract intact when
   changing the frontend entry point or shell.
3. `Web/web-app/src/index.tsx` imports `reflect-metadata`, registers singleton
   `ThemeStore` and `TimerStore` instances, and mounts React with `createRoot`.
4. `App.tsx` supplies the observing JSS theme provider, shared header, page
   container, and React Router outlet. Unknown client paths redirect to `/`.
5. `Utils/Stores.ts` configures MobX with `enforceActions: 'never'`.
   `AutoSavingStore` loads JSON and uses `autorun` to save observable state under
   the `ThemeStore` and `TimerStore` local-storage keys.

The backend enables forwarded headers, HTTPS redirection to port 443, HSTS,
static files (including unknown file types), response caching, and MVC routing.
Rate-limit services and rules are registered, but `app.UseIpRateLimiting()` is
commented out, so request rate limiting is currently inactive.

### Pages and sketches

| Client path | Current behavior |
| --- | --- |
| `/` | Introduction and work-in-progress graphic |
| `/gallery` | Animated sketch previews linked to individual sketches |
| `/gallery/<propsStore.name>` | Full sketch, with options/about panels where supplied |
| `/colors` | Theme color editing, preview, and save to the current persisted theme |
| `/projecteuler` | Problems 1-10, displayed in reverse order; solutions run through `@koale/useworker` |
| `/timer` | Placeholder page with an Add Item panel; no functioning countdown or item editor |

`Components/Sketches/GallerySketches.tsx` is the registration source for both
gallery previews and individual routes. It currently has 15 active entries:
Tetris, Stained Glass, Snow Globe, improved Skyscrapers, three particle/flow field
presets, Fireworks, two Times Tables presets, two simple edge-detection presets,
and two sine-sum presets. Canny edge detection and Purgatory registrations are
commented out. Bouncy DVD and the original Skyscrapers implementation exist but
are not registered.

`BaseSketch.tsx` owns p5 instance creation, resize handling, cleanup, and the
animated options/about panels. Gallery previews receive observable copies of
the registered props with `isGallery: true` and a 320-by-320 size. Full pages use
the registered props store and resize to the container. Changes to shared props
or lifecycle handling can affect every preview and sketch page.

Tetris is the latest commit's focus. The implementation includes movement,
collision-checked rotation, hard drop, line clearing, and automatic reset when a
new piece cannot spawn. Controls are `a`/`d` to move, `s` to descend, `q`/`e` to
rotate, and `w` to hard drop. Its options panel is currently empty.

## Local development

Use a .NET SDK that supports `net10.0` and npm. No Node version is pinned by a
repository version file or package `engines` field. The inspection used
.NET SDK `10.0.100-rc.1.25451.107`, Node `24.8.0`, and npm `11.6.0`; these are
observed local versions, not a declared support matrix.

From the repository root, restore and build the backend:

```sh
dotnet restore awillingham-site.csproj
dotnet build awillingham-site.csproj --configuration Release
```

Then install and bundle the frontend:

```sh
cd Web/web-app
npm ci --legacy-peer-deps
npm run bundle
```

The install command uses the committed lockfile. Deployment currently uses
`npm install --legacy-peer-deps`; a fresh dependency installation was not tested
during this inspection. React and several required bundling packages are listed
under `devDependencies`, so frontend builds require development dependencies.

Run these in separate terminals for development:

- From the root: `dotnet run --project awillingham-site.csproj --launch-profile awillingham_site`.
- From `Web/web-app`: `npm run bundle:watch`.

The launch profile sets `ASPNETCORE_ENVIRONMENT=Development` and advertises
`https://localhost:7100` and `http://localhost:5100`. Prefer the HTTPS address:
the custom HTTP redirect targets port 443, rather than the profile's port 7100.
Use `dotnet dev-certs https --trust` if the local HTTPS certificate needs trust.
The backend does not automatically build the frontend; a successful .NET build
alone does not ensure that the required bundle exists or is current.

### Frontend commands and output

Run these commands from `Web/web-app`:

| Command | Purpose |
| --- | --- |
| `npm run bundle` | Lint, then development Webpack build |
| `npm run bundle:test` | Same command as `bundle`; not a test runner |
| `npm run bundle:prod` | Lint, then production Webpack build |
| `npm run bundle:watch` | Development Webpack watch; does not run lint |
| `npm run lint` | ESLint over `.js` and `.ts` files |
| `npm run lint:fix` | Same lint scope with automatic fixes |
| `npm test -- --runInBand` | Existing Jest suite |
| `npm run test:watch` | Jest watch mode |
| `node node_modules/typescript/bin/tsc --noEmit` | Standalone full TypeScript check |

Webpack writes `bundle.js` and imported file assets to `wwwroot/js/bundles/`.
Type declarations are emitted under `Web/web-app/dist/types/`. TypeScript and
Webpack resolve application imports from `src`; the `wwwroot` alias resolves
shared assets. The exact-match Webpack alias `config$` selects
`config/dev.config.json` or `config/prod.config.json` by build mode.

## Verified baseline and current gaps

The following checks ran against the existing installed/restored dependencies on
2026-10-07, before adding this documentation:

| Check | Result |
| --- | --- |
| `dotnet build awillingham-site.csproj --configuration Release --no-restore` | Pass; 0 warnings and 0 errors, plus a preview-SDK informational message |
| `npm test -- --runInBand` | Pass; 1 suite, 31 tests |
| `npm run lint` | Pass with 1 unused-variable warning in `Models/Sketches/Tetris/Tetrimino.ts:98` |
| `npm run bundle` | Pass; development Webpack bundle generated |
| `node node_modules/typescript/bin/tsc --noEmit` | Fail; 21 errors in dependency declaration files |

- **Type declarations disagree.** The lockfile and installation have
  `react-router-dom` 6.30.4, `@types/react-router-dom` 5.3.3, and `@types/react`
  18.0.18. Standalone checking reports missing Router 5 exports and `React.JSX`.
  Installed `ts-loader` 9.3.1 sets `skipLibCheck` to `true`, which explains why
  the Webpack build passes while standalone checking fails. Do not equate the two
  checks.
- **Lint omits `.tsx`.** Both lint scripts specify `--ext .js,.ts`; most React
  components are therefore outside the directory traversal's lint scope. The
  lint result does not cover all frontend source.
- **Coverage is narrow.** The only existing product test file is
  `test/DataStructures/Heap.spec.ts`. There is no backend test project, component
  test suite, or browser test suite. Repository-only CI is included in preparation;
  full application CI belongs to M1. Browser behavior and the production bundle
  were not exercised during the earlier application inspection.
- **Deployment still targets .NET 6.** `README` describes ASP.NET Core 6,
  `Scripts/install_dependencies.sh` installs `dotnet-sdk-6.0`, and
  `Scripts/start_server.sh` launches `bin/Release/net6.0/awillingham-site.dll`.
  The actual project and new build output use .NET 10. These must be reconciled
  before relying on the deployment scripts. `Scripts/build.sh` also selects
  Node 16, unlike the local verification environment.
- **Duplicate sketch route.** Both Times Tables presets inherit the name
  `TimesTables`, producing duplicate `/gallery/TimesTables` routes. Registration
  order therefore matters for accessing these presets.
- **Incomplete features.** The timer's Add Item panel is placeholder text,
  Tetris options contain no controls, and `HomeController.Error()` returns a
  view with no corresponding `Views/Home/Error.cshtml`. Production exception
  handling points at `/Home/Error`; verify routing and rendering when fixing it.

## Configuration and deployment details

ASP.NET Core's default configuration is supplemented, in this order, by:

1. `_config/config.json` (required).
2. `_config/<EnvironmentName>.config.json` (optional).
3. `_config/local.config.json` (optional, loaded last in every environment).

All three existing `_config` files (`config.json`, `prod.config.json`, and
`local.config.json`) are tracked. The `AppOptions` section binds
`AppOptions.GithubSecret`; no consuming endpoint was found. Do not copy secret
values into documentation or logs. The local file can override environment
configuration even on a deployed host; do not assume it is a development-only
file. Environment filenames follow the environment string's casing, which
matters on Linux.

The existing AWS CodeDeploy spec copies the repository to `/opt/www/personal`
and runs dependency installation, build, start, and stop hooks as root. Deployment
groups `Test` and `Prod` select the frontend build and the systemd instances
`PersonalSite@test` and `PersonalSite@prod`; the instance name becomes the backend
environment (`test` or `prod`). nginx proxies the main site to ports 5000/5001
and includes additional subdomain proxies. The scripts modify system packages,
nginx configuration, and systemd services; they are deployment hooks, not local
development setup commands. Their live deployment state was not verified.

## Conventions for the existing application

- Follow existing separation: UI in `Components`, sketch data and algorithms in
  `Models`, shared state in `Stores`, and common helpers in `Utils`/`Hooks`.
- For a new sketch, add its component and model/props store, reuse `BaseSketch`,
  and register it in `GallerySketches.tsx`. Use a unique, stable props-store name
  because it becomes a public route. Check both gallery and full-page behavior.
- Use existing `Theme` tokens and React JSS styling for themed UI. Preserve
  observable state and `observer` wrappers when changing reactive components.
- Preserve the `ThemeStore`/`TimerStore` local-storage keys and account for saved
  JSON when changing store shapes. The current loader parses without validation
  or recovery, so malformed saved JSON can interrupt initialization.
- Existing ESLint conventions are tabs, single quotes, semicolons, sorted
  imports/exports, and no unused imports. Some `.tsx` files differ because they
  are outside the current lint script's scope; avoid unrelated formatting churn.
- Do not hand-edit or commit generated `bin/`, `obj/`,
  `Web/web-app/node_modules/`, `Web/web-app/dist/`, or `wwwroot/js/bundles/`.
  They are ignored. The npm lockfile is tracked and should accompany intentional
  dependency changes.
- For frontend changes, run the relevant Jest tests, lint, and bundle; use the
  standalone TypeScript check when investigating types and distinguish its
  existing dependency failures from regressions. For backend changes, run the
  .NET build. Manually check affected routes, theme persistence, resizing, and
  sketch cleanup when those behaviors change.
- Keep this file current when the target framework, scripts, routes, deployment
  assumptions, or verified baseline change.

- When the user invokes the agent workflow, follow
  [docs/AGENT_WORKFLOW.md](docs/AGENT_WORKFLOW.md) and
  [.codex/agents/coordinator.toml](.codex/agents/coordinator.toml). Delegate bounded
  tasks through the defined roles; apply the ownership/review/integration rules
  above. Ordinary questions do not start a feature batch.
