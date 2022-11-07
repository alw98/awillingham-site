import { useWindowSize } from 'Hooks/useWindowSize';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { SinSumSketchPropsStore } from 'Models/Sketches/SineSum/SinSumSketchPropsStore';
import p5 from 'p5';
import React, { useCallback, useLayoutEffect } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';

import { BaseSketch } from '../BaseSketch';
import { SinSumAbout } from './SinSumAbout';
import { SinSumOptions } from './SinSumOptions';

export interface SinSumSketchProps {
	themeStore: ThemeStore;
	propsStore: SinSumSketchPropsStore;
}

export const SinSumSketch: React.FC<SinSumSketchProps> = observer(({ themeStore, propsStore }) => {
	const [windowWidth, windowHeight] = useWindowSize(250);

	const sketch = useCallback((s: p5) => {
		const drawGraph = () => {
			s.noFill();
			s.stroke(themeStore.theme.textColor.secondary);

			for (let i = 1; i < propsStore.drawn.length; ++i) {
				const from = propsStore.drawn[i - 1];
				const to = propsStore.drawn[i];
				s.line(from.x, from.y, to.x, to.y);
			}
		};

		const drawCircles = () => {
			s.noFill();
			s.stroke(themeStore.theme.textColor.primary);

			let offX = propsStore.width / 2;
			let offY = propsStore.height / 2;
			const sizeScaler = Math.min(propsStore.width, propsStore.height);
			const globalThetaScale = propsStore.speed / 200 * propsStore.step;
			const globalTheta = globalThetaScale * Math.PI * 2;
			for (let i = 0; i < propsStore.functions.length; ++i) {
				const fn = propsStore.functions[i];
				const size = fn.amplitude * sizeScaler;
				const localTheta = globalTheta * fn.freq + fn.phase;

				s.ellipse(offX, offY, size, size);
				offX += Math.cos(localTheta) * size / 2;
				offY += Math.sin(localTheta) * size / 2;
			}
			s.ellipse(offX, offY, 10, 10);
			if (propsStore.drawn.length > 1000) {
				propsStore.drawn.splice(0, 1);
			}
			propsStore.drawn.push({ x: offX, y: offY });
		};

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				s.resizeCanvas(propsStore.width, propsStore.height);
				propsStore.mustResize = false;
			}
			drawGraph();
			drawCircles();
			propsStore.step++;
		};
	}, []);

	useLayoutEffect(() => {
		if (!propsStore.isGallery) {
			propsStore.drawn = [];
		}
	}, [windowWidth, windowHeight, propsStore.isGallery]);

	return (
		<BaseSketch
			about={SinSumAbout}
			options={SinSumOptions}
			sketch={sketch}
			propsStore={propsStore}
			themeStore={themeStore} />
	);
});

export const SinSumSketchDefaultPropsStore = observable<SinSumSketchPropsStore>({
	name: 'SinSums',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	functions: [{ freq: 1, amplitude: .6, phase: 0 }, { freq: 2, amplitude: .3, phase: 0 }, { freq: 5, amplitude: .1, phase: 0 }],
	drawn: [],
	speed: 1,
	step: 0
});

export const SinSumSketchDefaultPropsStoreTwo = observable<SinSumSketchPropsStore>({
	...toJS(SinSumSketchDefaultPropsStore),
	name: 'SinSums2',
	functions: [{ freq: 1, amplitude: .3, phase: 0 }, { freq: .1, amplitude: .3, phase: 0 }, { freq: 10, amplitude: .05, phase: 0 }]
});