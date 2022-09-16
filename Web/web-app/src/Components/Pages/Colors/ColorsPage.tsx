import { ColorsPageSketch } from 'Components/Sketches/ColorsPage/ColorsPageSketch';
import { toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import React, { useEffect } from 'react';
import { createUseStyles, ThemeProvider } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';
import { recursiveCopyStrings } from 'Utils/RecursiveCopyStrings';

import { ContentPageContainer } from '../ContentPageContainer';
import { PrimaryColors } from './PrimaryColors';


export const ColorsPage: React.FC<PropsWithThemeStore> = observer(({themeStore: globalThemeStore}) => {
	const styles = useStyles();
	const localThemeStore = useLocalObservable(() => ({theme: toJS(globalThemeStore.theme)}));
	const localThemeJS = toJS(localThemeStore.theme);

	useEffect(() => {
		recursiveCopyStrings(localThemeStore.theme, toJS(globalThemeStore.theme));
	}, [globalThemeStore.theme]);

	return (
		<ContentPageContainer>
			<ThemeProvider theme={localThemeJS}>
				<div className={styles.content}>
					<PrimaryColors themeStore={localThemeStore} />
					<button onClick={() => globalThemeStore.theme = localThemeStore.theme}>Save</button>
				</div>
				<ColorsPageSketch theme={localThemeJS} />
			</ThemeProvider>
		</ContentPageContainer>
	);
});

const useStyles = createUseStyles({
	content: {
		position: 'relative',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		zIndex: 1
	}
});
