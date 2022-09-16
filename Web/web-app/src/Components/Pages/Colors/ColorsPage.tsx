import { ColorsPageSketch } from 'Components/Sketches/ColorsPage/ColorsPageSketch';
import { toJS } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { createUseStyles, ThemeProvider } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';

import { ContentPageContainer } from '../ContentPageContainer';
import { PrimaryColors } from './PrimaryColors';


export const ColorsPage: React.FC<PropsWithThemeStore> = observer(({themeStore}) => {
	const styles = useStyles();
	const [renders, setRenders] = useState(0);
	const localTheme = useLocalStore(() => toJS(themeStore.theme));
	
	useEffect(() => {
		localTheme.backgroundColor.primary = themeStore.theme.backgroundColor.primary;
	}, [themeStore]);

	const forceUpdate = () => {
		// setRenders(renders + 1);
	};
	
	return (
		<ContentPageContainer>
			<ThemeProvider theme={{...toJS(localTheme)}}>
				<div className={styles.content} onClick={forceUpdate}>
					<PrimaryColors theme={localTheme} />
					<button onClick={() => themeStore.theme = localTheme}>Save</button>
				</div>
				<ColorsPageSketch themeStore={themeStore}/>
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
