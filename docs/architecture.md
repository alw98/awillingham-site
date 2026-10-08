# Target architecture and migration boundaries

Updated 2026-10-08 (America/Chicago). Direction accepted in the project
conversation; implementation states live only in [BACKLOG.md](../BACKLOG.md).
The application under `src/` implements the original gallery, theme editor, Euler
workers, HTTP host, packaging and product CI. The legacy application and AWS hooks
were retired at the user's request after local parity acceptance. A functioning
timer, database, accounts and remote hosting remain later work.

## Application shape

One feature-oriented ASP.NET Core application serves the compiled React frontend
and any server-owned API. Development uses a Vite server with an API proxy.
Production has one same-origin HTTPS entry point and one application release
image; Node is needed to build assets, not to run the deployed application.

Target technologies: released .NET 10/ASP.NET Core, React 19, strict TypeScript,
Vite, React Router framework mode with runtime SSR disabled, CSS Modules/custom
properties, Zustand for selected shared UI state, and Zod for runtime data
validation. Vitest/React Testing Library, Playwright, and xUnit cover the appropriate
boundaries. [Foundation revision 2](contracts/FOUNDATION.md) and its
[version manifest](contracts/foundation-toolchain.json) now freeze compatible
versions, routes, HTTP/storage rules and shared ownership for M1. The projects, runtime pins and lockfiles are now implemented; see STATUS for
local build and release-image evidence.

React Router can prerender public introduction/gallery pages at build time while
interactive canvases initialize in the browser. The host must serve the agreed
prerender files and fallback artifact; it must reserve `/api`, health, assets,
and future auth callbacks from catch-all HTML handling.

## Application layout

```text
src/Site.Server/             ASP.NET Core composition, feature APIs, infrastructure
src/Site.Web/                React application and feature-local TypeScript
tests/Site.Server.Tests/     Backend unit/integration checks
tests/browser/              Real-browser scenarios and seeded visual fixtures
docs/contracts/             Accepted shared contracts, created as milestones need them
docs/tasks/                 Coordinator-owned active task records
```

Keep frontend feature code/tests together. Keep C# endpoint/request/feature
services together; extract additional assemblies only when a real dependency
boundary warrants it. `Site.slnx` contains only the server and backend tests; no
root .NET project remains. Server publish inputs must stay within its own project
and explicitly approved shared data, without sibling clients or agent outputs.

## Sketch and feature boundaries

- A sketch definition owns stable sketch/preset IDs, a URL slug, label/about
  metadata, serializable defaults/schema, and a lazy implementation factory.
  A definition is immutable; every preview and full page creates its own instance.
- The engine owns simulation/input state and elapsed-time updates. Tetris uses a
  fixed simulation timestep. Rendering consumes engine state; React owns controls,
  navigation, accessibility, and lifecycle orchestration. Frame-level state does
  not flow through a global React store.
- A canvas host owns size/DPR, visibility/pause, focused keyboard/pointer input,
  configuration/theme updates, error reporting, and complete disposal. Native
  Canvas2D renders the sketches; Matter.js belongs to the snow globe implementation.
- Heavy Euler/image operations can use cancellable workers. A navigation or new
  request cannot allow obsolete results to overwrite the current instance.
- Gallery resource policy bounds simultaneous live previews; hidden/offscreen
  canvases pause. Seeded fixtures make behavior and selected visual checks repeatable.
- Theme values are shared design tokens, expressed as CSS custom properties and
  explicit canvas inputs. UI controls preserve keyboard/focus and reduced-motion
  behavior. A failed canvas should not take down navigation.

The registry uses explicit unique slugs and per-preset identifiers. The existing
two Times Tables presets share a legacy URL; migration must record that ambiguity,
preserve the established old destination, and assign distinct new destinations.
Inactive experiments are not automatically included in the parity milestone.

## Local state and compatibility

Component state stays local. Small cross-page preference/timer stores use explicit
actions and selected persistence. Saved data is a versioned JSON shape validated
at the storage boundary; loading supports migration and recoverable malformed data.
Keep transient engine instances, p5 colors, listeners, and runtime resources out
of persisted JSON.

Migrate existing `ThemeStore` and `TimerStore` keys deliberately. Capture disposable
fixtures, define supported import behavior, and retain the old values until import
is confirmed. The running timer derives remaining time from a deadline and handles
background suspension; tests separate a time source from timer transitions.

## Server and API

The host initially supplies static files, health, configuration, and real APIs only
when a feature needs server-owned data. Use typed options/startup validation,
built-in DI, async I/O/cancellation, request validation, consistent ProblemDetails,
structured logs, and health/readiness appropriate to enabled dependencies.
Unknown API paths return API errors; missing assets return 404.

Generate OpenAPI from C# endpoints and generate the client's transport types from
that contract (proposed: `openapi-typescript`/`openapi-fetch`). Type generation
does not replace runtime request validation or authorization. Keep generated
artifacts under one owner and verify regeneration drift. A server-state cache
such as TanStack Query is introduced with actual server-owned feature data.

## PostgreSQL and EF Core

Future persistence uses PostgreSQL, EF Core 10, and the matching Npgsql provider.
Database services are feature-scoped; the composition layer owns connection,
transaction/migration policy, and environment configuration. Anonymous/local
features remain usable while database-backed features are disabled.

Use stable internal user IDs and explicit ownership on saved resources. External
provider IDs, emails, slugs, and local-storage keys are not interchangeable user
identities. Saved presets/settings/schedules carry schema versions; concurrent
server edits use an explicit optimistic-concurrency contract.

Assign one migration owner. Review migrations, run them against disposable real
PostgreSQL databases, test upgrades/constraints, and rehearse backup/restore before
changing retained data. Release migrations execute once through an explicit job,
with deployment/rollback ordering recorded. Multiple agent/app processes must not
race automatic schema updates. Test databases and credentials are isolated per lane.

## External OAuth/OIDC login

The user's OAuth-login requirement is implemented through server-handled external
sign-in: prefer OpenID Connect authorization code with PKCE where supported, or
the chosen provider's supported OAuth login handler. Select provider(s) in AUTH-01;
this document does not assume provider registrations or credentials exist.

ASP.NET Core handles challenges/callbacks and issues secure HttpOnly session
cookies. Keep provider credentials and access/refresh tokens server-side. Define
session expiry/revocation, CSRF protection for cookie-authenticated mutations,
safe local return URLs, and explicit sign-out. Persist and protect Data Protection
keys across application replacements. Known API requests receive JSON 401/403;
interactive login redirects are separate from API error handling.

Map each stable `(provider, subject)` to a local account with a uniqueness
constraint. Do not automatically link accounts by matching email. Apply ownership
authorization in server queries/mutations and test cross-user denial. Importing
anonymous browser data into an account is an explicit choice, with conflict handling;
sign-out/account switching must not expose another account's cached data.

## Hetzner hosting

Initial target: a Hetzner Cloud Linux VM with Docker Compose, Caddy as the HTTPS
reverse proxy, and the versioned application image. PostgreSQL is added on a private
network/volume when DATA-01 is implemented. Design paths/configuration around
environment values, not a particular VM, cloud SDK, or home directory.

HOST-01 records VM architecture, region, DNS/TLS, SSH/firewall policy, deployment
access, secret injection, persistent key/data volumes, health, logs, and immutable
release/rollback commands. Keep runtime container permissions narrow and forward
headers only from trusted proxies. Provider credentials stay outside the repo.

Database-aware off-host backups, retained key material, and actual restoration
checks are required when persistence is activated. VM backups/snapshots are
operational tools, not proof of database consistency or volume recovery. Migration
compatibility constrains image rollback; restarting an old image does not undo a
database migration. Provisioning and release are later actions, outside this setup.

## Migration and ownership

Local foundation, reference runtime and feature parity have acceptance evidence
in STATUS. Legacy source retirement was explicitly authorized under OPS-03. Keep
old routes and browser data compatible; recover historical source from Git as
documented in README. M3-08 owns remaining release acceptance, and HOST-02 owns
the separately authorized hosted cutover. Registry, HTTP contracts, persistence versions, migrations, root builds,
lockfiles, CI, and tracking each need a named shared owner during parallel work.

## Primary technical references

- [.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy)
- [React Router prerendering/static deployment](https://reactrouter.com/how-to/pre-rendering)
- [Vite TypeScript checking boundary](https://vite.dev/guide/features.html#typescript)
- [ASP.NET Core OpenAPI](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/openapi/overview?view=aspnetcore-10.0)
- [ASP.NET Core OIDC/code flow and cookie sessions](https://learn.microsoft.com/en-us/aspnet/core/security/authentication/configure-oidc-web-authentication?view=aspnetcore-10.0)
- [Npgsql EF Core 10 provider](https://www.npgsql.org/efcore/release-notes/10.0.html)
- [Hetzner backups/snapshots](https://docs.hetzner.com/cloud/servers/backups-snapshots/overview/)
