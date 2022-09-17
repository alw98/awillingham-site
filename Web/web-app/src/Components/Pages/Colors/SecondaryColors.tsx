import { observer } from 'mobx-react';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { ThemeStore } from 'Stores/ThemeStore';

import { ColorDisplay } from './ColorDisplay';
import { ColorDisplaysContainer } from './ColorDisplaysContainer';
import { ColorSection } from './ColorSection';

interface PrimaryColorsProps {
	themeStore: Pick<ThemeStore, 'theme'>;
	renders: number;
}

export const SecondaryColors: React.FC<PrimaryColorsProps> = observer(({themeStore}) => {
	const styles = useStyles();
	
	return (
		<ColorSection title='Secondary Colors'>
			<div className={styles.display}>Lorem Ipsum</div>
			<ColorDisplaysContainer>
				<ColorDisplay displayText='Secondary Background Color' onSelect={(color) => themeStore.theme.backgroundColor.secondary = color} />
				<ColorDisplay displayText='Secondary Text Color' onSelect={(color) => themeStore.theme.textColor.secondary = color} />
				<ColorDisplay displayText='Secondary Accent Color' onSelect={(color) => themeStore.theme.accentColor.secondary = color} />
			</ColorDisplaysContainer>
		</ColorSection>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	display: {
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
		backgroundColor: theme.backgroundColor.secondary,
		border: `2px solid ${theme.accentColor.secondary}`,
		color: theme.textColor.secondary,
		padding: '.5rem',
		WebkitTextStroke: '0px'
	},
}));