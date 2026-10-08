import { Link } from 'react-router';
import styles from '../shared/site.module.css';
export const meta = () => [{ title: 'Page not found - Armond Willingham' }];
export default function NotFound() { return <section className={styles.comingSoon}><h1 id="page-title" tabIndex={-1}>Page not found</h1><div className={styles.actions}><Link className={styles.button} to="/">Home</Link><Link to="/gallery">Gallery</Link></div></section>; }
