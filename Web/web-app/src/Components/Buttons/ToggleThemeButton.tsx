import { observer } from 'mobx-react';
import React from 'react';
import { PropsWithThemeStore } from 'Stores/ThemeStore';

export const ToggleThemeButton: React.FC<PropsWithThemeStore> = observer(({themeStore})=> {
	const onClick = () => {
		themeStore.switchDefaultTheme();
	};

	return (<button onClick={onClick}>Toggle Theme</button>);
});