import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useSyncExternalStore } from 'react';
import { usePreferences, useThemeColors } from '../../themes/preferences-context';
import type { Definition } from './definitions';
import type { Point, Settings, SketchInstance } from './types';
import { schedule } from './scheduler';
import styles from './sketch.module.css';

const subscribeMotion = (callback: () => void) => { const query = matchMedia('(prefers-reduced-motion: reduce)'); query.addEventListener('change', callback); return () => query.removeEventListener('change', callback); };
const motionSnapshot = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export function useReducedMotion() {
  const { preferences } = usePreferences();
  const systemReduced = useSyncExternalStore(subscribeMotion, motionSnapshot, () => false);
  return preferences.motion === 'reduced' || systemReduced;
}
export interface CanvasHandle { input(action: string): void }
const keys: Record<string, string> = { a: 'left', ArrowLeft: 'left', d: 'right', ArrowRight: 'right', s: 'down', ArrowDown: 'down', q: 'clockwise', e: 'counterclockwise', w: 'drop', ' ': 'drop', ArrowUp: 'clockwise' };
export const CanvasHost = forwardRef<CanvasHandle, { definition: Definition; settings: Settings; seed: number; preview?: boolean; paused?: boolean; play?: boolean; onSummary?: (summary: string) => void }>(function CanvasHost({ definition, settings, seed, preview = false, paused = false, play = false, onSummary }, ref) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<SketchInstance | null>(null);
  const settingsRef = useRef(settings);
  const repaint = useRef<() => void>(() => {});
  const colors = useThemeColors();
  const colorsRef = useRef(colors);
  const summaryRef = useRef(onSummary);
  const reduced = useReducedMotion();
  const animated = !definition.slug.startsWith('edge-detection') && (!definition.slug.startsWith('times-tables') || Number(settings.rate) > 0);
  const enabled = animated && !paused && (play || !reduced);
  const enabledRef = useRef(enabled);
  const scheduling = useRef<ReturnType<typeof schedule> | null>(null);
  const visibleRef = useRef(false);
  const lastPointer = useRef(0);
  const [status, setStatus] = useState('loading');
  useImperativeHandle(ref, () => ({ input(action: string) { instanceRef.current?.input?.(action); repaint.current(); } }), []);
  useEffect(() => { colorsRef.current = colors; summaryRef.current = onSummary; repaint.current(); }, [colors, onSummary]);
  useEffect(() => {
    settingsRef.current = settings;
    const reset = instanceRef.current?.configure?.(settings);
    repaint.current();
    if (reset && reduced) { instanceRef.current?.update(1000); repaint.current(); }
  }, [settings, reduced]);
  useEffect(() => { enabledRef.current = enabled; if (!enabled) instanceRef.current?.input?.('release'); scheduling.current?.set(visibleRef.current, enabled); }, [enabled]);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const context = canvas.getContext('2d');
    const abort = new AbortController();
    let instance: SketchInstance | null = null, frames = 0, lastSummary = '', failed = false;
    let size = { width: 320, height: 320 };
    const fail = () => { if (abort.signal.aborted) return; failed = true; canvas.dataset.state = 'error'; setStatus('error'); scheduling.current?.set(false, false); };
    const draw = () => {
      if (!instance || !context || failed) return;
      context.save();
      try {
        context.fillStyle = colorsRef.current.backgroundColor.primary;
        context.fillRect(0, 0, size.width, size.height);
        instance.draw(context, colorsRef.current);
        canvas.dataset.frames = String(++frames);
        const summary = instance.summary?.() ?? '';
        if (summary !== lastSummary) { lastSummary = summary; summaryRef.current?.(summary); }
      } catch { fail(); } finally { context.restore(); }
    };
    repaint.current = draw;
    const scheduler = schedule(preview, dt => { try { instance?.update(dt); draw(); } catch { fail(); } }, moving => { if (!failed && instance) canvas.dataset.state = moving ? 'running' : 'paused'; });
    scheduling.current = scheduler;
    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const next = { width: Math.max(1, Math.round(bounds.width)), height: Math.max(1, Math.round(bounds.height)) };
      const dpr = Math.min(devicePixelRatio || 1, 2);
      size = next;
      if (canvas.width === Math.round(next.width * dpr) && canvas.height === Math.round(next.height * dpr)) return;
      canvas.width = Math.round(size.width * dpr); canvas.height = Math.round(size.height * dpr);
      context?.setTransform(dpr, 0, 0, dpr, 0, 0);
      try { instance?.resize(size); draw(); } catch { fail(); }
    };
    const observer = new ResizeObserver(resize); observer.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => { visibleRef.current = entry.isIntersecting; scheduler.set(entry.isIntersecting && !!instance && !failed, enabledRef.current); });
    visibility.observe(canvas);
    window.addEventListener('resize', resize);
    const release = () => instanceRef.current?.input?.('release');
    window.addEventListener('blur', release);
    document.addEventListener('visibilitychange', release);
    resize();
    void definition.load().then(factory => {
      if (abort.signal.aborted) return null;
      return factory({ settings: settingsRef.current, seed, preview, signal: abort.signal });
    }).then(created => {
      if (!created) return;
      if (abort.signal.aborted) { created.dispose(); return; }
      instance = created; instanceRef.current = created;
      created.configure?.(settingsRef.current);
      created.resize(size); draw();
      if (reduced) { created.update(1000); draw(); }
      if (failed) return; setStatus('ready'); canvas.dataset.state = 'paused';
      scheduler.set(visibleRef.current && !failed, enabledRef.current);
    }).catch(fail);
    if (!context) fail();
    return () => {
      abort.abort(); scheduler.dispose(); scheduling.current = null;
      observer.disconnect(); visibility.disconnect(); window.removeEventListener('resize', resize);
      window.removeEventListener('blur', release); document.removeEventListener('visibilitychange', release);
      instance?.dispose(); instanceRef.current = null; repaint.current = () => {};
    };
  }, [definition, seed, preview, reduced]);
  const action = (command: string, point?: Point) => { if (status !== 'ready') return; instanceRef.current?.input?.(command, point); repaint.current(); };
  return <div className={`${styles.surface} ${preview ? '' : styles.full}`}>
    <canvas ref={canvasRef} aria-label={`${definition.title} ${preview ? 'preview' : 'canvas'}`} role="img" tabIndex={preview ? undefined : 0}
      onKeyDown={preview ? undefined : event => { const key = keys[event.key] ?? keys[event.key.toLowerCase()]; if (definition.slug === 'tetris' && key && !event.altKey && !event.ctrlKey && !event.metaKey) { event.preventDefault(); if (!event.repeat) action('press:' + key); } }}
      onKeyUp={preview ? undefined : event => { const key = keys[event.key] ?? keys[event.key.toLowerCase()]; if (definition.slug === 'tetris' && key) { event.preventDefault(); action('release:' + key); } }}
      onBlur={preview ? undefined : () => action('release')}
      onPointerDown={preview ? undefined : event => { event.currentTarget.focus(); const bounds = event.currentTarget.getBoundingClientRect(); action('pointer', { x: event.clientX - bounds.left, y: event.clientY - bounds.top }); }}
      onPointerMove={preview || !definition.slug.endsWith('field') ? undefined : event => {
        if (event.buttons !== 1 || event.timeStamp - lastPointer.current < 60) return;
        lastPointer.current = event.timeStamp;
        const bounds = event.currentTarget.getBoundingClientRect(); action('pointer', { x: event.clientX - bounds.left, y: event.clientY - bounds.top });
      }} />
    {status !== 'ready' && <div className={styles.message} role={status === 'error' ? 'alert' : undefined}>{status === 'error' ? 'Unable to load sketch.' : 'Loading...'}</div>}
  </div>;
});
