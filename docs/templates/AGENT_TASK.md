# Task contract: <ticket ID and title>

Coordinator-owned record. State lives in [BACKLOG.md](../../BACKLOG.md).
Use [the workflow](../AGENT_WORKFLOW.md); remove unused fields and replace the
examples before assigning work.

## Outcome and boundaries

- Ticket and dependency IDs:
- User-visible result:
- Owned absolute checkout, branch, and paths/symbols:
- Explicit exclusions:
- Shared contract owner(s) and frozen contract revision:
- Current versus proposed paths/APIs:
- Browser/local-storage/API/database compatibility impact:
- Dependency/lockfile/root-build edits and their owner:

## Candidate and people

- Integration checkout/branch:
- Exact accepted base SHA and dependency SHAs:
- Implementer role/model/effort (actual):
- Independent reviewer:
- Independent QA:
- Integration order:

Workers are not alone. Preserve other agents' and the user's changes. Notify the
coordinator before crossing owned boundaries; do not edit shared tracking or
another lane's checkout.

## Resources

- HTTP/HTTPS/dev-server ports and exact launch commands:
- Local `bin`/`obj`/frontend/generated output paths:
- Disposable browser profile and storage:
- Worker/test fixture seeds and clocks:
- Disposable database/provider callback details, if applicable:
- Ignored evidence directory:
- Owned process/service cleanup:

## Acceptance

| Criterion | Exact check/command | Required evidence |
| --- | --- | --- |
| Feature behavior | Define a meaningful behavior/reproduction | Result and candidate revision |
| Compatibility | Define route/data/configuration cases | Preserved/imported data and failure behavior |
| Build/type/lint/tests | Select actual applicable commands | Exit codes and known baseline differences |
| Browser/runtime | Define cases when required | Actual environment, interaction, and observed result |
| Integration | Define combined check | Integrated revision and affected rechecks |

## Completion evidence

- Exact candidate SHA (or labeled setup-only frozen hash manifest):
- Changed paths and behavior:
- Commands/environment/outcomes:
- Review findings and disposition:
- QA criteria and results:
- Missing checks, concrete blockers, and limits:
- Data/resources preserved or cleaned:
- Integration SHA and combined verification:

Do not mark a ticket Done on implementation claims alone. Fixes change the
candidate and require affected evidence to be renewed.
