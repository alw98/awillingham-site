import { circle, FixedClock, line, noise, random, TAU } from './math';
import { randomColor } from './colors';
import { flag, number, type Point, type Settings, type SketchFactory } from './types';
import type { ThemeColors } from '../../themes/preferences';

export function fieldVector(x: number, y: number, step: number, settings: Settings, seed: number) {
  const theta = y * TAU, phi = x * TAU;
  const nx = (.1 + 10 * Math.cos(theta)) * Math.cos(phi), ny = (.1 + 10 * Math.cos(theta)) * Math.sin(phi), nz = .1 * Math.sin(theta);
  const dn = number(settings, 'directionNoise'), sn = number(settings, 'strengthNoise');
  const d = step * number(settings, 'directionRate'), s = step * number(settings, 'strengthRate');
  const angle = noise(nx * dn + d, ny * dn + d, nz + d, seed) * Math.PI * 6;
  const strength = (flag(settings, 'uniform') ? 1 : noise(nx * sn + 42069 + s, ny * sn + 42069 + s, nz + s, seed)) * number(settings, 'strength');
  return { x: Math.cos(angle) * strength, y: Math.sin(angle) * strength };
}
type Particle = Point & { vx: number; vy: number; color: string; trail: (Point | null)[] };
export class FieldEngine {
  particles: Particle[] = [];
  step = 0;
  width = 320; height = 320;
  private clock = new FixedClock();
  private rng: () => number;
  beforeStep?: () => void;
  constructor(readonly settings: Settings, readonly seed: number) { this.rng = random(seed); }
  get columns() { return number(this.settings, 'columns') || Math.max(1, Math.floor(this.width / 10)); }
  get rows() { return number(this.settings, 'rows') || Math.max(1, Math.floor(this.height / 10)); }
  vectorAt(point: Point) { return fieldVector(Math.floor(point.x / this.width * this.columns) / this.columns, Math.floor(point.y / this.height * this.rows) / this.rows, this.step, this.settings, this.seed); }
  add(point?: Point) {
    if (this.particles.length >= 100) return;
    this.particles.push({ x: point?.x ?? this.rng() * this.width, y: point?.y ?? this.rng() * this.height, vx: 0, vy: 0, color: randomColor(this.rng), trail: [] });
  }
  update(dt: number) {
    this.clock.advance(dt, () => {
      this.beforeStep?.();
      for (const p of this.particles) {
        const v = this.vectorAt(p);
        p.vx += v.x; p.vy += v.y;
        const mag = Math.hypot(p.vx, p.vy), max = number(this.settings, 'speed');
        if (mag > max) { p.vx *= max / mag; p.vy *= max / mag; }
        p.x += p.vx; p.y += p.vy;
        p.trail.push({ x: p.x, y: p.y });
        if (p.x < 0 || p.x >= this.width) { p.trail.push(null); p.x = p.x < 0 ? this.width - 1 : Math.min(1, this.width - 1); }
        if (p.y < 0 || p.y >= this.height) { p.trail.push(null); p.y = p.y < 0 ? this.height - 1 : Math.min(1, this.height - 1); }
        const maxTrail = number(this.settings, 'trail');
        if (p.trail.length > maxTrail) p.trail.splice(0, p.trail.length - maxTrail);
      }
      this.step++;
    });
  }
}
function paint(ctx: CanvasRenderingContext2D, engine: FieldEngine) {
  const settings = engine.settings, columns = engine.columns, rows = engine.rows;
  const dx = engine.width / columns, dy = engine.height / rows;
  ctx.save();
  if (flag(settings, 'grid')) {
    ctx.strokeStyle = '#000000'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = 0; x <= columns; x++) { ctx.moveTo(x * dx, 0); ctx.lineTo(x * dx, engine.height); }
    for (let y = 0; y <= rows; y++) { ctx.moveTo(0, y * dy); ctx.lineTo(engine.width, y * dy); } ctx.stroke();
  }
  if (flag(settings, 'vectors')) {
    ctx.lineWidth = 1;
    for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
      const v = fieldVector(x / columns, y / rows, engine.step, settings, engine.seed);
      const mag = Math.hypot(v.x, v.y), length = Math.min(dx, dy) / 2, strength = number(settings, 'strength');
      const fraction = strength ? mag / strength : 0;
      ctx.strokeStyle = `rgb(${Math.round(fraction * 255)},${Math.round((1 - fraction) * 255)},0)`;
      const fromX = (x + .5) * dx, fromY = (y + .5) * dy;
      line(ctx, [{ x: fromX, y: fromY }, { x: fromX + (mag ? v.x / mag * length : 0), y: fromY + (mag ? v.y / mag * length : 0) }]);
    }
  }
  ctx.globalAlpha = number(settings, 'alpha') / 255;
  for (const p of engine.particles) {
    ctx.strokeStyle = p.color; ctx.fillStyle = p.color; ctx.lineWidth = 1;
    circle(ctx, p.x, p.y, number(settings, 'size') / 2, true); circle(ctx, p.x, p.y, number(settings, 'size') / 2);
    for (let i = 1; i < p.trail.length; i++) { ctx.lineWidth = flag(settings, 'shrinks') ? number(settings, 'size') * i / p.trail.length : 1; line(ctx, [p.trail[i - 1], p.trail[i]]); }
  }
  ctx.restore();
}
export const create: SketchFactory = ({ settings, seed }) => {
  let engine = new FieldEngine(settings, seed);
  const buffer = document.createElement('canvas'), context = buffer.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable.');
  let palette: ThemeColors | null = null;
  return {
    resize(size) {
      engine = new FieldEngine(settings, seed); engine.width = size.width; engine.height = size.height;
      const dpr = Math.min(devicePixelRatio || 1, 2); buffer.width = Math.round(size.width * dpr); buffer.height = Math.round(size.height * dpr); context.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.beforeStep = () => { if (!flag(settings, 'clear') && palette) paint(context, engine); };
      for (let i = 0; i < number(settings, 'count'); i++) engine.add();
    },
    update(dt) { engine.update(dt); },
    configure(next, previous) {
      const reset = next.count !== previous?.count;
      if (reset) { engine.particles.length = 0; for (let i = 0; i < number(next, 'count'); i++) engine.add(); }
      if (reset || next.clear !== previous?.clear) context.clearRect(0, 0, engine.width, engine.height);
      return reset;
    },
    input(action, point) { if (action === 'pointer' || action === 'add') engine.add(point); },
    summary: () => `${engine.particles.length} particles`,
    draw(ctx, colors) {
      palette = colors;
      if (flag(settings, 'clear')) paint(ctx, engine);
      else ctx.drawImage(buffer, 0, 0, engine.width, engine.height);
    },
    dispose() { engine.particles.length = 0; buffer.width = buffer.height = 0; }
  };
};
