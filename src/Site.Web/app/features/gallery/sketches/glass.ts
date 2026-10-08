import { clamp, circle, FixedClock, random, TAU } from './math';
import { randomColor } from './colors';
import { flag, number, type Point, type Settings, type SketchFactory } from './types';

type Strip = Point & { theta: number; turn: number; width: number; color: string };
export type Segment = { from: Point; to: Point; width: number; color: string };
export class GlassEngine {
  strips: Strip[] = [];
  segments: Segment[] = [];
  private rng: () => number;
  constructor(readonly settings: Settings, seed: number, readonly width: number, readonly height: number) {
    this.rng = random(seed);
    for (let i = 0; i < number(settings, 'count'); i++) this.strips.push({ x: this.rng() * width / 2, y: this.rng() * height, theta: this.rng() * TAU, turn: Math.PI / (4 + Math.floor(this.rng() * 3)), width: 5 + this.rng() * 2, color: randomColor(this.rng) });
  }
  step() {
    for (const strip of this.strips) {
      const min = Math.min(number(this.settings, 'minDistance'), number(this.settings, 'maxDistance'));
      const max = Math.max(number(this.settings, 'minDistance'), number(this.settings, 'maxDistance'));
      const gaussian = Math.sqrt(-2 * Math.log(Math.max(1e-10, this.rng()))) * Math.cos(TAU * this.rng());
      const distance = clamp(Math.round(min + (max - min) * number(this.settings, 'average') + gaussian * (max - min) / 6), min, max);
      const from = { x: strip.x, y: strip.y }; strip.x += Math.cos(strip.theta) * distance; strip.y += Math.sin(strip.theta) * distance;
      this.segments.push({ from, to: { x: strip.x, y: strip.y }, width: strip.width, color: strip.color });
      strip.theta += (this.rng() < .5 ? -1 : 1) * strip.turn;
    }
    this.strips = this.strips.filter(s => s.x > 0 && s.x < this.width / 2 && s.y > 0 && s.y < this.height);
    if (this.segments.length >= 20000) { this.segments.length = 20000; this.strips.length = 0; }
  }
}
export const create: SketchFactory = ({ settings, seed }) => {
  let engine = new GlassEngine(settings, seed, 320, 320), clock = new FixedClock();
  return {
    resize(size) { engine = new GlassEngine(settings, seed, size.width, size.height); clock = new FixedClock(); },
    update(dt) { clock.advance(dt, () => engine.step()); },
    draw(ctx) {
      ctx.lineCap = 'butt';
      for (let half = 0; half < 2; half++) {
        ctx.save();
        if (half) { ctx.translate(engine.width, 0); ctx.scale(-1, 1); }
        ctx.beginPath(); ctx.rect(0, 0, engine.width / 2, engine.height); ctx.clip();
        if (flag(settings, 'grid')) {
          ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#000000'; ctx.lineWidth = 1;
          for (let x = 0; x <= engine.width / 2; x += number(settings, 'gridWidth')) for (let y = 0; y <= engine.height; y += number(settings, 'gridHeight')) { circle(ctx, x, y, 2.5, true); circle(ctx, x, y, 2.5); }
        }
        for (const segment of engine.segments) {
          ctx.save(); ctx.translate(segment.from.x, segment.from.y); ctx.rotate(Math.atan2(segment.to.y - segment.from.y, segment.to.x - segment.from.x) - Math.PI / 2);
          ctx.fillStyle = segment.color; ctx.fillRect(0, 0, segment.width, Math.hypot(segment.to.x - segment.from.x, segment.to.y - segment.from.y)); ctx.restore();
        }
        ctx.restore();
      }
    },
    dispose() { engine.strips.length = 0; engine.segments.length = 0; }
  };
};
