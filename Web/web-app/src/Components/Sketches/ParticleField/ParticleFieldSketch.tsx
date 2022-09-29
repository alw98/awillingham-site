import { useValueForTheme } from 'Hooks/useValueForTheme';
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable, toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { Field } from 'Models/Sketches/ParticleField/Field';
import { Particle } from 'Models/Sketches/ParticleField/Particle';
import { ParticleFieldSketchPropsStore } from 'Models/Sketches/ParticleField/ParticleFieldSketchPropsStore';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { ThemeStore } from 'Stores/ThemeStore';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';

import { ParticleFieldAbout } from './ParticleFieldAbout';
import { ParticleFieldOptions } from './ParticleFieldOptions';

export interface ParticleFieldSketchProps {
	themeStore: ThemeStore;
	propsStore?: ParticleFieldSketchPropsStore;
}

export const ParticleFieldSketch: React.FC<ParticleFieldSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	const settingsNodeRef = useRef(null);
	const aboutNodeRef = useRef(null);
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const gearbox = useValueForTheme(GearboxDark, GearboxLight, themeStore.theme);
	const localStore = propsStore ?? useLocalObservable<ParticleFieldSketchPropsStore>(() => ({
		...ParticleFieldSketchDefaultPropsStore,
		isGallery: false
	}));

	const sketch = useCallback((s: p5) => {
		const mouseMoved = () => {
			if(s.mouseIsPressed)
				localStore.particles.push(new Particle(s, s.mouseX, s.mouseY));
		};

		const createStartingParticles = () => {
			for(let i = 0; i < localStore.initialParticles; ++i) {
				localStore.particles.push(new Particle(s, Math.random() * localStore.width, Math.random() * localStore.height));
			}
		};

		s.setup = () => {
			const c = s.createCanvas(localStore.width, localStore.height);
			localStore.field = new Field(localStore.gridWidth, 
				localStore.gridHeight, 
				localStore.fieldDirectionNoiseScale, 
				localStore.fieldStrengthNoiseScale, 
				localStore.fieldStrengthScale,
				localStore.uniformStrength,
				s);
				
			createStartingParticles();
			c.mouseMoved(mouseMoved);
		};
		
		s.draw = () => {	
			if(localStore.resetBackground) {
				s.background(themeStore.theme.backgroundColor.primary);
			}
			if(localStore.mustResize) {
				if(s.width !== localStore.width 
					|| s.height != localStore.height 
					|| localStore.particles.length !== localStore.initialParticles) {
					localStore.particles = [];
					createStartingParticles();
					s.resizeCanvas(localStore.width, localStore.height);
				}
				localStore.mustResize = false;
				localStore.field = new Field(localStore.gridWidth, 
					localStore.gridHeight, 
					localStore.fieldDirectionNoiseScale, 
					localStore.fieldStrengthNoiseScale, 
					localStore.fieldStrengthScale,
					localStore.uniformStrength,
					s);
			}
			if(localStore.drawGrid)
				localStore.field.drawGrid(localStore.width, localStore.height);
			if(localStore.drawFieldLines)
				localStore.field.drawFieldLines(localStore.width, localStore.height, localStore.fieldStrengthScale);
			localStore.particles.forEach((val) => val.draw(localStore.particleSize, localStore.particleTrailShrinks, localStore.particleAlpha));
			localStore.field.update(localStore.step, localStore.fieldDirectionChangeSpeed, localStore.fieldStrengthChangeSpeed, localStore.fieldStrengthScale);
			localStore.field.updateParticles(localStore.particles, localStore.particleSpeed, localStore.particleTrailLength);
			localStore.step++;
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
	
	useEffect(() => {
		localStore.height = p5ContainerRef.current.clientHeight;
		localStore.width = p5ContainerRef.current.clientWidth;
		localStore.mustResize = true;
		if(!localStore.isGallery) {
			localStore.gridWidth = Math.floor(localStore.width / 10);
			localStore.gridHeight = Math.floor(localStore.height / 10);
		}
	}, [windowWidth, windowHeight, localStore.isGallery, p5ContainerRef]);

	const onSettingsClick = () => {
		setSettingsOpen(true);
	};

	const onSettingsClose = () => {
		setSettingsOpen(false);
	};

	return (
		<div className={styles.sketch} ref={p5ContainerRef} >
			{ 
				!localStore.isGallery && 
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
					<ParticleFieldOptions propsStore={localStore} onClose={onSettingsClose} />
				</div>
			</CSSTransition>
			<CSSTransition unmountOnExit nodeRef={aboutNodeRef} in={aboutOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={aboutNodeRef} className={styles.animationContainer}>
					<ParticleFieldAbout onClose={() => setAboutOpen(false)} />
				</div>
			</CSSTransition>
		</div>
	);
});

export const ParticleFieldSketchDefaultPropsStore = observable<ParticleFieldSketchPropsStore>({
	name: 'ParticleFields',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: true,
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