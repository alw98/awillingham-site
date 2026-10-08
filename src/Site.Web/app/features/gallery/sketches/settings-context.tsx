import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Settings } from './types';

const Context = createContext<Map<string, Settings> | null>(null);
export function SketchSettingsProvider({ children }: { children: ReactNode }) {
  const [settings] = useState(() => new Map<string, Settings>());
  return <Context.Provider value={settings}>{children}</Context.Provider>;
}
export function useSketchSettings() {
  const settings = useContext(Context);
  if (!settings) throw new Error('Sketch settings require a provider.');
  return settings;
}
