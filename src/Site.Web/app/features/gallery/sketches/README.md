# Sketch implementation boundary

This directory implements 15 Canvas2D presets and a WebGL 2 cellular automaton,
with lazy factories and Matter.js isolated to Snow Globe. Follow
[the runtime contract](../../../../../../docs/contracts/SKETCH_RUNTIME.md).
The automaton's `rps-gpu.ts` owns GPU simulation/painting/display resources;
`rps-rules.ts` supplies a scalar test reference, not a runtime CPU grid.

Definitions own immutable metadata and validated serializable defaults. Factories
create independent mutable simulation state; the host owns canvas scheduling,
resize, visibility, focused input, errors and disposal. The root settings provider
retains full-page options across SPA navigation; previews use independent defaults.
Settings are in the gear overlay and About is at the top of each sketch page.

Keep browser globals inside factories/effects so prerendering remains safe. Do
not put mutable engines into the gallery catalog or preference store. Register
metadata in `../catalog.ts`; the server has no gallery inventory. Engine fixtures and browser acceptance live under this
directory and `tests/browser`; STATUS records outcomes and intentional limits.
