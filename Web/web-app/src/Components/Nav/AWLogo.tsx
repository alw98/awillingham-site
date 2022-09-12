import React from 'react';
import { createUseStyles } from 'react-jss';
import AWLogoDark from 'wwwroot/images/AWLogoDark.svg';

export const AWLogo: React.FC = () => {
	const styles = useStyles();
	return (
		<img src={AWLogoDark} className={styles.logo} alt='AW Logo'/>
	);
};

const useStyles = createUseStyles({
	logo: {
		height: '100%',
		paddingRight: '1rem',
	}
});