import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';

interface ColorDisplayProps {
	displayText: string;
	onSelect: (color: string) => void;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = (props) => {
	const styles = useStyles();
	
	return (
		<div className={styles.container} onClick={() => props.onSelect('#fe0000')}>
			{props.displayText}
		</div>
	);
};

const useStyles = createUseStyles((theme: Theme) => ({
	container: {
		WebkitTextStroke: `.5px ${theme.accentColor.primary}`
	}
}));