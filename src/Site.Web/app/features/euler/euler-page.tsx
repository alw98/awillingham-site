import { useEffect, useRef, useState } from 'react';
import { problems } from './problems';
import styles from './euler.module.css';
export const meta = () => [{ title: 'Project Euler — Armond Willingham' }];

export default function EulerPage() {
  const [answers, setAnswers] = useState<Record<number, number | string>>({});
  const [run, setRun] = useState(0);
  const worker = useRef<Worker | null>(null);
  useEffect(() => {
    const job = new Worker(new URL('./euler.worker.ts', import.meta.url), { type: 'module' });
    worker.current = job;
    let alive = true, remaining = 10;
    job.onmessage = ({ data }: MessageEvent<{ id: number; answer?: number; error?: string }>) => {
      if (!alive || !Number.isInteger(data.id) || data.id < 1 || data.id > 10) return;
      setAnswers(current => ({ ...current, [data.id]: data.error ?? data.answer ?? 'Unable to calculate answer.' }));
      if (--remaining === 0) { job.terminate(); worker.current = null; }
    };
    job.onerror = () => { if (alive) setAnswers(current => Object.fromEntries(problems.map(p => [p.id, current[p.id] ?? 'Unable to calculate answer.']))); job.terminate(); worker.current = null; };
    job.postMessage('calculate');
    return () => { alive = false; job.terminate(); worker.current = null; };
  }, [run]);
  const pending = problems.some(p => answers[p.id] === undefined);
  return <section className={styles.page}>
    <h1 id="page-title" tabIndex={-1} className={styles.title}>Project Euler</h1>
    {problems.map(problem => <article key={problem.id} className={styles.problem}>
      <h2>{problem.id}. {problem.title}</h2><div className={styles.question}>{problem.text}</div>
      <div role="status" aria-label={`Problem ${problem.id} answer`}>Answer: {answers[problem.id] ?? 'Calculating...'}</div>
    </article>)}
    <div className={styles.actions}>
      {pending && <button onClick={() => { worker.current?.terminate(); worker.current = null; setAnswers(current => Object.fromEntries(problems.map(p => [p.id, current[p.id] ?? 'Cancelled.']))); }}>Cancel calculation</button>}
      <button onClick={() => { setAnswers({}); setRun(value => value + 1); }}>Recalculate answers</button>
    </div>
  </section>;
}
