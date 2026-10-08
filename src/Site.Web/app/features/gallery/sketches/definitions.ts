import { z } from 'zod';
import { catalog } from '../catalog';
import { colorSchema } from '../../themes/preferences';
import type { Control, Settings, SketchFactory } from './types';

const range = (key: string, label: string, value: number, min: number, max: number, step = 1): Control => ({ key, label, value, min, max, step });
const toggle = (key: string, label: string, value: boolean): Control => ({ key, label, value });
const field = [range('count', 'Initial particles', 20, 0, 100), range('size', 'Particle size', 4, 1, 10), range('speed', 'Speed', 6, 0, 20), range('trail', 'Trail length', 50, 0, 200), toggle('shrinks', 'Shrink trails', true), range('alpha', 'Opacity', 255, 1, 255), range('directionNoise', 'Direction noise scale', .1, .01, .2, .01), range('strengthNoise', 'Strength noise scale', .03, .01, .2, .01), range('directionRate', 'Direction change speed', .02, 0, .05, .0001), range('strengthRate', 'Strength change speed', .01, 0, .03, .001), range('strength', 'Field strength', 1.5, 0, 2, .01), range('columns', 'Grid columns (0 = auto)', 0, 0, 1000), range('rows', 'Grid rows (0 = auto)', 0, 0, 1000), toggle('grid', 'Draw grid', false), toggle('vectors', 'Draw field lines', false), toggle('uniform', 'Uniform strength', false), toggle('clear', 'Clear background', true)];
const waves = (mixed: boolean): Control[] => [range('speed', 'Speed', 1, 0, 5, .5), range('waves', 'Circles', 3, 0, 1024), ...Array.from({ length: 3 }, (_, i) => [range(`frequency${i}`, `Frequency ${i + 1}`, (mixed ? [1, .1, 10] : [1, 2, 5])[i], 0, 1e12, .1), range(`amplitude${i}`, `Amplitude ${i + 1}`, (mixed ? [.3, .3, .05] : [.6, .3, .1])[i], 0, 1e12, .01), range(`phase${i}`, `Phase ${i + 1}`, 0, 0, Math.PI * 2, .1)]).flat()];
const tables = (still: boolean): Control[] => [range('multiplier', 'Multiplier', 2, 1, 1000, .01), range('rate', 'Multiplier change rate', still ? 0 : .01, 0, .1, .001), range('points', 'Resolution', still ? 10 : 100, 2, 1000), range('radius', 'Radius', 160, 50, 1000), { key: 'color', label: 'Line color', value: '' }];
const controls: Record<string, Control[]> = {
  tetris: [range('dropFrames', 'Frames per drop', 25, 5, 120)],
  'stained-glass': [range('count', 'Strip count', 20, 1, 200), range('minDistance', 'Minimum step', 10, 1, 100), range('maxDistance', 'Maximum step', 75, 1, 200), range('average', 'Average step position', .25, 0, 1, .01), toggle('grid', 'Show grid', false), range('gridWidth', 'Grid width', 32, 4, 200), range('gridHeight', 'Grid height', 32, 4, 200)],
  'snow-globe': [range('count', 'Snow particles', 1000, 50, 1000, 50), range('gravity', 'Gravity', .1, 0, 1, .01), range('wind', 'Wind strength', .00003, 0, .001, .00001)],
  skyscrapers: [range('count', 'Skyscraper count', 10, 1, 1000), range('delay', 'Outline draw delay (seconds)', .1, .01, 1, .01), range('minHeight', 'Minimum height', 10, 1, 1000), range('maxHeight', 'Maximum height', 250, 1, 1000), range('minWidth', 'Minimum width', 10, 1, 1000), range('maxWidth', 'Maximum width', 100, 1, 1000), toggle('repeat', 'Restart on finish', true)],
  'particle-field': field,
  'flow-field': field.map(c => ({ ...c, value: c.key === 'count' ? 0 : c.key === 'vectors' ? true : c.key === 'directionRate' ? .001 : c.value })),
  'drawn-field': field.map(c => ({ ...c, value: ({ count: 3, trail: 2, alpha: 20, size: 1, shrinks: false, speed: 3, strength: .5, clear: false } as Settings)[c.key] ?? c.value })),
  fireworks: [range('gravity', 'Gravity', 1, 0, 5, .1), range('rocketSize', 'Firework size', 5, 1, 20), range('size', 'Particle size', 3, 0, 20), range('trail', 'Particle trail length', 15, 0, 200), range('trailVariance', 'Trail length variance', 10, 0, 50), range('force', 'Explosion force', 10, 0, 20), range('arc', 'Explosion arc', 4.71, 0, Math.PI * 2, .1), range('count', 'Explosion particles', 50, 0, 200), range('life', 'Particle lifespan', 50, 1, 100), range('lifeVariance', 'Particle lifespan variance', 20, 0, 200), range('fuse', 'Firework lifespan', 10, 1, 100), range('fuseVariance', 'Firework lifespan variance', 15, 0, 200), toggle('spawner', 'Spawn fireworks', true), range('spawnRate', 'Spawn interval (frames)', 40, 1, 250)],
  'times-tables-animated': tables(false), 'times-tables-static': tables(true),
  'sine-sums': waves(false), 'sine-sums-mixed': waves(true),
  'edge-detection': [], 'edge-detection-agate': [],
  'bouncy-dvd': [range('speed', 'Speed', 1, 0, 4, .1), range('size', 'Logo width (%)', 100 / 6, 5, 50, .1)]
};
const factories = import.meta.glob<{ create: SketchFactory }>(['./tetris.ts', './geometry.ts', './field.ts', './fireworks.ts', './glass.ts', './skyline.ts', './snow.ts', './dvd.ts', './edges.ts']);
function family(slug: string) {
  if (slug.startsWith('times-tables') || slug.startsWith('sine-sums')) return 'geometry';
  if (slug.endsWith('field')) return 'field';
  if (slug.startsWith('edge-detection')) return 'edges';
  return ({ 'stained-glass': 'glass', skyscrapers: 'skyline', 'snow-globe': 'snow', 'bouncy-dvd': 'dvd' } as Record<string, string>)[slug] ?? slug;
}
export const definitions = Object.freeze(catalog.map(entry => {
  const fields = controls[entry.slug].map(control => Object.freeze({ ...control }));
  const shape = Object.fromEntries(fields.map(control => [control.key, typeof control.value === 'boolean' ? z.boolean() : typeof control.value === 'string' ? z.union([z.literal(''), colorSchema]) : (control.step === 1 ? z.number().int() : z.number()).min(control.min!).max(control.key === 'strength' ? 1e12 : control.max!)]));
  const schema = entry.slug.startsWith('sine-sums') ? z.record(z.string(), z.union([z.number(), z.boolean(), z.string()])).superRefine((settings, context) => {
    const count = settings.waves;
    if (typeof count !== 'number' || !Number.isInteger(count) || count < 0 || count > 1024 || typeof settings.speed !== 'number' || settings.speed < 0 || settings.speed > 5) { context.addIssue({ code: 'custom', message: 'Invalid sine settings.' }); return; }
    for (const [key, value] of Object.entries(settings)) {
      if (key === 'waves' || key === 'speed') continue;
      const match = /^(frequency|amplitude|phase)(\d+)$/.exec(key);
      if (!match || Number(match[2]) >= count || typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > (match[1] === 'phase' ? Math.PI * 2 : 1e12)) context.addIssue({ code: 'custom', message: 'Invalid circle parameter.' });
    }
    for (let i = 0; i < count; i++) for (const key of ['frequency', 'amplitude', 'phase']) if (typeof settings[key + i] !== 'number') context.addIssue({ code: 'custom', message: 'Missing circle parameter.' });
  }) : z.object(shape).strict();
  return Object.freeze({ ...entry, controls: Object.freeze(fields), defaults: Object.freeze(Object.fromEntries(fields.map(c => [c.key, c.value]))), schema,
    load: async (): Promise<SketchFactory> => {
      const { create } = await factories[`./${family(entry.slug)}.ts`]();
      return async options => {
        const settings: Settings = { ...schema.parse(options.settings), preset: entry.slug };
        const instance = await create({ ...options, settings });
        let size: { width: number; height: number } | undefined;
        return { ...instance,
          resize(next) { size = next; instance.resize(next); },
          configure(next) {
            const parsed = schema.parse(next), previous = { ...settings };
            for (const key of Object.keys(settings)) if (key !== 'preset' && !(key in parsed)) delete settings[key];
            Object.assign(settings, parsed);
            if (instance.configure) return instance.configure(settings, previous);
            if (size) { instance.resize(size); return true; }
          }
        };
      };
    }
  });
}));
export function parsePreset(value: unknown) {
  const envelope = z.object({ version: z.literal(1), presetId: z.string(), seed: z.number().int().min(0).max(4294967295), settings: z.record(z.string(), z.union([z.number(), z.boolean(), z.string()])) }).strict().parse(value);
  const definition = definitions.find(entry => entry.presetId === envelope.presetId);
  if (!definition) throw new Error('Unknown preset.');
  return { ...envelope, settings: definition.schema.parse(envelope.settings) };
}
export type Definition = typeof definitions[number];
