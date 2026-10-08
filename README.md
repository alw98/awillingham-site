# Armond Willingham's interactive gallery

An ASP.NET Core host for a React/TypeScript website with interactive sketches,
theme editing, Project Euler solutions, and a timer prototype.

The current application targets **.NET 10** and uses React 18, Webpack, MobX, and
p5. A feature-by-feature rebuild is planned with React 19, Vite, a dedicated
sketch runtime, and a small ASP.NET Core host/API. PostgreSQL with EF Core,
external OAuth/OIDC login, and Hetzner hosting are planned later capabilities.
They are not implemented or required to run the current gallery.

## Start here

| Document | Purpose |
| --- | --- |
| [AGENTS.md](AGENTS.md) | Current source map, commands, and agent instructions |
| [BACKLOG.md](BACKLOG.md) | Authoritative task states, dependencies, and completion checks |
| [STATUS.md](STATUS.md) | Actual progress, validation evidence, and limits |
| [NEXT_STEPS.md](NEXT_STEPS.md) | Next implementation sequence and milestone gate |
| [Architecture](docs/architecture.md) | Target boundaries and future database/auth/hosting design |
| [Agent workflow](docs/AGENT_WORKFLOW.md) | Ownership, isolated worktrees, review, and integration |

## Run the existing application

Use an SDK supporting `net10.0` and Node/npm. From the repository root:

```sh
dotnet restore awillingham-site.csproj
dotnet build awillingham-site.csproj --configuration Release
cd Web/web-app
npm ci --legacy-peer-deps
npm run bundle
```

Run the backend from the root:

```sh
dotnet run --project awillingham-site.csproj --launch-profile awillingham_site
```

Open `https://localhost:7100`. In a second terminal under `Web/web-app`, use
`npm run bundle:watch` while editing. The backend and frontend build separately.
Fresh dependency installation is not part of the recorded local baseline.

## Repository preparation check

```sh
node Scripts/check-repo.mjs
node --test Scripts/check-repo.test.mjs
```

This dependency-free check validates local documentation links, planning task
dependencies, agent entry points, and stale copied project references. It does
not replace application builds or browser tests. Full product CI is an explicit
foundation milestone; the current standalone TypeScript check has known failures.

Legacy AWS hooks under `Scripts/` and `DevOps/` still assume .NET 6 and should
not be used as local setup. Migration and hosting work are tracked in the backlog.
