import { RangeSlider } from 'Components/Inputs/RangeSlider';
import { ColorPicker } from 'Components/Pages/Colors/ColorPicker';
import { observer } from 'mobx-react';
import { TimesTablesPropsStore } from 'Models/Sketches/TimesTables/TimesTablesPropsStore';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { BaseOptions } from '../BaseOptions';

interface TimesTablesOptionsProps {
	propsStore: TimesTablesPropsStore;
	onClose: () => void;
}

export const TimesTablesOptions: React.FC<TimesTablesOptionsProps> = observer(({propsStore, onClose}) => {
	const styles = useStyles();
	
	return (
		<BaseOptions onClose={onClose}>
			<RangeSlider 
				title='Multiplier' 
				onChange={(val) => { propsStore.tables[0].curMultiplier = val; propsStore.tables[0].initialMultiplier = val; }}
				min={1}
				max={propsStore.tables[0].resolution}
				initialValue={propsStore.tables[0].initialMultiplier} />

			<RangeSlider 
				title='Multiplier Change Rate' 
				onChange={(val) => propsStore.tables[0].multiplierChangeRate = val}
				min={0}
				max={.1}
				step={.01}
				initialValue={propsStore.tables[0].multiplierChangeRate} />

			<RangeSlider 
				title='Resolution' 
				onChange={(val) => propsStore.tables[0].resolution = val}
				min={2}
				max={1000}
				step={1}
				initialValue={propsStore.tables[0].resolution} />
			
			<div className={styles.colorPicker}>
			Color
				<ColorPicker onSelect={(color) => propsStore.tables[0].color = color}/>
			</div>
		
			<RangeSlider 
				title='Size' 
				onChange={(val) => propsStore.tables[0].radius = val}
				min={50}
				max={1000}
				step={1}
				initialValue={propsStore.tables[0].radius} />
		</BaseOptions>
	);
});

const useStyles = createUseStyles({
	colorPicker: {
		padding: '.5rem',
		display: 'flex',
		flexDirection: 'column',
		width: '10rem',
	}
});