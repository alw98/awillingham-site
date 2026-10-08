import { useEffect, useRef, useSyncExternalStore, type ReactNode } from 'react';
import { Link, useLocation, useNavigation } from 'react-router';
import { usePreferences } from '../features/themes/preferences-context';
import styles from './site.module.css';
import logo from '../assets/AWLogoDark.svg';

const hydration = { subscribe: () => () => {}, client: () => true, server: () => false };

export function Shell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  // The shared SPA fallback is rendered at /. Match its neutral navigation
  // during hydration, then mark the browser's actual route as current.
  const hydrated = useSyncExternalStore(hydration.subscribe, hydration.client, hydration.server);
  const previousPath = useRef(pathname);
  const navigation = useNavigation();
  const { preferences, setMode } = usePreferences();
  useEffect(() => {
    if (previousPath.current !== pathname) document.getElementById('page-title')?.focus();
    previousPath.current = pathname;
  }, [pathname]);
  return <div className={styles.site}>
    <a className={styles.skip} href="#main">Skip to content</a>
    <header className={styles.header}>
      <nav aria-label="Main navigation" className={styles.nav}>
        {[['/', 'Home'], ['/gallery', 'Gallery'], ['/colors', 'Colors'], ['/projecteuler', 'Euler'], ['/timer', 'Timer']].map(([to, label]) =>
          <Link key={to} to={to} aria-current={hydrated && (pathname === to || (to !== '/' && pathname.startsWith(to + '/'))) ? 'page' : undefined}>{to === '/' && <img src={logo} alt="" className={styles.logo} />}{label}</Link>)}
      </nav>
      <button className={styles.themeToggle} onClick={() => setMode(preferences.themeMode === 'light' ? 'dark' : 'light')}
        aria-label={preferences.themeMode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}><svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" aria-hidden="true"><path d="M14 2A14 14 0 1 0 30 20C17 26 6 15 14 2Z" /></svg></button>
    </header>
    <div className={styles.progress} role="status">{navigation.state !== 'idle' ? 'Opening page…' : ''}</div>
    <main id="main" tabIndex={-1} className={styles.main}>{children}</main>

  </div>;
}
