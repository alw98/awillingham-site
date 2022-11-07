import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { EdgeDetectionPropsStore } from 'Models/Sketches/EdgeDetection/EdgeDetectionPropsStore';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';

import { BaseSketch } from '../BaseSketch';
import { EdgeDetectionAbout } from './EdgeDetectionAbout';
import { EdgeDetectionOptions } from './EdgeDetectionOptions';

export interface EdgeDetectionSketchProps {
	themeStore: ThemeStore;
	propsStore: EdgeDetectionPropsStore;
}

export const EdgeDetectionSketch: React.FC<EdgeDetectionSketchProps> = observer(({ themeStore, propsStore }) => {
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
			about={EdgeDetectionAbout}
			options={EdgeDetectionOptions}
			propsStore={propsStore}
			themeStore={themeStore}
			sketch={sketch} />
	);
});

export const EdgeDetectionDefaultPropsStore = observable<EdgeDetectionPropsStore>({
	name: 'EdgeDetection',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false
});
