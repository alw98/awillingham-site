import inventory from '../../../../../docs/contracts/legacy-gallery.json';

const metadata: Record<string, { title: string; category: string; description: string }> = {
  tetris: { title: 'Tetris', category: 'Play', description: 'Falling-block puzzle.' },
  'stained-glass': { title: 'Stained Glass', category: 'Geometry', description: 'Generated stained-glass patterns.' },
  'snow-globe': { title: 'Snow Globe', category: 'Motion', description: 'Snow globe simulation.' },
  skyscrapers: { title: 'Skyscrapers', category: 'Geometry', description: 'Generated skyline.' },
  'particle-field': { title: 'Particle Field', category: 'Motion', description: 'Particles in a vector field.' },
  fireworks: { title: 'Fireworks', category: 'Motion', description: 'Firework simulation.' },
  'times-tables-animated': { title: 'Times Tables · Animated', category: 'Geometry', description: 'Animated multiplication patterns on a circle.' },
  'times-tables-static': { title: 'Times Tables · Still', category: 'Geometry', description: 'Static multiplication pattern on a circle.' },
  'edge-detection-agate': { title: 'Agate Edges', category: 'Pixels', description: 'Edge detection on an agate image.' },
  'edge-detection': { title: 'Edge Detection', category: 'Pixels', description: 'Image edge detection.' },
  'flow-field': { title: 'Flow Field', category: 'Motion', description: 'Animated flow field.' },
  'drawn-field': { title: 'Drawn Field', category: 'Motion', description: 'Drawn particle paths.' },
  'sine-sums': { title: 'Sine Sums', category: 'Geometry', description: 'Combined sine waves.' },
  'sine-sums-mixed': { title: 'Sine Sums · Mixed', category: 'Geometry', description: 'Combined sine waves with mixed frequencies.' },
  'bouncy-dvd': { title: 'Bouncy DVD', category: 'Play', description: 'Bouncing DVD logo.' }
};

export const catalog = Object.freeze(inventory.presets.map(entry => Object.freeze({ ...entry, ...metadata[entry.slug] })));
export const legacyAliases = new Map<string, string>();
for (const entry of catalog) if (!legacyAliases.has(entry.legacyName)) legacyAliases.set(entry.legacyName, entry.slug);
export const categories = ['All', 'Geometry', 'Motion', 'Play', 'Pixels'] as const;
