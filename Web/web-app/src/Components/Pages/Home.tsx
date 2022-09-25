import { useValueForTheme } from 'Hooks/useValueForTheme';
import { observer } from 'mobx-react';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';

import { ContentPageContainer } from './ContentPageContainer';

export const HomePage: React.FC<PropsWithThemeStore> = observer(({themeStore}) => {
	const styles = useStyles();
	const gearbox = useValueForTheme(GearboxDark, GearboxLight, themeStore.theme);

	return (
		<ContentPageContainer>
			<div className={styles.body}>
				This is an interactive gallery made by Armond Willingham, with love and care. It's still a work in progress.
				<a href='https://github.com/alw98/awillingham-site'>Source</a>
			</div>
			<img src={gearbox} className={styles.gearboxImage} alt={'WIP'}/>
		</ContentPageContainer>
	);
});

const useStyles = createUseStyles({
	body: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: '1rem 2rem 2rem 2rem',
	},
	gearboxImage: {
		maxWidth: 'min(100%, 40rem)',
		maxHeight: '100%',
	}
});