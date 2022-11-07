import { Heap } from 'DataStructures/Heap';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Firework } from 'Models/Sketches/Fireworks2D/Firework';
import { FireworksSketchPropsStore } from 'Models/Sketches/Fireworks2D/FireworksSketchPropsStore';
import { Particle } from 'Models/Sketches/Fireworks2D/Particle';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';
import { getRandomColor } from 'Themes/ColorPalletes';

import { BaseSketch } from '../BaseSketch';
import { FireworksAbout } from './FireworksAbout';
import { FireworksOptions } from './FireworksOptions';

export interface FireworksSketchProps {
	themeStore: ThemeStore;
	propsStore: FireworksSketchPropsStore;
}

export const FireworksSketch: React.FC<FireworksSketchProps> = observer(({ themeStore, propsStore }) => {
	const sketch = useCallback((s: p5) => {
		const mouseClicked = () => {
			propsStore.fireworks.push(new Firework(
				s,
				new p5.Vector(s.mouseX, s.height - s.mouseY),
				new p5.Vector(0, 20),
				getRandomColor(),
				propsStore
			));
		};

		const spawnRandomFirework = () => {
			const x = s.noise(propsStore.step * .1) * propsStore.width;
			const vel = p5.Vector.fromAngle(s.lerp(Math.PI / 4, Math.PI / 4 * 3, x / propsStore.width), 20);
			propsStore.fireworks.push(new Firework(
				s,
				new p5.Vector(x, 0),
				vel,
				getRandomColor(),
				propsStore
			));
		};

		s.setup = () => {
			const c = s.createCanvas(propsStore.width, propsStore.height);
			c.mouseClicked(mouseClicked);
		};

		s.draw = () => {
			if (propsStore.spawner && s.frameCount % propsStore.spawnRate === 0) {
				spawnRandomFirework();
			}
			s.background(themeStore.theme.backgroundColor.primary);
			s.translate(0, s.height);
			s.scale(1, -1);
			if (propsStore.mustResize) {
				if (s.width !== propsStore.width || s.height != propsStore.height) {
					s.resizeCanvas(propsStore.width, propsStore.height);
				}
				propsStore.mustResize = false;
			}
			const gravity = new p5.Vector(0, -propsStore.gravity);

			propsStore.fireworks.heapArray.forEach((val) => {
				val.draw();
				val.update(gravity);
			});

			propsStore.particles.heapArray.forEach((val) => {
				val.draw();
				val.update(gravity);
			});

			while (!propsStore.fireworks.isEmpty() && propsStore.fireworks.peek().fuse <= 0) {
				const popped = propsStore.fireworks.pop();
				propsStore.particles.push(...popped.explode());
			}

			while (!propsStore.particles.isEmpty() && propsStore.particles.peek().life <= 0) {
				propsStore.particles.pop();
			}

			propsStore.step++;
		};
	}, []);

	return (
		<BaseSketch
			about={FireworksAbout}
			options={FireworksOptions}
			sketch={sketch}
			propsStore={propsStore}
			themeStore={themeStore} />
	);
});

export const FireworksSketchDefaultPropsStore = observable<FireworksSketchPropsStore>({
	name: 'Fireworks',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	step: 0,
	fireworks: new Heap<Firework>(),
	particles: new Heap<Particle>(),
	gravity: 1,
	fireworkSize: 5,
	explosionForce: 10,
	explosionParticleCount: 50,
	explosionArc: Number.parseFloat((Math.PI * 1.5).toPrecision(3)),
	particleTrailLength: 15,
	particleTrailLengthVariance: 10,
	particleSize: 3,
	particleLifeSpan: 50,
	particleLifeSpanVariance: 20,
	fireworkLifeSpan: 10,
	fireworkLifeSpanVariance: 15,
	spawner: true,
	spawnRate: 40,
});