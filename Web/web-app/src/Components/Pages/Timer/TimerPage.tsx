import { observer } from 'mobx-react-lite';
import React from 'react';
import { createUseStyles } from 'react-jss';
import { PropsWithTimerStore } from 'Stores/TimerStore';

import { ContentPageContainer } from '../ContentPageContainer';
import { AddItemContainer } from './AddItemContainer';


export const TimerPage: React.FC<PropsWithTimerStore> = observer(({timerStore}) => {
	const styles = useStyles();

	return (
		<ContentPageContainer>
			<div className={styles.body}>
				Timer
				<AddItemContainer timerStore={timerStore} />
			</div>
		</ContentPageContainer>
	);
});

const useStyles = createUseStyles({
	body: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		position: 'relative',
		width: '100%'
	}
});