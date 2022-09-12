import { BaseTheme } from './BaseTheme';
import { ColorPalletes } from './ColorPalletes';

export class DarkTheme extends BaseTheme {
	backgroundColor = { 
		primary: ColorPalletes.gray[1],
		secondary: ColorPalletes.gray[9],
		tertiary: ColorPalletes.gray[1],
		quaternary: ColorPalletes.gray[1]
	};

	textColor = { 
		primary: ColorPalletes.gray[9],
		secondary: ColorPalletes.gray[1]
	};

	accentColor = { 
		primary: ColorPalletes.gray[9],
		secondary: ColorPalletes.gray[1]
	};

	button = {
		backgroundColor: {
			primary: ColorPalletes.gray[9],
			secondary: ColorPalletes.gray[1]
		},
		textColor: {
			primary: ColorPalletes.gray[1],
			secondary: ColorPalletes.gray[9]
		},
		outlineColor: {
			primary: 'none',
			secondary: 'none'
		},
		hoverBackgroundColor: {
			primary: ColorPalletes.gray[9],
			secondary: ColorPalletes.gray[1]
		},
		hoverTextColor: {
			primary: ColorPalletes.gray[1],
			secondary: ColorPalletes.gray[9]
		},
		pressBackgroundColor: {
			primary: ColorPalletes.gray[9],
			secondary: ColorPalletes.gray[1]
		},
		pressTextColor: {
			primary: ColorPalletes.gray[1],
			secondary: ColorPalletes.gray[9]
		},
	};
	
}