import React from 'react';
import { createUseStyles } from 'react-jss';

export const HomePage: React.FC = () => {
	const styles = useStyles();

	return (
		<div></div>
	);
};

const useStyles = createUseStyles({
	gearboxImage: {
		maxWidth: '100%',
		maxHeight: '100%',
	}
});