# Interactive gallery agent workflow

Updated 2026-10-08 (America/Chicago). [BACKLOG.md](../BACKLOG.md) owns task states;
[STATUS.md](../STATUS.md) records evidence; [NEXT_STEPS.md](../NEXT_STEPS.md) expands
the next gate. [Architecture](architecture.md) defines the target and migration
boundaries; [AGENTS.md](../AGENTS.md) distinguishes current source from that target.

## Invocation and read order

Ordinary questions and repository preparation do not automatically launch feature
batches. Use parallel agents when the user invokes this workflow or authorizes a
parallel batch. Prepare bounded contracts before implementation. Read AGENTS,
README, STATUS, NEXT_STEPS, BACKLOG, architecture, this guide, your role, and your
task contract. Read narrower AGENTS files if the assigned directory has any.

## Roles and capacity

Custom roles live in `.codex/agents/*.toml`. Preserve the existing model policy:

| Role | Responsibility | Model / effort |
| --- | --- | --- |
| coordinator | Shared contracts, tracking, resources, integration | gpt-6.1-sol / high |
| architect | Read-only boundaries, data/lifecycle risks, dependencies | gpt-6.1-sol / high |
| planner | Read-only bounded ticket/contract proposals | gpt-6.1-sol / medium |
| implementer | One ordinary owned implementation | gpt-6.1-sol / medium |
| implementer_high | Complex engine, migration, authentication, or cross-system work | gpt-6.1-sol / high |
| reviewer | Independent review of the exact candidate | gpt-6.1-sol / high |
| qa | Independent acceptance checks; assigned disposable outputs | gpt-6.1-sol / high |
| support | Narrow lookups or supplied checks; no acceptance decision | gpt-6-luna / high |

At most three children plus the primary, and at most two independent implementation
lanes. Lower runtime limits win. Children do not spawn descendants. Use the third
slot for review/QA sequentially when needed; do not fill it with dependent feature
work. Record actual role/model/effort. Reading a role file does not change an
already running model or grant additional permissions.

Standalone role files and the child-cap settings follow
[official OpenAI documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents).
Project trust, account access, and runtime support still apply; parsing TOML is not
proof of live custom-role execution. Start a fresh project session to load changes.

## Shared ownership

The coordinator owns tracking/task records, root tooling, solution/project files,
CI/container/release configuration, pins and lockfiles unless explicitly delegated.
Assign one owner each for sketch lifecycle/registry contracts, theme tokens,
persisted browser schemas, API/OpenAPI contracts, and database/account migrations.
Land shared prerequisites before feature lanes use them.

Workers are not alone in the codebase. Every assignment names absolute worktree,
owned paths/symbols, exclusions, and shared owners. They must preserve others'
edits and request coordination for overlap. Check outputs, generated inputs,
ports, browser profiles, storage, databases, and .NET globs as well as source paths.

## Batch lifecycle

1. Select up to two independent Ready tickets. Copy
   [the task template](templates/AGENT_TASK.md) to `docs/tasks/<ticket>.md` and
   record acceptance, scope, dependencies, exact base SHAs, owners, resources,
   actual roles/models, review/QA, and integration order.
2. Inspect dirty work. Establish an accepted committed base without silently
   committing, resetting, stashing, or staging unrelated work. Worktrees contain
   committed files only. Shared setup may be prepared in the integration checkout;
   parallel product writes use separate worktrees.
3. Implement only the assigned scope. Run focused behavior checks and required
   build/lint/type checks. Report missing environment/runtime evidence honestly.
4. Freeze the candidate as an immutable commit with exact base/candidate SHAs.
   Independent review examines that diff and acceptance. Fixes get new revisions.
5. Independent QA exercises the frozen candidate on assigned resources. Record
   commands, environment/browser, result per criterion, and remaining limits.
   Compile/static checks do not prove actual browser or cloud behavior.
6. Integrate accepted candidates sequentially in dependency order. Resolve
   conflicts and repeat affected review/QA plus combined checks. Local integration
   does not itself authorize pushing, provisioning, or publishing.
7. The coordinator alone updates BACKLOG, STATUS, NEXT_STEPS, and shared task
   records. Done requires all required evidence; pending checks keep acceptance open.

For setup-only work in a dirty checkout, a base SHA plus frozen scope/hash manifest
can identify the candidate. Label it a working-tree candidate; do not claim it
proves a committed parallel feature batch. Later edits invalidate affected checks.

## Worktree and resource setup

Example, from the repository root, after recording an accepted local commit:

```powershell
git status --short
git worktree add -b agent/M1-02 .worktrees/M1-02 <accepted-local-sha>
```

Use the resulting absolute checkout path for every agent command. Each checkout
owns its client `node_modules`, build outputs, server/test `bin` and `obj`, and
`.artifacts/site/publish`. Share download caches only. `Site.slnx` contains only
the server and backend tests; no root project globs nested worktrees. Git ignore
rules alone do not isolate compiler or publish inputs in any future root project.

Assign distinct API/frontend/production ports and disposable browser storage.
Record launch arguments/environment; do not assume launch profiles respect an
unrecorded override. Do not clear the user's real `ThemeStore` or `TimerStore`.
Future PostgreSQL checks get separate disposable databases; OAuth tests get mock
providers and unique callbacks. No lane runs shared production migrations.

Keep disposable evidence at `.agent-artifacts/<ticket>/<candidate>/`; put concise
durable results in task records. Stop/delete only resources owned by that lane.
Do not copy mutable outputs between worktrees or run overlapping builds in one.

## Checks available now

From the assigned root:

```sh
node Scripts/check-repo.mjs
node Scripts/check-foundation.mjs
node --test Scripts/check-repo.test.mjs
node Scripts/build-site.mjs --configuration Release
```

Start the published application from `.artifacts/site/publish` on the lane's
assigned port, then run `npm --prefix src/Site.Web run test:browser` with
`SITE_BASE_URL` set to that URL. See README for development and container commands.
Strict typechecking includes library declarations, lint includes TSX, and clean
builds use committed npm/NuGet locks. Repository CI complements full product CI.

Optional TOML diagnostic with Python 3.11+:

```powershell
py -3 -c "import pathlib,tomllib; files=list(pathlib.Path('.codex').rglob('*.toml')); [tomllib.loads(p.read_text(encoding='utf-8')) for p in files]; print(f'{len(files)} TOML files parsed')"
```

Use `python3` on other platforms. This does not validate installed-Codex discovery,
permissions, or live role/model execution; OPS-02 owns live batch evidence.

## Kickoff prompt

```text
Act as primary coordinator for the interactive gallery. Follow AGENTS.md,
docs/AGENT_WORKFLOW.md and .codex/agents/coordinator.toml. Read BACKLOG.md,
STATUS.md, NEXT_STEPS.md and docs/architecture.md; recheck dirty work and dependencies.
Use the accepted foundation/runtime contracts and verify their recorded acceptance.
Establish an accepted committed base, then assign up to two independent Ready
tickets to isolated worktrees/resources with explicit ownership.
Use independent exact-candidate review and QA, integrate sequentially, run combined
checks, and update tracking. Cap three children and two implementation lanes.
Keep existing routes/browser data recoverable and database/login optional until
their tickets are implemented. Record unavailable checks without claiming acceptance.
```
