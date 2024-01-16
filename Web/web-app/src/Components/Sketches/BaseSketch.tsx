import { useValueForTheme } from 'Hooks/useValueForTheme';
import { useWindowSize } from 'Hooks/useWindowSize';
import { observer } from 'mobx-react';
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';
import { Theme } from 'Models/Theme';
import p5 from 'p5';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createUseStyles } from 'react-jss';
import { CSSTransition } from 'react-transition-group';
import { ThemeStore } from 'Stores/ThemeStore';
import GearboxDark from 'wwwroot/images/GearAnimationDark.gif';
import GearboxLight from 'wwwroot/images/GearAnimationLight.gif';


export interface BaseOptionsProps {
	onClose: () => void;
	propsStore: BaseSketchPropsStore;
}

export interface BaseAboutProps {
	onClose: () => void;
}

export interface BaseSketchProps {
	propsStore: BaseSketchPropsStore;
	themeStore: ThemeStore;
	options?: React.ComponentType<BaseOptionsProps>;
	about?: React.ComponentType<BaseAboutProps>;
	sketch: (s: p5) => void;
}


export const BaseSketch: React.FC<BaseSketchProps> = observer((props) => {
	const styles = useStyles();
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [aboutOpen, setAboutOpen] = useState(false);
	const settingsNodeRef = useRef(null);
	const aboutNodeRef = useRef(null);
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const gearbox = useValueForTheme(GearboxDark, GearboxLight, props.themeStore.theme);

	useLayoutEffect(() => {
		if (p5ContainerRef.current) {
			const p5Instance = new p5(props.sketch, p5ContainerRef.current);
			const baseDraw = p5Instance.draw;

			p5Instance.draw = () => {
				if (props.propsStore.mustResize) {
					if (p5Instance.width !== props.propsStore.width || p5Instance.height != props.propsStore.height) {
						p5Instance.resizeCanvas(props.propsStore.width, props.propsStore.height);
					}
				}

				baseDraw();

				props.propsStore.mustResize = false;
			}

			return () => {
				p5Instance.remove();
				setTimeout(() => p5Instance.remove(), 100);
			};
		}
	}, []);

	useLayoutEffect(() => {
		if (!props.propsStore.isGallery) {
			props.propsStore.height = p5ContainerRef.current.clientHeight;
			props.propsStore.width = p5ContainerRef.current.clientWidth;
		}
		props.propsStore.mustResize = true;
	}, [windowWidth, windowHeight, props.propsStore.isGallery, p5ContainerRef]);

	const onSettingsClick = () => {
		setSettingsOpen(true);
	};

	const onSettingsClose = () => {
		setSettingsOpen(false);
	};

	return (
		<div className={styles.sketch} ref={p5ContainerRef} >
			{
				!props.propsStore.isGallery &&
				<>
					{props.about && <div className={styles.aboutContainer} onClick={() => setAboutOpen(true)}>About</div>}
					{
						props.options && <div className={styles.settingsContainer}>
							<img
								src={gearbox}
								className={styles.settings}
								alt={'Settings'}
								onClick={onSettingsClick} />
							settings
						</div>
					}
				</>
			}

			<CSSTransition unmountOnExit nodeRef={settingsNodeRef} in={settingsOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={settingsNodeRef} className={styles.animationContainer}>
					{props.options && <props.options onClose={onSettingsClose} propsStore={props.propsStore} />}
				</div>
			</CSSTransition>
			<CSSTransition unmountOnExit nodeRef={aboutNodeRef} in={aboutOpen} timeout={500} classNames={{
				enter: styles.optionsEnter,
				enterActive: styles.optionsEnterActive,
				exit: styles.optionsExit,
				exitActive: styles.optionsExitActive
			}} >
				<div ref={aboutNodeRef} className={styles.animationContainer}>
					{props.about && <props.about onClose={() => setAboutOpen(false)} />}
				</div>
			</CSSTransition>
		</div>
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