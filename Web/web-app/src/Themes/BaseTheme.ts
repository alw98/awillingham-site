import { Theme } from 'Models/Theme';

export abstract class BaseTheme implements Theme {
	abstract backgroundColor: { primary: string; secondary: string; tertiary: string; quaternary: string; };
	abstract textColor: { primary: string; secondary: string; };
	abstract accentColor: { primary: string; secondary: string; };
	abstract button: { 
		backgroundColor: { primary: string; secondary: string; }; 
		textColor: { primary: string; secondary: string; }; 
		outlineColor: { primary: string; secondary: string; }; 
		hoverBackgroundColor: { primary: string; secondary: string; }; 
		hoverTextColor: { primary: string; secondary: string; }; 
		pressBackgroundColor: { primary: string; secondary: string; }; 
		pressTextColor: { primary: string; secondary: string; }; 
	}
	
	buttonPadding = {
		one: '.125rem',
		two: '.25rem',
		three: '.5rem',
		four: '1rem',
		five: '2rem',
	};

	font = {
		size: {
			one: '.5rem',
			two: '.75rem',
			three: '1rem',
			four: '1.25rem',
			five: '1.5rem',
			six: '2rem',
			seven: '4rem',
			eight: '5rem',
		},
		family: {
			rubik: '\'Rubik\', sans-serif;'
		}
	};
}