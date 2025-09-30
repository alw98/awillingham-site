import { Checkbox } from 'Components/Inputs/Checkbox';
import { RangeSlider } from 'Components/Inputs/RangeSlider';
import { observer } from 'mobx-react';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { BaseOptions } from '../BaseOptions';
import { TetrisPropsStore } from 'Models/Sketches/Tetris/TetrisPropsStore';

interface TetrisOptionsProps {
	propsStore: TetrisPropsStore;
	onClose: () => void;
}

export const TetrisOptions: React.FC<TetrisOptionsProps> = observer(({propsStore, onClose}) => {	
	const styles = useStyles();

	return (
		<BaseOptions onClose={onClose}>
			
			{/* <RangeSlider
				title='Firework lifespan variance'
				onChange={(val) => { propsStore.fireworkLifeSpanVariance = val; }}
				min={0}
				max={200}
				initialValue={propsStore.fireworkLifeSpanVariance}
				step={1} /> */}
			
		</BaseOptions>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	groupContainer: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		padding: '0rem .5rem',
		border: `1px solid ${theme.accentColor.primary}`
	},
}));