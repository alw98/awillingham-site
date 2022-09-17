import { Theme } from 'Models/Theme';

import { ColorPalletes } from './ColorPalletes';

export class LightTheme implements Theme {
	backgroundColor = { 
		primary: ColorPalletes.tan[9],
		secondary: ColorPalletes.gray[4],
		tertiary: ColorPalletes.gray[1],
		quaternary: ColorPalletes.gray[1]
	};
	// "primary": "#faefdf",
	// "secondary": "#6a6a6a",

	textColor = { 
		primary: ColorPalletes.prettyBlue[0],
		secondary: ColorPalletes.trueBlue[8]
	};
	// "primary": "#001416",
	// "secondary": "#d0d1fd"

	accentColor = { 
		primary: ColorPalletes.trueBlue[7],
		secondary: ColorPalletes.trueBlue[7],
	};
	// "primary": "#b0b2fc",
	// "secondary": "#b0b2fc"

	button = {
		backgroundColor: {
			primary: ColorPalletes.tan[9],
			secondary: ColorPalletes.trueBlue[2]
		},
		// "primary": "#faefdf",
		// "secondary": "#0e1fb5"
		textColor: {
			primary: ColorPalletes.tan[6],
			secondary: ColorPalletes.paleBlue[2],
		},
		// "primary": "#b69a5f",
		// "secondary": "#1f3f51"
		outlineColor: {
			primary: ColorPalletes.trueBlue[7],
			secondary: ColorPalletes.paleBlue[2],
		},
		// "primary": "#b0b2fc",
		// "secondary": "#1f3f51"
		hoverBackgroundColor: {
			primary: ColorPalletes.tan[9],
			secondary: ColorPalletes.gray[1]
		},
		// "primary": "#faefdf",
		// "secondary": "#262626"
		hoverTextColor: {
			primary: ColorPalletes.tan[8],
			secondary: ColorPalletes.gray[9]
		},
		// "primary": "#f1d08e",
		// "secondary": "#f1f1f1"
		hoverOutlineColor: {
			primary: ColorPalletes.trueBlue[6],
			secondary: ColorPalletes.gray[9]
		},
		// "primary": "#9194fb",
		// "secondary": "#f1f1f1"
		pressBackgroundColor: {
			primary: ColorPalletes.tan[9],
			secondary: ColorPalletes.gray[1]
		},
		// "primary": "#faefdf",
		// "secondary": "#262626"
		pressTextColor: {
			primary: ColorPalletes.tan[5],
			secondary: ColorPalletes.gray[9]
		},
		// "primary": "#98814f",
		// "secondary": "#f1f1f1"
		pressOutlineColor: {
			primary: ColorPalletes.trueBlue[5],
			secondary: ColorPalletes.gray[9]
		},
		// "primary": "#7075fa",
		// "secondary": "#f1f1f1"
	};
}
