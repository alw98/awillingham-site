import { ObserverThemeProvider } from 'Components/HigherOrderComponents/ObserverThemeProvider';
import { Header } from 'Components/Nav/Header';
import { cid, useInject } from 'inversify-hooks';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeStore } from 'Stores/ThemeStore';

export const App: React.FC = () => {
	const [themeStore] = useInject<ThemeStore>(cid.ThemeStore);

	return (
		<ObserverThemeProvider themeStore={themeStore}>
			<Header />
			<Outlet />
		</ObserverThemeProvider>
	);
};