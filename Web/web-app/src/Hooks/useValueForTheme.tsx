import { hexToHsluv } from 'hsluv';
import { Theme } from 'Models/Theme';

export const useValueForTheme = <T,>(lightValue: T, darkValue: T, theme: Theme): T => {
 	return hexToHsluv(theme.backgroundColor.primary)[2] > 50 ? lightValue : darkValue;
};