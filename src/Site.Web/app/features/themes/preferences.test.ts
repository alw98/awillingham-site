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
  it('reads preferences first, inspects the old theme and never overwrites legacy keys', () => {
    const storage = memory({ ThemeStore: '{old-theme}', TimerStore: '{old-timer}' });
    const store = createPreferenceStore(() => storage);
    expect(storage.getItem).not.toHaveBeenCalled();
    store.getState().load();
    expect(storage.getItem).toHaveBeenNthCalledWith(1, PREFERENCE_KEY);
    expect(storage.getItem).toHaveBeenNthCalledWith(2, 'ThemeStore');
    expect(storage.setItem).not.toHaveBeenCalled();
    store.getState().setMode('light');
    expect(parsePreferences(storage.entries.get(PREFERENCE_KEY)!)).toMatchObject({ themeMode: 'light' });
    expect(storage.entries.get('ThemeStore')).toBe('{old-theme}');
    expect(storage.entries.get('TimerStore')).toBe('{old-timer}');
  });

  it('imports a validated original theme only on request and preserves both old keys', () => {
    const theme = structuredClone(dark); theme.backgroundColor.primary = '#123456';
    const raw = JSON.stringify({ theme, usingDefaultTheme: false, colorPageThemeStore: { theme } });
    const storage = memory({ ThemeStore: raw, TimerStore: '{old-timer}' });
    const store = createPreferenceStore(() => storage); store.getState().load();
    expect(store.getState().preferences.customTheme).toBeNull();
    expect(storage.setItem).not.toHaveBeenCalled();
    store.getState().importLegacyTheme();
    expect(parsePreferences(storage.entries.get(PREFERENCE_KEY)!)).toMatchObject({ themeMode: 'custom', customTheme: theme, legacyImport: { theme: 'imported' } });
    expect(storage.entries.get('ThemeStore')).toBe(raw); expect(storage.entries.get('TimerStore')).toBe('{old-timer}');
  });

  it('does not import malformed legacy colors or overwrite an unreadable replacement record', () => {
    const storage = memory({ ThemeStore: JSON.stringify({ theme: dark }), [PREFERENCE_KEY]: '{broken' });
    const store = createPreferenceStore(() => storage); store.getState().load(); store.getState().importLegacyTheme();
    expect(storage.setItem).not.toHaveBeenCalled(); expect(storage.entries.get(PREFERENCE_KEY)).toBe('{broken');
    storage.entries.set('ThemeStore', '{bad'); store.getState().load();
    expect(store.getState().legacyTheme).toBeNull(); expect(store.getState().legacyNotice).toContain('preserved');
  });
  it('does not overwrite a new custom theme with an original saved theme', () => {
    const storage = memory({ ThemeStore: JSON.stringify({ theme: dark }) });
    const store = createPreferenceStore(() => storage); store.getState().load();
    store.getState().saveCustomTheme(light); const raw = storage.entries.get(PREFERENCE_KEY);
    store.getState().importLegacyTheme(); expect(storage.entries.get(PREFERENCE_KEY)).toBe(raw);
    expect(store.getState().preferences.customTheme).toEqual(light);
  });
  it('preserves the pending import and original bytes when saving runs out of quota', () => {
    const original = JSON.stringify({ theme: dark }), storage = memory({ ThemeStore: original });
    storage.setItem.mockImplementation(() => { throw new Error('Quota exceeded'); });
    const store = createPreferenceStore(() => storage); store.getState().load(); store.getState().importLegacyTheme();
    expect(store.getState()).toMatchObject({ status: 'unavailable', preferences: { customTheme: null, legacyImport: { theme: 'pending' } } });
    expect(storage.entries.get('ThemeStore')).toBe(original); expect(storage.entries.has(PREFERENCE_KEY)).toBe(false);
  });

  it.each(['{', '{"schemaVersion":99}', JSON.stringify({ ...defaultPreferences(), extra: true }), JSON.stringify({ ...defaultPreferences(), themeMode: 'custom' }), 'x'.repeat(MAX_PREFERENCE_BYTES + 1)])('preserves invalid or unsupported data until an explicit reset (%#)', raw => {
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
