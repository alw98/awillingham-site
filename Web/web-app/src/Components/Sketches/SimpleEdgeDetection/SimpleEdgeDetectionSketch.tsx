import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { SimpleEdgeDetectionPropsStore } from 'Models/Sketches/SimpleEdgeDetection/SimpleEdgeDetectionPropsStore';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';
import { detectEdges } from 'Utils/SimpleEdgeDetection';
import SimpleEdgeDetectionTest from 'wwwroot/images/EdgeDetectionTest.png';
import SimpleEdgeDetectionTest1 from 'wwwroot/images/EdgeDetectionTest1.png';

import { BaseSketch } from '../BaseSketch';
import { SimpleEdgeDetectionAbout } from './SimpleEdgeDetectionAbout';
import { SimpleEdgeDetectionOptions } from './SimpleEdgeDetectionOptions';

export interface SimpleEdgeDetectionSketchProps {
	themeStore: ThemeStore;
	propsStore: SimpleEdgeDetectionPropsStore;
}

export const SimpleEdgeDetectionSketch: React.FC<SimpleEdgeDetectionSketchProps> = observer(({ themeStore, propsStore }) => {
	const sketch = useCallback((s: p5) => {
		let image: p5.Image;
		let edgeDetectedImage: p5.Image;

		const getImagePosition = () => {
			const maxWidth = propsStore.width;
			const maxHeight = propsStore.height / 2;
			const aspectRatio = image.width / image.height;
			let width = maxWidth;
			let height = width / aspectRatio;
			if (height > maxHeight) {
				height = maxHeight;
				width = height * aspectRatio;
			}

			const x = (maxWidth - width) / 2;
			const y = (maxHeight - height) / 2;
			return { x, y, width: Math.floor(width), height: Math.floor(height) };
		};

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
	
			image = s.loadImage(propsStore.image, () => {
				edgeDetectedImage = s.createImage(image.width, image.height);
				detectEdges(image, edgeDetectedImage);
			});
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				if (s.width !== propsStore.width || s.height != propsStore.height) {
					s.resizeCanvas(propsStore.width, propsStore.height);
				}
			}

			if(image && edgeDetectedImage) {
				const { x, y, width: scaledWidth, height: scaledHeight } = getImagePosition();
				s.image(image, x, y, scaledWidth, scaledHeight);
				s.image(edgeDetectedImage, x, y + propsStore.height / 2, scaledWidth, scaledHeight);
				s.line(0, propsStore.height / 2, propsStore.width, propsStore.height / 2);
			}
		};
	}, []);

	return (
		<BaseSketch
			about={SimpleEdgeDetectionAbout}
			options={SimpleEdgeDetectionOptions}
			propsStore={propsStore}
			themeStore={themeStore}
			sketch={sketch} />
	);
});

export const SimpleEdgeDetectionDefaultPropsStore = observable<SimpleEdgeDetectionPropsStore>({
	name: 'SimpleSimpleEdgeDetection',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	image: SimpleEdgeDetectionTest
});

export const SimpleEdgeDetectionAgatePropsStore = observable<SimpleEdgeDetectionPropsStore>({
	...toJS(SimpleEdgeDetectionDefaultPropsStore),
	name: 'AgateSimpleEdgeDetection',
	image: SimpleEdgeDetectionTest1
});