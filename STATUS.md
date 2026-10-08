# Interactive gallery status

Updated 2026-10-07 (America/Chicago).

## Actual progress

The existing ASP.NET Core/React gallery is still the running implementation.
Repository preparation is complete locally; **M1-01 is the next Ready ticket**.
**The rebuild, PostgreSQL/EF Core,
external OAuth/OIDC login, and Hetzner deployment are not implemented.**

[BACKLOG.md](BACKLOG.md) alone owns task states. [NEXT_STEPS.md](NEXT_STEPS.md)
describes the next implementation; [architecture](docs/architecture.md) records
the agreed direction and remaining choices.

| Area | Actual state |
| --- | --- |
| Existing app | `net10.0` MVC host; React 18/TypeScript 4.7/Webpack/MobX/p5 client under `Web/web-app` |
| Gallery | 15 registered entries, with duplicate Times Tables route names; inactive experiments remain in source |
| Theme/Euler | Existing local theme persistence/editor and worker-based Euler 1-10 page |
| Timer | Placeholder UI/store; no working schedule editor/countdown |
| Data/auth | Browser local storage only; no PostgreSQL, EF Core, or login |
| Hosting | Legacy AWS/nginx/systemd assets; live deployment not inspected; scripts still target .NET 6 |
| Target foundation | Documented; new `src/Site.Server`/`src/Site.Web` projects and product CI do not exist yet |
| Agent workflow | Project-specific setup validated locally; no live parallel feature batch or independent product acceptance claimed |

## Evidence boundary and preserved work

Inspected HEAD: `36c308a` (`Added AGENTS.md`), on `main`. The earlier source
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

## Repository-preparation validation

OPS-01 is complete for preparation, not for live parallel feature execution.
This is an uncommitted working-tree candidate based on `36c308a`; its final scoped
SHA-256 manifest is `.agent-artifacts/preparation-validation/manifest.json`.
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
- SDK/Node/package patch versions and exact migration mechanics are frozen by
  M1-01, after checking compatibility. Earlier local preview versions are not pins.

## Limits and next action

The standard sandbox runner currently fails before process creation with
`helper_unknown_error: setup refresh had errors`; approved outside-sandbox shell
execution is available. This is an execution-environment limitation, not a product
test failure or permission change in the project configuration.

The standalone frontend type failures, incomplete lint scope, old deployment
assumptions, local-storage compatibility, and missing browser coverage remain
visible work. None blocks writing the M1-01 foundation contract. A real parallel
batch needs an accepted committed base containing its setup; worktrees do not
inherit these uncommitted preparation files.
