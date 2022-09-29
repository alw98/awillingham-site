import { useValueForTheme } from 'Hooks/useValueForTheme';
import { useWindowSize } from 'Hooks/useWindowSize';
import { observable, toJS } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { TimesTablesPropsStore } from 'Models/Sketches/TimesTables/TimesTablesPropsStore';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { ThemeStore } from 'Stores/ThemeStore';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';

import { TimesTablesAbout } from './TimesTableAbout';
import { TimesTablesOptions } from './TimesTablesOptions';
import { drawTables } from './Utils';

export interface TimesTablesSketchProps {
	themeStore: ThemeStore;
	propsStore?: TimesTablesPropsStore;
}

export const TimesTablesSketch: React.FC<TimesTablesSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	const settingsNodeRef = useRef(null);
	const aboutNodeRef = useRef(null);
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const gearbox = useValueForTheme(GearboxDark, GearboxLight, themeStore.theme);
	const localStore = propsStore ?? useLocalObservable<TimesTablesPropsStore>(() => ({
		...TimesTablesDefaultPropsStore,
		isGallery: false
	}));

	const sketch = useCallback((s: p5) => {
		s.setup = () => {
			s.createCanvas(localStore.width, localStore.height);
		};
		
		s.draw = () => {				
			s.background(themeStore.theme.backgroundColor.primary);
			if(localStore.mustResize) {
				s.resizeCanvas(localStore.width, localStore.height);
				localStore.mustResize = false;
			}

			drawTables(s, localStore, themeStore);
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

	const onSettingsClick = () => {
		setSettingsOpen(true);
	};

	const onSettingsClose = () => {
		setSettingsOpen(false);
	};
	return (
		<div className={styles.sketch} ref={p5ContainerRef} >
			{ !localStore.isGallery && 
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
					<TimesTablesOptions propsStore={localStore} onClose={onSettingsClose} />
				</div>
			</CSSTransition>
			<CSSTransition unmountOnExit nodeRef={aboutNodeRef} in={aboutOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={aboutNodeRef} className={styles.animationContainer}>
					<TimesTablesAbout onClose={() => setAboutOpen(false)} />
				</div>
			</CSSTransition>
		</div>
	);
});


export const TimesTablesDefaultPropsStore = observable<TimesTablesPropsStore>({
	name: 'TimesTables',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	tables: [{x: 0, y: 0, radius: 160, resolution: 100, initialMultiplier: 2, curMultiplier: 2, multiplierChangeRate: .01}],
	isGallery: true
});


export const TimesTablesDefaultPropsStoreTwo = observable<TimesTablesPropsStore>({
	...toJS(TimesTablesDefaultPropsStore),
	tables: [{x: 0, y: 0, radius: 160, resolution: 10, initialMultiplier: 2, curMultiplier: 2, multiplierChangeRate: 0}]
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