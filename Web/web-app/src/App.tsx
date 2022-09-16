import { ObserverThemeProvider } from 'Components/HigherOrderComponents/ObserverThemeProvider';
import { Header } from 'Components/Nav/Header';
import { PageContainer } from 'Components/Pages/PageContainer';
import { useInject } from 'inversify-hooks';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Stores } from 'Stores/Stores';
import { ThemeStore } from 'Stores/ThemeStore';

export const App: React.FC = () => {
	const [themeStore] = useInject<ThemeStore>(Stores.ThemeStore);
	
	return (
		<ObserverThemeProvider themeStore={themeStore}>
			<Header />
			<PageContainer>
				<Outlet />
			</PageContainer>
		</ObserverThemeProvider>
	);
};