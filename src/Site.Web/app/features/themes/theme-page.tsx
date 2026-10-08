import { useState } from 'react';
import { usePreferences, useThemeColors } from './preferences-context';
import type { Preferences } from './preferences';
import { ThemeEditor } from './theme-editor';
import styles from './theme-editor.module.css';
export const meta = () => [{ title: 'Colors — Armond Willingham' }];

export default function ThemePage() {
  const { preferences, status, notice, raw, load, setMode, setMotion, reset, saveCustomTheme, legacyTheme, legacyNotice, importLegacyTheme, declineLegacyTheme } = usePreferences();
  const palette = useThemeColors();
  const [message, setMessage] = useState('');
  function download() {
    if (raw === null) return;
    const url = URL.createObjectURL(new Blob([raw], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = 'gallery-preferences.json'; link.click(); URL.revokeObjectURL(url);
  }
  return <div className={styles.page}>
    <div className={styles.content}>
      <section className={styles.heading}><h1 id="page-title" tabIndex={-1}>Colors</h1></section>
      {notice && <aside className={styles.recovery} role="status"><p>{notice}</p><button onClick={load}>Retry saved preferences</button>{raw !== null && <button onClick={download}>Download saved data</button>}<button onClick={reset}>Reset saved preferences to defaults</button></aside>}
      {preferences.customTheme === null && preferences.legacyImport.theme === 'pending' && (legacyTheme || legacyNotice) && <aside className={styles.recovery}>
        <p>{legacyNotice ?? 'A saved theme from the original website is available. Import it to apply those colors. The original saved data will be preserved.'}</p>
        {legacyTheme && <div style={{ padding: '1rem', backgroundColor: legacyTheme.backgroundColor.primary, color: legacyTheme.textColor.primary, border: `1px solid ${legacyTheme.accentColor.primary}` }}>Saved theme preview</div>}
        {legacyTheme && <button disabled={status !== 'ready'} onClick={importLegacyTheme}>Import saved theme</button>}
        <button onClick={load}>Retry original theme</button><button disabled={status !== 'ready'} onClick={declineLegacyTheme}>Keep current colors</button>
      </aside>}
      <details className={styles.options}><summary>Appearance</summary><div className={styles.optionBody}>
        <fieldset disabled={status === 'loading'}><legend>Appearance</legend>
          {(['dark', 'light', 'system', ...(preferences.customTheme ? ['custom'] : [])] as Preferences['themeMode'][]).map(mode => <label key={mode}>
            <input type="radio" name="appearance" value={mode} checked={preferences.themeMode === mode} onChange={() => { setMode(mode); setMessage(''); }} />{mode[0].toUpperCase() + mode.slice(1)}
          </label>)}
        </fieldset>
        <label><input type="checkbox" checked={preferences.motion === 'reduced'} onChange={event => setMotion(event.target.checked ? 'reduced' : 'system')} /> Reduce motion</label>
        <span role="status">{message || (status === 'ready' ? 'Saved in this browser.' : 'Changes last for this visit until storage is recovered.')}</span>
      </div></details>
      <ThemeEditor key={JSON.stringify(palette)} initial={palette} reduced={preferences.motion === 'reduced'} loading={status === 'loading'} onSave={colors => {
        saveCustomTheme(colors); setMessage('Your colors are applied.');
      }} />
    </div>
  </div>;
}
