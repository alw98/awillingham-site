import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
	const styles = useStyles();

	return (
		<nav className={styles.header} >
			<Link className={styles.navLink} to={'/'} >Home</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
			<Link className={styles.navLink} to={'/colors'} >Colors</Link>
		</nav>
	);
};

const useStyles = createUseStyles((theme: Theme) => ({
	header: {
		width: '100%',
		display: 'flex',
		backgroundColor: theme.backgroundColor.primary
	},
	navLink: {
		color: theme.button.textColor.primary,
		backgroundColor: theme.button.backgroundColor.primary,
		padding: theme.buttonPadding.two,
		fontSize: theme.font.size.four,
		textDecoration: 'none',
		'&:visited': {
			color: `${theme.button.textColor.primary} !important`
		}
	}
}));