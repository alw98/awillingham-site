
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { getRandomColor } from 'Themes/ColorPalletes';
import DVDLogo from 'wwwroot/images/DVDLogo.png';

import { BaseSketchProps } from '../BaseSketch';

export const BouncyDVDSketchDefaultPropsStore = observable<BaseSketchPropsStore>({
	name: 'BaseSketch',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: true
});

export const BouncyDVDSketch: React.FC<BaseSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const localStore = propsStore ?? useLocalObservable<BaseSketchPropsStore>(() => ({
		...BouncyDVDSketchDefaultPropsStore,
		isGallery: false
	}));

	const sketch = useCallback((s: p5) => {
		const dvdLogo = s.loadImage(DVDLogo);
		const aspectRatio = .5;
		let vx = (Math.random() * 5 + 3) * localStore.width / 500;
		let vy = (Math.random() * 5 + 3) * localStore.height / 500;
		const imageWidth = localStore.width / 6;
		const imageHeight = localStore.width / 6 * aspectRatio;
		let x = Math.random() * localStore.width - imageWidth;
		let y = Math.random() * localStore.height - imageHeight;
		let color = getRandomColor();

		s.setup = () => {
			s.createCanvas(localStore.width, localStore.height);
		};
		
		s.draw = () => {				
			s.background(themeStore.theme.backgroundColor.primary);
			if(localStore.mustResize) {
				s.resizeCanvas(localStore.width, localStore.height);
				localStore.mustResize = false;
			}
			const imageWidth = localStore.width / 6;
			const imageHeight = localStore.width / 6 * aspectRatio;
			s.stroke(themeStore.theme.accentColor.primary);
			s.noFill();
			s.rect(0, 0, localStore.width, localStore.height);
			s.tint(color);
			s.image(dvdLogo, x, y, imageWidth, imageHeight);
			x += vx;
			y += vy;
			if(x < 0) {
				x = -x;
				vx = -vx;
				color = getRandomColor();
			} else if(x + imageWidth > localStore.width) {
				vx = -vx;
				color = getRandomColor();
			}
			if(y < 0) {
				y = -y;
				vy = -vy;
				color = getRandomColor();
			} else if(y + imageHeight > localStore.height) {
				vy = -vy;
				color = getRandomColor();
			}
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
	
	useLayoutEffect(() => {
		if(!localStore.isGallery) {
			localStore.height = p5ContainerRef.current.clientHeight;
			localStore.width = p5ContainerRef.current.clientWidth;
			localStore.mustResize = true;
		}
	}, [windowWidth, windowHeight, localStore.isGallery, p5ContainerRef]);

	return (
		<div className={styles.sketch} ref={p5ContainerRef} />
	);
});

const useStyles = createUseStyles((theme: Theme) => ({
	sketch: {
		position: 'relative',
		overflow: 'hidden',
		height: '100%'
	},
	settingsContainer: {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: 0,
		right: 0,
		cursor: 'pointer',
		padding: '1rem',
		alignItems: 'center',
	},
	settings: {
		width: '4rem',
		height: '4rem',
	},
	optionsEnter: {
		marginTop: '-100%',
	},
	optionsEnterActive: {
		marginTop: 0,
		transition: 'all 500ms'
	},
	optionsExit: {
		marginTop: 0,
		transformOrigin: 'top'
	},
	optionsExitActive: {
		marginTop: '-100%',
		transition: 'all 500ms'
	},
	animationContainer: {
		position: 'absolute',
		top: 0,
		width: '100%',
		backgroundColor: theme.backgroundColor.secondary,
		overflow: 'hidden'
	}
}));