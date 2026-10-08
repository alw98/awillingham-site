# Sketch implementation boundary

This directory implements all 15 registered gallery presets with lazy native
Canvas2D factories and Matter.js for Snow Globe. Follow
[runtime revision 3](../../../../../../docs/contracts/SKETCH_RUNTIME.md).

Definitions own immutable metadata and validated serializable defaults. Factories
create independent mutable simulation state; the host owns canvas scheduling,
resize, visibility, focused input, errors and disposal. The root settings provider
retains full-page options across SPA navigation; previews use independent defaults.
Settings are in the gear overlay and About is at the top of each sketch page.

Keep browser globals inside factories/effects so prerendering remains safe. Do
not put mutable engines into the gallery catalog or preference store. Register
metadata in `../catalog.ts`; the server has no gallery inventory. Engine fixtures and browser acceptance live under this
directory and `tests/browser`; STATUS records outcomes and intentional limits.
