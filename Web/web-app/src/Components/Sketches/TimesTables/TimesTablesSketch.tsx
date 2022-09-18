import { useWindowSize } from 'Hooks/useWindowSize';
import { observable } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import { TimesTablesPropsStore } from 'Models/Sketches/TimesTables/TimesTablesPropsStore';
import p5 from 'p5';
import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { ThemeStore } from 'Stores/ThemeStore';

import { drawTables } from './Utils';

export interface TimesTablesSketchProps {
	themeStore: ThemeStore;
	propsStore?: TimesTablesPropsStore;
}

export const TimesTablesDefaultPropsStore: TimesTablesPropsStore = observable({
	name: 'TimesTables',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	tables: [{x: 0, y: 0, radius: 160, resolution: 100, multiplier: 2}],
	isGallery: true
});

export const TimesTablesSketch: React.FC<TimesTablesSketchProps> = observer(({themeStore, propsStore}) => {
	const styles = useStyles();
	const p5ContainerRef = useRef<HTMLDivElement>();
	const [windowWidth, windowHeight] = useWindowSize(250);
	const localStore: TimesTablesPropsStore = propsStore ?? useLocalObservable(() => ({
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

			drawTables(s, localStore);
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
		<>
			<div className={styles.sketch} ref={p5ContainerRef} />
		</>
	);
});

const useStyles = createUseStyles({
	sketch: {
		overflow: 'hidden',
		height: '100%'
	}
});