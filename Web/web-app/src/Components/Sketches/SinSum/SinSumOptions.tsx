import { RangeSlider } from 'Components/Inputs/RangeSlider/RangeSlider';
import { observer } from 'mobx-react';
import { SinSumSketchPropsStore } from 'Models/Sketches/SineSum/SinSumSketchPropsStore';
import { Theme } from 'Models/Theme';
import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';

import { BaseOptions } from '../BaseOptions';

interface SinSumOptionsProps {
	propsStore: SinSumSketchPropsStore;
	onClose: () => void;
}

export const SinSumOptions: React.FC<SinSumOptionsProps> = observer(({propsStore, onClose}) => {	
	const styles = useStyles();
	const functionOptions = useMemo(() => {
		return propsStore.functions.map((fn, i) => {
			const setFreq = (val: number) => {
				fn.freq = val;
				propsStore.drawn = [];
			};
			const setPhase = (val: number) => {
				fn.phase = val;
				propsStore.drawn = [];
			};
			const setAmplitude = (val: number) => {
				fn.amplitude = val;
				propsStore.drawn = [];
			};
			return(
				<div key={i} className={styles.functionContainer}>
					Function {i}
					<RangeSlider
						title='Frequency'
						onChange={setFreq}
						min={.1}
						max={10}
						initialValue={fn.freq}
						step={.1} />
					<RangeSlider
						title='Amplitude'
						onChange={setAmplitude}
						min={.1}
						max={1}
						initialValue={fn.amplitude}
						step={.1} />
					<RangeSlider
						title='Phase'
						onChange={setPhase}
						min={0}
						max={Math.PI * 2}
						initialValue={fn.phase}
						step={.1} />
				</div>

			); 
		});
	}, [propsStore.functions]);

	const setSketchSpeed = (val: number) => {
		propsStore.speed = val;
		propsStore.drawn = [];
	};

	return (
		<BaseOptions onClose={onClose}>
			<RangeSlider
				title='Sketch speed'
				onChange={setSketchSpeed}
				min={0}
				max={5}
				initialValue={propsStore.speed}
				step={.5} />
			{functionOptions}
		</BaseOptions>
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	functionContainer: {
		display: 'flex',
		alignItems: 'center',
		flexDirection: 'column',
		border: `1px solid ${theme.accentColor.primary}`
	}
}));