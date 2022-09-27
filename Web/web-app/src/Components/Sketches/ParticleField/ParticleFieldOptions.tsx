import { Checkbox } from 'Components/Inputs/Checkbox';
import { RangeSlider } from 'Components/Inputs/RangeSlider';
import { observer } from 'mobx-react';
import { ParticleFieldSketchPropsStore } from 'Models/Sketches/ParticleField/ParticleFieldSketchPropsStore';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { BaseOptions } from '../BaseOptions';

interface ParticleFieldOptionsProps {
	propsStore: ParticleFieldSketchPropsStore;
	onClose: () => void;
}

export const ParticleFieldOptions: React.FC<ParticleFieldOptionsProps> = observer(({propsStore, onClose}) => {	
	const styles = useStyles();

	return (
		<BaseOptions onClose={onClose}>
			<div className={styles.groupContainer}>
				Particles
				<RangeSlider
					title='Size'
					onChange={(val) => { propsStore.particleSize = val; }}
					min={1}
					max={10}
					initialValue={propsStore.particleSize} 
					step={1} />
				<RangeSlider
					title='Speed'
					onChange={(val) => { propsStore.particleSpeed = val; }}
					min={0}
					max={20}
					initialValue={propsStore.particleSpeed}
					step={1} />
				<RangeSlider
					title='Trail Length'
					onChange={(val) => { propsStore.particleTrailLength = val; }}
					min={0}
					max={200}
					initialValue={propsStore.particleTrailLength}
					step={1} />
				<div className={styles.groupContainer}>
						Particle tail shrinks
					<Checkbox checked={propsStore.particleTrailShrinks} onChange={() => propsStore.particleTrailShrinks = !propsStore.particleTrailShrinks} />
				</div>
			</div>
			<div className={styles.groupContainer}>
				Noise Scaling
				<RangeSlider
					title='Field Direction'
					onChange={(val) => { propsStore.fieldDirectionNoiseScale = val; propsStore.mustResize = true; }}
					min={.01}
					max={.2}
					initialValue={propsStore.fieldDirectionNoiseScale} step={.01}
					extendable />
				<RangeSlider
					title='Field Strength'
					onChange={(val) => { propsStore.fieldStrengthNoiseScale = val; propsStore.mustResize = true; }}
					min={.01}
					max={.2}
					initialValue={propsStore.fieldStrengthNoiseScale}
					step={.01} />
			</div>
				
			<div className={styles.groupContainer}>
				Field Change Speed
				<RangeSlider
					title='Field Direction'
					onChange={(val) => { propsStore.fieldDirectionChangeSpeed = val; propsStore.mustResize = true; }}
					min={0}
					max={.005}
					initialValue={propsStore.fieldDirectionChangeSpeed} 
					step={.0001} />
				<RangeSlider
					title='Field Strength'
					onChange={(val) => { propsStore.fieldStrengthChangeSpeed = val; propsStore.mustResize = true; }}
					min={0}
					max={.03}
					initialValue={propsStore.fieldStrengthChangeSpeed}
					step={.001} />
			</div>
				
			<div className={styles.groupContainer}>
				Draw Grid Lines
				<Checkbox checked={propsStore.drawGrid} onChange={() => propsStore.drawGrid = !propsStore.drawGrid} />
			</div>
			<div className={styles.groupContainer}>
				Draw Field Lines
				<Checkbox checked={propsStore.drawFieldLines} onChange={() => propsStore.drawFieldLines = !propsStore.drawFieldLines} />
			</div>
			<RangeSlider
				title='Grid Width'
				onChange={(val) => { propsStore.gridWidth = val; propsStore.mustResize = true; }}
				min={1}
				max={Math.floor(propsStore.width / 3)}
				initialValue={propsStore.gridWidth}
				step={1} />
			<RangeSlider
				title='Grid Height'
				onChange={(val) => { propsStore.gridHeight = val; propsStore.mustResize = true; }}
				min={1}
				max={Math.floor(propsStore.height / 3)}
				initialValue={propsStore.gridHeight}
				step={1} />
			<RangeSlider
				title='Field Strength Scale'
				onChange={(val) => { propsStore.fieldStrengthScale = val; }}
				min={0}
				max={2}
				initialValue={propsStore.fieldStrengthScale}
				step={.01} />

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