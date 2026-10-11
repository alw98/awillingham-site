# Status

Updated 2026-10-11. [BACKLOG](BACKLOG.md) owns task states.

## Application

- .NET 10 host and React 19/strict TypeScript/Vite client under `src/`.
- Fifteen Canvas2D presets plus a WebGL 2 Rock Paper Scissors automaton (16 total).
  Matter.js is isolated to Snow Globe. Visible animated previews run,
  hidden/offscreen work pauses, and settings survive SPA navigation.
- Full-page canvases, gear Settings, top About, original Rubik styling and assets.
- 26-color bubble editor, validated current preferences and recoverable storage
  errors. No old-site data imports, URL aliases or redirects.
- Cancellable Euler 1–10 workers. Timer remains an Add Item prototype.
- One solution, clean release pipeline, nonroot container and product CI.
  PostgreSQL, external login and Hetzner hosting are future work.

## Verification

Validation uses an isolated release copy on port 5507 and disposable browser
storage, preserving the running development servers. Clean install, strict
types/lint, 56 frontend tests, production client build, locked restore,
zero-warning .NET build, 32 backend tests and publish passed. All 32 regular
Chromium checks passed in 29.0 seconds; the opt-in hardware benchmark passed
separately against the same published artifact in 34.1 seconds. Checks cover all
16 sketches, shader/reference parity, growth, brush sizes, mouse/touch, zoom/pan,
board changes/session isolation, graphics limits, pause/restart, context recovery,
themes, accessibility, workers, routes and HTTP/cache behavior.

The working source matches the tested release fingerprint:
`ff6c69c3a186d4baf18cdfb9236620f85780d6fcc80aeb6a5ba76fb0d07b9d11`.
Repository/toolchain checks, five repository-check tests and whitespace checks
passed. Desktop/mobile and zoomed 10,000² screenshots were inspected.

## Rock Paper Scissors

The `/gallery/rock-paper-scissors` simulation, painting, fill and display now run
on the GPU. The runtime CPU grid and stable counting sort were removed. Two R8UI
textures pack each cell's color and strength into one byte, requiring 200,000,000
bytes (~191 MiB) at 10,000², plus presentation/driver resources. No runtime grid
uploads or readbacks occur.

Level-4 paint, wrapped neighbors, reproduction at parent level minus one,
weakening, conversion at level 0 and attacker gains capped at 4 remain. The user
explicitly accepted changing sequential order while preserving functional rules.
Seeded random pairs within shifting 2×2 partitions update without write races;
endpoint actions see their pair's earlier writes. Global color sorting and
unbounded same-pass newborn chains are removed. Neighbor choices are correlated,
so exact trajectories and the former CPU engine's ordering are not preserved.
A scalar test reference and actual GPU readbacks verify byte-for-byte transitions.
Monochrome growth remains bounded; conflict permits renewed growth.

Gear Settings offers board sizes 200–10,000 per side in steps of 200, a 10,000²
shortcut, Fill board, speed and brush radius. Size changes clear the board and
dispose the old GPU instance. Full pages start empty; independent 200² gallery
previews get demo paint. RGB buttons, continuous mouse/touch strokes, anchored
zoom/pan, resize, keyboard, themes, reduced motion, context recovery and disposal
remain. Unsupported dimensions report the actual device limit and allow recovery
through smaller settings. No graphics dependency or CPU fallback was added.

Simulation batches are bounded by a nonblocking fence. Large boards submit at
most one generation per update and drop missed time rather than building a queue.
The default target is 60 generations/second; actual speed depends on the device.

The published hardware benchmark used NVIDIA GeForce RTX 5080 through ANGLE D3D11,
with maximum texture size 16,384. With all 100 million cells occupied at 1280 × 900,
15-second samples measured 59.62 simulation updates/rendered frames per second
at 1× and 59.53 at 25.63× zoom. GPU simulation passes averaged 1.19 ms. The benchmark
confirmed two 10,000² R8UI allocations, zero texture uploads, evolving pixels,
pause and resize. Chromium's default headless backend uses SwiftShader here
(maximum texture size 8192); the hardware benchmark explicitly selects D3D11.

The opt-in benchmark is `SITE_HARDWARE_GPU=1` with `rps-scale.spec.ts`, documented
in README. Build, browser and performance evidence stays in ignored
`.agent-artifacts/rps-gpu-*`; the isolated release is under
`.agent-artifacts/rps-gpu-check/.artifacts/site/publish`.

Seeded Canvas2D frames differ from the former random p5 renderer. Intentional
behavior includes elapsed-time updates, reduced-motion views, resource bounds
and accessible dialogs. A 30-second hardware sample does not establish sustained
performance across devices/browsers. Hosted CI, other browsers and remote
deployment have not run on this candidate. The Docker daemon was unavailable for
the last container rerun. Agent model/capacity policy is unchanged.
