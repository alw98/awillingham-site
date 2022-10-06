import { Checkbox } from 'Components/Inputs/Checkbox';
import { RangeSlider } from 'Components/Inputs/RangeSlider';
import { observer } from 'mobx-react';
import { FireworksSketchPropsStore } from 'Models/Sketches/Fireworks2D/FireworksSketchPropsStore';
import { Theme } from 'Models/Theme';
import React from 'react';
import { createUseStyles } from 'react-jss';

import { BaseOptions } from '../BaseOptions';

interface FireworksOptionsProps {
	propsStore: FireworksSketchPropsStore;
	onClose: () => void;
}

export const FireworksOptions: React.FC<FireworksOptionsProps> = observer(({propsStore, onClose}) => {	
	const styles = useStyles();

	return (
		<BaseOptions onClose={onClose}>
			<RangeSlider
				title='Gravity'
				onChange={(val) => { propsStore.gravity = val; }}
				min={0}
				max={5}
				initialValue={propsStore.gravity}
				step={.1} />
			<RangeSlider
				title='Firework size'
				onChange={(val) => { propsStore.fireworkSize = val; }}
				min={1}
				max={20}
				initialValue={propsStore.fireworkSize}
				step={1} />
			<RangeSlider
				title='Particle size'
				onChange={(val) => { propsStore.particleSize = val; }}
				min={0}
				max={20}
				initialValue={propsStore.particleSize}
				step={1} />
			<RangeSlider
				title='Particle trail length'
				onChange={(val) => { propsStore.particleTrailLength = val; }}
				min={0}
				max={200}
				initialValue={propsStore.particleTrailLength}
				step={1} />
			<RangeSlider
				title='Particle trail length variance'
				onChange={(val) => { propsStore.particleTrailLengthVariance = val; }}
				min={0}
				max={50}
				initialValue={propsStore.particleTrailLengthVariance}
				step={1} />
			<RangeSlider
				title='Explosion force'
				onChange={(val) => { propsStore.explosionForce = val; }}
				min={0}
				max={20}
				initialValue={propsStore.explosionForce}
				step={1} />
			<RangeSlider
				title='Explosion arc'
				onChange={(val) => { propsStore.explosionArc = val; }}
				min={0}
				max={Number.parseFloat((Math.PI * 2).toPrecision(3))}
				initialValue={propsStore.explosionArc}
				step={.1} />
			<RangeSlider
				title='Explosion particle count'
				onChange={(val) => { propsStore.explosionParticleCount = val; }}
				min={0}
				max={200}
				initialValue={propsStore.explosionParticleCount}
				step={1} />
			<RangeSlider
				title='Explosion particle lifespan'
				onChange={(val) => { propsStore.particleLifeSpan = val; }}
				min={0}
				max={100}
				initialValue={propsStore.particleLifeSpan}
				step={1} />
			<RangeSlider
				title='Explosion particle lifespan variance'
				onChange={(val) => { propsStore.particleLifeSpanVariance = val; }}
				min={0}
				max={200}
				initialValue={propsStore.particleLifeSpanVariance}
				step={1} />
			<RangeSlider
				title='Firework lifespan'
				onChange={(val) => { propsStore.fireworkLifeSpan = val; }}
				min={0}
				max={100}
				initialValue={propsStore.fireworkLifeSpan}
				step={1} />
			<RangeSlider
				title='Firework lifespan variance'
				onChange={(val) => { propsStore.fireworkLifeSpanVariance = val; }}
				min={0}
				max={200}
				initialValue={propsStore.fireworkLifeSpanVariance}
				step={1} />
			<div className={styles.groupContainer}>
					Spawn Fireworks
				<Checkbox checked={propsStore.spawner} onChange={() => propsStore.spawner = !propsStore.spawner} />
			</div>
			{propsStore.spawner && <RangeSlider
				title='Firework spawn rate'
				onChange={(val) => { propsStore.spawnRate = val; }}
				min={1}
				max={250}
				initialValue={propsStore.spawnRate}
				step={1} />}
			
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