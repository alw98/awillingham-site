import { reactRouter } from '@react-router/dev/vite';
import { defineConfig } from 'vite';

const target = process.env.SITE_DEV_API_TARGET ?? 'http://127.0.0.1:5200';
export default defineConfig({
  plugins: [reactRouter()],
  server: {
    host: '127.0.0.1', port: 5300, strictPort: true,
    proxy: Object.fromEntries(['/api', '/auth', '/health'].map(path => [path, { target }]))
  }
});
