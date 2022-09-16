import { ToggleThemeButton } from 'Components/Buttons/ToggleThemeButton';
import { useInject } from 'inversify-hooks';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Link } from 'react-router-dom';
import { Stores } from 'Stores/Stores';
import { ThemeStore } from 'Stores/ThemeStore';

import { AWLogo } from './AWLogo';

export const Header: React.FC = () => {
	const styles = useStyles();
	const [themeStore] = useInject<ThemeStore>(Stores.ThemeStore);

	return (
		<nav className={styles.header} >
			<Link className={styles.navLink} to={'/'} >
				<AWLogo />
				Home
			</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
			<ToggleThemeButton themeStore={themeStore} />
		</nav>
	);
};

const useStyles = createUseStyles((theme: Theme) => ({
	header: {
		zIndex: '100',
		position: 'relative',
		width: '100%',
		height: '3rem',
		display: 'flex',
		backgroundColor: theme.backgroundColor.secondary
	},
	navLink: {
		display: 'flex',
		alignItems: 'center',
		color: theme.accentColor.primary,
		backgroundColor: theme.backgroundColor.secondary,
		padding: '.5rem',
		fontSize: '1rem',
		textDecoration: 'none',
		'&:visited': {
			color: theme.accentColor.primary,
		}
	}
}));