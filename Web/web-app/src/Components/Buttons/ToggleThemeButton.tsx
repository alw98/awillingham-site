import { observer } from 'mobx-react';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';
import ToggleThemeIcon from 'wwwroot/images/ToggleThemeIcon.svg';

import { UnstyledButton } from './UnstyledButton';

export const ToggleThemeButton: React.FC<PropsWithThemeStore> = observer(({themeStore})=> {
	const styles = useStyles();

	const onClick = () => {
		themeStore.switchDefaultTheme();
	};

	return (
		<UnstyledButton className={styles.toggleThemeButton} onClick={onClick} type='button' title='Toggle Theme'>
			<img className={styles.toggleThemeIcon} src={ToggleThemeIcon} alt='Toggle Theme' />
		</UnstyledButton>
	);
});

const useStyles = createUseStyles({
	toggleThemeButton: {
		marginLeft: 'auto',
		display: 'flex',
		flexDirection: 'row-reverse',
		padding: '.5rem',
		paddingRight: '1rem',
	},
	toggleThemeIcon: {
		width: 'auto',
		height: '100%'
	}
});