import React from 'react';
import { createUseStyles } from 'react-jss';
import Gearbox from 'wwwroot/images/gearbox.gif';

export const HomePage: React.FC = () => {
	const styles = useStyles();

	return (
		<img src={Gearbox} className={styles.gearboxImage} alt={'WIP'}/>
	);
};

const useStyles = createUseStyles({
	gearboxImage: {
		maxWidth: '100%',
		maxHeight: '100%',
	}
});