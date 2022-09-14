import { Theme } from 'Models/Theme';

import { ColorPalletes } from './ColorPalletes';

export class LightTheme implements Theme {
	backgroundColor = { 
		primary: ColorPalletes.gray[9],
		secondary: ColorPalletes.gray[8],
		tertiary: ColorPalletes.gray[1],
		quaternary: ColorPalletes.gray[1]
	};

	textColor = { 
		primary: ColorPalletes.gray[1],
		secondary: ColorPalletes.gray[9]
	};

	accentColor = { 
		primary: ColorPalletes.paleBlue[4],
		secondary: ColorPalletes.paleBlue[2],
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