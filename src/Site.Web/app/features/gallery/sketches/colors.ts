import { colorPalettes } from '../../themes/color-palettes';
const colors = Object.values(colorPalettes).flat();
export const randomColor = (rng: () => number) => colors[Math.floor(rng() * colors.length)];
