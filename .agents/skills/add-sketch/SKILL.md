---
name: add-sketch
description: Add or port an interactive sketch or preset in this gallery repository, preserving its renderer lifecycle, registration, URL, and saved-data contracts.
---

Read [AGENTS.md](../../../AGENTS.md), the assigned task contract, and
[architecture](../../../docs/architecture.md). Determine whether the task targets
the existing `Web/web-app` implementation or an implemented replacement runtime.
Do not create the planned foundation/runtime just to fulfill a small sketch task.

For existing code, use `Components/Sketches/BaseSketch.tsx`, the matching
`Models/Sketches` props interface, and `GallerySketches.tsx`. Check both the gallery
preview and individual route. Coordinate registry/shared-wrapper edits with their
owner. Existing observable default stores need independent preview data.

For the replacement, follow its accepted lifecycle/definition contract. Keep
simulation logic testable outside React/renderers, define serializable validated
defaults, and create fresh instance state per preview/full page. Use unique stable
sketch/preset IDs and slugs independent of display labels; preserve old links when
porting. Rendering/input/workers must clean up on disposal and handle resize,
theme changes, focus, and hidden/offscreen pause.

Keep changes within assigned paths. Coordinate dependency/lockfile, shared type,
registry, and storage-schema changes. Preserve real browser data; use disposable
fixtures for validation. Run relevant engine/behavior and build checks, and actual
browser checks for affected lifecycle/input/rendering. Record the exact revision,
commands, outcomes, compatibility changes, and limits. Shared tracking remains
with the coordinator during a parallel batch.
