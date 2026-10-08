type Entry = { preview: boolean; visible: boolean; enabled: boolean; last: number; frame: (dt: number) => void; status: (moving: boolean) => void; moving: boolean };
const entries = new Set<Entry>();
let request = 0;
let listening = false;
function reconcile() {
  for (const entry of entries) {
    const moving = !document.hidden && entry.visible && entry.enabled;
    if (moving !== entry.moving) { entry.moving = moving; entry.last = 0; entry.status(moving); }
  }
  if ([...entries].some(e => e.moving)) { if (!request) request = requestAnimationFrame(tick); }
  else if (request) { cancelAnimationFrame(request); request = 0; }
}
function tick(time: number) {
  request = 0;
  for (const entry of entries) if (entry.moving) {
    const interval = entry.preview ? 1000 / 30 : 1000 / 60;
    if (!entry.last) entry.last = time - interval;
    const dt = time - entry.last;
    if (dt + .1 >= interval) { entry.last = time; entry.frame(Math.min(dt, 100)); }
  }
  if ([...entries].some(e => e.moving)) request = requestAnimationFrame(tick);
}
export function schedule(preview: boolean, frame: Entry['frame'], status: Entry['status']) {
  const entry: Entry = { preview, visible: false, enabled: false, last: 0, frame, status, moving: false };
  entries.add(entry);
  if (!listening) { document.addEventListener('visibilitychange', reconcile); listening = true; }
  return {
    set(visible: boolean, enabled: boolean) { entry.visible = visible; entry.enabled = enabled; reconcile(); },
    dispose() {
      entries.delete(entry); reconcile();
      if (!entries.size) { document.removeEventListener('visibilitychange', reconcile); listening = false; }
    }
  };
}
