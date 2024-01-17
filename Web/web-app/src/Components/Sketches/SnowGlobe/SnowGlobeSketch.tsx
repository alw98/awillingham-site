import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';

import { BaseSketch } from '../BaseSketch';
import { SnowGlobeAbout } from './SnowGlobeAbout';
import { SnowGlobeOptions } from './SnowGlobeOptions';
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';

import * as Matter from 'matter-js'
import { Field } from 'Models/Sketches/ParticleField/Field';

export interface SnowGlobeSketchProps {
	themeStore: ThemeStore;
	propsStore: BaseSketchPropsStore;
}

export const SnowGlobeSketch: React.FC<SnowGlobeSketchProps> = observer(({ themeStore, propsStore }) => {
	const sketch = useCallback((s: p5) => {
		let tick = 0;
		let lastTick = Date.now();
		let globeRadius = Math.max(propsStore.width, propsStore.height) * .8;
		const globeResolution = 100;
		const globeDT = Math.PI * 2 / globeResolution;
		const circumference = 2 * Math.PI * globeRadius;
		const globeDC = circumference / globeResolution;
		const snowCount = 1000;
		const snowSize = 3;
		let field: Field;
		let snow: Matter.Body[];
		let globePoints: Matter.Vector[];
		let globe: Matter.Body[];
		let engine: Matter.Engine;
		
		const createGlobe = () => {
			globeRadius = Math.min(propsStore.width, propsStore.height) * .4;
			lastTick = Date.now();
			snow = [];
			globePoints = [];
			globe = [];
			engine = Matter.Engine.create();
			engine.gravity.y = .1;
			field = new Field(100,
				100,
				.5,
				.5,
				.0003,
				false,
				s);

			for(let i = 0; i < snowCount; ++i) {
				const centerX = propsStore.width / 2;
				const centerY = propsStore.height / 2;
				const r = Math.random() * globeRadius - 5;
				const theta = Math.random() * Math.PI * 2;
				const snowParticle = Matter.Bodies.circle(centerX + Math.cos(theta) * r, centerY + Math.sin(theta) * r, snowSize, {restitution: 1, frictionAir: 0});

				Matter.World.add(engine.world, snowParticle);
				snow.push(snowParticle);
			}
			

			for(let theta = 0; theta < Math.PI * 2; theta += globeDT) {
				const cur = {x: propsStore.width / 2 + Math.cos(theta) * globeRadius, y: propsStore.height / 2 + Math.sin(theta) * globeRadius};
				globePoints.push(cur);
				globe.push(Matter.Bodies.rectangle(cur.x, cur.y, 20, globeDC * 1.5, {angle: theta, isStatic: true}));
			}
			Matter.World.add(engine.world, globe);

			// mouseBox = Matter.Bodies.rectangle(450, 500, 50, 50, {isStatic: true, density: 100000});
			// Matter.World.add(engine.world, mouseBox);
			// Matter.World.add(engine.world, Matter.Bodies.rectangle(0, 500, propsStore.width, 10, {isStatic:}));
		}

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
			createGlobe();
		};

			
		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				createGlobe();
			}
			const now = Date.now();
			const dt = now - lastTick;
			Matter.Engine.update(engine, dt);
			field.update(tick++, .01, .01, .00003);
			// field.drawFieldLines(propsStore.width, propsStore.height, 1);

			for(let i = 0; i < snow.length; ++i){
				const particle = snow.at(i);
				s.circle(particle.position.x, particle.position.y, particle.circleRadius * 2);
				const vec = field.getFieldValueAtCoordinate(particle.position.x, particle.position.y);
				Matter.Body.applyForce(particle, particle.position, vec);
			}
			
			for(let i = 0; i < globe.length; ++i) {
				const cur = globe.at(i);
				s.push();
				s.translate(cur.position.x, cur.position.y);
				s.rotate(i * globeDT);
				s.rectMode('corner');
				s.rect(-10, -10, 3, globeDC);
				s.pop();
			}

			// s.rect(mouseBox.position.x - 25, mouseBox.position.y - 25, 50, 50);
			// if(s.mouseIsPressed) {
			// 	const dx = s.mouseX - mouseBox.position.x;
			// 	const dy = s.mouseY - mouseBox.position.y;
			// 	Matter.Body.setPosition(mouseBox, {x: s.mouseX, y: s.mouseY});
			// } else {
			// 	// mouseBox.position.x = 0;
			// 	// mouseBox.position.y = 0;
			// }
			lastTick = now;
		};
	}, []);

	return (
		<BaseSketch
			about={SnowGlobeAbout}
			options={SnowGlobeOptions}
			propsStore={propsStore}
			themeStore={themeStore}
			sketch={sketch} />
	);
});

export const SnowGlobeDefaultPropsStore = observable<BaseSketchPropsStore>({
	name: 'SnowGlobe',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false
});
