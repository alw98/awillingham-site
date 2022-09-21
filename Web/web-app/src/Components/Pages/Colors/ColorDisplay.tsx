import React, { useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';

import { ColorPicker } from './ColorPicker';

interface ColorDisplayProps {
	displayText: string;
	onSelect: (color: string) => void;
}

export const ColorDisplay: React.FC<ColorDisplayProps> = (props) => {
	const styles = useStyles();
	const [display, setDisplay] = useState(false);
	const nodeRef = useRef(null);

	const onSelect = (color: string) => {
		setDisplay(false);
		props.onSelect(color);
	};
	
	return (
		<div className={styles.container} >
			<span onClick={() => setDisplay(!display)}>{props.displayText}</span>	
			<CSSTransition unmountOnExit nodeRef={nodeRef} in={display} timeout={200} classNames={{
				enter: styles.colorPickerEnter,
				enterActive: styles.colorPickerEnterActive,
				exit: styles.colorPickerExit,
				exitActive: styles.colorPickerExitActive
			}} >
				<div ref={nodeRef} className={styles.animationContainer}>
					<ColorPicker onSelect={onSelect} />
				</div>
			</CSSTransition>
		</div>
	);
};

const useStyles = createUseStyles({
	container: {
		fontSize: '1.5rem',
		padding: '.5rem'
	},
	colorPickerEnter: {
		maxHeight: 0,
		transformOrigin: 'top'
	},
	colorPickerEnterActive: {
		maxHeight: 100,
		transition: 'all 200ms'
	},
	colorPickerExit: {
		maxHeight: 100,
		transformOrigin: 'top'
	},
	colorPickerExitActive: {
		maxHeight: 0,
		transition: 'all 200ms'
	},
	animationContainer: {
		overflow: 'hidden'
	}
});