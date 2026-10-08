# Armond Willingham's interactive gallery

An ASP.NET Core host for a React/TypeScript website with interactive sketches,
theme editing, Project Euler solutions, and a timer prototype.

The application uses .NET 10, React 19, strict TypeScript and Vite. It preserves
the original styling, 15 gallery presets, gear settings, top About panels and
bubble color editor. Euler 1–10 runs in workers. The timer is an Add Item prototype.

[STATUS](STATUS.md) records checks and limits; [BACKLOG](BACKLOG.md) and
[NEXT_STEPS](NEXT_STEPS.md) track future work. Agent instructions are in
[AGENTS.md](AGENTS.md), with [architecture](docs/architecture.md),
[application contracts](docs/contracts/FOUNDATION.md) and the
[parallel workflow](docs/AGENT_WORKFLOW.md).

## Run the site

Use SDK 10.0.401 (`global.json`), Node 24.21.0 (`.node-version`) and npm 11.19.0
(`src/Site.Web/package.json`). From the root:

```sh
node Scripts/build-site.mjs --configuration Release
cd .artifacts/site/publish
dotnet Site.Server.dll --urls http://127.0.0.1:5400
```

The build performs a clean strict npm install, types, lint, the frontend tests,
production client build, locked .NET restore, build, backend tests and publish.
It replaces only owned generated client assets and release output. Open
`http://127.0.0.1:5400`. Production needs no database or login credentials.

Alternatively Docker supplies the pinned build toolchain:

```sh
docker build --platform linux/amd64 -t gallery:local .
docker run --rm --name gallery-local -p 127.0.0.1:5400:8080 gallery:local
```

In VS Code, **Terminal > Run Task > site: dev** (or **Ctrl+Shift+B**) installs
frontend dependencies and starts both development servers in split terminals.
Open `http://127.0.0.1:5300`. **site: production** runs the full release pipeline
and starts the published app at `http://127.0.0.1:5400`. Both tasks require the
pinned toolchain above. Use **Tasks: Terminate Task** to stop the running server
tasks. Definitions are in [.vscode/tasks.json](.vscode/tasks.json).

For development without editor tasks, run the API and Vite in separate terminals:

```sh
dotnet run --project src/Site.Server --no-launch-profile -- --environment Development --urls http://127.0.0.1:5200
npm --prefix src/Site.Web ci --include=dev --strict-peer-deps
npm --prefix src/Site.Web run dev
```

Open `http://127.0.0.1:5300`. Vite proxies `/api`, `/health`, `/auth` to the API;
`SITE_DEV_API_TARGET` can override that server-only target. Health checks are
`/health/live` and `/health/ready`. TLS belongs at the production edge; forwarded
headers are accepted only from explicitly configured `Proxy:TrustedProxies` IPs.

Browser checks run against the published app or release container on port 5400,
using disposable browser storage (`SITE_BASE_URL` overrides the URL):

```sh
node src/Site.Web/node_modules/@playwright/test/cli.js install chromium
npm --prefix src/Site.Web run test:browser
```

The product workflow builds and tests that image, then checks UI, accessibility,
routes, storage and HTTP behavior. Hosted CI has not yet run on this candidate.

## Repository checks

```sh
node Scripts/check-repo.mjs
node Scripts/check-foundation.mjs
node --test Scripts/check-repo.test.mjs
```

The repository check validates documentation links, task dependencies and agent
entry points. The foundation check verifies toolchain/lockfile pins and build
boundaries. Client tests cover gallery registration and routes. These checks complement the
application build and browser tests. Product CI is in
[.github/workflows/product.yml](.github/workflows/product.yml).

## Source layout

- `src/Site.Server`: ASP.NET Core host, health endpoints and static routing.
- `src/Site.Web`: React UI, Canvas2D sketches, theme editor and workers.
- `tests/Site.Server.Tests`, `tests/browser`: backend and Chromium checks.
- `Scripts`: reproducible release build and repository checks.
- `Site.slnx`: the single solution, containing only the current server and tests.

The gallery catalog lives in `src/Site.Web/app/features/gallery/catalog.ts`.
The server serves static files and the SPA fallback; it has no gallery registry or
old-link redirects. Unknown sketch URLs show Not Found. Preferences use the validated
`aw.gallery.preferences.v1` record; there are no imports from the old site.

The original client license is preserved at [LICENSE](LICENSE). Rubik's font
license remains alongside its assets.
