import logoUrl from '../../../assets/DVDLogo.png';
import { loadImage } from './images';
import { random } from './math';
import { randomColor } from './colors';
import { number, type SketchFactory } from './types';

export function reflect(position: number, velocity: number, maximum: number) {
  if (maximum <= 0) return { position: 0, velocity: 0, hit: false };
  let hit = false;
  while (position < 0 || position > maximum) {
    if (position < 0) { position = -position; velocity = Math.abs(velocity); }
    if (position > maximum) { position = 2 * maximum - position; velocity = -Math.abs(velocity); }
    hit = true;
  }
  return { position, velocity, hit };
}
export const create: SketchFactory = async ({ settings, seed, signal }) => {
  const image = await loadImage(logoUrl, signal), tint = document.createElement('canvas'), source = document.createElement('canvas');
  tint.width = source.width = image.width; tint.height = source.height = image.height;
  const sourceContext = source.getContext('2d', { willReadFrequently: true });
  if (!sourceContext) throw new Error('Canvas is unavailable.');
  sourceContext.drawImage(image, 0, 0);
  const pixels = sourceContext.getImageData(0, 0, source.width, source.height);
  const mask = tint.getContext('2d'); if (!mask) throw new Error('Canvas is unavailable.');
  const rng = random(seed);
  let width = 320, height = 320, logoWidth = 50, logoHeight = 25, x = 0, y = 0, vx = 1, vy = 1;
  const recolor = () => {
    const color = randomColor(rng), channels = [1, 3, 5].map(i => parseInt(color.slice(i, i + 2), 16));
    const tinted = new Uint8ClampedArray(pixels.data);
    for (let i = 0; i < tinted.length; i += 4) for (let c = 0; c < 3; c++) tinted[i + c] *= channels[c] / 255;
    mask.putImageData(new ImageData(tinted, source.width, source.height), 0, 0);
  };
  recolor();
  return {
    resize(size) { width = size.width; height = size.height; logoWidth = width * number(settings, 'size') / 100; logoHeight = logoWidth / 2; x = rng() * (width - logoWidth); y = rng() * Math.max(0, height - logoHeight); vx = (rng() * 5 + 3) * width / 500 * 60; vy = (rng() * 5 + 3) * height / 500 * 60; },
    update(dt) {
      const horizontal = reflect(x + vx * dt / 1000 * number(settings, 'speed'), vx, width - logoWidth);
      const vertical = reflect(y + vy * dt / 1000 * number(settings, 'speed'), vy, height - logoHeight);
      x = horizontal.position; vx = horizontal.velocity; y = vertical.position; vy = vertical.velocity;
      if (horizontal.hit || vertical.hit) recolor();
    },
    input(action) { if (action === 'pointer') recolor(); },
    configure() { logoWidth = width * number(settings, 'size') / 100; logoHeight = logoWidth / 2; },
    draw(ctx, colors) { ctx.strokeStyle = colors.accentColor.primary; ctx.lineWidth = 1; ctx.strokeRect(0, 0, width, height); ctx.drawImage(tint, x, y, logoWidth, logoHeight); },
    dispose() { tint.width = source.width = 0; tint.height = source.height = 0; }
  };
};
