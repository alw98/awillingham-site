import { useWindowSize } from 'Hooks/useWindowSize';
import { observer, useLocalObservable } from 'mobx-react';
import p5 from 'p5';
import React, { useCallback, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';

import { BaseSketchProps } from '../BaseSketch';
import { ColorChances } from './ColorChances';
import { getColorsByChance } from './Utils';


export const ColorsPageSketch: React.FC<BaseSketchProps> = observer(({themeStore}) => {
	const styles = useStyles();
	const p5ContainerRef = useRef();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const localStore = useLocalObservable(() => ({
		radius: 200,
		width: windowWidth - 1,
		height: windowHeight - 10,
		mustResize: false,
		colorsByChance: getColorsByChance(themeStore.theme, ColorChances),
		circles: [] as {colorInd: number, r: number, x: number, y: number, vx: number, vy: number, growthModifier: number}[],
		spawnChance: .5,
		chanceToShrink: .001,
		growthRate: .1
	}));
	
	useEffect(() => {
		localStore.width = windowWidth - 1;
		localStore.height = windowHeight - 10;
		localStore.mustResize = true;
	}, [windowWidth, windowHeight]);

	useEffect(() => {
		const newColors = getColorsByChance(themeStore.theme, ColorChances);
		for(let i = 0; i < localStore.colorsByChance.length; ++i) {
			localStore.colorsByChance[i] = newColors[i];
		}
	}, [themeStore.theme]);

	const sketch = useCallback((s: p5) => {
		const addCircle = (radius?: number) => {
			localStore.circles.push({
				colorInd: getRandomColorIndByChance(),
				r: radius ?? 0,
				x: Math.random() * localStore.width,
				y: Math.random() * localStore.height,
				vx: Math.random() - .5,
				vy: Math.random() - .5,
				growthModifier: Math.random() * 5
			});
		};

		const init = () => {
			for(let i = 0; i < 25; ++i) {
				//addCircle(Math.random() * 300);
			}
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
			init();
		};
		
		s.draw = () => {
			if(s.frameCount % 30 === 0)
				console.log(`Frame rate: ${Math.round(s.frameRate())}`);
			s.background(themeStore.theme.backgroundColor.primary);
			if(localStore.mustResize) {
				s.resizeCanvas(localStore.width, localStore.height);
				localStore.mustResize = false;
			}
			
			drawCircles();
			tryAddCircle();
		};
	}, []);

	useEffect(() => {
		if(p5ContainerRef.current){
			const p5Instance = new p5(sketch, p5ContainerRef.current);
			return () => {
				p5Instance.remove();
			};
		}
	}, [p5ContainerRef.current, sketch]);
	

	return (
		<>	
			<div className={styles.sketch} ref={p5ContainerRef} />
		</>
	);
});

const useStyles = createUseStyles({
	sketch: {
		position: 'absolute',
		left: '0',
		top: '0'
	}
});