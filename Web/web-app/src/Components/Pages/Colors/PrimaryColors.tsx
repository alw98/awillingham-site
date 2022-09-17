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

export const PrimaryColors: React.FC<PrimaryColorsProps> = observer(({themeStore}) => {
	const styles = useStyles();
	
	return (
		<ColorSection title='Primary Colors'>
			<div className={styles.display}>Lorem Ipsum</div>
			<ColorDisplaysContainer>
				<ColorDisplay displayText='Background' onSelect={(color) => themeStore.theme.backgroundColor.primary = color} />
				<ColorDisplay displayText='Text' onSelect={(color) => themeStore.theme.textColor.primary = color} />
				<ColorDisplay displayText='Accent' onSelect={(color) => themeStore.theme.accentColor.primary = color} />
			</ColorDisplaysContainer>
		</ColorSection>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	display: {
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
		backgroundColor: theme.backgroundColor.primary,
		border: `2px solid ${theme.accentColor.primary}`,
		color: theme.textColor.primary,
		padding: '.5rem',
		WebkitTextStroke: '0px'
	},
}));