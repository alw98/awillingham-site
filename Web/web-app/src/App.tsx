import { Header } from 'Components/Header';
import React from 'react';
import { createUseStyles, ThemeProvider } from 'react-jss';
import { Outlet } from 'react-router-dom';
import { LightTheme } from 'Themes/LightTheme';

export const App: React.FC = () => {
	const styles = useStyles();

	return (
		<ThemeProvider theme={new LightTheme()}>
			<Header />
			<Outlet />
		</ThemeProvider>
	);
};

const useStyles = createUseStyles({
	gearboxImage: {
		maxWidth: '100%',
		maxHeight: '100%',
	}
});