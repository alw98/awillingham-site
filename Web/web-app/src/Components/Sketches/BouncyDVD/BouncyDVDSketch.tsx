
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
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
	isGallery: false
});

export const BouncyDVDSketch: React.FC<BaseSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	
	const sketch = useCallback((s: p5) => {
		const dvdLogo = s.loadImage(DVDLogo);
		const aspectRatio = .5;
		let vx = (Math.random() * 5 + 3) * propsStore.width / 500;
		let vy = (Math.random() * 5 + 3) * propsStore.height / 500;
		const imageWidth = propsStore.width / 6;
		const imageHeight = propsStore.width / 6 * aspectRatio;
		let x = Math.random() * propsStore.width - imageWidth;
		let y = Math.random() * propsStore.height - imageHeight;
		let color = getRandomColor();

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};
		
		s.draw = () => {				
			s.background(themeStore.theme.backgroundColor.primary);
			if(propsStore.mustResize) {
				s.resizeCanvas(propsStore.width, propsStore.height);
				propsStore.mustResize = false;
			}
			const imageWidth = propsStore.width / 6;
			const imageHeight = propsStore.width / 6 * aspectRatio;
			s.stroke(themeStore.theme.accentColor.primary);
			s.noFill();
			s.rect(0, 0, propsStore.width, propsStore.height);
			s.tint(color);
			s.image(dvdLogo, x, y, imageWidth, imageHeight);
			x += vx;
			y += vy;
			if(x < 0) {
				x = -x;
				vx = -vx;
				color = getRandomColor();
			} else if(x + imageWidth > propsStore.width) {
				vx = -vx;
				color = getRandomColor();
			}
			if(y < 0) {
				y = -y;
				vy = -vy;
				color = getRandomColor();
			} else if(y + imageHeight > propsStore.height) {
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
		if(!propsStore.isGallery) {
			propsStore.height = p5ContainerRef.current.clientHeight;
			propsStore.width = p5ContainerRef.current.clientWidth;
			propsStore.mustResize = true;
		}
	}, [windowWidth, windowHeight, propsStore.isGallery, p5ContainerRef]);

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