import { Theme } from 'Models/Theme';
import React, { AnchorHTMLAttributes } from 'react';
import { createUseStyles } from 'react-jss';

export const StyledLink: React.FC<AnchorHTMLAttributes<HTMLAnchorElement>> = (props) => {
	const styles = useStyles();
	return <a {...props} className={styles.link} />;
};

const useStyles = createUseStyles((theme: Theme) => ({
	link: {
		color: theme.accentColor.primary,
		'&:visited': {
			color: theme.accentColor.secondary,
		}
	}
}));