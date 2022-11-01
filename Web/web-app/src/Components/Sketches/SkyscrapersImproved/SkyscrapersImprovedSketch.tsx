import { Heap } from 'DataStructures/Heap';
import { useValueForTheme } from 'Hooks/useValueForTheme';
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Skyscraper } from 'Models/Sketches/SkyscrapersImproved/Skyscraper';
import { SkyscrapersImprovedSketchPropsStore } from 'Models/Sketches/SkyscrapersImproved/SkyscrapersSketchPropsStore';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { ThemeStore } from 'Stores/ThemeStore';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';

import { SkyscrapersImprovedAbout } from './SkyscrapersImprovedAbout';
import { SkyscrapersImprovedOptions } from './SkyscrapersImprovedOptions';

export interface SkyscrapersSketchProps {
	themeStore: ThemeStore;
	propsStore: SkyscrapersImprovedSketchPropsStore;
}

export const SkyscrapersImprovedSketch: React.FC<SkyscrapersSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	const settingsNodeRef = useRef(null);
	const aboutNodeRef = useRef(null);
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const gearbox = useValueForTheme(GearboxDark, GearboxLight, themeStore.theme);

	const addLastPoints = () => {
		let cur = propsStore.ssHeap.pop();
		while(!propsStore.ssHeap.isEmpty()) {
			const curRight = cur.x + cur.w;
			const next = propsStore.ssHeap.pop();
			const nextRight = next.x + next.w;
			if(nextRight > curRight) {
				propsStore.points.push(new p5.Vector(curRight, cur.h));
				propsStore.points.push(new p5.Vector(curRight, next.h));
				cur = next;
			}
		}

		propsStore.points.push(...cur.getRightSidePoints());
	};

	const addNewSkyScraperThatIntersects = (toAdd: Skyscraper, tallest: Skyscraper) => {
		//add to the heap, move up if needed
		propsStore.ssHeap.push(toAdd);
		if(toAdd.h > tallest.h) {
			propsStore.points.push(new p5.Vector(toAdd.x, tallest.h));
			propsStore.points.push(new p5.Vector(toAdd.x, toAdd.h));
		}
		propsStore.curSSInd++;
	};

	const addNewSkyScraperThatDoesntIntersect = () => {
		const tallest = propsStore.ssHeap.pop();
		const tallestRight = tallest.x + tallest.w;
		//move down
		let nextTallest = tallest;
		let nextTallestRight = nextTallest.x + nextTallest.w;
		while(!propsStore.ssHeap.isEmpty() && nextTallestRight <= tallestRight) {
			nextTallest = propsStore.ssHeap.pop();			
			nextTallestRight = nextTallest.x + nextTallest.w;
		}

		if(nextTallest === tallest || nextTallestRight <= tallestRight) {
			//straight down to ground
			propsStore.points.push(new p5.Vector(tallestRight, tallest.h));
			propsStore.points.push(new p5.Vector(tallestRight, 0));
		} else {
			//down to next tallest		
			propsStore.points.push(new p5.Vector(tallestRight, tallest.h));
			propsStore.points.push(new p5.Vector(tallestRight, nextTallest.h));
			propsStore.ssHeap.push(nextTallest);
		}
	};

	const updatePoints = () => {	
		propsStore.updateCallbackId = setTimeout(updatePoints, propsStore.updateDelay * 1000);
		if(propsStore.curSSInd >= propsStore.skyscrapers.length) {
			if (propsStore.ssHeap.isEmpty()) {
				return;
			} else {
				addLastPoints();
				if(propsStore.resetOnFinish) {
					setTimeout(() => propsStore.mustResize = true, 2000);
				}
				return;
			}
		}

		const toAdd = propsStore.skyscrapers[propsStore.curSSInd];
		if(propsStore.ssHeap.isEmpty()) {
			//Add the first skyscraper
			propsStore.points.push(...toAdd.getLeftSidePoints());
			propsStore.ssHeap.push(toAdd);
			propsStore.curSSInd++;
			return;
		}

		const tallest = propsStore.ssHeap.peek();
		const tallestRight = tallest.x + tallest.w;
		if(tallestRight > toAdd.x) {
			addNewSkyScraperThatIntersects(toAdd, tallest);
		} else {
			addNewSkyScraperThatDoesntIntersect();
		}

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
			s.ellipse(last?.x, last?.y, 10);
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
					<SkyscrapersImprovedOptions propsStore={propsStore} onClose={onSettingsClose} />
				</div>
			</CSSTransition>
			<CSSTransition unmountOnExit nodeRef={aboutNodeRef} in={aboutOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={aboutNodeRef} className={styles.animationContainer}>
					<SkyscrapersImprovedAbout onClose={() => setAboutOpen(false)} />
				</div>
			</CSSTransition>
		</div>
	);
});

export const SkyscrapersImprovedSketchDefaultPropsStore = observable<SkyscrapersImprovedSketchPropsStore>({
	name: 'SkyscrapersImproved',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	startCount: 10,
	updateDelay: .1,
	minSSHeight: 10,
	maxSSHeight: 250,
	minSSWidth: 10,
	maxSSWidth: 100,
	skyscrapers: [],
	ssHeap: new Heap<Skyscraper>(),
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