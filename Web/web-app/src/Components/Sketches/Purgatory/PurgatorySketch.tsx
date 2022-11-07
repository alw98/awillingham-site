import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PurgatoryPropsStore } from 'Models/Sketches/Purgatory/PurgatoryPropsStore';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';

import { BaseSketch } from '../BaseSketch';
import { PurgatoryAbout } from './PurgatoryAbout';
import { PurgatoryOptions } from './PurgatoryOptions';

export interface PurgatorySketchProps {
	themeStore: ThemeStore;
	propsStore: PurgatoryPropsStore;
}

export const PurgatorySketch: React.FC<PurgatorySketchProps> = observer(({ themeStore, propsStore }) => {
	const sketch = useCallback((s: p5) => {
		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				if (s.width !== propsStore.width || s.height != propsStore.height) {
					s.resizeCanvas(propsStore.width, propsStore.height);
				}
			}
		};
	}, []);

	return (
		<BaseSketch
			about={PurgatoryAbout}
			options={PurgatoryOptions}
			sketch={sketch}
			propsStore={propsStore}
			themeStore={themeStore} />
	);
});

export const PurgatorySketchDefaultPropsStore = observable<PurgatoryPropsStore>({
	name: 'Purgatory',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false
});
