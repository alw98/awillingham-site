# Interactive gallery backlog

Updated 2026-10-07 (America/Chicago). This is the source of task states.
[STATUS.md](STATUS.md) records evidence, [NEXT_STEPS.md](NEXT_STEPS.md) expands the
next milestone, and [architecture](docs/architecture.md) defines the target design.

## Working rules

- **Ready:** prerequisites are Done and scope/completion checks are defined.
  **In progress:** actively assigned. **Planned:** awaiting dependencies or selection.
  **Blocked:** a concrete obstacle is recorded. **Done:** acceptance has evidence.
  **Deferred:** intentionally outside the current roadmap.
- **P0:** current foundation milestone. **P1:** next feature work or cross-cutting
  validation. **P2:** later capabilities. Dependencies take precedence over priority.
- Keep stable IDs. Split a ticket before assignment if its scope cannot fit one
  bounded contract. Every assigned ticket gets paths, exclusions, resources,
  base revision, acceptance, and an integration order.
- Use at most two independent implementation lanes and three child agents under
  the [agent workflow](docs/AGENT_WORKFLOW.md). Shared contracts land first; the
  coordinator owns tracking, lockfiles, migrations, CI, and sequential integration.
- Product Done requires the checks in its contract, independent review/QA for a
  parallel batch, and combined integration checks. Preparation can be completed
  with repository/configuration checks; it does not establish live delegation.
- Keep existing routes/assets and browser preferences recoverable during the
  rebuild. Record regressions with reproduction, impact, and an owning ticket.

## Repository preparation

| ID | Priority | State | Depends on | Deliverable and completion check |
| --- | --- | --- | --- | --- |
| OPS-01 | P0 | Done | - | Project-specific planning, architecture, role instructions, workflow/task template, sketch skill, README, ignored agent outputs, nested-worktree build exclusions, and repository check/CI. Local links/task graph, TOML, skill validation, and backend exclusion probe passed; evidence and working-tree candidate boundary are in STATUS. Original templates are archived in ignored preparation output. |
| OPS-02 | P1 | Planned | M1-04 | First actual parallel foundation batch is accepted: committed bases, isolated worktrees/resources, independent candidate review/QA, sequential integration, and combined checks recorded. Configuration parsing alone cannot close this ticket. |
| SEC-01 | P1 | Ready | OPS-01 | Inventory tracked local/configuration files without exposing values; establish secret-free examples and ignored local overrides while preserving runtime behavior. Validate missing/override cases and document any required rotation; no history rewrite is implied. |

## M1: reproducible C# and React foundation

The first implementation milestone is a runnable replacement shell and a reliable
verification path. It does not migrate the whole gallery or activate accounts.

| ID | Priority | State | Depends on | Deliverable and completion check |
| --- | --- | --- | --- | --- |
| M1-01 | P0 | Ready | OPS-01 | Freeze foundation contract: exact supported SDK/Node/package versions, source layout, route/asset ownership, API error/fallback policy, theme tokens, local-storage compatibility, contract generation, dev ports, and build/container ownership. Inventory all active sketch presets and legacy URLs. Define independent server/client contracts and acceptance before moving code. |
| M1-02 | P0 | Planned | M1-01 | New `src/Site.Server` ASP.NET Core host with feature-oriented Minimal APIs, health endpoints, validated options, and planned static hosting. xUnit/WebApplicationFactory covers health, errors, and reserved API routes. Anonymous startup needs no PostgreSQL or OAuth credentials. |
| M1-03 | P0 | Planned | M1-01 | New `src/Site.Web` React 19/strict TypeScript/Vite/React Router shell, theme tokens, accessible navigation/error pages, and frontend tests. Pin compatible package families; lint covers TSX. Install/typecheck/test/production build pass from a clean checkout. |
| M1-04 | P0 | Planned | M1-02, M1-03 | Integrate one deployable frontend/backend artifact, dev API proxy, SPA/prerender routing, production container, and product CI. Direct client routes work; unknown `/api` and missing assets return 404 rather than HTML. Clean install, both test suites, lint, typecheck, production build, and container smoke checks pass. |

## M2: reference sketch runtime and Tetris

| ID | Priority | State | Depends on | Deliverable and completion check |
| --- | --- | --- | --- | --- |
| M2-01 | P1 | Planned | M1-04 | Freeze sketch definition/lifecycle/input/configuration contracts: stable sketch/preset IDs and slugs, fresh instance factories, serializable versioned presets, deterministic test seeds, and renderer boundary. Type/fixture checks prove unique routes and independent instances. |
| M2-02 | P1 | Planned | M2-01 | Canvas host/p5 adapter handles mount, update, resize/DPR, visibility, focus/input, pause, errors, and disposal. Browser checks cover repeated navigation, offscreen/hidden behavior, and independent previews; reduced motion and resource limits are defined. |
| M2-03 | P1 | Planned | M2-01 | Pure TypeScript Tetris engine with fixed-time updates, movement/rotation/collision, drop, clearing, and restart. Deterministic behavior tests cover edges, multiple lines, spawn failure, and equivalent elapsed time at different render rates. |
| M2-04 | P1 | Planned | M2-02, M2-03 | Tetris renderer, focused keyboard/touch-accessible controls, settings, and gallery entry. Preserve recognizable existing behavior and document intentional changes; preview/full-page instances do not share mutable state. |
| M2-05 | P1 | Planned | M2-04 | Accept the reference runtime: real-browser lifecycle/input/resize/theme checks, seeded visual fixtures, accessibility checks, and recorded performance observations. Publish extension examples and resolve integration findings before broad parallel sketch ports. |

## M3: feature parity and completion

Only select independent ports after the shared runtime is accepted. Break grouped
ports into per-sketch contracts when assigning them; do not give one agent this
entire milestone.

| ID | Priority | State | Depends on | Deliverable and completion check |
| --- | --- | --- | --- | --- |
| M3-01 | P1 | Planned | M2-05 | Port sine sums, Times Tables, and Fireworks with unique preset routes, old-link mappings, and engine/visual/browser checks. |
| M3-02 | P1 | Planned | M2-05 | Port ParticleField, FlowField, and DrawnField with independent configs, bounded work, supported interactions, and lifecycle/performance evidence. |
| M3-03 | P1 | Planned | M2-05 | Port improved Skyscrapers, Stained Glass, and Snow Globe; isolate Matter.js, preserve assets, and verify resize/disposal and expected rendering. |
| M3-04 | P1 | Planned | M2-05 | Port both active simple edge-detection presets with cancellable worker processing where useful, loading/error handling, and fixture-based output checks. Decide inactive experiments separately. |
| M3-05 | P1 | Planned | M1-04 | Theme editor uses validated versioned preferences, CSS tokens, canvas theme inputs, safe legacy `ThemeStore` import, and accessible controls. Save/reset/reload and malformed-storage recovery pass. |
| M3-06 | P1 | Planned | M1-04 | Complete local schedule/timer editing, execution, pause/resume, reset, and persistence. Deadline-based timing survives delayed callbacks; fake-clock and real-browser transition checks pass. Define legacy `TimerStore` import. |
| M3-07 | P1 | Planned | M1-04 | Euler 1-10 page and cancellable worker execution with known-answer tests, progress/error presentation, and route cleanup checks. Preserve current content and URLs. |
| M3-08 | P1 | Planned | M3-01, M3-02, M3-03, M3-04, M3-05, M3-06, M3-07 | Full parity audit and cutover: route/preset/asset inventory accounted for, browser data import verified, performance/accessibility checks recorded, and rollback documented. Retire legacy source/AWS hooks only after this gate; no user-data reset is a migration strategy. |

## Future persistence and login

These are intended capabilities. The foundation must allow them without requiring
them for anonymous/local operation.

| ID | Priority | State | Depends on | Deliverable and completion check |
| --- | --- | --- | --- | --- |
| DATA-01 | P2 | Planned | M1-04, SEC-01 | PostgreSQL/EF Core/Npgsql with stable internal user IDs, explicit migrations, development Compose profile, and isolated real-PostgreSQL integration tests. Validate upgrade and backup/restore; database ports are private. |
| AUTH-01 | P2 | Planned | DATA-01 | Select external provider(s), then implement ASP.NET Core OAuth/OIDC login, local account mapping, cookie sessions, CSRF protection, safe return URLs, and logout. Unique provider/subject identities and authorization tests prevent cross-account access; mock-provider tests plus real provider smoke evidence are required. |
| DATA-02 | P2 | Planned | AUTH-01, M3-05, M3-06 | Authenticated preset/theme/schedule sync with per-user ownership, generated API contracts, validation, and optimistic concurrency. Local-to-account import is explicit; conflict/offline/sign-out cases preserve data and account isolation. |

## Hetzner delivery and operations

| ID | Priority | State | Depends on | Deliverable and completion check |
| --- | --- | --- | --- | --- |
| HOST-01 | P2 | Planned | M1-04, SEC-01 | Provider-neutral release image plus Hetzner runbook/configuration: Docker Compose, Caddy TLS proxy, firewall/SSH, secrets, persistent Data Protection keys, health, logs, and rollback. Rehearse locally; record region/domain/architecture choices before provisioning. |
| HOST-02 | P2 | Planned | HOST-01, M3-08 | Deploy an authorized Hetzner staging environment, verify DNS/TLS/direct routes, proxy headers, restart and rollback. Record actual host/revision/resources; production cutover is a separate release decision. |
| HOST-03 | P2 | Planned | HOST-01, DATA-01 | Database-aware off-host backups and restoration drill with recovery objectives, volume handling, and secrets/key recovery. Hetzner VM backups alone are not database recovery proof. |

## Deferred scope

| ID | Priority | State | Depends on | Deliverable and completion check |
| --- | --- | --- | --- | --- |
| EXP-01 | P2 | Deferred | M3-08 | Decide whether to expose Canny edge detection, Purgatory, Bouncy DVD, and original Skyscrapers; current source existence is not a parity requirement. |
| SCALE-01 | P2 | Deferred | HOST-02 | Revisit multiple instances, distributed caching, background services, or advanced graphics only against measured needs. |

## Next pull

After repository preparation is verified, pull **M1-01**. Freeze the foundation
contract before starting M1-02 and M1-03 as separate implementation lanes.
SEC-01 is an optional independent hygiene ticket with a coordinator-owned scope.
