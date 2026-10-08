import type { Point } from './types';

export const TAU = Math.PI * 2;
export const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ state >>> 15, state | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
export function seedFor(slug: string) {
  let seed = 2166136261;
  for (const c of slug) seed = Math.imul(seed ^ c.charCodeAt(0), 16777619);
  return seed >>> 0;
}
export class FixedClock {
  private remainder = 0;
  advance(milliseconds: number, step: () => void) {
    this.remainder += milliseconds;
    while (this.remainder + 1e-7 >= 1000 / 60) {
      this.remainder -= 1000 / 60;
      step();
    }
  }
}
// Four-octave cosine-interpolated value noise, matching the original p5 defaults.
// Tables are immutable and bounded; simulation state remains instance-owned.
const noiseTables = new Map<number, Float64Array>();
function noiseTable(seed: number) {
  const cached = noiseTables.get(seed); if (cached) return cached;
  let state = seed >>> 0;
  const table = Float64Array.from({ length: 4096 }, () => { state = (Math.imul(1664525, state) + 1013904223) >>> 0; return state / 4294967296; });
  if (noiseTables.size === 32) noiseTables.delete(noiseTables.keys().next().value!);
  noiseTables.set(seed, table); return table;
}
export function noise(x: number, y: number, z = 0, seed = 1): number {
  const table = noiseTable(seed);
  x = Math.abs(x); y = Math.abs(y); z = Math.abs(z);
  const blend = (t: number) => (1 - Math.cos(t * Math.PI)) / 2;
  const mix = (a: number, b: number, t: number) => a + (b - a) * t;
  let result = 0, amplitude = .5;
  for (let octave = 0; octave < 4; octave++) {
    const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
    const offset = ix + iy * 16 + iz * 256;
    const fx = blend(x - ix), fy = blend(y - iy), fz = blend(z - iz);
    const sample = (n: number) => table[n & 4095];
    const plane = (n: number) => mix(mix(sample(n), sample(n + 1), fx), mix(sample(n + 16), sample(n + 17), fx), fy);
    result += amplitude * mix(plane(offset), plane(offset + 256), fz);
    amplitude *= .5; x *= 2; y *= 2; z *= 2;
  }
  return result;
}
export function line(ctx: CanvasRenderingContext2D, points: (Point | null)[]) {
  ctx.beginPath();
  let start = true;
  for (const point of points) {
    if (!point) { start = true; continue; }
    if (start) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
    start = false;
  }
  ctx.stroke();
}
export function circle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill = false) {
  ctx.beginPath(); ctx.arc(x, y, Math.max(0, radius), 0, TAU);
  if (fill) ctx.fill(); else ctx.stroke();
}
