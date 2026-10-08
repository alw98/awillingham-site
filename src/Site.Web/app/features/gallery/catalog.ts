export const catalog = Object.freeze([
  { slug: 'tetris', title: 'Tetris', category: 'Play', description: 'Falling-block puzzle.' },
  { slug: 'stained-glass', title: 'Stained Glass', category: 'Geometry', description: 'Generated stained-glass patterns.' },
  { slug: 'snow-globe', title: 'Snow Globe', category: 'Motion', description: 'Snow globe simulation.' },
  { slug: 'skyscrapers', title: 'Skyscrapers', category: 'Geometry', description: 'Generated skyline.' },
  { slug: 'particle-field', title: 'Particle Field', category: 'Motion', description: 'Particles in a vector field.' },
  { slug: 'fireworks', title: 'Fireworks', category: 'Motion', description: 'Firework simulation.' },
  { slug: 'times-tables-animated', title: 'Times Tables · Animated', category: 'Geometry', description: 'Animated multiplication patterns on a circle.' },
  { slug: 'edge-detection-agate', title: 'Agate Edges', category: 'Pixels', description: 'Edge detection on an agate image.' },
  { slug: 'edge-detection', title: 'Edge Detection', category: 'Pixels', description: 'Image edge detection.' },
  { slug: 'flow-field', title: 'Flow Field', category: 'Motion', description: 'Animated flow field.' },
  { slug: 'drawn-field', title: 'Drawn Field', category: 'Motion', description: 'Drawn particle paths.' },
  { slug: 'times-tables-static', title: 'Times Tables · Still', category: 'Geometry', description: 'Static multiplication pattern on a circle.' },
  { slug: 'sine-sums', title: 'Sine Sums', category: 'Geometry', description: 'Combined sine waves.' },
  { slug: 'sine-sums-mixed', title: 'Sine Sums · Mixed', category: 'Geometry', description: 'Combined sine waves with mixed frequencies.' },
  { slug: 'bouncy-dvd', title: 'Bouncy DVD', category: 'Play', description: 'Bouncing DVD logo.' },
].map(entry => Object.freeze(entry)));

export const categories = ['All', 'Geometry', 'Motion', 'Play', 'Pixels'] as const;
