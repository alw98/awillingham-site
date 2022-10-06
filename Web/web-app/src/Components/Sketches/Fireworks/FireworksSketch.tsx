import { Heap } from 'DataStructures/Heap';
import { useValueForTheme } from 'Hooks/useValueForTheme';
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Firework } from 'Models/Sketches/Fireworks2D/Firework';
import { FireworksSketchPropsStore } from 'Models/Sketches/Fireworks2D/FireworksSketchPropsStore';
import { Particle } from 'Models/Sketches/Fireworks2D/Particle';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { ThemeStore } from 'Stores/ThemeStore';
import { getRandomColor } from 'Themes/ColorPalletes';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';

import { FireworksAbout } from './FireworksAbout';
import { FireworksOptions } from './FireworksOptions';


export interface FireworksSketchProps {
	themeStore: ThemeStore;
	propsStore: FireworksSketchPropsStore;
}

export const FireworksSketch: React.FC<FireworksSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	const settingsNodeRef = useRef(null);
	const aboutNodeRef = useRef(null);
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const gearbox = useValueForTheme(GearboxDark, GearboxLight, themeStore.theme);

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
			if(propsStore.spawner && s.frameCount % propsStore.spawnRate === 0) {
				spawnRandomFirework();
			}
			s.background(themeStore.theme.backgroundColor.primary);
			s.translate(0, s.height);
			s.scale(1, -1);
			if(propsStore.mustResize) {
				if(s.width !== propsStore.width || s.height != propsStore.height) {
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

			while(!propsStore.fireworks.isEmpty() && propsStore.fireworks.peek().fuse <= 0) {
				const popped = propsStore.fireworks.pop();
				propsStore.particles.push(...popped.explode());
			}

			while(!propsStore.particles.isEmpty() && propsStore.particles.peek().life <= 0) {
				propsStore.particles.pop();
			}

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
					<FireworksOptions propsStore={propsStore} onClose={onSettingsClose} />
				</div>
			</CSSTransition>
			<CSSTransition unmountOnExit nodeRef={aboutNodeRef} in={aboutOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={aboutNodeRef} className={styles.animationContainer}>
					<FireworksAbout onClose={() => setAboutOpen(false)} />
				</div>
			</CSSTransition>
		</div>
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
	explosionForce: 5,
	explosionParticleCount: 50,
	explosionArc: Math.PI * 1.5,
	particleTrailLength: 25,
	particleTrailLengthVariance: 10,
	particleSize: 3,
	particleLifeSpan: 50,
	particleLifeSpanVariance: 20,
	fireworkLifeSpan: 10,
	fireworkLifeSpanVariance: 15,
	spawner: true,
	spawnRate: 40,
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