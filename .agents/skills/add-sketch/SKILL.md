---
name: add-sketch
description: Add or port an interactive sketch or preset in this gallery repository, preserving its renderer lifecycle, registration, URL, and saved-data contracts.
---

Read [AGENTS.md](../../../AGENTS.md), the assigned task contract,
[architecture](../../../docs/architecture.md), and the accepted
[sketch runtime contract](../../../docs/contracts/SKETCH_RUNTIME.md).
The application lives in `src/Site.Web/app/features/gallery`. Use
`catalog.ts`, `sketches/definitions.ts` and
`sketches/canvas-host.tsx`. Gallery metadata belongs to the client; the server
has no gallery registry or old-link redirects.
Coordinate registry/shared-wrapper edits with their owner. Check both gallery
previews and individual routes.

Follow the accepted lifecycle/definition contract. Keep
simulation logic testable outside React/renderers, define serializable validated
defaults, and create fresh instance state per preview/full page. Use unique stable
slugs independent of display labels.
Rendering/input/workers must clean up on disposal and handle resize,
theme changes, focus, and hidden/offscreen pause.

Keep changes within assigned paths. Coordinate dependency/lockfile, shared type,
registry, and storage-schema changes. Preserve real browser data; use disposable
fixtures for validation. Run relevant engine/behavior and build checks, and actual
browser checks for affected lifecycle/input/rendering. Record the exact revision,
commands, outcomes, compatibility changes, and limits. Shared tracking remains
with the coordinator during a parallel batch.
