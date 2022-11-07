import { useWindowSize } from 'Hooks/useWindowSize';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Field } from 'Models/Sketches/ParticleField/Field';
import { Particle } from 'Models/Sketches/ParticleField/Particle';
import { ParticleFieldSketchPropsStore } from 'Models/Sketches/ParticleField/ParticleFieldSketchPropsStore';
import p5 from 'p5';
import React, { useCallback, useLayoutEffect } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';

import { BaseSketch } from '../BaseSketch';
import { ParticleFieldAbout } from './ParticleFieldAbout';
import { ParticleFieldOptions } from './ParticleFieldOptions';

export interface ParticleFieldSketchProps {
	themeStore: ThemeStore;
	propsStore: ParticleFieldSketchPropsStore;
}

export const ParticleFieldSketch: React.FC<ParticleFieldSketchProps> = observer(({ themeStore, propsStore }) => {
	const [windowWidth, windowHeight] = useWindowSize(250);

	const sketch = useCallback((s: p5) => {
		const mouseMoved = () => {
			if (s.mouseIsPressed)
				propsStore.particles.push(new Particle(s, s.mouseX, s.mouseY));
		};

		const createStartingParticles = () => {
			for (let i = 0; i < propsStore.initialParticles; ++i) {
				propsStore.particles.push(new Particle(s, Math.random() * propsStore.width, Math.random() * propsStore.height));
			}
		};

		s.setup = () => {
			const c = s.createCanvas(propsStore.width, propsStore.height);
			propsStore.field = new Field(propsStore.gridWidth,
				propsStore.gridHeight,
				propsStore.fieldDirectionNoiseScale,
				propsStore.fieldStrengthNoiseScale,
				propsStore.fieldStrengthScale,
				propsStore.uniformStrength,
				s);

			createStartingParticles();
			c.mouseMoved(mouseMoved);
		};

		s.draw = () => {
			if (propsStore.resetBackground) {
				s.background(themeStore.theme.backgroundColor.primary);
			}
			if (propsStore.mustResize) {
				if (s.width !== propsStore.width
					|| s.height != propsStore.height
					|| propsStore.particles.length !== propsStore.initialParticles) {
					propsStore.particles = [];
					createStartingParticles();
					s.resizeCanvas(propsStore.width, propsStore.height);
				}
				propsStore.mustResize = false;
				propsStore.field = new Field(propsStore.gridWidth,
					propsStore.gridHeight,
					propsStore.fieldDirectionNoiseScale,
					propsStore.fieldStrengthNoiseScale,
					propsStore.fieldStrengthScale,
					propsStore.uniformStrength,
					s);
			}
			if (propsStore.drawGrid)
				propsStore.field.drawGrid(propsStore.width, propsStore.height);
			if (propsStore.drawFieldLines)
				propsStore.field.drawFieldLines(propsStore.width, propsStore.height, propsStore.fieldStrengthScale);
			propsStore.particles.forEach((val) => val.draw(propsStore.particleSize, propsStore.particleTrailShrinks, propsStore.particleAlpha));
			propsStore.field.update(propsStore.step, propsStore.fieldDirectionChangeSpeed, propsStore.fieldStrengthChangeSpeed, propsStore.fieldStrengthScale);
			propsStore.field.updateParticles(propsStore.particles, propsStore.particleSpeed, propsStore.particleTrailLength);
			propsStore.step++;
		};
	}, []);

	useLayoutEffect(() => {
		propsStore.gridWidth = Math.floor(propsStore.width / 10);
		propsStore.gridHeight = Math.floor(propsStore.height / 10);
	}, [windowWidth, windowHeight, propsStore.isGallery]);


	return (
		<BaseSketch
			about={ParticleFieldAbout}
			options={ParticleFieldOptions}
			sketch={sketch}
			propsStore={propsStore}
			themeStore={themeStore} />
	);
});

export const ParticleFieldSketchDefaultPropsStore = observable<ParticleFieldSketchPropsStore>({
	name: 'ParticleFields',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	particleSpeed: 6,
	particleTrailLength: 50,
	particleSize: 4,
	fieldDirectionChangeSpeed: .02,
	fieldStrengthChangeSpeed: .01,
	fieldStrengthScale: 1.5,
	fieldDirectionNoiseScale: .1,
	fieldStrengthNoiseScale: .03,
	gridWidth: 32,
	gridHeight: 32,
	step: 0,
	initialParticles: 20,
	particleAlpha: 255,
	particleTrailShrinks: true,
	drawFieldLines: false,
	drawGrid: false,
	uniformStrength: false,
	resetBackground: true,
	field: {} as Field,
	particles: [],
});

export const ParticleFieldSketchDefaultPropsStoreTwo = observable<ParticleFieldSketchPropsStore>({
	...toJS(ParticleFieldSketchDefaultPropsStore),
	name: 'FlowField',
	initialParticles: 0,
	drawFieldLines: true,
	fieldDirectionChangeSpeed: .001
});

export const ParticleFieldSketchDefaultPropsStoreThree = observable<ParticleFieldSketchPropsStore>({
	...toJS(ParticleFieldSketchDefaultPropsStore),
	name: 'DrawnField',
	resetBackground: false,
	particleTrailLength: 2,
	particleAlpha: 20,
	initialParticles: 3,
	particleSize: 1,
	particleTrailShrinks: false,
	particleSpeed: 3,
	fieldStrengthScale: .5
});