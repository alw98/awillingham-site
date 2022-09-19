import { hexToHsluv } from 'hsluv';
import { useObserver } from 'mobx-react';
import { ThemeStore } from 'Stores/ThemeStore';

export const useValueForTheme = <T,>(lightValue: T, darkValue: T, themeStore: ThemeStore): T => {
	return useObserver(() => {
		console.log(hexToHsluv(themeStore.theme.backgroundColor.primary)[2]);
		return hexToHsluv(themeStore.theme.backgroundColor.primary)[2] > 50 ? lightValue : darkValue;
	});
};