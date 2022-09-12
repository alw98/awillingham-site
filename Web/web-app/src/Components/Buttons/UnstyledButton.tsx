import React from 'react';
import { createUseStyles } from 'react-jss';


export const UnstyledButton: React.FC<React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>> = (props) => {
	const styles = useStyles();

	return <button {...props} className={styles.unstyledButton + ' ' + props.className} />;
};

const useStyles = createUseStyles({
	unstyledButton: {
		all: 'unset',
		cursor: 'pointer'
	}
});