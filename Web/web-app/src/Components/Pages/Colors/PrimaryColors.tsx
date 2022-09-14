import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { ColorDisplay } from './ColorDisplay';
import { ColorDisplaysContainer } from './ColorDisplaysContainer';
import { ColorSection } from './ColorSection';

interface PrimaryColorsProps {
	theme: Theme;
}

export const PrimaryColors: React.FC<PrimaryColorsProps> = ({theme}) => {
	const styles = useStyles();

	return (
		<ColorSection title='Primary Colors'>
			<div className={styles.display}>Lorem Ipsum</div>
			<ColorDisplaysContainer>
				<ColorDisplay displayText='Primary Background Color' onSelect={(color) => theme.backgroundColor.primary = color} />
				<ColorDisplay displayText='Primary Text Color' onSelect={(color) => theme.textColor.primary = color} />
			</ColorDisplaysContainer>
		</ColorSection>
	);
};

const useStyles = createUseStyles((theme: Theme) => ({
	display: {
		backgroundColor: theme.backgroundColor.primary,
		color: theme.textColor.primary,
		padding: '.5rem 2rem'
	},
}));