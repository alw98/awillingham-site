import { RpsCamera } from './rps-camera';
import { RpsGpu } from './rps-gpu';
import { RPS_SIZE } from './rps-rules';
import type { Point, SketchFactory } from './types';

export const create: SketchFactory = ({ settings, seed, preview, signal }) => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2', { antialias: false, depth: false, stencil: false, preserveDrawingBuffer: true });
  if (!gl) throw new Error('WebGL 2 is unavailable.');
  const cells = preview ? RPS_SIZE : Number(settings.boardSize), camera = new RpsCamera(cells);
  let gpu: RpsGpu | undefined;
  let disposed = false, remainder = 0, lastPaint: Point | undefined;
  const lose = (event: Event) => event.preventDefault();
  canvas.addEventListener('webglcontextlost', lose);
  function dispose() {
    if (disposed) return;
    disposed = true; signal.removeEventListener('abort', dispose); canvas.removeEventListener('webglcontextlost', lose);
    gpu?.dispose();
    gl!.getExtension('WEBGL_lose_context')?.loseContext(); canvas.width = canvas.height = 1;
  }
  try {
    const engine = gpu = new RpsGpu(gl, cells, seed);
    // Full pages start empty; only independent gallery previews get demo paint.
    if (preview) engine.fill(true);
    signal.addEventListener('abort', dispose, { once: true }); if (signal.aborted) dispose();
    return {
      resize(size) { camera.size = size; },
      update(milliseconds) {
        if (disposed) return;
        remainder = Math.min(remainder + Math.min(milliseconds, 100) * Math.min(Number(settings.speed), preview ? 30 : 120) / 1000, 6);
        if (!engine.ready()) { remainder = Math.min(remainder, 1); return; }
        // Large boards never accumulate catch-up batches or an unbounded GPU queue.
        const steps = Math.min(cells > 2000 ? 1 : 6, Math.floor(remainder)); remainder -= steps;
        if (steps) engine.step(steps);
        remainder = Math.min(remainder, 1);
      },
      configure() { lastPaint = undefined; },
      draw(context) {
        if (disposed) return;
        if (gl.isContextLost()) throw new Error('Graphics context lost.');
        const width = context.canvas.width, height = context.canvas.height;
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
        engine.bind(engine.display); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, width, height);
        const view = engine.display.uniforms;
        gl.uniform2f(view.uScreen, width, height); gl.uniform2f(view.uCenter, camera.center.x, camera.center.y);
        gl.uniform1f(view.uScale, camera.scale * width / camera.size.width);
        gl.drawArrays(gl.TRIANGLES, 0, 3); context.imageSmoothingEnabled = false;
        context.drawImage(canvas, 0, 0, camera.size.width, camera.size.height);
      },
      input(action, point) {
        if (disposed) return;
        if (action === 'release') lastPaint = undefined;
        if (action === 'paint' && point) { const world = camera.world(point); engine.stroke(lastPaint ?? world, world, Number(settings.paintColor), Number(settings.brushSize)); lastPaint = world; }
        if (action === 'zoom' && point) { camera.zoomAt(point.scale ?? 1, point); lastPaint = undefined; }
        if (action === 'pan' && point) { camera.pan(point); lastPaint = undefined; }
        if (action === 'zoom-in') camera.zoomAt(1.5);
        if (action === 'zoom-out') camera.zoomAt(1 / 1.5);
        if (action === 'reset-view') camera.reset();
        if (action === 'clear') { engine.clear(); remainder = 0; lastPaint = undefined; }
        if (action === 'fill') { engine.fill(false); remainder = 0; lastPaint = undefined; }
        if (action.startsWith('pan-')) camera.pan({ x: action === 'pan-left' ? 40 : action === 'pan-right' ? -40 : 0, y: action === 'pan-up' ? 40 : action === 'pan-down' ? -40 : 0 });
        if (action === 'paint-center') { const center = camera.world({ x: camera.size.width / 2, y: camera.size.height / 2 }); engine.stroke(center, center, Number(settings.paintColor), Number(settings.brushSize)); }
      },
      summary: () => `${cells} × ${cells} cells · Generation ${Math.floor(engine.generation / 15) * 15} · Zoom ${camera.zoom.toFixed(2)}×`,
      dispose
    };
  } catch (error) { dispose(); throw error; }
};
