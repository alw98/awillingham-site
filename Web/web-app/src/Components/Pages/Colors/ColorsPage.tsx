import React from 'react';
import { createUseStyles } from 'react-jss';

import { ColorPalleteElement } from './ColorPallete';

export const ColorsPage: React.FC = () => {
	const styles = useStyles();
	return (
		<div className={styles.pageContainer}>
			<ColorPalleteElement />
		</div>
	);
};

const useStyles = createUseStyles({
	pageContainer: {
		display: 'flex'
	}
});