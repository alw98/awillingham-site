# Sketch runtime revision 3

Updated 2026-10-08 for the user-requested original behavior and gear/About layout. Implementation
owner: the primary agent, working sequentially in the existing dirty workspace.
No parallel batch, account storage, timer, Euler or inactive experiment is included.

The inventory in [legacy-gallery.json](legacy-gallery.json) owns stable sketch IDs,
preset IDs, slugs and old URLs. Definitions are immutable metadata plus validated,
serializable settings and lazy factories. Every factory creates independent state.
The version-1 preset envelope contains `version`, `presetId`, a uint32 `seed`, and
`settings`; unknown keys, nonfinite numbers and out-of-range values are rejected.
A root provider retains validated full-page settings by slug for the current SPA
session, matching original navigation behavior. Reload resets sketch settings;
previews always use fresh independent defaults. No sketch storage key is written.

All registered renderers are 2D. Use native Canvas2D instead of carrying the legacy
p5 runtime into the replacement. Matter.js is loaded only by Snow Globe. The host
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
pages use 60fps. Revision 2 removes the four-preview cap at the user's request;
visible cards must not be paused merely because earlier cards are animating.
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

Acceptance sequence: definition/fixture checks, pure Tetris and canvas reference,
real-browser reference acceptance, then sequential per-family ports: sine/tables/
fireworks, vector fields, skyline/glass/globe/DVD, and worker-based image edges.
Tests cover deterministic math and independent instances, Tetris collision/clear/
spawn/timing, image fixtures, all routes and controls, resize/theme, hidden/offscreen/
reduced motion, resource bounds, navigation cleanup, accessibility and screenshots.
Evidence and intentional differences are recorded in STATUS; BACKLOG owns states.

## Extension example

A lazy renderer module exports a factory with fresh state for each call. Register
its immutable defaults, controls and strict schema in `definitions.ts`, and add
its unique preset/slug to the shared inventory before exposing a gallery entry.
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
