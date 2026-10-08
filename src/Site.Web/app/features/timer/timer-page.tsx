import { useState } from 'react';
import { OverlayPanel } from '../../shared/overlay-panel';
import styles from './timer.module.css';
export const meta = () => [{ title: 'Timer — Armond Willingham' }];
export default function TimerPage() {
  const [open, setOpen] = useState(false);
  return <section className={styles.page}><h1 id="page-title" tabIndex={-1}>Timer</h1>
    <button className={styles.add} onClick={() => setOpen(true)} aria-label="Add item" aria-haspopup="dialog">＋</button>
    {open && <OverlayPanel title="Add Item" onClose={() => setOpen(false)}><p>Timer editing is not yet available.</p></OverlayPanel>}
  </section>;
}
