import { hexToHsluv } from 'hsluv';
import { ThemeStore } from 'Stores/ThemeStore';

export const useValueForTheme = <T,>(lightValue: T, darkValue: T, themeStore: ThemeStore): T => {
	return hexToHsluv(themeStore.theme.backgroundColor.primary)[2] > 50 ? lightValue : darkValue;
};