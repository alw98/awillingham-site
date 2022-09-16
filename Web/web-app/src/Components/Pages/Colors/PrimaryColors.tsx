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
}

export const PrimaryColors: React.FC<PrimaryColorsProps> = observer(({themeStore}) => {
	const styles = useStyles();

	return (
		<ColorSection title='Primary Colors'>
			<div className={styles.display}>Lorem Ipsum</div>
			<ColorDisplaysContainer>
				<ColorDisplay displayText='Primary Background Color' onSelect={(color) => themeStore.theme.backgroundColor.primary = color} />
				<ColorDisplay displayText='Primary Text Color' onSelect={(color) => themeStore.theme.textColor.primary = color} />
			</ColorDisplaysContainer>
		</ColorSection>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	display: {
		backgroundColor: theme.backgroundColor.primary,
		border: `1px solid ${theme.accentColor.primary}`,
		color: theme.textColor.primary,
		padding: '.5rem'
	},
}));