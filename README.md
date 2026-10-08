# Armond Willingham's interactive gallery

An ASP.NET Core host for a React/TypeScript website with interactive sketches,
theme editing, Project Euler solutions, and a timer prototype.

The application in `src/` uses **.NET 10**, React 19, strict TypeScript,
Vite and React Router. It runs all 15 gallery presets, with viewport-sized
canvases, gear settings and top About panels. It includes the original styling,
bubble color editor, explicit saved-theme import, Euler 1–10 workers and safe
saved-data recovery. The timer retains the original Add Item prototype; a
working countdown remains planned. See STATUS for parity evidence and limits.
The legacy MVC/Webpack application and AWS deployment scripts were retired on
2026-10-08 after local parity acceptance. Previous versions remain in Git history.
PostgreSQL, external login and Hetzner hosting are planned later capabilities.

## Start here

| Document | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Current source map, commands, and agent instructions |
| [BACKLOG.md](BACKLOG.md) | Authoritative task states, dependencies, and completion checks |
| [STATUS.md](STATUS.md) | Actual progress, validation evidence, and limits |
| [NEXT_STEPS.md](NEXT_STEPS.md) | Next implementation sequence and milestone gate |
| [Architecture](docs/architecture.md) | Target boundaries and future database/auth/hosting design |
| [Foundation contract](docs/contracts/FOUNDATION.md) | Frozen M1 versions, routes, HTTP/storage rules and lane ownership |
| [Agent workflow](docs/AGENT_WORKFLOW.md) | Ownership, isolated worktrees, review, and integration |

## Run the site

Install the exact SDK/Node/npm versions in `global.json`, `.node-version` and the
[toolchain manifest](docs/contracts/foundation-toolchain.json). From the root:

```sh
node Scripts/build-site.mjs --configuration Release
cd .artifacts/site/publish
dotnet Site.Server.dll --urls http://127.0.0.1:5400
```

The build performs a clean strict npm install, types, lint, the frontend tests,
production client build, locked .NET restore, build, 34 backend tests and publish.
It replaces only owned generated client assets and release output. Open
`http://127.0.0.1:5400`. Production needs no database or login credentials.

Alternatively Docker supplies the pinned build toolchain:

```sh
docker build --platform linux/amd64 -t gallery:m1 .
docker run --rm --name gallery-m1 -p 127.0.0.1:5400:8080 gallery:m1
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

## Repository preparation check

```sh
node Scripts/check-repo.mjs
node Scripts/check-foundation.mjs
node --test Scripts/check-repo.test.mjs
```

The repository check validates documentation links, task dependencies, agent entry
points and stale copied project references. The foundation check verifies the
15-preset/14-old-URL compatibility map, exact toolchain/lockfile pins, solution
boundaries and absence of retired entry points. These checks complement the
application build and browser tests. Product CI is in
[.github/workflows/product.yml](.github/workflows/product.yml).

## Source layout and recovery

- `src/Site.Server`: ASP.NET Core host, health endpoints and static routing.
- `src/Site.Web`: React UI, Canvas2D sketches, theme editor and workers.
- `tests/Site.Server.Tests`, `tests/browser`: backend and Chromium checks.
- `Scripts`: reproducible release build and repository checks.
- `Site.slnx`: the single solution, containing only the current server and tests.

Old gallery URLs still redirect to their canonical routes. Existing `ThemeStore`
and `TimerStore` browser values remain untouched; Colors offers validated theme
import. The compatibility inventory is data used by both client and server.

For source recovery, the last legacy revision is
`07db3fe363465e3c9c842ca8b9857cbd9c517f63`. Inspect it with `git show` or create a
separate checkout with `git worktree add --detach <recovery-directory> <revision>`.
This preserves the current checkout and browser data. That historical application
uses its own build instructions and is not the current release path. Remote
deployment and rollback rehearsal remain future release work.

The original client license is preserved at [LICENSE](LICENSE). Rubik's font
license remains alongside its assets.
