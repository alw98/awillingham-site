import { detectEdges } from './edge-algorithm';
self.onmessage = (event: MessageEvent<{ pixels: Uint8ClampedArray; width: number; height: number }>) => {
  try {
    const { pixels, width, height } = event.data;
    const result = detectEdges(pixels, width, height);
    self.postMessage({ pixels: result }, { transfer: [result.buffer] });
  } catch { self.postMessage({ error: 'Image processing failed.' }); }
};
