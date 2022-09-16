import { useWindowSize } from 'Hooks/useWindowSize';
import { useLocalObservable } from 'mobx-react';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

import { ColorChances } from './ColorChances';
import { getColorsByChance } from './Utils';

interface ColorsPageSketchProps {
	theme: Theme
}

export const ColorsPageSketch: React.FC<ColorsPageSketchProps> = ({theme}) => {
	const styles = useStyles();
	const p5ContainerRef = useRef();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const localStore = useLocalObservable(() => ({
		backgroundColor: theme.backgroundColor.primary,
		radius: 200,
		width: windowWidth,
		height: windowHeight,
		mustResize: false,
		colorsByChance: getColorsByChance(theme, ColorChances),
		circles: [] as {colorInd: number, r: number, x: number, y: number, vx: number, vy: number, growthModifier: number}[],
		spawnChance: .5,
		chanceToShrink: .001,
		growthRate: .1
	}));
	
	useEffect(() => {
		localStore.width = windowWidth;
		localStore.height = windowHeight - 4;
		localStore.mustResize = true;
	}, [windowWidth, windowHeight]);

	const newColors = getColorsByChance(theme, ColorChances);
	for(let i = 0; i < localStore.colorsByChance.length; ++i) {
		localStore.colorsByChance[i] = newColors[i];
	}
	localStore.backgroundColor = theme.backgroundColor.primary;

	const sketch = useCallback((s: p5) => {
		const addCircle = (radius?: number) => {
			localStore.circles.push({
				colorInd: getRandomColorIndByChance(),
				r: radius ?? 0,
				x: Math.random() * localStore.width,
				y: Math.random() * localStore.height,
				vx: Math.random() - .5,
				vy: Math.random() - .5,
				growthModifier: Math.random() * 5 * Math.min(1, (Math.min(localStore.width, localStore.height) / 600)),
			});
		};

		const getRandomColorIndByChance = () => {
			return Math.floor(Math.random() * localStore.colorsByChance.length);
		};

		const drawCircles = () => {
			for(let i = localStore.circles.length - 1; i >= 0; i--) {
				const c = localStore.circles[i];
				s.fill(localStore.colorsByChance[c.colorInd]);
				s.circle(c.x, c.y, c.r * 2);
				c.r += localStore.growthRate * c.growthModifier;
				c.growthModifier-= .01;
				c.x += c.vx;
				c.y += c.vy;
				if(c.r < 0) {
					localStore.circles.splice(i, 1);
				}
			}
		};

		const tryAddCircle = () => {
			if(Math.random() < localStore.spawnChance) {
				addCircle();
			}
		};


		s.setup = () => {
			s.createCanvas(localStore.width, localStore.height);
		};
		
		s.draw = () => {				
			s.background(localStore.backgroundColor);
			if(localStore.mustResize) {
				s.resizeCanvas(localStore.width, localStore.height);
				localStore.mustResize = false;
			}
			
			drawCircles();
			tryAddCircle();
		};
	}, []);

	useLayoutEffect(() => {
		if(p5ContainerRef.current){
			const p5Instance = new p5(sketch, p5ContainerRef.current);
			return () => {
				p5Instance.remove();
				setTimeout(() => p5Instance.remove(), 100);
			};
		}
	}, []);
	

	return (
		<>	
			<div className={styles.sketch} ref={p5ContainerRef} />
		</>
	);
};

const useStyles = createUseStyles({
	sketch: {
		position: 'absolute',
		left: '0',
		top: '0'
	}
});