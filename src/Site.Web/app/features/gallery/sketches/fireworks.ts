import { circle, FixedClock, line, noise, random } from './math';
import { randomColor } from './colors';
import { flag, number, type Point, type Settings, type SketchFactory } from './types';

type Spark = Point & { vx: number; vy: number; color: string; life: number; trail: Point[]; trailLength: number };
export class FireworksEngine {
  rockets: Spark[] = [];
  particles: Spark[] = [];
  private rng: () => number;
  private clock = new FixedClock();
  private frame = 0;
  width = 320; height = 320;
  constructor(private settings: Settings, private seed: number, private limit = 2500) { this.rng = random(seed); }
  launch(point?: Point) {
    if (this.rockets.length >= 30) return;
    const x = point?.x ?? noise(Math.max(0, this.frame - 1) * .1, 0, 0, this.seed) * this.width;
    const angle = Math.PI * (.25 + .5 * x / this.width);
    this.rockets.push({ x, y: point?.y ?? this.height, vx: point ? 0 : Math.cos(angle) * 20, vy: point ? -20 : -Math.sin(angle) * 20, color: randomColor(this.rng), life: number(this.settings, 'fuse') + this.rng() * number(this.settings, 'fuseVariance'), trail: [], trailLength: 0 });
  }
  explode(rocket: Spark) {
    const count = Math.min(number(this.settings, 'count'), this.limit - this.particles.length);
    for (let i = 0; i < count; i++) {
      const angle = Math.atan2(rocket.vy, rocket.vx) + (this.rng() - .5) * number(this.settings, 'arc');
      this.particles.push({ x: rocket.x, y: rocket.y, vx: rocket.vx + Math.cos(angle) * number(this.settings, 'force'), vy: rocket.vy + Math.sin(angle) * number(this.settings, 'force'), color: rocket.color, life: number(this.settings, 'life') + this.rng() * number(this.settings, 'lifeVariance'), trail: [{ x: rocket.x, y: rocket.y }], trailLength: number(this.settings, 'trail') + Math.floor((this.rng() - .5) * number(this.settings, 'trailVariance')) });
    }
  }
  update(dt: number) {
    this.clock.advance(dt, () => {
      this.frame++;
      if (flag(this.settings, 'spawner') && this.frame % number(this.settings, 'spawnRate') === 0) this.launch();
      for (const rocket of this.rockets) {
        rocket.vy += number(this.settings, 'gravity'); rocket.x += rocket.vx; rocket.y += rocket.vy;
        rocket.life--;
      }
      for (const p of this.particles) {
        p.trail.push({ x: p.x, y: p.y }); p.vy += number(this.settings, 'gravity'); p.x += p.vx; p.y += p.vy; p.life--;
        const length = Math.max(0, Math.min(p.trailLength, Math.ceil(p.life)));
        if (p.trail.length > length) p.trail.splice(0, Math.max(0, p.trail.length - Math.min(number(this.settings, 'trail'), Math.ceil(p.life))));
      }
      this.particles = this.particles.filter(p => p.life > 0);
      for (const rocket of this.rockets) if (rocket.life <= 0) this.explode(rocket);
      this.rockets = this.rockets.filter(r => r.life > 0);
    });
  }
}
export const create: SketchFactory = ({ settings, seed, preview }) => {
  let engine = new FireworksEngine(settings, seed, preview ? 500 : 2500);
  return {
    resize(size) {
      engine = new FireworksEngine(settings, seed, preview ? 500 : 2500); engine.width = size.width; engine.height = size.height;
    },
    update(dt) { engine.update(dt); },
    configure() { /* Existing particles retain their lifetimes; new ones use the current settings. */ },
    input(action, point) { if (action === 'pointer' || action === 'launch') engine.launch(point); },
    draw(ctx) {
      for (const p of engine.particles) { ctx.strokeStyle = p.color; ctx.fillStyle = p.color; ctx.lineWidth = 1; line(ctx, p.trail); circle(ctx, p.x, p.y, number(settings, 'size') / 2, true); }
      for (const r of engine.rockets) { ctx.fillStyle = r.color; circle(ctx, r.x, r.y, number(settings, 'rocketSize') / 2, true); }
    },
    dispose() { engine.particles.length = 0; engine.rockets.length = 0; }
  };
};
