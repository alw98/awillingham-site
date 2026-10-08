import { createStore } from 'zustand/vanilla';
import { z } from 'zod';

export const PREFERENCE_KEY = 'aw.gallery.preferences.v1';
export const MAX_PREFERENCE_BYTES = 256 * 1024;
export const colorSchema = z.string().refine(value => {
  if (/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(value)) return true;
  const match = value.match(/^(rgb|rgba)\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/);
  if (!match || (match[1] === 'rgba') !== (match[5] !== undefined)) return false;
  return match.slice(2, 5).every(channel => Number.isFinite(Number(channel)) && Number(channel) >= 0 && Number(channel) <= 255) &&
    (match[5] === undefined || (Number.isFinite(Number(match[5])) && Number(match[5]) >= 0 && Number(match[5]) <= 1));
});
const color = colorSchema;
const pair = z.strictObject({ primary: color, secondary: color });
const outlineColor = z.union([color, z.literal('none')]);
const outlinePair = z.strictObject({ primary: outlineColor, secondary: outlineColor });
export const themeColorsSchema = z.strictObject({
  backgroundColor: z.strictObject({ primary: color, secondary: color, tertiary: color, quaternary: color }),
  textColor: pair, accentColor: pair,
  button: z.strictObject({
    backgroundColor: pair, textColor: pair, outlineColor: outlinePair,
    hoverBackgroundColor: pair, hoverTextColor: pair, hoverOutlineColor: outlinePair,
    pressBackgroundColor: pair, pressTextColor: pair, pressOutlineColor: outlinePair
  })
});
const decision = z.enum(['pending', 'imported', 'declined']);
export const preferencesSchema = z.strictObject({
  schemaVersion: z.literal(1), themeMode: z.enum(['dark', 'light', 'system', 'custom']),
  customTheme: themeColorsSchema.nullable(), motion: z.enum(['system', 'reduced']),
  legacyImport: z.strictObject({ theme: decision, timer: decision })
}).refine(value => value.themeMode !== 'custom' || value.customTheme !== null);
export type Preferences = z.infer<typeof preferencesSchema>;
export type ThemeColors = z.infer<typeof themeColorsSchema>;
export type StoragePort = Pick<Storage, 'getItem' | 'setItem'>;
export const defaultPreferences = (): Preferences => ({ schemaVersion: 1, themeMode: 'dark', customTheme: null, motion: 'system', legacyImport: { theme: 'pending', timer: 'pending' } });

export function parsePreferences(raw: string): Preferences {
  if (new TextEncoder().encode(raw).byteLength > MAX_PREFERENCE_BYTES) throw new Error('Preference data is too large.');
  return preferencesSchema.parse(JSON.parse(raw));
}

export function parseLegacyTheme(raw: string): ThemeColors {
  if (new TextEncoder().encode(raw).byteLength > MAX_PREFERENCE_BYTES) throw new Error('Legacy theme data is too large.');
  return z.object({ theme: themeColorsSchema }).parse(JSON.parse(raw)).theme;
}

export interface PreferenceState {
  preferences: Preferences;
  status: 'loading' | 'ready' | 'invalid' | 'unavailable';
  raw: string | null;
  notice: string | null;
  legacyTheme: ThemeColors | null;
  legacyNotice: string | null;
  load: () => void;
  setMode: (mode: Preferences['themeMode']) => void;
  setMotion: (motion: Preferences['motion']) => void;
  saveCustomTheme: (colors: ThemeColors) => void;
  importLegacyTheme: () => void;
  declineLegacyTheme: () => void;
  reset: () => void;
}

export function createPreferenceStore(storage: () => StoragePort) {
  return createStore<PreferenceState>()((set, get) => {
    const save = (preferences: Preferences, explicitReset = false) => {
      set({ preferences });
      if (!explicitReset && get().status !== 'ready') return false;
      try {
        const raw = JSON.stringify(preferencesSchema.parse(preferences));
        storage().setItem(PREFERENCE_KEY, raw);
        set({ status: 'ready', notice: null, raw });
        return true;
      } catch {
        set({ status: 'unavailable', notice: 'Preferences are available for this visit, but could not be saved. Your previous saved data is preserved.' });
        return false;
      }
    };
    return {
      preferences: defaultPreferences(), status: 'loading', raw: null, notice: null, legacyTheme: null, legacyNotice: null,
      load: () => {
        let raw: string | null;
        try { raw = storage().getItem(PREFERENCE_KEY); }
        catch { set({ status: 'unavailable', notice: 'Browser storage is unavailable. Preferences will last for this visit.' }); return; }
        try {
          const legacy = storage().getItem('ThemeStore');
          if (legacy !== null) {
            try { set({ legacyTheme: parseLegacyTheme(legacy), legacyNotice: null }); }
            catch { set({ legacyTheme: null, legacyNotice: 'The original saved theme could not be read. Its data has been preserved.' }); }
          } else set({ legacyTheme: null, legacyNotice: null });
        } catch { set({ legacyTheme: null, legacyNotice: 'The original saved theme is unavailable. Retry when browser storage is available.' }); }
        if (raw === null) { set({ preferences: defaultPreferences(), status: 'ready', raw, notice: null }); return; }
        try { set({ preferences: parsePreferences(raw), status: 'ready', raw, notice: null }); }
        catch { set({ status: 'invalid', raw, notice: 'Saved preferences could not be read. Your saved data is preserved; changes will last for this visit until you recover or reset it.' }); }
      },
      setMode: mode => {
        const current = get().preferences;
        if (mode === 'custom' && current.customTheme === null) return;
        save({ ...current, themeMode: mode });
      },
      setMotion: motion => save({ ...get().preferences, motion }),
      saveCustomTheme: colors => {
        const result = themeColorsSchema.safeParse(colors);
        if (result.success) save({ ...get().preferences, themeMode: 'custom', customTheme: result.data });
      },
      importLegacyTheme: () => {
        const { preferences, legacyTheme, status } = get();
        if (status === 'ready' && legacyTheme && preferences.customTheme === null && preferences.legacyImport.theme === 'pending') {
          if (!save({ ...preferences, themeMode: 'custom', customTheme: structuredClone(legacyTheme), legacyImport: { ...preferences.legacyImport, theme: 'imported' } })) set({ preferences });
        }
      },
      declineLegacyTheme: () => {
        const preferences = get().preferences;
        save({ ...preferences, legacyImport: { ...preferences.legacyImport, theme: 'declined' } });
      },
      reset: () => save(defaultPreferences(), true)
    };
  });
}
