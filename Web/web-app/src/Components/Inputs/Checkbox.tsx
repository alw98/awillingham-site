import { Theme } from 'Models/Theme';
import React, { InputHTMLAttributes } from 'react';
import { createUseStyles } from 'react-jss';


export const Checkbox: React.FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
	const styles = useStyles();

	return <input {...props} className={styles.input} type='checkbox' />;
};

const useStyles = createUseStyles((theme: Theme) => ({
	input: {
		backgroundColor: theme.accentColor.primary
	}
}));