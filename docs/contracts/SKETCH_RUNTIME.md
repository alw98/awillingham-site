# Sketch runtime

The client [catalog](../../src/Site.Web/app/features/gallery/catalog.ts) owns
unique slugs and display metadata. Definitions contain immutable defaults,
validated settings and lazy factories. Every factory creates independent state.
A root provider retains validated full-page settings by slug for the current SPA
session, matching original navigation behavior. Reload resets sketch settings;
previews always use fresh independent defaults. No sketch storage key is written.

The original 15 renderers use native Canvas2D. Rock Paper Scissors uses WebGL 2
shaders and copies the rendered image into the shared Canvas2D surface. Matter.js
is loaded only by Snow Globe. The host
owns the canvas, DPR (maximum 2), ResizeObserver, visibility, focused input, error
boundary, animation scheduling and cancellation. Engines own simulation state and
fixed 60Hz updates, independent of React. Renderers receive explicit theme colors.
Resize rebuilds size-dependent generated art; Tetris retains its board. Configuration
changes call `configure(settings, previous)` against each instance-owned settings
object. Geometry, fields, fireworks, DVD and Tetris update live; generated
size-dependent art can rebuild. Restart changes the seed; Reset options restores
defaults and the original seed with a fresh instance. Theme changes repaint.
An async factory receives the latest settings before its first resize/draw.

One shared scheduler animates every visible enabled preview at 30fps. Full
pages use 60fps. All visible animated cards run.
Offscreen/hidden/paused instances receive no simulation time and
do not catch up on resume. Reduced motion renders a static seeded view; full pages
offer an explicit Play button. Preview canvases have no keyboard/pointer handlers.
Full-page keyboard handling is scoped to the focused canvas; buttons provide
equivalent touch/keyboard actions. Navigation, failed loads and instance restarts
abort image work and terminate workers. Disposal releases Matter worlds, listeners,
observers and scheduler entries; obsolete async results cannot mount.

Full pages fill the viewport below the 3rem header. About is centered at the
top and Settings opens from the original gear in the upper right. Both use
scrollable native modal dialogs, Escape, focus trapping and focus restoration.
Pause, Play, Restart, reset and action buttons are inside Settings. Tetris uses
a 200ms held-key delay and 50ms movement repeat; keyup, blur, pause and hidden
documents release held input. The page heading remains available to assistive
technology without adding a visible heading above the canvas.

Fields use original p5-compatible seeded four-octave noise and quantized grid
forces. Grid columns/rows affect motion. With background clearing disabled,
a DPR-bounded backing canvas accumulates the original translucent strokes;
particle trails stay bounded independently of the accumulated raster.
Times Tables uses the chosen radius directly and defaults to current primary
text color. Sine circles can be appended, deleted at any index, or reduced to
zero; frequency/amplitude and field strength bounds expand in the UI.

Bounds: field particles <=100, trails <=200, grid dimensions <=1000,
firework particles <=2500 full/500 preview, skyline buildings <=1000, glass segments
<=20000, waves <=1024, multiplication points <=1000, image processing <=1024px per
axis. Expanded numeric values must be finite and <=1e12. Snow uses the original
1000 particles on full pages and previews. Reduced motion advances the initial
seeded simulation by one second to produce a useful static view, then stops.
Normal motion has no artificial simulation warm-up.

## Rock Paper Scissors

`/gallery/rock-paper-scissors` simulates and renders on WebGL 2. Full pages start
empty at 200²; validated board sizes run from 200 to 10,000 per side in increments
of 200. Independent previews always use a 200² demo board. Paint starts at level 4. An
occupied cell above level 0 reproduces into a blank at one lower level without
spending its own level. Monochrome descendants stop within four neighbor steps;
conflict restores strength and permits continued growth.
Red attacks blue, green attacks red, blue attacks green. Winning attacks lower the
target's level by one, or convert its color at level 0 (keeping level 0). Every
winning attack increases the attacker's level up to 4, even before conversion.
The user accepted parallel processing order while preserving these functional
rules. Each generation shifts a wrapped 2×2 partition and selects disjoint
horizontal, vertical or diagonal pairs with probabilities 1/4, 1/4, 1/2.
Across the four shifts, each of the eight neighbors has equal marginal probability.
Each endpoint skips its action with probability 1/9, preserving the self/no-op
frequency. Pair endpoints act in seeded random order; the second sees the first's
writes, including births/conversions. Global blue/green/red sorting and unbounded
same-pass newborn chains are intentionally removed. Neighbor choices are correlated
within pairs, so random trajectories and exact sequential results differ.

Two ping-pong R8UI textures pack color in bits 0–1 and level in bits 2–4.
Each fragment reads both endpoints, calculates the same pair and writes its own
cell, avoiding races/atomics while updating the entire board. Simulation, stroke
rasterization, fill and clear stay on the GPU; runtime has no CPU grid, uploads or
readback. The two textures require 200,000,000 bytes (~191 MiB) at 10,000²,
excluding presentation/driver allocations. A scalar reference in `rps-rules.ts`
is used for tests; browser fixtures compare actual GPU bytes against it.

Steps are capped at six per update, or one for boards above 2000 per side. A
nonblocking GPU fence bounds outstanding simulation batches; missed time is dropped.
Previews request at most 30 generations/second, full pages at most 120 (default 60).
Actual speed depends on the GPU. Reduced-motion warm-up obeys the same caps.

Three visible color buttons select the brush. The default brush paints one cell;
larger brushes and continuous strokes remain available. Camera zoom (.25–32×),
pan and viewport resize leave the board intact. Wheel/pinch zoom anchors at the
pointer; Shift/right-drag and two-finger gestures pan. Focused keyboard +/−, 0,
arrows and Space provide zoom/reset/pan/center-paint. Pointer capture, cancellation,
focus loss and hidden documents end strokes. Two-finger gestures do not paint.
Gear settings expose size, speed and brush radius (1–1000 cells). A size change
disposes the old instance and starts an empty board; Fill board populates random
level-4 colors entirely on the GPU. No probabilistic birth rule is added.
Restart/reset restore an empty full-page board. Session settings retain size
across navigation; previews remain independent.

The renderer deletes its textures, framebuffers, programs and fence and releases its WebGL context on
disposal/abort. Shader failure/context loss stays local with a recoverable message.
Unsupported texture/viewport sizes report the actual device limit and allow a
smaller size in Settings. WebGL 2 is required; no graphics dependency or CPU
fallback is added. The opt-in Windows D3D11 browser benchmark checks a fully
populated 10,000² board, simulation/render rates, zoom, pause and absence of uploads.

## Extension example

A lazy renderer module exports a factory with fresh state for each call. Register
its immutable defaults, controls and strict schema in `definitions.ts`, and add
its unique slug to `catalog.ts` before exposing a gallery entry.
The host passes an instance-owned settings object and updates it before calling
`configure`; engines should never retain shared defaults or other instances.

```ts
import { circle, FixedClock } from './math';
import type { SketchFactory } from './types';

export const create: SketchFactory = ({ settings }) => {
  let width = 320, height = 320, angle = 0;
  const clock = new FixedClock();
  return {
    resize(size) { width = size.width; height = size.height; },
    update(dt) { clock.advance(dt, () => { angle += Number(settings.speed) / 60; }); },
    configure() { /* Live speed is read from the owned settings object. */ },
    draw(ctx, colors) {
      ctx.fillStyle = colors.textColor.primary;
      circle(ctx, width / 2 + Math.cos(angle) * 40, height / 2, 5, true);
    },
    dispose() { /* Release owned buffers, listeners or workers here if added. */ }
  };
};
```

Add pure engine fixtures for meaningful algorithm behavior and browser coverage
for preview/full-page resize, focus, live configuration, theme and disposal.
