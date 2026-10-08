# Next implementation: timer and release acceptance

Updated 2026-10-08 (America/Chicago). Task states live in
[BACKLOG.md](BACKLOG.md); evidence and limits live in [STATUS.md](STATUS.md).
[Architecture](docs/architecture.md),
[foundation revision 2](docs/contracts/FOUNDATION.md) and
[sketch runtime revision 3](docs/contracts/SKETCH_RUNTIME.md) control boundaries.

The local replacement implements the original 15-preset gallery, full-page
canvases, gear settings, top About panels, retained session options, color editor,
explicit legacy theme import and Euler 1–10 workers. Original visual and behavior
regressions from the parity audit are repaired; STATUS records concrete checks
and retained accessibility/resource changes. Legacy source and AWS hooks were
removed at the user's request after that acceptance; Git history preserves them.

## Next pull

M3-06 can now be selected for a functioning timer: define schedule/item editing,
deadline-based execution, pause/resume/reset, browser persistence and explicit
TimerStore import. The current Add Item panel matches the unfinished original;
it is not a completed countdown. SEC-01 remains independently Ready.

M3-08 remains the release acceptance gate after timer completion. Rehearse
rollback/deployment and review broader browser/device and sustained-load behavior.
Source recovery uses the Git revision documented in README. PostgreSQL, external login and
Hetzner provisioning remain future work and are unnecessary for anonymous use.

## Verification and delivery

See [README](README.md) for build, development and browser commands. The release
pipeline performs strict clean installation, types/lint/tests, production assets
and locked backend build/test/publish. Browser tests target a running production
artifact and disposable storage. Run repository checks after guidance changes.

For an explicitly invoked parallel batch, use the
[workflow](docs/AGENT_WORKFLOW.md) and [task template](docs/templates/AGENT_TASK.md).
Establish an accepted committed base first; isolated worktrees do not inherit
the current dirty candidate. Assign absolute paths/resources, preserve user work,
and perform independent review/QA and sequential combined checks for that batch.
