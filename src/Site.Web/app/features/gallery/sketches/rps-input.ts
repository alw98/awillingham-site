import type { Point } from './types';

export function attachRpsInput(canvas: HTMLCanvasElement, dispatch: (action: string, point?: Point) => void) {
  const pointers = new Map<number, Point>();
  let panning = false;
  let touchPending: Point | undefined;
  const point = (event: MouseEvent) => { const bounds = canvas.getBoundingClientRect(); return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }; };
  const pair = () => {
    const [a, b] = [...pointers.values()];
    return { middle: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, distance: Math.hypot(a.x - b.x, a.y - b.y) };
  };
  const down = (event: PointerEvent) => {
    if (event.button !== 0 && event.button !== 2) return;
    event.preventDefault(); canvas.focus({ preventScroll: true }); canvas.setPointerCapture(event.pointerId);
    pointers.set(event.pointerId, point(event)); panning = pointers.size > 1 || event.shiftKey || event.button === 2; dispatch('release');
    touchPending = event.pointerType === 'touch' && pointers.size === 1 && !panning ? point(event) : undefined;
    if (pointers.size === 1 && !panning && event.pointerType !== 'touch') dispatch('paint', point(event));
  };
  const move = (event: PointerEvent) => {
    const before = pointers.get(event.pointerId); if (!before) return;
    event.preventDefault(); const old = pointers.size === 2 ? pair() : null, next = point(event); pointers.set(event.pointerId, next);
    if (pointers.size === 2 && old) {
      const current = pair(); dispatch('pan', { x: current.middle.x - old.middle.x, y: current.middle.y - old.middle.y });
      if (old.distance > 1) dispatch('zoom', { ...current.middle, scale: current.distance / old.distance });
    } else if (pointers.size === 1) {
      if (touchPending && !panning) { dispatch('paint', touchPending); touchPending = undefined; }
      dispatch(panning ? 'pan' : 'paint', panning ? { x: next.x - before.x, y: next.y - before.y } : next);
    }
  };
  const up = (event: PointerEvent) => {
    if (event.type === 'pointerup' && touchPending && pointers.size === 1 && !panning) dispatch('paint', touchPending);
    touchPending = undefined; pointers.delete(event.pointerId); dispatch('release');
  };
  const release = () => { pointers.clear(); touchPending = undefined; dispatch('release'); };
  const wheel = (event: WheelEvent) => {
    event.preventDefault(); dispatch('zoom', { ...point(event), scale: Math.exp(-Math.max(-100, Math.min(100, event.deltaY)) * .002) });
  };
  const key = (event: KeyboardEvent) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const action = ({ '+': 'zoom-in', '=': 'zoom-in', '-': 'zoom-out', '0': 'reset-view', ArrowLeft: 'pan-left', ArrowRight: 'pan-right', ArrowUp: 'pan-up', ArrowDown: 'pan-down', ' ': 'paint-center' } as Record<string, string>)[event.key];
    if (action) { event.preventDefault(); dispatch(action); }
  };
  const context = (event: Event) => event.preventDefault(), visibility = () => { if (document.hidden) release(); };
  canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up); canvas.addEventListener('lostpointercapture', up);
  canvas.addEventListener('wheel', wheel, { passive: false }); canvas.addEventListener('keydown', key);
  canvas.addEventListener('contextmenu', context); canvas.addEventListener('blur', release); document.addEventListener('visibilitychange', visibility);
  window.addEventListener('blur', release);
  return () => {
    release(); canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
    canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up); canvas.removeEventListener('lostpointercapture', up);
    canvas.removeEventListener('wheel', wheel); canvas.removeEventListener('keydown', key);
    canvas.removeEventListener('contextmenu', context); canvas.removeEventListener('blur', release); document.removeEventListener('visibilitychange', visibility);
    window.removeEventListener('blur', release);
  };
}
