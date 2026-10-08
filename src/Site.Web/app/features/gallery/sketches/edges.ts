import defaultUrl from '../../../assets/EdgeDetectionTest.png';
import agateUrl from '../../../assets/EdgeDetectionTest1.png';
import { loadImage } from './images';
import type { SketchFactory } from './types';

export const create: SketchFactory = async ({ settings, signal }) => {
  const image = await loadImage(settings.preset === 'edge-detection-agate' ? agateUrl : defaultUrl, signal);
  const source = document.createElement('canvas'), result = document.createElement('canvas');
  const scale = Math.min(1, 1024 / image.width, 1024 / image.height);
  source.width = result.width = Math.max(1, Math.floor(image.width * scale));
  source.height = result.height = Math.max(1, Math.floor(image.height * scale));
  const input = source.getContext('2d', { willReadFrequently: true }), output = result.getContext('2d');
  if (!input || !output) throw new Error('Canvas is unavailable.');
  input.drawImage(image, 0, 0, source.width, source.height);
  await new Promise<void>((resolve, reject) => {
    const worker = new Worker(new URL('./edge.worker.ts', import.meta.url), { type: 'module' });
    const cleanup = () => { worker.terminate(); signal.removeEventListener('abort', abort); };
    const abort = () => { cleanup(); reject(new DOMException('Aborted', 'AbortError')); };
    if (signal.aborted) { abort(); return; }
    signal.addEventListener('abort', abort, { once: true });
    worker.onmessage = (event: MessageEvent<{ pixels?: Uint8ClampedArray<ArrayBuffer>; error?: string }>) => {
      cleanup();
      if (!event.data.pixels) { reject(new Error(event.data.error)); return; }
      output.putImageData(new ImageData(event.data.pixels, source.width, source.height), 0, 0); resolve();
    };
    worker.onerror = () => { cleanup(); reject(new Error('Image processing failed.')); };
    const pixels = input.getImageData(0, 0, source.width, source.height).data;
    worker.postMessage({ pixels, width: source.width, height: source.height }, [pixels.buffer]);
  });
  let width = 320, height = 320;
  return {
    resize(size) { width = size.width; height = size.height; },
    update() { /* Static processed image. */ },
    draw(ctx) {
      const scale = Math.min(width / source.width, height / 2 / source.height);
      const w = Math.floor(source.width * scale), h = Math.floor(source.height * scale), x = (width - w) / 2;
      ctx.drawImage(source, x, (height / 2 - h) / 2, w, h);
      ctx.drawImage(result, x, height / 2 + (height / 2 - h) / 2, w, h);
      ctx.strokeStyle = '#000000'; ctx.beginPath(); ctx.moveTo(0, height / 2); ctx.lineTo(width, height / 2); ctx.stroke();
    },
    dispose() { source.width = result.width = 0; source.height = result.height = 0; }
  };
};
