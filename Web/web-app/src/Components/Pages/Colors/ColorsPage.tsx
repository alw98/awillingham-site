import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import React, { useMemo, useState } from 'react';
import { createUseStyles, ThemeProvider } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';

import { ContentPageContainer } from '../ContentPageContainer';
import { PrimaryColors } from './PrimaryColors';


export const ColorsPage: React.FC<PropsWithThemeStore> = observer(({themeStore}) => {
	const styles = useStyles();
	const [renders, setRenders] = useState(0);

	const localTheme = useMemo(() => (observable(toJS(themeStore.theme))), [themeStore.theme]);
	
	const forceUpdate = () => {
		setRenders(renders + 1);
	};

	return (
		<ContentPageContainer>
			<ThemeProvider theme={{...toJS(localTheme)}}>
				<div className={styles.content} onClick={forceUpdate}>
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
