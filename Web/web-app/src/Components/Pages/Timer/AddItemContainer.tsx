import { observer } from 'mobx-react';
import { Theme } from 'Models/Theme';
import React, { useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { PropsWithTimerStore } from 'Stores/TimerStore';

import { AddItemButton } from './AddItemButton';

export const AddItemContainer: React.FC<PropsWithTimerStore> = observer(({timerStore}) => {
	const styles = useStyles();
	const [addItemOpen, setAddItemOpen] = useState(false);
	const addItemModalRef = useRef(null);

	const onAddItemClick = () => {
		setAddItemOpen(true);
	};

	return (
		<>
			<AddItemButton onClick={onAddItemClick} />
			<CSSTransition unmountOnExit nodeRef={addItemModalRef} in={addItemOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={addItemModalRef} className={styles.animationContainer}>
					Add Item
				</div>
			</CSSTransition>
		</>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	optionsEnter: {
		marginTop: '-100%',
	},
	optionsEnterActive: {
		marginTop: 0,
		transition: 'all 500ms'
	},
	optionsExit: {
		marginTop: 0,
		transformOrigin: 'top'
	},
	optionsExitActive: {
		marginTop: '-100%',
		transition: 'all 500ms'
	},
	animationContainer: {
		position: 'absolute',
		top: 0,
		width: '100%',
		overflow: 'hidden',
		backgroundColor: theme.backgroundColor.secondary
	}
}));