import { PrimaryButton } from 'Components/Buttons/PrimaryButton';
import { observer } from 'mobx-react';
import { TimesTablesPropsStore } from 'Models/Sketches/TimesTables/TimesTablesPropsStore';
import React from 'react';
import { createUseStyles } from 'react-jss';

interface TimesTablesOptionsProps {
	propsStore: TimesTablesPropsStore;
	onClose: () => void;
}
export const TimesTablesOptions: React.FC<TimesTablesOptionsProps> = observer(({propsStore, onClose}) => {
	const styles = useStyles();
	
	return <div className={styles.container}>
		<input 
			type='number' 
			placeholder={`Multiplier: ${Math.round(propsStore.tables[0].multiplier * 100) / 100}`} 
			onChange={(evt) => propsStore.tables[0].multiplier = Number.parseInt(evt.target.value)} />

		
		<input 
			type='number' 
			placeholder={`Multiplier Change Rate: ${Math.round(propsStore.tables[0].multiplierChangeRate * 100) / 100}`} 
			onChange={(evt) => propsStore.tables[0].multiplierChangeRate = Number.parseInt(evt.target.value)} />
		<PrimaryButton onClick={onClose} className={styles.closeButton}>Close</PrimaryButton>
	</div>;
});

const useStyles = createUseStyles({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		padding: '1rem',
	},
	closeButton: {
		marginLeft: 'auto',
	}
});