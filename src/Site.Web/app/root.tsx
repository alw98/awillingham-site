import { Links, Meta, Outlet, Scripts, ScrollRestoration, Link } from 'react-router';
import type { ReactNode } from 'react';
import { PreferenceProvider } from './features/themes/preferences-context';
import { SketchSettingsProvider } from './features/gallery/sketches/settings-context';
import { Shell } from './shared/shell';
import './shared/global.css';
import styles from './shared/site.module.css';
import fontLicense from './assets/Rubik-LICENSE.txt?url';

export function Layout({ children }: { children: ReactNode }) {
  return <html lang="en"><head><meta charSet="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><link rel="license" href={fontLicense} /><Meta /><Links /></head>
    <body><PreferenceProvider><SketchSettingsProvider><Shell>{children}</Shell></SketchSettingsProvider></PreferenceProvider><ScrollRestoration /><Scripts /></body></html>;
}
export default function App() { return <Outlet />; }
export function HydrateFallback() { return <section className={styles.pageHeading} role="status"><h1 id="page-title" tabIndex={-1}>Loading...</h1></section>; }
export function ErrorBoundary() {
  return <section className={styles.pageHeading}><h1 id="page-title" tabIndex={-1}>Unable to load page</h1>
    <p>Reload the page to try again.</p><Link className={styles.button} to="/">Home</Link></section>;
}
