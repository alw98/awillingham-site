import { useId, useState, type CSSProperties } from 'react';
import { BubbleBackground } from './bubble-background';
import { colorPalettes } from './color-palettes';
import { colorSchema, type ThemeColors } from './preferences';
import { themeVariables } from './palettes';
import styles from './theme-editor.module.css';

const buttonFields = [
  ['backgroundColor', 'Background'], ['textColor', 'Text'], ['outlineColor', 'Outline'],
  ['hoverBackgroundColor', 'Hover Background'], ['hoverTextColor', 'Hover Text'], ['hoverOutlineColor', 'Hover Outline'],
  ['pressBackgroundColor', 'Press Background'], ['pressTextColor', 'Press Text'], ['pressOutlineColor', 'Press Outline']
] as const;

function pickerHex(value: string) {
  if (/^#[\da-f]{6}$/i.test(value)) return value;
  if (/^#[\da-f]{3,4}$/i.test(value)) return '#' + value.slice(1, 4).split('').map(letter => letter + letter).join('');
  if (/^#[\da-f]{8}$/i.test(value)) return value.slice(0, 7);
  const channels = value.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/);
  return channels ? '#' + channels.slice(1, 4).map(channel => Math.round(Number(channel)).toString(16).padStart(2, '0')).join('') : '#000000';
}

export function ColorControl({ label, value, outline = false, displayLabel = label, onChange }: { label: string; displayLabel?: string; value: string; outline?: boolean; onChange: (value: string) => void }) {
  const id = useId();
  const [palette, setPalette] = useState<keyof typeof colorPalettes>('prettyBlue');
  const [raw, setRaw] = useState(value);
  const [previous, setPrevious] = useState(value);
  if (previous !== value) { setPrevious(value); setRaw(value); }
  const valid = colorSchema.safeParse(raw).success || (outline && raw === 'none');
  function choose(next: string) { setRaw(next); onChange(next); }
  return <details className={styles.colorControl}>
    <summary aria-label={label}><span className={styles.chip} style={{ backgroundColor: value === 'none' ? 'transparent' : value }} /><span>{displayLabel}</span><span className={styles.colorValue}>{value}</span></summary>
    <div className={styles.picker}>
      <div className={styles.paletteFamilies} role="group" aria-label={`${label} palettes`}>
        {Object.entries(colorPalettes).map(([name, shades]) => <button key={name} type="button" style={{ backgroundColor: shades[5] }} aria-label={`${name.replace(/[A-Z]/g, letter => ' ' + letter.toLowerCase())} palette`} aria-pressed={palette === name} onClick={() => setPalette(name as keyof typeof colorPalettes)} />)}
      </div>
      <div className={styles.shades} role="group" aria-label={`${label} shades`}>
        {colorPalettes[palette].map(shade => <button key={shade} type="button" style={{ backgroundColor: shade }} aria-label={`Choose ${shade} for ${label}`} onClick={() => choose(shade)} />)}
      </div>
      <div className={styles.customColor}>
        <input type="color" aria-label={`${label} color picker`} value={pickerHex(value)} onChange={event => choose(event.target.value)} />
        <label htmlFor={id}>{label}<input id={id} value={raw} aria-invalid={!valid} aria-describedby={!valid ? id + '-error' : undefined} required onChange={event => {
          const next = event.target.value;
          setRaw(next);
          if (colorSchema.safeParse(next).success || (outline && next === 'none')) onChange(next);
        }} /></label>
      </div>
      {!valid && <p id={id + '-error'} className={styles.error} role="alert">Use a hex, rgb or rgba color{outline ? ', or none' : ''}.</p>}
      {outline && <button type="button" onClick={() => choose('none')}>No outline</button>}
    </div>
  </details>;
}

export function ThemeEditor({ initial, reduced, loading, onSave }: { initial: ThemeColors; reduced: boolean; loading: boolean; onSave: (colors: ThemeColors) => void }) {
  const [draft, setDraft] = useState(() => structuredClone(initial));
  const [saved, setSaved] = useState(false);
  const [resetVersion, setResetVersion] = useState(0);
  function update(group: 'backgroundColor' | 'textColor' | 'accentColor', variant: string, value: string) {
    setSaved(false); setDraft(current => ({ ...current, [group]: { ...current[group], [variant]: value } }));
  }
  function updateButton(field: keyof ThemeColors['button'], variant: 'primary' | 'secondary', value: string) {
    setSaved(false); setDraft(current => ({ ...current, button: { ...current.button, [field]: { ...current.button[field], [variant]: value } } }));
  }
  return <>
    <BubbleBackground colors={draft} reduced={reduced} />
    <form className={styles.editor} style={themeVariables(draft) as CSSProperties} onSubmit={event => {
      event.preventDefault();
      const invalid = event.currentTarget.querySelector<HTMLInputElement>('input[aria-invalid="true"]');
      if (invalid) { invalid.closest('details')?.setAttribute('open', ''); invalid.focus(); return; }
      onSave(draft); setSaved(true);
    }}>
      <div className={styles.saveRow}><button disabled={loading} type="submit">Save colors</button><button type="button" onClick={() => { setDraft(structuredClone(initial)); setSaved(false); setResetVersion(current => current + 1); }}>Discard changes</button><span role="status">{saved ? 'Colors applied.' : 'Save to apply changes.'}</span></div>
      {(['primary', 'secondary'] as const).map(variant => <section className={styles.section} key={variant}>
        <h2>{variant === 'primary' ? 'Primary' : 'Secondary'} Colors</h2>
        <div className={styles.sample} style={{ backgroundColor: draft.backgroundColor[variant], color: draft.textColor[variant], borderColor: draft.accentColor[variant] }}>Text preview</div>
        <div className={styles.colorGrid}>
          {(['backgroundColor', 'textColor', 'accentColor'] as const).map((group, index) => <ColorControl key={group + resetVersion} label={`${variant === 'primary' ? 'Primary' : 'Secondary'} ${['Background', 'Text', 'Accent'][index]}`} displayLabel={['Background', 'Text', 'Accent'][index]} value={draft[group][variant]} onChange={value => update(group, variant, value)} />)}
        </div>
      </section>)}
      {(['primary', 'secondary'] as const).map(variant => <section className={styles.section} key={variant}>
        <h2>{variant === 'primary' ? 'Primary' : 'Secondary'} Button Colors</h2>
        <div className={styles.buttonSamples} style={themeVariables(draft) as CSSProperties}>
          <button type="button" className={styles.previewButton} data-variant={variant}>Button</button>
          <span className={styles.previewButton} data-variant={variant} data-state="hover">Hover</span>
          <span className={styles.previewButton} data-variant={variant} data-state="press">Pressed</span>
        </div>
        <div className={styles.colorGrid}>
          {buttonFields.map(([field, label]) => <ColorControl key={field + resetVersion} label={`${variant === 'primary' ? 'Primary' : 'Secondary'} Button ${label}`} displayLabel={label} value={draft.button[field][variant]} outline={field.toLowerCase().includes('outline')} onChange={value => updateButton(field, variant, value)} />)}
        </div>
      </section>)}
      <section className={styles.section}><h2>More Background Colors</h2><div className={styles.colorGrid}>
        {(['tertiary', 'quaternary'] as const).map(variant => <ColorControl key={variant + resetVersion} label={`${variant === 'tertiary' ? 'Tertiary' : 'Quaternary'} Background`} value={draft.backgroundColor[variant]} onChange={value => update('backgroundColor', variant, value)} />)}
      </div></section>
    </form>
  </>;
}
