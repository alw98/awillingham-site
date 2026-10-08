import { useEffect, useRef } from 'react';
import type { ThemeColors } from './preferences';
import styles from './theme-editor.module.css';

type Bubble = { x: number; y: number; radius: number; vx: number; vy: number; growth: number; color: number };

// Decorative version of the original ColorsPageSketch. No renderer dependency
// or browser work at import/prerender time; every mount owns its animation.
export function BubbleBackground({ colors, reduced }: { colors: ThemeColors; reduced: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const palette = useRef(colors);
  const repaint = useRef<() => void>(() => {});
  useEffect(() => { palette.current = colors; repaint.current(); }, [colors]);
  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext('2d');
    if (!element || !context) return;
    let width = 0, height = 0, frame = 0, previous = 0;
    const bubbles: Bubble[] = [];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const frozen = () => reduced || motion.matches;
    const add = (initial = false) => bubbles.push({
      x: Math.random() * width, y: Math.random() * height,
      radius: initial ? Math.random() * 5 : 0,
      vx: Math.random() - .5, vy: Math.random() - .5,
      growth: Math.random() * 5 * Math.min(1, Math.min(width, height) / 600),
      color: Math.random()
    });
    const draw = (elapsed = 0) => {
      const theme = palette.current;
      const shades: string[] = [];
      const addShade = (shade: string, weight: number) => { if (shade !== 'none') for (let i = 0; i < weight; i++) shades.push(shade); };
      Object.entries(theme.backgroundColor).forEach(([key, shade]) => addShade(shade, key === 'primary' ? 20 : key === 'secondary' ? 5 : 2));
      Object.entries(theme.textColor).forEach(([key, shade]) => addShade(shade, key === 'primary' ? 20 : 5));
      addShade(theme.accentColor.primary, 15); addShade(theme.accentColor.secondary, 10);
      for (const [key, pair] of Object.entries(theme.button)) {
        const weight = key.startsWith('hover') || key.startsWith('press') ? 2 : 5;
        addShade(pair.primary, key === 'backgroundColor' || key === 'textColor' ? 10 : weight);
        addShade(pair.secondary, weight);
      }
      context.fillStyle = theme.backgroundColor.primary;
      context.fillRect(0, 0, width, height);
      for (let i = bubbles.length - 1; i >= 0; i--) {
        const bubble = bubbles[i];
        context.beginPath(); context.fillStyle = shades[Math.floor(bubble.color * shades.length)];
        context.arc(bubble.x, bubble.y, Math.max(0, bubble.radius), 0, Math.PI * 2); context.fill();
        bubble.radius += .1 * bubble.growth * elapsed;
        bubble.growth -= .01 * elapsed;
        bubble.x += bubble.vx * elapsed; bubble.y += bubble.vy * elapsed;
        if (bubble.radius < 0) bubbles.splice(i, 1);
      }
      if (elapsed && bubbles.length < 120 && Math.random() < 1 - .5 ** elapsed) add();
    };
    const tick = (now: number) => {
      frame = 0;
      const elapsed = previous ? Math.min((now - previous) / (1000 / 60), 3) : 0;
      previous = now; draw(elapsed);
      if (!frozen() && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resume = () => {
      cancelAnimationFrame(frame); frame = 0; previous = 0; draw();
      if (!frozen() && !document.hidden) frame = requestAnimationFrame(tick);
    };
    const resize = () => {
      const oldWidth = width, oldHeight = height;
      width = window.innerWidth; height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(width * ratio); element.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      if (oldWidth && oldHeight) for (const bubble of bubbles) { bubble.x *= width / oldWidth; bubble.y *= height / oldHeight; }
      if (!bubbles.length && frozen()) for (let i = 0; i < 35; i++) add(true);
      draw();
    };
    // Repaint frozen previews too when the user edits their colors.
    repaint.current = () => draw();
    resize(); resume();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', resume);
    motion.addEventListener('change', resume);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      repaint.current = () => {};
      document.removeEventListener('visibilitychange', resume);
      motion.removeEventListener('change', resume);
    };
  }, [reduced]);
  return <canvas ref={canvas} className={styles.bubbles} aria-hidden="true" data-testid="bubble-background" />;
}
