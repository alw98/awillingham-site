import { index, route, type RouteConfig } from '@react-router/dev/routes';

export default [
  index('routes/home.tsx'),
  route('gallery', 'features/gallery/gallery-page.tsx'),
  route('gallery/:slug', 'features/gallery/sketch-page.tsx'),
  route('colors', 'features/themes/theme-page.tsx'),
  route('projecteuler', 'features/euler/euler-page.tsx'),
  route('timer', 'features/timer/timer-page.tsx'),
  route('*', 'routes/not-found.tsx')
] satisfies RouteConfig;
