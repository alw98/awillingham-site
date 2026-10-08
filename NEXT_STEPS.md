# Next steps

Task states live in [BACKLOG.md](BACKLOG.md); checks and limits live in
[STATUS.md](STATUS.md). See [README](README.md) for development and test commands.

- M3-06: implement timer item editing, deadline-based countdown, pause/resume,
  reset and browser persistence. The current Add Item panel is a prototype.
- SEC-01: review configuration and local overrides before deployment.
- M3-08: broader browser/device, sustained-load and release/rollback acceptance
  after timer completion.
- PostgreSQL, external OAuth/OIDC login and Hetzner hosting remain future work
  described in [architecture](docs/architecture.md). Anonymous use needs none of them.

Use the [workflow](docs/AGENT_WORKFLOW.md) and
[task template](docs/templates/AGENT_TASK.md) only for an explicitly invoked
parallel batch. Start from an accepted committed base, assign isolated resources,
and finish independent review/QA and sequential integration checks.
