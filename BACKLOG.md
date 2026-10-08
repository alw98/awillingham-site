# Backlog

Task states live here; [STATUS](STATUS.md) records verification.
Ready means prerequisites are Done; Planned waits for dependencies or selection.
Done requires recorded acceptance. Keep stable ticket IDs and dependencies.
P0 is foundation work, P1 feature/validation work, P2 future capabilities.
Use [the workflow](docs/AGENT_WORKFLOW.md) only for an explicitly invoked parallel
batch; ordinary work does not require agents or a batch.

## Tasks

| ID | Priority | State | Depends on | Deliverable and completion check |
| --- | --- | --- | --- | --- |
| OPS-01 | P0 | Done | - | Repository guidance, agent roles/workflow, sketch skill and repository CI. |
| OPS-02 | P1 | Planned | M1-04 | Accept the first explicitly invoked parallel feature batch with isolated resources, independent review/QA and combined checks. |
| OPS-03 | P1 | Done | M3-01, M3-02, M3-03, M3-04, M3-05, M3-07 | Remove the previous application and deployment hooks; keep required assets and licenses. |
| SEC-01 | P1 | Ready | OPS-01 | Inventory tracked local/configuration files without exposing values; establish secret-free examples and ignored local overrides while preserving runtime behavior. Validate missing/override cases and document any required rotation; no history rewrite is implied. |
| M1-01 | P0 | Done | OPS-01 | Define application routes, HTTP/storage and build boundaries. |
| M1-02 | P0 | Done | M1-01 | ASP.NET Core host with health, validated options, routing and integration tests. |
| M1-03 | P0 | Done | M1-01 | React/strict TypeScript/Vite shell, themes, accessible navigation and tests. |
| M1-04 | P0 | Done | M1-02, M1-03 | One deployable artifact, dev proxy, static/SPA routing, container and product CI. |
| UI-01 | P1 | Done | M1-04 | Original Rubik navigation, palettes, buttons and 26-color bubble editor with Save/Discard. |
| UI-02 | P1 | Done | UI-01 | Plain titles, factual descriptions and necessary control/status text. |
| M2-01 | P1 | Done | M1-04 | Immutable definitions, unique slugs, validated settings, independent factories and deterministic seeds. |
| M2-02 | P1 | Done | M2-01 | Canvas lifecycle, resize/DPR, visibility, input, pause, errors and disposal. |
| M2-03 | P1 | Done | M2-01 | Deterministic Tetris movement, rotation, collision, clearing, spawn reset and elapsed-time behavior. |
| M2-04 | P1 | Done | M2-02, M2-03 | Tetris renderer, keyboard/touch controls, settings and independent previews. |
| M2-05 | P1 | Done | M2-04 | Runtime browser acceptance for lifecycle, input, resize, themes and accessibility. |
| M3-01 | P1 | Done | M2-05 | Sine Sums, Times Tables and Fireworks with controls and distinct routes. |
| M3-02 | P1 | Done | M2-05 | Particle, Flow and Drawn Field with independent settings and bounded work. |
| M3-03 | P1 | Done | M2-05 | Skyscrapers, Stained Glass, Snow Globe and Bouncy DVD with resize/disposal checks. |
| M3-04 | P1 | Done | M2-05 | Both edge-detection presets with cancellable workers and image fixtures. |
| M3-05 | P1 | Done | M1-04 | Theme inputs, accessible editor, validated preferences and storage recovery. No old-site import. |
| M3-06 | P1 | Ready | M1-04 | Timer item editing, deadline-based execution, pause/resume/reset and persistence; fake-clock and browser transition checks. |
| M3-07 | P1 | Done | M1-04 | Euler 1–10 cancellable workers, known-answer tests and navigation cleanup. |
| M3-08 | P1 | Planned | M3-01, M3-02, M3-03, M3-04, M3-05, M3-06, M3-07 | Release acceptance after timer completion: browser/device and sustained-load checks, deployment/rollback rehearsal. |
| DATA-01 | P2 | Planned | M1-04, SEC-01 | PostgreSQL/EF Core/Npgsql with stable internal user IDs, explicit migrations, development Compose profile, and isolated real-PostgreSQL integration tests. Validate upgrade and backup/restore; database ports are private. |
| AUTH-01 | P2 | Planned | DATA-01 | Select external provider(s), then implement ASP.NET Core OAuth/OIDC login, local account mapping, cookie sessions, CSRF protection, safe return URLs, and logout. Unique provider/subject identities and authorization tests prevent cross-account access; mock-provider tests plus real provider smoke evidence are required. |
| DATA-02 | P2 | Planned | AUTH-01, M3-05, M3-06 | Authenticated preset/theme/schedule sync with per-user ownership, generated API contracts, validation, and optimistic concurrency. Local-to-account import is explicit; conflict/offline/sign-out cases preserve data and account isolation. |
| HOST-01 | P2 | Planned | M1-04, SEC-01 | Provider-neutral release image plus Hetzner runbook/configuration: Docker Compose, Caddy TLS proxy, firewall/SSH, secrets, persistent Data Protection keys, health, logs, and rollback. Rehearse locally; record region/domain/architecture choices before provisioning. |
| HOST-02 | P2 | Planned | HOST-01, M3-08 | Deploy an authorized Hetzner staging environment, verify DNS/TLS/direct routes, proxy headers, restart and rollback. Record actual host/revision/resources; production cutover is a separate release decision. |
| HOST-03 | P2 | Planned | HOST-01, DATA-01 | Database-aware off-host backups and restoration drill with recovery objectives, volume handling, and secrets/key recovery. Hetzner VM backups alone are not database recovery proof. |
| EXP-01 | P2 | Deferred | M3-08 | Decide whether to add further sketches; no inactive experiments ship by default. |
| SCALE-01 | P2 | Deferred | HOST-02 | Revisit multiple instances, distributed caching, background services, or advanced graphics only against measured needs. |

Next: M3-06 (working timer); SEC-01 can proceed independently. Database, accounts
and Hetzner hosting remain planned in [architecture](docs/architecture.md).
