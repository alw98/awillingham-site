import { PrimaryButton } from 'Components/Buttons/PrimaryButton';
import React from 'react';
import { ButtonHTMLAttributes } from 'react';
import { createUseStyles } from 'react-jss';

export interface AddItemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export const AddItemButton: React.FC<AddItemButtonProps> = (props) => {
	const styles = useStyles();
	
	return <PrimaryButton {...props} className={styles.button}>&#xFF0B;</PrimaryButton>;
};

const useStyles = createUseStyles({
	button: {
		width: '4rem',
		height: '4rem',
		textAlign: 'center',
		fontSize: '2rem',
		position: 'absolute',
		right: '.5rem',
		top: '.5rem',
		lineHeight: '0'
	},
});