import { useValueForTheme } from 'Hooks/useValueForTheme';
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Skyscraper } from 'Models/Sketches/Skyscrapers/Skyscraper';
import { SkyscrapersSketchPropsStore } from 'Models/Sketches/Skyscrapers/SkyscrapersSketchPropsStore';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { ThemeStore } from 'Stores/ThemeStore';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';

import { SkyscrapersAbout } from './SkyscrapersAbout';
import { SkyscrapersOptions } from './SkyscrapersOptions';

export interface SkyscrapersSketchProps {
	themeStore: ThemeStore;
	propsStore: SkyscrapersSketchPropsStore;
}

export const SkyscrapersSketch: React.FC<SkyscrapersSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	const settingsNodeRef = useRef(null);
	const aboutNodeRef = useRef(null);
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const gearbox = useValueForTheme(GearboxDark, GearboxLight, themeStore.theme);

	const getTallestSSOnRightSide = () => {
		let tallestSS: Skyscraper;
		let tallestSSInd = -1;
		const curSS = propsStore.skyscrapers[propsStore.curSSInd];
		const rightSide = curSS.x + curSS.w;
		for(let i = 0; i < propsStore.checkingSSInd; ++i) {
			const toCheck = propsStore.skyscrapers[i];
			if(toCheck.x < rightSide && toCheck.x + toCheck.w > rightSide) {
				if(tallestSSInd === -1 || tallestSS.h < toCheck.h) {
					tallestSSInd = i;
					tallestSS = toCheck;
				}
			}
		}
		return tallestSSInd;
	};

	const addLastPoints = () => {
		let curSS = propsStore.skyscrapers[propsStore.curSSInd];
		let rightSide = curSS.x + curSS.w;
		let tallestSSInd = getTallestSSOnRightSide();
		while(tallestSSInd !== -1) {
			const toAdd = propsStore.skyscrapers[tallestSSInd];
			propsStore.points.push(new p5.Vector(rightSide, curSS.h));
			propsStore.points.push(new p5.Vector(rightSide, toAdd.h));
			curSS = toAdd;
			rightSide = curSS.x + curSS.w;
			propsStore.curSSInd = tallestSSInd;		
			tallestSSInd = getTallestSSOnRightSide();
		}
		propsStore.points.push(...curSS.getRightSidePoints());
	};

	const updatePoints = () => {
		const curSS = propsStore.skyscrapers[propsStore.curSSInd];
		const rightSide = curSS.x + curSS.w;
		while(propsStore.checkingSSInd < propsStore.skyscrapers.length) {
			const toCheck = propsStore.skyscrapers[propsStore.checkingSSInd];
			if(toCheck.x > rightSide) {
				const tallestSSInd = getTallestSSOnRightSide();
				if(tallestSSInd === -1) {
					propsStore.points.push(...curSS.getRightSidePoints());
					propsStore.points.push(...toCheck.getLeftSidePoints());
					propsStore.curSSInd = propsStore.checkingSSInd;
				} else {
					propsStore.points.push(new p5.Vector(rightSide, curSS.h));
					propsStore.points.push(new p5.Vector(rightSide, propsStore.skyscrapers[tallestSSInd].h));
					propsStore.curSSInd = tallestSSInd;
				}
				break;
			} else if(toCheck.h > curSS.h) {
				propsStore.points.push(new p5.Vector(toCheck.x, curSS.h));
				propsStore.points.push(new p5.Vector(toCheck.x, toCheck.h));
				propsStore.curSSInd = propsStore.checkingSSInd;
				break;
			}
			propsStore.checkingSSInd++;
		}

		if(propsStore.checkingSSInd === propsStore.skyscrapers.length) {
			addLastPoints();
			propsStore.checkingSSInd++;
			if(propsStore.resetOnFinish) {
				setTimeout(() => propsStore.mustResize = true, 2000);
			}
		}
		propsStore.updateCallbackId = setTimeout(updatePoints, propsStore.updateDelay * 1000);
	};

	useEffect(() => {
		propsStore.updateCallbackId = setTimeout(updatePoints, propsStore.updateDelay * 1000);
		
		return () => {
			clearTimeout(propsStore.updateCallbackId);
		};
	}, []);

	const sketch = useCallback((s: p5) => {
		const createSkyscrapers = () => {
			for(let i = 0; i < propsStore.startCount; ++i) {
				const w = s.lerp(propsStore.minSSWidth, propsStore.maxSSWidth, Math.random());
				const h = s.lerp(propsStore.minSSHeight, propsStore.maxSSHeight, Math.random());
				const x = s.lerp(0, propsStore.width - w, Math.random());
				propsStore.skyscrapers.push(new Skyscraper(x, w, h));
			}
			propsStore.skyscrapers.sort((a, b) => {
				if(a.x === b.x) {
					return a.h - b.h;
				}
				return a.x - b.x;
			});
			propsStore.points.push(...propsStore.skyscrapers[0].getLeftSidePoints());
		};
		
		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};
		
		s.draw = () => {				
			s.background(themeStore.theme.backgroundColor.primary);
			if(propsStore.mustResize) {
				if(s.width !== propsStore.width || s.height != propsStore.height) {
					s.resizeCanvas(propsStore.width, propsStore.height);
				}
				propsStore.mustResize = false;
				propsStore.points = [];
				propsStore.skyscrapers = [];
				propsStore.curSSInd = 0;
				propsStore.checkingSSInd = 0;
				createSkyscrapers();
			}
			s.translate(0, propsStore.height);
			s.scale(1, -1);
			propsStore.skyscrapers.forEach((ss) => ss.draw(s));
			s.stroke(255, 0, 0);
			s.fill(255, 0, 0);
			for(let i = 0; i < propsStore.points.length - 1; ++i) {
				const p1 = propsStore.points[i];
				const p2 = propsStore.points[i + 1];
				s.line(p1.x, p1.y, p2.x, p2.y);
			}
			const last = propsStore.points[propsStore.points.length - 1];
			s.ellipse(last.x, last.y, 10);
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
					<SkyscrapersOptions propsStore={propsStore} onClose={onSettingsClose} />
				</div>
			</CSSTransition>
			<CSSTransition unmountOnExit nodeRef={aboutNodeRef} in={aboutOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={aboutNodeRef} className={styles.animationContainer}>
					<SkyscrapersAbout onClose={() => setAboutOpen(false)} />
				</div>
			</CSSTransition>
		</div>
	);
});

export const SkyscrapersSketchDefaultPropsStore = observable<SkyscrapersSketchPropsStore>({
	name: 'Skyscrapers',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	startCount: 10,
	updateDelay: .3,
	minSSHeight: 10,
	maxSSHeight: 250,
	minSSWidth: 10,
	maxSSWidth: 100,
	skyscrapers: [],
	points: [],
	curSSInd: 0,
	checkingSSInd: 1,
	updateCallbackId: setTimeout(() => {}),
	resetOnFinish: true
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