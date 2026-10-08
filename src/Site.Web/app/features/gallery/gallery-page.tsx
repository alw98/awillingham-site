import { useState } from 'react';
import { Link } from 'react-router';
import { categories } from './catalog';
import { definitions } from './sketches/definitions';
import { CanvasHost } from './sketches/canvas-host';
import { seedFor } from './sketches/math';
import styles from '../../shared/site.module.css';
export const meta = () => [{ title: 'Gallery — Armond Willingham' }];

export default function Gallery() {
  const [category, setCategory] = useState<string>('All');
  const [query, setQuery] = useState('');
  const studies = definitions.filter(study => (category === 'All' || study.category === category) && (study.title + ' ' + study.description).toLowerCase().includes(query.toLowerCase()));
  return <>
    <h1 id="page-title" tabIndex={-1} className={styles.collectionTitle}>Gallery</h1>
    <details className={styles.galleryTools}><summary>Filter gallery</summary><div className={styles.galleryToolsBody}><div className={styles.filters} role="group" aria-label="Filter studies">{categories.map(label => <button key={label} aria-pressed={label === category} onClick={() => setCategory(label)}>{label}</button>)}</div>
      <label className={styles.search}><span>Search sketches</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search…" /></label></div>
    <p className={styles.resultCount} role="status">{studies.length} {studies.length === 1 ? 'sketch' : 'sketches'}</p></details>
    <div className={styles.galleryGrid}>{studies.map(study => <Link key={study.slug} className={styles.card} to={'/gallery/' + study.slug} aria-label={`${study.title} preview`} title={study.title}>
      <div className={styles.cardArt}><CanvasHost definition={study} settings={study.defaults} seed={seedFor(study.slug)} preview /></div>
      <div className={styles.cardBody}><span className={styles.eyebrow}>{study.category}</span><h2>{study.title}<span aria-hidden="true">↗</span></h2><p>{study.description}</p></div>
    </Link>)}</div>
    {studies.length === 0 && <div className={styles.empty}><h2>No sketches found.</h2><button onClick={() => { setCategory('All'); setQuery(''); }}>Clear filters</button></div>}
  </>;
}
