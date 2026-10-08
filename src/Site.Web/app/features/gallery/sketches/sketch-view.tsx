import { useEffect, useRef, useState } from 'react';
import type { Definition } from './definitions';
import { CanvasHost, useReducedMotion, type CanvasHandle } from './canvas-host';
import { seedFor } from './math';
import type { Control, Settings } from './types';
import { useSketchSettings } from './settings-context';
import { useThemeColors } from '../../themes/preferences-context';
import { ColorControl } from '../../themes/theme-editor';
import { OverlayPanel } from '../../../shared/overlay-panel';
import { SketchAbout } from './about';
import darkGear from '../../../assets/GearAnimationDark.gif';
import lightGear from '../../../assets/GearAnimationLight.gif';
import styles from './sketch.module.css';

function SettingControl({ control, value, themeColor, change, extend = false }: { control: Control; value: number | boolean | string; themeColor: string; change: (value: number | boolean | string) => void; extend?: boolean }) {
  const [bounds, setBounds] = useState({ min: Math.min(control.min ?? 0, Number(value)), max: Math.max(control.max ?? 1, Number(value)), step: control.step ?? 1 });
  const update = (next: number) => {
    if (!Number.isFinite(next) || next < 0 || next > 1e12) return;
    change(next);
    if (extend && (next <= bounds.min || next >= bounds.max)) setBounds({ min: Math.min(bounds.min, next / 2), max: Math.max(bounds.max, next * 2), step: Math.min(bounds.step, Math.max(.00001, next / 20)) });
  };
  if (typeof control.value === 'string') return <div className={styles.control}>
    <ColorControl label={control.label} value={String(value || themeColor)} onChange={change} /><button onClick={() => change('')}>Use theme color</button>
  </div>;
  return <div className={styles.control}>
    <label><span className={styles.value}><span>{control.label}</span>{typeof control.value === 'number' && <output>{Number(value).toFixed(control.step && control.step < 1 ? Math.min(5, String(control.step).split('.')[1]?.length ?? 2) : 0)}</output>}</span>
      {typeof control.value === 'boolean' ? <input aria-label={control.label} type="checkbox" checked={Boolean(value)} onChange={e => change(e.target.checked)} /> : <input aria-label={control.label} type="range" min={extend ? bounds.min : control.min} max={extend ? bounds.max : control.max} step={extend ? bounds.step : control.step} value={Number(value)} onChange={e => update(Number(e.target.value))} />}
    </label>
    {extend && <label className={styles.extended}>Value<input type="number" aria-label={`${control.label} value`} min="0" max="1000000000000" step="any" value={Number(value)} onChange={e => update(e.target.valueAsNumber)} /></label>}
  </div>;
}

export function SketchView({ definition }: { definition: Definition }) {
  const session = useSketchSettings();
  const [settings, setSettings] = useState<Settings>(() => ({ ...(session.get(definition.slug) ?? definition.defaults) }));
  const [seed, setSeed] = useState(seedFor(definition.slug));
  const [resetVersion, setResetVersion] = useState(0);
  const [paused, setPaused] = useState(false);
  const [play, setPlay] = useState(false);
  const [summary, setSummary] = useState('');
  const [panel, setPanel] = useState<'Settings' | 'About' | null>(null);
  const reduced = useReducedMotion();
  const colors = useThemeColors();
  const channels = colors.backgroundColor.primary.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i)?.slice(1).map(channel => parseInt(channel, 16));
  const isLight = channels && channels[0] * .299 + channels[1] * .587 + channels[2] * .114 > 128;
  const staticImage = definition.slug.startsWith('edge-detection');
  const sine = definition.slug.startsWith('sine-sums');
  const host = useRef<CanvasHandle>(null);
  useEffect(() => { session.set(definition.slug, { ...settings }); }, [session, settings, definition.slug]);
  const apply = (candidate: Settings) => { if (definition.schema.safeParse(candidate).success) setSettings(candidate); };
  const change = (key: string, value: number | boolean | string) => apply({ ...settings, [key]: value });
  const actions = definition.slug === 'tetris' ? [['left', 'Left'], ['right', 'Right'], ['down', 'Down'], ['clockwise', 'Rotate clockwise'], ['counterclockwise', 'Rotate counterclockwise'], ['drop', 'Drop']] : definition.slug === 'snow-globe' ? [['shake', 'Shake']] : definition.slug === 'fireworks' ? [['launch', 'Launch']] : definition.slug.endsWith('field') ? [['add', 'Add particle']] : [];
  function addCircle() {
    const count = Number(settings.waves); const candidate: Settings = { ...settings, waves: count + 1 };
    for (const key of ['frequency', 'amplitude', 'phase']) candidate[key + count] = settings[key + (count - 1)] ?? (key === 'frequency' ? 1 : key === 'amplitude' ? .1 : 0);
    apply(candidate);
  }
  function deleteCircle(index: number) {
    const count = Number(settings.waves); const candidate: Settings = { ...settings, waves: count - 1 };
    for (const key of ['frequency', 'amplitude', 'phase']) {
      for (let i = index; i < count - 1; i++) candidate[key + i] = candidate[key + (i + 1)];
      delete candidate[key + (count - 1)];
    }
    apply(candidate);
  }
  const control = (c: Control, extend = false) => <SettingControl key={c.key} control={c} value={settings[c.key]} themeColor={colors.textColor.primary} change={value => change(c.key, value)} extend={extend} />;
  return <section className={styles.page}>
    <h1 id="page-title" className={styles.title} tabIndex={-1}>{definition.title}</h1>
    <CanvasHost key={resetVersion} ref={host} definition={definition} settings={settings} seed={seed} paused={paused} play={play} onSummary={setSummary} />
    <button className={styles.about} onClick={() => setPanel('About')} aria-haspopup="dialog">About</button>
    <button className={styles.gear} onClick={() => setPanel('Settings')} aria-haspopup="dialog" aria-label="Settings">
      <img src={isLight ? darkGear : lightGear} alt="" /><span className={styles.gearStatic} aria-hidden="true">⚙</span><span>settings</span>
    </button>
    {panel && <OverlayPanel title={panel} onClose={() => setPanel(null)}>
      {panel === 'About' ? <SketchAbout slug={definition.slug} /> : <>
        <div className={styles.controls}>
          {definition.controls.filter(c => !sine || !/^(waves|frequency|amplitude|phase)/.test(c.key)).map(c => control(c, c.key === 'strength'))}
          {sine && <>
            <button disabled={Number(settings.waves) >= 1024} onClick={addCircle}>Add circle</button>
            {Array.from({ length: Number(settings.waves) }, (_, i) => <fieldset className={styles.function} key={i}><legend>Function {i + 1}</legend>
              {control({ key: `frequency${i}`, label: `Frequency ${i + 1}`, value: 1, min: .1, max: 10, step: .1 }, true)}
              {control({ key: `amplitude${i}`, label: `Amplitude ${i + 1}`, value: .1, min: .01, max: 1, step: .01 }, true)}
              {control({ key: `phase${i}`, label: `Phase ${i + 1}`, value: 0, min: 0, max: Math.PI * 2, step: .1 })}
              <button onClick={() => deleteCircle(i)} aria-label={`Delete circle ${i + 1}`}>Delete</button>
            </fieldset>)}
          </>}
        </div>
        <div className={styles.toolbar}>
          {!staticImage && <button onClick={() => { if (paused || (reduced && !play)) { setPaused(false); setPlay(true); } else setPaused(true); }}>{paused ? 'Resume' : reduced && !play ? 'Play' : 'Pause'}</button>}
          <button onClick={() => { setSeed(s => (s + 1) >>> 0); setSummary(''); }}>Restart</button>
          {actions.map(([action, label]) => <button key={action} onClick={() => host.current?.input(action)}>{label}</button>)}
          <button onClick={() => { setSettings({ ...definition.defaults }); setSeed(seedFor(definition.slug)); setResetVersion(value => value + 1); }}>Reset options</button>
        </div>
        {definition.slug === 'tetris' && <p className={styles.instructions}>Focus the canvas: A/D move, S down, Q/E rotate, W drop. Arrow keys and Space also work.</p>}
        <div className={styles.readout} role="status" aria-label={`${definition.title} status`}>{summary}</div>
      </>}
    </OverlayPanel>}
  </section>;
}
