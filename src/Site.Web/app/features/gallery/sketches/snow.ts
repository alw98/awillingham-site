import Matter from 'matter-js';
import { FixedClock, random, TAU } from './math';
import { fieldVector } from './field';
import { number, type SketchFactory } from './types';

export const create: SketchFactory = ({ settings, seed }) => {
  const { Bodies, Body, Composite, Engine } = Matter;
  const world = Engine.create({ gravity: { x: 0, y: number(settings, 'gravity'), scale: .001 }, enableSleeping: false });
  let width = 320, height = 320, radius = 128, flakes: Matter.Body[] = [], step = 0, clock = new FixedClock();
  const shake = () => {
    const rng = random(seed + step++);
    for (const flake of flakes) Body.setVelocity(flake, { x: (rng() - .5) * 12, y: -rng() * 12 });
  };
  return {
    resize(size) {
      Composite.clear(world.world, false); Engine.clear(world);
      width = size.width; height = size.height; radius = Math.min(width, height) * .4; step = 0; clock = new FixedClock();
      const rng = random(seed), walls: Matter.Body[] = [];
      for (let i = 0; i < 100; i++) {
        const theta = i / 100 * TAU;
        walls.push(Bodies.rectangle(width / 2 + Math.cos(theta) * radius, height / 2 + Math.sin(theta) * radius, 20, TAU * radius / 100 * 1.5, { angle: theta, isStatic: true }));
      }
      flakes = Array.from({ length: number(settings, 'count') }, () => {
        const r = rng() * radius - 5, angle = rng() * TAU;
        return Bodies.circle(width / 2 + Math.cos(angle) * r, height / 2 + Math.sin(angle) * r, 3, { restitution: 1, frictionAir: 0 });
      });
      Composite.add(world.world, [...walls, ...flakes]);
    },
    update(dt) {
      clock.advance(dt, () => {
        Engine.update(world, 1000 / 60);
        const field = { directionNoise: .5, strengthNoise: .5, strength: number(settings, 'wind'), uniform: false, directionRate: .01, strengthRate: .01 };
        for (const flake of flakes) {
          const pos = flake.position;
          const force = fieldVector(Math.floor(pos.x / width * 100) / 100, Math.floor(pos.y / height * 100) / 100, step, field, seed);
          Body.applyForce(flake, pos, force);
          // Keep even a particle accelerated by repeated shaking inside the globe.
          const dx = pos.x - width / 2, dy = pos.y - height / 2, distance = Math.hypot(dx, dy), limit = radius - 14;
          if (distance > limit) { Body.setPosition(flake, { x: width / 2 + dx / distance * limit, y: height / 2 + dy / distance * limit }); Body.setVelocity(flake, { x: -flake.velocity.x * .6, y: -flake.velocity.y * .6 }); }
        }
        step++;
      });
    },
    input(action) { if (action === 'shake' || action === 'pointer') shake(); },
    draw(ctx) {
      ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#000000'; ctx.lineWidth = 1;
      for (const flake of flakes) {
        ctx.beginPath(); ctx.arc(flake.position.x, flake.position.y, flake.circleRadius!, 0, TAU); ctx.fill(); ctx.stroke();
      }
      const dc = TAU * radius / 100;
      for (let i = 0; i < 100; i++) {
        const theta = i / 100 * TAU;
        ctx.save(); ctx.translate(width / 2 + Math.cos(theta) * radius, height / 2 + Math.sin(theta) * radius); ctx.rotate(theta); ctx.fillRect(-10, -10, 3, dc); ctx.strokeRect(-10, -10, 3, dc); ctx.restore();
      }
    },
    dispose() { Composite.clear(world.world, false); Engine.clear(world); flakes.length = 0; }
  };
};
