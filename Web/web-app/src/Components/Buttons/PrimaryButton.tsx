import { Theme } from 'Models/Theme';
import React, { ButtonHTMLAttributes } from 'react';
import { createUseStyles } from 'react-jss';

import { UnstyledButton } from './UnstyledButton';


export const PrimaryButton: React.FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
	const styles = useStyles();

	const className = styles.primaryButton + ' ' + props.className;
	return <UnstyledButton {...props} className={className} type={props.type ?? 'button'} />;
};

const useStyles = createUseStyles((theme: Theme) => ({
	primaryButton: {
		backgroundColor: theme.button.backgroundColor.primary,
		border: `1px solid ${theme.button.outlineColor.primary}`,
		color: theme.button.textColor.primary,
		padding: '.5rem',
		borderRadius: '10rem',
		'&:hover': {
			backgroundColor: theme.button.hoverBackgroundColor.primary,
			border: `1px solid ${theme.button.hoverOutlineColor.primary}`,
			color: theme.button.hoverTextColor.primary,
		},
		'&:active': {
			backgroundColor: theme.button.pressBackgroundColor.primary,
			border: `1px solid ${theme.button.pressOutlineColor.primary}`,
			color: theme.button.pressTextColor.primary,
		}
	}
}));