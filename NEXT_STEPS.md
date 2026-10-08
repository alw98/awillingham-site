# Next implementation: M1 foundation

Updated 2026-10-07 (America/Chicago). The existing site remains the implementation;
the rebuild begins after repository preparation. Task states live in
[BACKLOG.md](BACKLOG.md); actual evidence is in [STATUS.md](STATUS.md).
[Architecture](docs/architecture.md) controls target boundaries.

## Runnable target

Build a new C#/React application shell with public home/gallery/theme/Euler/timer
navigation and clear placeholder boundaries for features not yet ported. A clean
checkout can install, check, test, build, and run one production artifact.
The host needs no PostgreSQL connection or OAuth credentials for anonymous use.
Database/login/Hetzner design seams exist, but those services are not activated.

Do not remove the legacy app or claim feature parity at this gate. The accepted
reference sketch and broader ports are M2/M3.

## M1-01: freeze shared contracts first

Deliver a bounded foundation contract, proposed at
`docs/contracts/FOUNDATION.md`, with:

- Exact supported SDK/Node/package families and installation commands; use
  released supported versions and lockfiles rather than the local preview SDK.
- New source/test/build-output paths, namespaces, package manager policy, and
  treatment of the root legacy .NET project's recursive globs. New projects must
  not accidentally compile into the legacy project.
- Public routes and legacy URL/preset inventory, including duplicate Times Tables
  behavior. Assign stable new IDs/slugs independently of labels.
- Static/prerender output, SPA fallback, missing-asset behavior, `/api` reservation,
  JSON error contract, health paths, and development proxy/origin rules.
- Theme tokens, browser-only canvas initialization, and a boundary for future
  independently instantiated sketch engines.
- Explicit persisted preference/schedule/preset schemas and legacy key/import
  policy. No blanket serialization of live engine objects or automatic data loss.
- Future account ownership represented by stable internal user IDs, server-handled
  OAuth/OIDC sessions, PostgreSQL/EF migration ownership, and feature-disabled
  configuration behavior. Empty interfaces are not proof of these features.
- Build/container/CI/lockfile ownership, generated OpenAPI client workflow when
  APIs exist, supported local ports, and the two implementation contracts.

Done requires a consistent inventory and executable acceptance plan for both
lanes, with every shared file assigned to one owner. Decisions in the architecture
document can be refined here; contradictory documents must be reconciled.
Land any required shared root-project exclusions before either lane adds nested
C# projects/tests. A written exclusion plan alone does not protect the legacy build.

## M1-02: server lane

Own `src/Site.Server/**` and `tests/Site.Server.Tests/**` after the contract is
accepted. Build a small ASP.NET Core host with feature-oriented endpoint groups,
health, typed/validated options, API error handling, and a static-asset integration
point. Keep C# dependency injection at the composition boundary.

Add meaningful integration checks for health, reserved API routes, and error
responses using xUnit/WebApplicationFactory. Browser configuration must expose
only public values. Shared root solution/project/build changes belong to the
coordinator unless specifically assigned to this lane.

## M1-03: frontend lane

Own `src/Site.Web/**`, excluding any lockfile/configuration files assigned to the
coordinator. Build the React shell, routes, theme tokens, navigation, accessible
focus/error/loading behavior, strict type checking, lint including TSX, and Vitest
checks. Configure React Router for the agreed static/SPA model.

Do not import p5 or browser globals during prerendering. Sketch pages remain
bounded placeholders until M2. Keep the feature boundaries for gallery, themes,
timer, and Euler visible without inventing backend calls for local behavior.

Clean-install/typecheck/test/lint/production-build success is required. Preserve
the current lockfile and dependencies in the legacy application until cutover.

## M1-04: sequential integration and delivery

Integrate the accepted server and frontend candidates in contract order. The
coordinator owns the production asset copy/publish boundary, route fallback,
root scripts, container, and CI. Build assets before .NET publish so the final
artifact contains the correct static files.

Build the release image once and run that artifact locally. Node is a build-time
dependency. Reserve API and auth callback paths from SPA fallbacks; a missing
JavaScript asset must not receive an HTML response. Define HTML versus immutable
asset cache behavior. Record HTTPS/proxy handling and graceful startup failures.

No root AWS hook is repurposed for Hetzner implicitly. Keep legacy deployment
assets available until M3-08; HOST-01 creates the future runbook.

## Parallel assignment boundaries

| Area | Owner | Independence condition |
| --- | --- | --- |
| Foundation contract, tracking, root solution/project, CI, image, shared pins | Coordinator | One writer; prerequisites land before lane work |
| New server and backend tests | M1-02 owner | Accepted HTTP/static-output contract; own outputs and ports |
| New client and frontend tests | M1-03 owner | Accepted routes/tokens/output contract; dependency edits coordinated |
| Future schema/migrations/account mapping | Named data/auth contract owner | Shared changes sequence; separate databases are required for tests |
| Legacy app and assets | Coordinator or explicit migration owner | Unrelated ports do not edit common legacy files |

At most two implementation lanes and three child agents. Independent review and
QA can use the third slot sequentially. Threads, output directories, browsers,
ports, test data, and database schemas all need ownership; directory separation
alone does not establish independence.

## M1 gate

| Check | Required evidence |
| --- | --- |
| Reproducibility | Clean checkout/install with committed SDK/Node/dependency versions and no borrowed `node_modules` or build output |
| Static checks | Repository validation, C#/TS checks, lint including TSX, and production build pass independently |
| Tests | Backend integration and frontend behavior suites pass; current baseline failures are resolved in the new app |
| Routing | Direct public/client routes work; unknown API and missing assets return appropriate errors |
| Browser | Real navigation, theme, keyboard focus, responsive shell, and error/loading behavior recorded |
| Packaging | One locally running release container contains the matching frontend/backend revision |
| Future seams | Anonymous startup without database/login; no server secrets in browser assets; future account/data/hosting contracts documented |
| Integration | Exact candidate review/QA and combined checks recorded; no unexplained shared-file changes |

Unavailable required evidence leaves its acceptance incomplete. Repository-check
CI alone is not this product gate. OPS-02 records the first real parallel batch;
M2 begins once the foundation gate passes or its scope is explicitly revised.

## Commands available today

These run from the current root, not the proposed new layout:

```sh
node Scripts/check-repo.mjs
dotnet build awillingham-site.csproj --configuration Release --no-restore
```

From `Web/web-app`:

```sh
npm test -- --runInBand
npm run lint
npm run bundle
node node_modules/typescript/bin/tsc --noEmit
```

The final command has known dependency declaration failures. New-app scripts,
product CI, containers, database/login checks, and Hetzner tooling are deliverables,
not commands that exist today. See the [workflow](docs/AGENT_WORKFLOW.md) for
task contracts and isolated resource setup.

## First task

Pull **M1-01** after OPS-01 closes. Establish an accepted committed setup/base
before spawning implementation worktrees. Then start the independent server and
frontend lanes; finish with shared integration and actual-browser/container checks.
