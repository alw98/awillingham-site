import { Theme } from 'Models/Theme';

import { ColorPalletes } from './ColorPalletes';

export class DarkTheme implements Theme {
	backgroundColor = { 
		primary: ColorPalletes.paleBlue[0],
		secondary: ColorPalletes.paleBlue[1],
		tertiary: ColorPalletes.gray[0],
		quaternary: ColorPalletes.gray[0]
	};

	textColor = { 
		primary: ColorPalletes.trueBlue[9],
		secondary: ColorPalletes.trueBlue[8]
	};

	accentColor = { 
		primary: ColorPalletes.prettyBlue[7],
		secondary: ColorPalletes.trueBlue[8]
	};

	button = {
		backgroundColor: {
			primary: ColorPalletes.paleBlue[2],
			secondary: ColorPalletes.gray[1]
		},
		textColor: {
			primary: ColorPalletes.prettyBlue[9],
			secondary: ColorPalletes.gray[9]
		},
		outlineColor: {
			primary: ColorPalletes.paleBlue[7],
			secondary: 'none'
		},
		hoverBackgroundColor: {
			primary: ColorPalletes.prettyBlue[3],
			secondary: ColorPalletes.gray[1]
		},
		hoverTextColor: {
			primary: ColorPalletes.gray[2],
			secondary: ColorPalletes.gray[9]
		},
		hoverOutlineColor: {
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
		pressOutlineColor: {
			primary: ColorPalletes.gray[1],
			secondary: ColorPalletes.gray[9]
		},
	};
}

