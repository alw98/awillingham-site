import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { TimesTablesPropsStore } from 'Models/Sketches/TimesTables/TimesTablesPropsStore';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';

import { BaseSketch } from '../BaseSketch';
import { TimesTablesAbout } from './TimesTablesAbout';
import { TimesTablesOptions } from './TimesTablesOptions';
import { drawTables } from './Utils';

export interface TimesTablesSketchProps {
	themeStore: ThemeStore;
	propsStore: TimesTablesPropsStore;
}

export const TimesTablesSketch: React.FC<TimesTablesSketchProps> = observer(({ themeStore, propsStore }) => {
	const sketch = useCallback((s: p5) => {
		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				s.resizeCanvas(propsStore.width, propsStore.height);
				propsStore.mustResize = false;
			}

			drawTables(s, propsStore, themeStore);
		};
	}, []);

	return (
		<BaseSketch
			about={TimesTablesAbout}
			options={TimesTablesOptions}
			sketch={sketch}
			propsStore={propsStore}
			themeStore={themeStore} />
	);
});


export const TimesTablesDefaultPropsStore = observable<TimesTablesPropsStore>({
	name: 'TimesTables',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	tables: [{ x: 0, y: 0, radius: 160, resolution: 100, initialMultiplier: 2, curMultiplier: 2, multiplierChangeRate: .01 }],
	isGallery: false
});


export const TimesTablesDefaultPropsStoreTwo = observable<TimesTablesPropsStore>({
	...toJS(TimesTablesDefaultPropsStore),
	tables: [{ x: 0, y: 0, radius: 160, resolution: 10, initialMultiplier: 2, curMultiplier: 2, multiplierChangeRate: 0 }]
});