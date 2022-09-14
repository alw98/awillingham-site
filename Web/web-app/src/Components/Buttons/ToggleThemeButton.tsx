import { AWLogo } from 'Components/Nav/AWLogo';
import { observer } from 'mobx-react';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';

import { UnstyledButton } from './UnstyledButton';

export const ToggleThemeButton: React.FC<PropsWithThemeStore> = observer(({themeStore})=> {
	const styles = useStyles();

	const onClick = () => {
		themeStore.switchDefaultTheme();
	};

	return (
		<UnstyledButton className={styles.toggleThemeButton} onClick={onClick} type='button' title='Toggle Theme'>
			<AWLogo />
		</UnstyledButton>
	);
});

const useStyles = createUseStyles({
	toggleThemeButton: {
		display: 'flex',
		padding: '.5rem',
		marginLeft: 'auto'
	},
	toggleThemeIcon: {
		width: '100%',
	}
});