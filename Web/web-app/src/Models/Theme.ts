export interface Theme {
	backgroundColor: {
		primary: string;
		secondary: string;
	},
	
    textColor: {
        primary: string;
        secondary: string;
    };

    borderColor: {
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
		pressBackgroundColor: {
			primary: string;
			secondary: string;
		};
		pressTextColor: {
			primary: string;
			secondary: string;
		};
	};

	buttonPadding: {
		one: string;
		two: string;
		three: string;
		four: string;
		five: string;
	};

	font: {
		size: {
			one: string;
			two: string;
			three: string;
			four: string;
			five: string;
			six: string;
			seven: string;
			eight: string;
		};
		family: {
			rubik: string;
		}
	}
}