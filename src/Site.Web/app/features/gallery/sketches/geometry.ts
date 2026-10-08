import { circle, FixedClock, line, TAU } from './math';
import { number, type Point, type Settings, type SketchFactory } from './types';

export function multiplicationChord(index: number, count: number, multiplier: number, radius: number): [Point, Point] {
  const point = (n: number) => ({ x: Math.cos(n / count * TAU) * radius, y: Math.sin(n / count * TAU) * radius });
  return [point(index), point(index * multiplier % count)];
}
export function epicycles(settings: Settings, angle: number, scale: number) {
  let x = 0, y = 0;
  return Array.from({ length: number(settings, 'waves') }, (_, i) => {
    const radius = number(settings, `amplitude${i}`) * scale / 2;
    const theta = angle * number(settings, `frequency${i}`) + number(settings, `phase${i}`);
    const from = { x, y }; x += Math.cos(theta) * radius; y += Math.sin(theta) * radius;
    return { from, to: { x, y }, radius };
  });
}
export const create: SketchFactory = ({ settings }) => {
  const sine = String(settings.preset).startsWith('sine-sums');
  let width = 320, height = 320, step = 0;
  let multiplier = number(settings, 'multiplier');
  const clock = new FixedClock();
  const history: Point[] = [];
  const advance = () => {
    step++;
    if (!sine) multiplier += number(settings, 'rate');
    if (sine) {
      const circles = epicycles(settings, TAU * number(settings, 'speed') / 200 * step, Math.min(width, height));
      history.push(circles.at(-1)?.to ?? { x: 0, y: 0 });
      if (history.length > 1000) history.shift();
    }
  };
  return {
    resize(size) { width = size.width; height = size.height; history.length = 0; },
    update(dt) { clock.advance(dt, advance); },
    configure(next, previous) {
      if (sine) history.length = 0;
      else if (next.multiplier !== previous?.multiplier) multiplier = number(next, 'multiplier');
    },
    draw(ctx, colors) {
      ctx.translate(width / 2, height / 2);
      ctx.lineWidth = 1;
      if (sine) {
        ctx.strokeStyle = colors.textColor.secondary; line(ctx, history);
        ctx.strokeStyle = colors.textColor.primary;
        const circles = epicycles(settings, TAU * number(settings, 'speed') / 200 * step, Math.min(width, height));
        for (const c of circles) {
          circle(ctx, c.from.x, c.from.y, c.radius);
        }
        const end = circles.at(-1)?.to ?? { x: 0, y: 0 };
        circle(ctx, end.x, end.y, 5);
      } else {
        const radius = number(settings, 'radius');
        const count = number(settings, 'points');
        ctx.strokeStyle = String(settings.color || colors.textColor.primary); circle(ctx, 0, 0, radius);
        ctx.beginPath();
        for (let i = 0; i < count; i++) { const [a, b] = multiplicationChord(i, count, multiplier, radius); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); }
        ctx.stroke();
      }
    },
    dispose() { history.length = 0; }
  };
};
