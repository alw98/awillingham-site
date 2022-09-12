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
		width: '100%',
		height: '3rem',
		display: 'flex',
		backgroundColor: theme.backgroundColor.primary
	},
	navLink: {
		display: 'flex',
		alignItems: 'center',
		color: theme.button.textColor.primary,
		backgroundColor: theme.button.backgroundColor.primary,
		padding: theme.buttonPadding.two,
		fontSize: theme.font.size.four,
		textDecoration: 'none',
		'&:visited': {
			color: `${theme.button.textColor.primary}`
		}
	}
}));