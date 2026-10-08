import { describe, expect, it } from 'vitest';
import { definitions } from './definitions';
import { detectEdges } from './edge-algorithm';
import { epicycles, multiplicationChord } from './geometry';
import { FieldEngine, fieldVector } from './field';
import { FireworksEngine } from './fireworks';
import { GlassEngine } from './glass';
import { skyline, SkylineWalk } from './skyline';
import { reflect } from './dvd';
import { noise, random } from './math';
const defaults = (slug: string) => ({ ...definitions.find(d => d.slug === slug)!.defaults });

describe('ported simulation fixtures', () => {
  it('matches original p5 noiseSeed(77) fixtures across octaves and negative coordinates', () => {
    const coordinates = [[0, 0, 0], [.25, .5, .75], [10.1, 42069.2, -3], [-.5, -.25, -.125]];
    const expected = [.24929016537498683, .6421466483847229, .3104189864416302, .3625153121865407];
    coordinates.forEach(([x, y, z], index) => expect(noise(x, y, z, 77)).toBeCloseTo(expected[index], 14));
  });
  it('samples quantized field cells and responds to the original grid resolution settings', () => {
    const settings = defaults('particle-field'), engine = new FieldEngine(settings, 1);
    settings.columns = settings.rows = 2;
    const first = engine.vectorAt({ x: 1, y: 1 });
    expect(engine.vectorAt({ x: 150, y: 150 })).toEqual(first);
    settings.columns = settings.rows = 1000;
    expect(engine.vectorAt({ x: 150, y: 150 })).not.toEqual(first);
  });
  it('has multiplication endpoints on the circle and exact modular wrapping', () => {
    const [a, b] = multiplicationChord(5, 10, 2, 160);
    expect(a.x).toBeCloseTo(-160); expect(a.y).toBeCloseTo(0); expect(b.x).toBeCloseTo(160); expect(b.y).toBeCloseTo(0);
    for (let i = 0; i < 100; i++) for (const p of multiplicationChord(i, 100, 2.3, 160)) expect(Math.hypot(p.x, p.y)).toBeCloseTo(160);
  });
  it('sums sine components with phase and distinguishes both presets', () => {
    const a = epicycles(defaults('sine-sums'), 0, 200);
    expect(a.at(-1)!.to.x).toBeCloseTo(100); expect(a.at(-1)!.to.y).toBe(0);
    expect(epicycles(defaults('sine-sums-mixed'), 0, 200).at(-1)!.to.x).toBeCloseTo(65);
    const settings = defaults('sine-sums'); settings.waves = 1; settings.phase0 = Math.PI / 2;
    const end = epicycles(settings, 0, 200)[0].to; expect(end.x).toBeCloseTo(0); expect(end.y).toBeCloseTo(60);
  });
  it('generates a correct outline across overlapping roofs and simultaneous edges', () => {
    const points = skyline([{ x: 0, width: 10, height: 5, color: '' }, { x: 5, width: 10, height: 8, color: '' }, { x: 15, width: 5, height: 8, color: '' }]);
    expect(points).toEqual([{ x: 0, y: 0 }, { x: 0, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 8 }, { x: 20, y: 8 }, { x: 20, y: 0 }]);
    expect(skyline([])).toEqual([]);
  });
  it('walks the original heap outline incrementally through overlaps and gaps', () => {
    const walk = new SkylineWalk([{ x: 0, width: 10, height: 5, color: '' }, { x: 5, width: 10, height: 8, color: '' }, { x: 20, width: 5, height: 6, color: '' }]);
    walk.step(); expect(walk.points).toEqual([{ x: 0, y: 0 }, { x: 0, y: 5 }]);
    walk.step(); expect(walk.points.slice(-2)).toEqual([{ x: 5, y: 5 }, { x: 5, y: 8 }]);
    for (let i = 0; i < 10 && !walk.done; i++) walk.step();
    expect(walk.done).toBe(true);
    expect(walk.points).toEqual([{ x: 0, y: 0 }, { x: 0, y: 5 }, { x: 5, y: 5 }, { x: 5, y: 8 }, { x: 15, y: 8 }, { x: 15, y: 0 }, { x: 20, y: 0 }, { x: 20, y: 6 }, { x: 25, y: 6 }, { x: 25, y: 0 }]);
  });
  it('reproduces seeded glass paths and bounds generation', () => {
    const settings = defaults('stained-glass'), a = new GlassEngine(settings, 7, 320, 320), b = new GlassEngine(settings, 7, 320, 320);
    for (let i = 0; i < 2000; i++) { a.step(); b.step(); }
    expect(a.segments).toEqual(b.segments); expect(a.segments.length).toBeGreaterThan(0); expect(a.segments.length).toBeLessThanOrEqual(20000);
    expect(a.segments).not.toBe(b.segments); expect(a.strips).toHaveLength(0);
  });
  it('wraps field particles without drawing across the boundary and enforces speed/count/trail limits', () => {
    const settings = defaults('particle-field'), engine = new FieldEngine(settings, 23);
    engine.width = engine.height = 10;
    for (let i = 0; i < 120; i++) engine.add({ x: 9, y: 9 });
    for (let i = 0; i < 300; i++) engine.update(1000 / 60);
    expect(engine.particles).toHaveLength(100);
    expect(engine.particles.some(p => p.trail.includes(null))).toBe(true);
    for (const p of engine.particles) { expect(p.x).toBeGreaterThanOrEqual(0); expect(p.x).toBeLessThan(10); expect(p.y).toBeGreaterThanOrEqual(0); expect(p.y).toBeLessThan(10); expect(Math.hypot(p.vx, p.vy)).toBeLessThanOrEqual(6.00000001); expect(p.trail.length).toBeLessThanOrEqual(50); }
  });
  it('keeps the toroidal field continuous, finite and seed-dependent', () => {
    const settings = defaults('flow-field');
    const a = fieldVector(0, .3, 4, settings, 1), b = fieldVector(1, .3, 4, settings, 1);
    expect(a.x).toBeCloseTo(b.x); expect(a.y).toBeCloseTo(b.y);
    expect(fieldVector(.4, .3, 4, settings, 2)).not.toEqual(fieldVector(.4, .3, 4, settings, 1));
    settings.strength = 0; expect(Math.hypot(...Object.values(fieldVector(.3, .3, 4, settings, 1)))).toBe(0);
  });
  it('isolates field presets and bounds accumulated drawn paths', () => {
    const a = new FieldEngine(defaults('drawn-field'), 99), b = new FieldEngine(defaults('drawn-field'), 99);
    a.add(); b.add(); a.update(1000); expect(b.particles[0].trail).toHaveLength(0);
    b.update(1000); expect(a.particles).toEqual(b.particles);
    for (let i = 0; i < 7000; i++) a.update(1000 / 60);
    expect(a.particles[0].trail.length).toBeLessThanOrEqual(6000);
  });
  it('reproduces fireworks across frame rates and caps repeated launches', () => {
    const a = new FireworksEngine(defaults('fireworks'), 15, 100), b = new FireworksEngine(defaults('fireworks'), 15, 100);
    for (let i = 0; i < 180; i++) a.update(1000 / 60);
    for (let i = 0; i < 90; i++) b.update(1000 / 30);
    expect(a.particles).toEqual(b.particles); expect(a.rockets).toEqual(b.rockets);
    for (let i = 0; i < 100; i++) a.launch(); expect(a.rockets.length).toBeLessThanOrEqual(30);
    a.update(500); expect(a.particles.length).toBeLessThanOrEqual(100);
  });
  it('reflects DVD motion at corners and after multiple crossings', () => {
    expect(reflect(105, 10, 100)).toEqual({ position: 95, velocity: -10, hit: true });
    expect(reflect(-5, -10, 100)).toEqual({ position: 5, velocity: 10, hit: true });
    expect(reflect(305, 10, 100)).toEqual({ position: 95, velocity: -10, hit: true });
    expect(reflect(2, 10, 0)).toEqual({ position: 0, velocity: 0, hit: false });
  });
  it('uses independent random generators', () => {
    const a = random(45), b = random(45); expect(Array.from({ length: 10 }, a)).toEqual(Array.from({ length: 10 }, b));
  });
});

describe('simple edge operator', () => {
  it('preserves transparent boundaries and produces the original grayscale difference', () => {
    const input = new Uint8ClampedArray(3 * 3 * 4);
    for (let i = 0; i < 9; i++) input[i * 4 + 3] = 255;
    input.set([80, 80, 80, 255], 4 * 4);
    const result = detectEdges(input, 3, 3);
    expect([...result.slice(16, 20)]).toEqual([160, 160, 160, 255]);
    expect([...result.slice(0, 16)]).toEqual(Array(16).fill(0));
    input.set([255, 255, 255, 255], 16);
    expect(detectEdges(input, 3, 3)[16]).toBe(255);
  });
  it('detects no edge in a uniform image and validates dimensions', () => {
    const input = new Uint8ClampedArray(4 * 4 * 4).fill(128);
    const result = detectEdges(input, 4, 4);
    expect([...result.slice(20, 24)]).toEqual([0, 0, 0, 255]);
    expect(() => detectEdges(input, 3, 3)).toThrow();
  });
});
