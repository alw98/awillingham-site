import { PrimaryButton } from 'Components/Buttons/PrimaryButton';
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

export const PrimaryButtonColors: React.FC<PrimaryColorsProps> = observer(({themeStore}) => {
	const styles = useStyles();
	
	return (
		<ColorSection title='Primary Button Colors'>
			<div className={styles.display}>
				<PrimaryButton>Lorem Ipsum</PrimaryButton>
			</div>
			<ColorDisplaysContainer>
				<ColorDisplay displayText='Background' onSelect={(color) => themeStore.theme.button.backgroundColor.primary = color} />
				<ColorDisplay displayText='Text' onSelect={(color) => themeStore.theme.button.textColor.primary = color} />
				<ColorDisplay displayText='Outline' onSelect={(color) => themeStore.theme.button.outlineColor.primary = color} />
				<ColorDisplay displayText='Hover Background' onSelect={(color) => themeStore.theme.button.hoverBackgroundColor.primary = color} />
				<ColorDisplay displayText='Hover Text' onSelect={(color) => themeStore.theme.button.hoverTextColor.primary = color} />
				<ColorDisplay displayText='Hover Outline' onSelect={(color) => themeStore.theme.button.hoverOutlineColor.primary = color} />
				<ColorDisplay displayText='Press Background' onSelect={(color) => themeStore.theme.button.pressBackgroundColor.primary = color} />
				<ColorDisplay displayText='Press Text' onSelect={(color) => themeStore.theme.button.pressTextColor.primary = color} />
				<ColorDisplay displayText='Press Outline' onSelect={(color) => themeStore.theme.button.pressOutlineColor.primary = color} />
			</ColorDisplaysContainer>
		</ColorSection>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	display: {
		display: 'flex',
		alignItems: 'center',
		textAlign: 'center',
		color: theme.textColor.secondary,
		padding: '.5rem',
		WebkitTextStroke: '0px'
	},
}));