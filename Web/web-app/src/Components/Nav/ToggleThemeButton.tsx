import { hexToCSSFilter } from 'hex-to-css-filter';
import { observer } from 'mobx-react';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { PropsWithThemeStore } from 'Stores/ThemeStore';
import ToggleThemeIcon from 'wwwroot/images/ToggleThemeIcon.svg';

import { UnstyledButton } from '../Buttons/UnstyledButton';

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

const useStyles = createUseStyles((theme: Theme) => ({
	toggleThemeButton: {
		padding: '.5rem',
		marginLeft: 'auto',
		zIndex: 100
	},
	toggleThemeIcon: {
		width: '2rem',
		filter: hexToCSSFilter(theme.accentColor.primary).filter
	}
}));