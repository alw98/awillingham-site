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
[Application contract](docs/contracts/FOUNDATION.md) defines the toolchain,
routes, HTTP/storage and ownership contracts. [Sketch runtime](docs/contracts/SKETCH_RUNTIME.md)
defines renderer lifecycle and configuration. Run `node Scripts/check-foundation.mjs`
to check toolchain pins and build boundaries.

## Current application

The only application lives in `src/Site.Server` and `src/Site.Web`. `Site.slnx`
contains the server and `tests/Site.Server.Tests`; Chromium checks live in
`tests/browser`.

Use SDK 10.0.401, Node 24.21.0 and npm 11.19.0 from `global.json` and
`src/Site.Web/package.json`; `.node-version` selects the same Node version. See README for editor tasks
and development commands. `node Scripts/build-site.mjs --configuration Release`
performs clean installation, strict types, TSX lint, frontend tests/build, locked
.NET restore, backend build/tests and publish to `.artifacts/site/publish`.
The final Docker image runs without Node. Start the published server from its
publish directory. Development uses API port 5200 and frontend port 5300;
production/browser checks default to port 5400. Assign isolated ports/storage
when another server is running.

Health paths are `/health/live` and `/health/ready`; API/auth/health reservations
never receive SPA fallback. Development defaults to ApiOnly; Production requires
generated client assets. Forwarded headers require explicit trusted proxy IPs.
The server project must not glob sibling client sources, worktrees or evidence.

All 15 gallery presets use native Canvas2D, with Matter.js isolated to Snow Globe.
Keep preview/full-page state independent, animate visible previews, pause hidden
work, and dispose frames/listeners/workers. Settings belong behind the gear;
About belongs at the top. Options survive navigation within the current session.
React owns the catalog in `app/features/gallery/catalog.ts`. Keep current
slugs stable, including both Times Tables destinations. The server does
not load gallery metadata or redirect old links; unknown slugs render Not Found.

The 26-color editor has draft-colored bubbles, validated versioned preferences
under `aw.gallery.preferences.v1`. No old-site import or migration is supported.
Never reset real browser data to pass checks. Euler 1–10 executes in cancellable workers. The timer is the
original Add Item prototype; a functioning countdown remains M3-06.

## Product and implementation conventions

Product copy should be plain and functional. The user rejected added slogans,
poetic headings, decorative introductions and promotional descriptions. Use page
names, factual descriptions, control labels and necessary recovery instructions.
Preserve the original styling and bubble editor. The original Home introduction
is an explicit user-requested exception:
"This is an interactive gallery made by Armond Willingham, with love and care.
It's still a work in progress."

Keep feature UI, engines and tests together under `app/features`; shared UI and
tokens belong in `app/shared`. Simulation is testable outside React. Configuration
is serializable and validated; factories create fresh mutable instances. Use CSS
tokens/modules and explicit theme inputs for canvas rendering. Follow existing
formatting and avoid unrelated churn. Dependency/lockfile changes are intentional
and owned by the shared tooling owner during a batch.

Run relevant frontend behavior tests, types/lint/build and real-browser checks for
rendering, input, resize, theme, persistence or lifecycle changes. Backend changes
require build/integration checks. Use `dotnet test --project
tests/Site.Server.Tests/Site.Server.Tests.csproj` with the runner in global.json.
The full release pipeline plus Chromium suite is the combined product gate.
Record unavailable checks and practical limits; local checks do not prove remote
deployment, other browsers or sustained load.

Do not commit `node_modules`, `bin`, `obj`, generated assets/build output,
`.artifacts`, `.worktrees` or `.agent-artifacts`. Preserve existing user changes.
Keep guidance current when commands, routes, contracts or verified behavior change.
