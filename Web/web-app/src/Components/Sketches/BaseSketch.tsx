import { observer, useLocalObservable } from 'mobx-react';
import p5 from 'p5';
import React, { useCallback, useEffect, useRef } from 'react';
import { createUseStyles } from 'react-jss';
import { ThemeStore } from 'Stores/ThemeStore';

export interface BaseSketchProps {
	themeStore: ThemeStore
}


export const BaseSketch: React.FC<BaseSketchProps> = observer(({themeStore}) => {
	const styles = useStyles();
	const p5ContainerRef = useRef();
	const localStore = useLocalObservable(() => ({radius: 200}));

	const sketch = useCallback((s: p5) => {
		s.setup = () => {
			s.createCanvas(400, 400);
		};
		
		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			s.circle(200, 200, localStore.radius);
			localStore.radius++;
		};
	}, []);

	useEffect(() => {
		if(p5ContainerRef.current){
			const p5Instance = new p5(sketch, p5ContainerRef.current);
			return () => {
				p5Instance.remove();
			};
		}
	}, [p5ContainerRef.current, sketch]);
	
	return (
		<>	
			<input placeholder='Enter a radius' onChange={(evt) => localStore.radius = Number.parseInt(evt.target.value)} />
			<span>{localStore.radius}</span>
			<div className={styles.sketch} ref={p5ContainerRef} />
		</>
	);
});

const useStyles = createUseStyles({
	sketch: {
		width: '100%',
		height: '100%'
	}
});