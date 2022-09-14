import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Theme } from 'Models/Theme';
import React, { useEffect } from 'react';
import { createUseStyles, ThemeProvider } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';

import { ContentPageContainer } from '../ContentPageContainer';
import { PrimaryColors } from './PrimaryColors';


export const ColorsPage: React.FC<PropsWithThemeStore> = observer(({themeStore: globalThemeStore}) => {
	const styles = useStyles();
	const localTheme = useLocalObservable(() => toJS(globalThemeStore.theme));

	useEffect(() => {
		const newTheme = toJS(globalThemeStore.theme);
		for (const key in newTheme) {
			type KeyOf = keyof Theme;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(localTheme as any)[key as KeyOf] = newTheme[key as KeyOf];
		}
	}, [globalThemeStore.theme]);

	return (
		<ContentPageContainer>
			<ThemeProvider theme={toJS(localTheme)}>
				<div className={styles.content}>
					<PrimaryColors theme={localTheme} />
				</div>
			</ThemeProvider>
		</ContentPageContainer>
	);
});

const useStyles = createUseStyles({
	content: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	colorSection: {
		display: 'flex',
	}
});
