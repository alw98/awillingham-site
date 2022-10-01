import { useValueForTheme } from 'Hooks/useValueForTheme';
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Field } from 'Models/Sketches/ParticleField/Field';
import { Particle } from 'Models/Sketches/ParticleField/Particle';
import { ParticleFieldSketchPropsStore } from 'Models/Sketches/ParticleField/ParticleFieldSketchPropsStore';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { ThemeStore } from 'Stores/ThemeStore';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';

import { ParticleFieldAbout } from './ParticleFieldAbout';
import { ParticleFieldOptions } from './ParticleFieldOptions';

export interface ParticleFieldSketchProps {
	themeStore: ThemeStore;
	propsStore: ParticleFieldSketchPropsStore;
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

	const sketch = useCallback((s: p5) => {
		const mouseMoved = () => {
			if(s.mouseIsPressed)
				propsStore.particles.push(new Particle(s, s.mouseX, s.mouseY));
		};

		const createStartingParticles = () => {
			for(let i = 0; i < propsStore.initialParticles; ++i) {
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
			if(propsStore.resetBackground) {
				s.background(themeStore.theme.backgroundColor.primary);
			}
			if(propsStore.mustResize) {
				if(s.width !== propsStore.width 
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
			if(propsStore.drawGrid)
				propsStore.field.drawGrid(propsStore.width, propsStore.height);
			if(propsStore.drawFieldLines)
				propsStore.field.drawFieldLines(propsStore.width, propsStore.height, propsStore.fieldStrengthScale);
			propsStore.particles.forEach((val) => val.draw(propsStore.particleSize, propsStore.particleTrailShrinks, propsStore.particleAlpha));
			propsStore.field.update(propsStore.step, propsStore.fieldDirectionChangeSpeed, propsStore.fieldStrengthChangeSpeed, propsStore.fieldStrengthScale);
			propsStore.field.updateParticles(propsStore.particles, propsStore.particleSpeed, propsStore.particleTrailLength);
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
		}
		propsStore.gridWidth = Math.floor(propsStore.width / 10);
		propsStore.gridHeight = Math.floor(propsStore.height / 10);
		propsStore.mustResize = true;
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
					<ParticleFieldOptions propsStore={propsStore} onClose={onSettingsClose} />
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