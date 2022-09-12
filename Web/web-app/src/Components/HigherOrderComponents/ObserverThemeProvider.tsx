import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';
import { ThemeProvider } from 'react-jss';
import { ThemeStore } from 'Stores/ThemeStore';

interface ObserverThemeProviderProps extends PropsWithChildren {
	themeStore: ThemeStore
}

export const ObserverThemeProvider: React.FC<ObserverThemeProviderProps > = observer(({themeStore, children}) => {
	return (
		<ThemeProvider theme={themeStore.theme}>
			{children}
		</ThemeProvider>
	);
});