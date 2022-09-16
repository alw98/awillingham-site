import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { PropsWithChildren } from 'react';
import { ThemeProvider } from 'react-jss';
import { ThemeStore } from 'Stores/ThemeStore';

interface ObserverThemeProviderProps extends PropsWithChildren {
	themeStore: Pick<ThemeStore, 'theme'>
}

export const ObserverThemeProvider: React.FC<ObserverThemeProviderProps > = observer(({themeStore, children}) => {
	return (
		<ThemeProvider theme={toJS(themeStore.theme)}>
			{children}
		</ThemeProvider>
	);
});