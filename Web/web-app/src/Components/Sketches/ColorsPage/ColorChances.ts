import { Theme } from 'Models/Theme';

export type ColorChancesType<T> = {
	[P in keyof T]: T[P] extends Record<string, unknown> ? ColorChancesType<T[P]> : number;
} 



export const ColorChances: ColorChancesType<Theme> = {
	backgroundColor: {
		primary: 20,
		secondary: 5,
		tertiary: 2,
		quaternary: 2
	},
	accentColor: {
		primary: 15,
		secondary: 10
	},
	button: {
		backgroundColor: {
			primary: 10,
			secondary: 5
		},
		hoverBackgroundColor: {
			primary: 2,
			secondary: 2,
		},
		pressBackgroundColor: {
			primary: 2,
			secondary: 2
		},
		textColor: {
			primary: 10,
			secondary: 5
		},
		hoverTextColor: {
			primary: 2,
			secondary: 2
		},
		pressTextColor: {
			primary: 2,
			secondary: 2
		},
		outlineColor: {
			primary: 5,
			secondary: 5
		}
	},
	textColor: {
		primary: 20,
		secondary: 5
	}
};