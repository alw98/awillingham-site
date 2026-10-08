import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { createPreferenceStore } from './preferences';
import { dark, light, themeVariables } from './palettes';

const Context = createContext<ReturnType<typeof createPreferenceStore> | null>(null);
const subscribe = (callback: () => void) => {
  const query = window.matchMedia('(prefers-color-scheme: light)');
  query.addEventListener('change', callback);
  return () => query.removeEventListener('change', callback);
};
const snapshot = () => window.matchMedia('(prefers-color-scheme: light)').matches;
const serverSnapshot = () => false;

export function PreferenceProvider({ children }: { children: ReactNode }) {
  const [store] = useState(() => createPreferenceStore(() => window.localStorage));
  const { preferences } = useStore(store);
  const systemLight = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  useEffect(() => { store.getState().load(); }, [store]);
  useEffect(() => {
    const isLight = preferences.themeMode === 'light' || (preferences.themeMode === 'system' && systemLight);
    const palette = preferences.themeMode === 'custom' && preferences.customTheme ? preferences.customTheme : isLight ? light : dark;
    for (const [token, value] of Object.entries(themeVariables(palette))) document.documentElement.style.setProperty(token, value);
    document.documentElement.dataset.theme = isLight ? 'light' : 'dark';
    document.documentElement.dataset.motion = preferences.motion;
  }, [preferences, systemLight]);
  return <Context.Provider value={store}>{children}</Context.Provider>;
}

export function usePreferences() {
  const store = useContext(Context);
  if (!store) throw new Error('Preferences require a provider.');
  return useStore(store);
}

export function useThemeColors() {
  const { preferences } = usePreferences();
  const systemLight = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return preferences.themeMode === 'custom' && preferences.customTheme ? preferences.customTheme :
    preferences.themeMode === 'light' || (preferences.themeMode === 'system' && systemLight) ? light : dark;
}
