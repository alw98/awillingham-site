export interface Theme {
	backgroundColor: {
		primary: string;
		secondary: string;
		tertiary: string;
		quaternary: string;
	},
	
    textColor: {
        primary: string;
        secondary: string;
    };

    accentColor: {
        primary: string;
        secondary: string;
    };
	
	button: {
		backgroundColor: {
			primary: string;
			secondary: string;
		};
		textColor: {
			primary: string;
			secondary: string;
		};
		outlineColor: {
			primary: string;
			secondary: string;
		};
		hoverBackgroundColor: {
			primary: string;
			secondary: string;
		};
		hoverTextColor: {
			primary: string;
			secondary: string;
		};
		hoverOutlineColor: {
			primary: string;
			secondary: string;
		};
		pressBackgroundColor: {
			primary: string;
			secondary: string;
		};
		pressTextColor: {
			primary: string;
			secondary: string;
		};
		pressOutlineColor: {
			primary: string;
			secondary: string;
		};
	};
}