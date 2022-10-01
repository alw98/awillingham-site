import { useValueForTheme } from 'Hooks/useValueForTheme';
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { SinSumSketchPropsStore } from 'Models/Sketches/SineSum/SinSumSketchPropsStore';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { ThemeStore } from 'Stores/ThemeStore';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';

import { SinSumAbout } from './SinSumAbout';
import { SinSumOptions } from './SinSumOptions';

export interface SinSumSketchProps {
	themeStore: ThemeStore;
	propsStore: SinSumSketchPropsStore;
}

export const SinSumSketch: React.FC<SinSumSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	const settingsNodeRef = useRef(null);
	const aboutNodeRef = useRef(null);
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const gearbox = useValueForTheme(GearboxDark, GearboxLight, themeStore.theme);

	const sketch = useCallback((s: p5) => {
		const drawGraph = () => {
			s.noFill();
			s.stroke(themeStore.theme.textColor.secondary);

			for(let i = 1; i < propsStore.drawn.length; ++i) {
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
			for(let i = 0; i < propsStore.functions.length; ++i) {
				const fn = propsStore.functions[i];
				const size = fn.amplitude * sizeScaler;
				const localTheta = globalTheta * fn.freq + fn.phase;

				s.ellipse(offX, offY, size, size);
				offX += Math.cos(localTheta) * size / 2;
				offY += Math.sin(localTheta) * size / 2;
			}
			s.ellipse(offX, offY, 10, 10);
			if(propsStore.drawn.length > 1000) {
				propsStore.drawn.splice(0, 1);
			}
			propsStore.drawn.push({x: offX, y: offY});
		};

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};
		
		s.draw = () => {				
			s.background(themeStore.theme.backgroundColor.primary);
			if(propsStore.mustResize) {
				s.resizeCanvas(propsStore.width, propsStore.height);
				propsStore.mustResize = false;
			}
			drawGraph();
			drawCircles();
			propsStore.step++;
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
			propsStore.drawn = [];
		}
	}, [windowWidth, windowHeight, propsStore.isGallery, p5ContainerRef]);

	const onSettingsClick = () => {
		setSettingsOpen(true);
	};

	const onSettingsClose = () => {
		setSettingsOpen(false);
	};

	return (
		<div className={styles.sketch} ref={p5ContainerRef} >
			{ 
				!propsStore.isGallery && 
				<>
					<div className={styles.aboutContainer} onClick={() => setAboutOpen(true)}>About</div>
					<div className={styles.settingsContainer}>
						<img 
							src={gearbox} 
							className={styles.settings} 
							alt={'Settings'} 
							onClick={onSettingsClick}/>
						settings
					</div> 
				</>
			}
			
			<CSSTransition unmountOnExit nodeRef={settingsNodeRef} in={settingsOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={settingsNodeRef} className={styles.animationContainer}>
					<SinSumOptions propsStore={propsStore} onClose={onSettingsClose} />
				</div>
			</CSSTransition>
			<CSSTransition unmountOnExit nodeRef={aboutNodeRef} in={aboutOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={aboutNodeRef} className={styles.animationContainer}>
					<SinSumAbout onClose={() => setAboutOpen(false)} />
				</div>
			</CSSTransition>
		</div>
	);
});

export const SinSumSketchDefaultPropsStore = observable<SinSumSketchPropsStore>({
	name: 'SinSums',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	functions: [{freq: 1, amplitude: .6, phase: 0}, {freq: 2, amplitude: .3, phase: 0}, {freq: 5, amplitude: .1, phase: 0}],
	drawn: [],
	speed: 1,
	step: 0
});

export const SinSumSketchDefaultPropsStoreTwo = observable<SinSumSketchPropsStore>({
	...toJS(SinSumSketchDefaultPropsStore),
	name: 'SinSums2',
	functions: [{freq: 1, amplitude: .3, phase: 0}, {freq: .1, amplitude: .3, phase: 0}, {freq: 10, amplitude: .05, phase: 0}]
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
	aboutContainer: {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: 0,
		right: '50%',
		left: '50%',
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