import React, { useState } from 'react';
import { createUseStyles } from 'react-jss';

import { ColorPicker } from './ColorPicker';

interface ColorDisplayProps {
	displayText: string;
	onSelect: (color: string) => void;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = (props) => {
	const styles = useStyles();
	const [display, setDisplay] = useState(false);

	const onSelect = (color: string) => {
		setDisplay(false);
		props.onSelect(color);
	};
	
	return (
		<div className={styles.container} >
			<span onClick={() => setDisplay(!display)}>{props.displayText}</span>		
			{display && <ColorPicker onSelect={onSelect} />}
		</div>
	);
};

const useStyles = createUseStyles({
	container: {
		fontSize: '1.5rem',
		padding: '.5rem'
	}
});