import { useEffect, useRef, type ReactNode } from 'react';
import styles from './overlay-panel.module.css';

export function OverlayPanel({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = ref.current!;
    opener.current ??= document.activeElement as HTMLElement;
    dialog.showModal();
    return () => { dialog.close(); opener.current?.focus(); };
  }, []);
  return <dialog ref={ref} className={styles.panel} aria-label={title} onCancel={onClose}>
    <div className={styles.header}><h2>{title}</h2><button autoFocus onClick={onClose} aria-label={`Close ${title.toLowerCase()}`}>×</button></div>
    {children}
  </dialog>;
}
