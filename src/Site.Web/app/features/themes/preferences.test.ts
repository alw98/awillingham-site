import { describe, expect, it, vi } from 'vitest';
import { createPreferenceStore, defaultPreferences, MAX_PREFERENCE_BYTES, parsePreferences, PREFERENCE_KEY, preferencesSchema, type StoragePort } from './preferences';
import { dark, light, themeVariables } from './palettes';

const memory = (initial: Record<string, string> = {}) => {
  const entries = new Map(Object.entries(initial));
  return { entries, getItem: vi.fn((key: string) => entries.get(key) ?? null), setItem: vi.fn((key: string, value: string) => { entries.set(key, value); }) };
};

describe('safe preference persistence', () => {
  it('validates and persists every custom color while preserving preference flags', () => {
    const storage = memory(); const store = createPreferenceStore(() => storage);
    store.getState().load(); store.getState().setMotion('reduced');
    const custom = structuredClone(dark); custom.accentColor.primary = '#c531dd';
    store.getState().saveCustomTheme(custom);
    const persisted = parsePreferences(storage.entries.get(PREFERENCE_KEY)!);
    expect(persisted).toMatchObject({ themeMode: 'custom', motion: 'reduced', customTheme: custom });
    custom.accentColor.primary = '#ffffff';
    expect(store.getState().preferences.customTheme?.accentColor.primary).toBe('#c531dd');
    const reload = createPreferenceStore(() => storage); reload.getState().load();
    expect(reload.getState().preferences).toEqual(persisted);
  });

  it('rejects unsafe custom colors without changing saved bytes or live preferences', () => {
    const storage = memory(); const store = createPreferenceStore(() => storage); store.getState().load();
    const custom = structuredClone(dark); custom.backgroundColor.primary = 'url(unsafe)';
    store.getState().saveCustomTheme(custom);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(store.getState().preferences).toEqual(defaultPreferences());
  });

  it('allows a temporary custom preview without overwriting unreadable data', () => {
    const storage = memory({ [PREFERENCE_KEY]: '{broken' });
    const store = createPreferenceStore(() => storage); store.getState().load();
    store.getState().saveCustomTheme(light);
    expect(store.getState().preferences.customTheme).toEqual(light);
    expect(storage.entries.get(PREFERENCE_KEY)).toBe('{broken');
    expect(storage.setItem).not.toHaveBeenCalled();
  });
  it('reads only current preferences and strips unused fields without losing saved colors', () => {
    const current = { ...defaultPreferences(), themeMode: 'custom', customTheme: dark, motion: 'reduced' };
    const raw = JSON.stringify({ ...current, legacyImport: { theme: 'imported', timer: 'pending' } });
    const storage = memory({ [PREFERENCE_KEY]: raw, unrelated: 'untouched' });
    const store = createPreferenceStore(() => storage);
    expect(storage.getItem).not.toHaveBeenCalled();
    store.getState().load();
    expect(storage.getItem).toHaveBeenCalledExactlyOnceWith(PREFERENCE_KEY);
    expect(store.getState().preferences).toEqual(current);
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(storage.entries.get(PREFERENCE_KEY)).toBe(raw);
    store.getState().setMode('light');
    expect(JSON.parse(storage.entries.get(PREFERENCE_KEY)!)).toEqual({ ...current, themeMode: 'light' });
    expect(storage.entries.get('unrelated')).toBe('untouched');
  });

  it.each(['{', '{"schemaVersion":99}', JSON.stringify({ ...defaultPreferences(), themeMode: 'custom' }), 'x'.repeat(MAX_PREFERENCE_BYTES + 1)])('preserves invalid or unsupported data until an explicit reset (%#)', raw => {
    const storage = memory({ [PREFERENCE_KEY]: raw });
    const store = createPreferenceStore(() => storage);
    store.getState().load();
    expect(store.getState()).toMatchObject({ status: 'invalid', raw });
    store.getState().setMode('light');
    expect(store.getState().preferences.themeMode).toBe('light');
    expect(storage.setItem).not.toHaveBeenCalled();
    expect(storage.entries.get(PREFERENCE_KEY)).toBe(raw);
    store.getState().reset();
    expect(store.getState().status).toBe('ready');
    expect(parsePreferences(storage.entries.get(PREFERENCE_KEY)!)).toEqual(defaultPreferences());
  });

  it('recovers if read access later becomes available', () => {
    const storage = memory({ [PREFERENCE_KEY]: JSON.stringify({ ...defaultPreferences(), themeMode: 'system' }) });
    const getStorage = vi.fn<() => StoragePort>().mockImplementationOnce(() => { throw new Error('Denied'); }).mockReturnValue(storage);
    const store = createPreferenceStore(getStorage);
    store.getState().load();
    expect(store.getState().status).toBe('unavailable');
    store.getState().load();
    expect(store.getState()).toMatchObject({ status: 'ready', preferences: { themeMode: 'system' } });
  });

  it('keeps previous bytes when saving fails and still allows temporary changes', () => {
    const raw = JSON.stringify(defaultPreferences());
    const storage = memory({ [PREFERENCE_KEY]: raw });
    storage.setItem.mockImplementation(() => { throw new Error('Quota exceeded'); });
    const store = createPreferenceStore(() => storage);
    store.getState().load(); store.getState().setMode('light');
    expect(store.getState()).toMatchObject({ status: 'unavailable', preferences: { themeMode: 'light' } });
    expect(storage.entries.get(PREFERENCE_KEY)).toBe(raw);
    store.getState().setMotion('reduced');
    expect(storage.setItem).toHaveBeenCalledTimes(1);
  });

  it('retains all 26 custom color leaves including transparent outlines', () => {
    const custom = structuredClone(dark); custom.button.outlineColor.secondary = 'none';
    const preferences = { ...defaultPreferences(), themeMode: 'custom', customTheme: custom };
    expect(preferencesSchema.safeParse(preferences).success).toBe(true);
    const variables = themeVariables(custom);
    expect(Object.keys(variables)).toHaveLength(26);
    expect(variables['--color-button-outline-secondary']).toBe('transparent');
    expect(variables['--color-button-hover-text-secondary']).toBe(dark.button.hoverTextColor.secondary);
    expect(preferencesSchema.safeParse({ ...preferences, customTheme: { ...custom, unknown: 'red' } }).success).toBe(false);
    expect(parsePreferences(JSON.stringify(preferences)).customTheme).toEqual(custom);
  });

  it.each(['url(secret)', 'var(--unsafe)', 'rgb(256,0,0)', 'rgba(0,0,0,2)', '#12', 'rgb(.,0,0)'])('rejects unsupported color syntax: %s', value => {
    const custom = structuredClone(dark); custom.textColor.primary = value;
    expect(preferencesSchema.safeParse({ ...defaultPreferences(), customTheme: custom }).success).toBe(false);
  });

  it('default text and button states have readable contrast in both palettes', () => {
    const luminance = (hex: string) => {
      const channels = [1, 3, 5].map(start => parseInt(hex.slice(start, start + 2), 16) / 255).map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
      return channels[0] * .2126 + channels[1] * .7152 + channels[2] * .0722;
    };
    const ratio = (a: string, b: string) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);
    for (const palette of [dark, light]) {
      expect(ratio(palette.textColor.primary, palette.backgroundColor.primary)).toBeGreaterThanOrEqual(4.5);
      expect(ratio(palette.textColor.secondary, palette.backgroundColor.secondary)).toBeGreaterThanOrEqual(4.5);
      for (const variant of ['primary', 'secondary'] as const) {
        expect(ratio(palette.button.textColor[variant], palette.button.backgroundColor[variant])).toBeGreaterThanOrEqual(4.5);
        expect(ratio(palette.button.hoverTextColor[variant], palette.button.hoverBackgroundColor[variant])).toBeGreaterThanOrEqual(4.5);
        expect(ratio(palette.button.pressTextColor[variant], palette.button.pressBackgroundColor[variant])).toBeGreaterThanOrEqual(4.5);
      }
    }
  });
});
