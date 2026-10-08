import { circle, FixedClock, line, random } from './math';
import { randomColor } from './colors';
import { flag, number, type Point, type SketchFactory } from './types';

export type Building = { x: number; width: number; height: number; color: string };
// Sweep simultaneous start/end events together, retaining the tallest active roof.
export function skyline(buildings: Building[]): Point[] {
  const events = new Map<number, { height: number; delta: number }[]>();
  for (const b of buildings) for (const [x, delta] of [[b.x, 1], [b.x + b.width, -1]]) {
    const list = events.get(x) ?? []; list.push({ height: b.height, delta }); events.set(x, list);
  }
  const heights = new Map<number, number>(); let previous = 0;
  const result: Point[] = [];
  for (const [x, changes] of [...events].sort(([a], [b]) => a - b)) {
    for (const { height, delta } of changes) { const count = (heights.get(height) ?? 0) + delta; if (count) heights.set(height, count); else heights.delete(height); }
    const height = Math.max(0, ...heights.keys());
    if (height !== previous) { result.push({ x, y: previous }, { x, y: height }); previous = height; }
  }
  return result;
}
// The original incremental priority-queue walk, with a separate finished outline
// helper above for fixtures. Timing is owned by the scheduler instead of timers.
export class SkylineWalk {
  points: Point[] = [];
  index = 0;
  private heap: Building[] = [];
  constructor(readonly buildings: Building[]) {}
  private push(b: Building) {
    this.heap.push(b); let i = this.heap.length - 1;
    while (i > 0) { const parent = Math.floor((i - 1) / 2); if (this.heap[parent].height >= b.height) break; this.heap[i] = this.heap[parent]; i = parent; }
    this.heap[i] = b;
  }
  private pop() {
    const top = this.heap[0], last = this.heap.pop()!;
    if (this.heap.length) {
      let i = 0;
      while (i * 2 + 1 < this.heap.length) {
        let child = i * 2 + 1;
        if (child + 1 < this.heap.length && this.heap[child + 1].height > this.heap[child].height) child++;
        if (this.heap[child].height <= last.height) break;
        this.heap[i] = this.heap[child]; i = child;
      }
      this.heap[i] = last;
    }
    return top;
  }
  get done() { return this.index >= this.buildings.length && this.heap.length === 0; }
  step() {
    const right = (b: Building) => b.x + b.width;
    if (this.index >= this.buildings.length) {
      if (!this.heap.length) return;
      let cur = this.pop();
      while (this.heap.length) { const next = this.pop(); if (right(next) > right(cur)) { this.points.push({ x: right(cur), y: cur.height }, { x: right(cur), y: next.height }); cur = next; } }
      this.points.push({ x: right(cur), y: cur.height }, { x: right(cur), y: 0 }); return;
    }
    const next = this.buildings[this.index];
    if (!this.heap.length) { this.points.push({ x: next.x, y: 0 }, { x: next.x, y: next.height }); this.push(next); this.index++; return; }
    const tallest = this.heap[0];
    if (right(tallest) > next.x) { this.push(next); if (next.height > tallest.height) this.points.push({ x: next.x, y: tallest.height }, { x: next.x, y: next.height }); this.index++; return; }
    this.pop(); let lower = tallest;
    while (this.heap.length && right(lower) <= right(tallest)) lower = this.pop();
    this.points.push({ x: right(tallest), y: tallest.height });
    if (lower === tallest || right(lower) <= right(tallest)) this.points.push({ x: right(tallest), y: 0 });
    else { this.points.push({ x: right(tallest), y: lower.height }); this.push(lower); }
  }
}
export const create: SketchFactory = ({ settings, seed }) => {
  let width = 320, height = 320, buildings: Building[] = [], elapsed = 0, cycle = 0, finished = 0;
  let walk = new SkylineWalk([]), clock = new FixedClock();
  const generate = () => {
    const rng = random(seed + cycle++);
    buildings = Array.from({ length: number(settings, 'count') }, () => {
      const w = number(settings, 'minWidth') + rng() * (number(settings, 'maxWidth') - number(settings, 'minWidth'));
      const h = number(settings, 'minHeight') + rng() * (number(settings, 'maxHeight') - number(settings, 'minHeight'));
      return { x: rng() * (width - w), width: w, height: h, color: randomColor(rng) };
    }).sort((a, b) => a.x - b.x || a.height - b.height);
    walk = new SkylineWalk(buildings); elapsed = finished = 0;
  };
  return {
    resize(size) { width = size.width; height = size.height; cycle = 0; clock = new FixedClock(); generate(); },
    update(dt) { clock.advance(dt, () => {
      if (walk.done) { finished += 1000 / 60; if (flag(settings, 'repeat') && finished >= 2000) generate(); return; }
      elapsed += 1000 / 60;
      if (elapsed >= number(settings, 'delay') * 1000) { elapsed -= number(settings, 'delay') * 1000; walk.step(); }
    }); },
    draw(ctx) {
      ctx.lineWidth = 1;
      for (const b of buildings) { ctx.strokeStyle = b.color; ctx.strokeRect(b.x, height - b.height, b.width, b.height); }
      const drawn = walk.points.map(p => ({ x: p.x, y: height - p.y }));
      ctx.strokeStyle = '#ff0000'; ctx.fillStyle = '#ff0000'; line(ctx, drawn);
      const last = drawn.at(-1); if (last) circle(ctx, last.x, last.y, 5, true);
    },
    dispose() { buildings.length = 0; walk.points.length = 0; }
  };
};
