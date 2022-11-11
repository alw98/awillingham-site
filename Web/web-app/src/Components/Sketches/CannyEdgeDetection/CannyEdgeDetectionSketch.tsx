import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { CannyEdgeDetectionPropsStore } from 'Models/Sketches/CannyEdgeDetection/CannyEdgeDetectionPropsStore';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';
import { detectEdges } from 'Utils/CannyEdgeDetection';
import CannyEdgeDetectionTest from 'wwwroot/images/EdgeDetectionTest.png';
import CannyEdgeDetectionTest1 from 'wwwroot/images/EdgeDetectionTest1.png';
import ApplyKernelFrag from 'wwwroot/shaders/applyKernel.frag';
import ApplySobelKernelFrag from 'wwwroot/shaders/applySobelKernel.frag';
import TexturedRectVert from 'wwwroot/shaders/texturedRect.vert';

import { BaseSketch } from '../BaseSketch';
import { CannyEdgeDetectionAbout } from './CannyEdgeDetectionAbout';
import { CannyEdgeDetectionOptions } from './CannyEdgeDetectionOptions';

export interface CannyEdgeDetectionSketchProps {
	themeStore: ThemeStore;
	propsStore: CannyEdgeDetectionPropsStore;
}

export const CannyEdgeDetectionSketch: React.FC<CannyEdgeDetectionSketchProps> = observer(({ themeStore, propsStore }) => {
	const sketch = useCallback((s: p5) => {
		let image: p5.Image;
		let smoothingShader: p5.Shader;
		let smoothedBuffer: p5.Graphics;
		let gradientsShader: p5.Shader;
		let gradientsBuffer: p5.Graphics;
		let edgeDetectedImage: p5.Image;

		const getSmoothingKernel = () => {
			const result = [];
			const size = propsStore.smoothingKernelSize * propsStore.smoothingKernelSize;
			for(let i = 0; i < size; ++i) {
				result.push(1.0 / size);
			}
			return result;
		};

		const smoothImage = (buffer: p5.Graphics) => {
			buffer.shader(smoothingShader);
			const smoothingKernel = getSmoothingKernel();
			smoothingShader.setUniform('uTexImg', image);
			smoothingShader.setUniform('uKernelSize', propsStore.smoothingKernelSize);
			smoothingShader.setUniform('uKernel', smoothingKernel);
			smoothingShader.setUniform('uTexSize', s.width);
			smoothedBuffer.rect(0, 0, s.width, s.height);
		};

		const takeImageGradient = (input: p5.Graphics, output: p5.Graphics) => {
			output.shader(gradientsShader);
			gradientsShader.setUniform('uTexImg', input);
			gradientsShader.setUniform('uTexSize', input.width);
			gradientsBuffer.rect(0, 0, s.width, s.height);
		};

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
			s.pixelDensity(1);
			image = s.loadImage(propsStore.image, () => {
				edgeDetectedImage = s.createImage(image.width, image.height);
				detectEdges(image, edgeDetectedImage);
				smoothingShader = s.loadShader(TexturedRectVert, ApplyKernelFrag, () => {
					smoothedBuffer = s.createGraphics(image.width, image.height, s.WEBGL);
				});

				gradientsShader = s.loadShader(TexturedRectVert, ApplySobelKernelFrag, () => {
					gradientsBuffer = s.createGraphics(image.width, image.height, s.WEBGL);
				});
			});
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				if (s.width !== propsStore.width || s.height != propsStore.height) {
					s.resizeCanvas(propsStore.width, propsStore.height);
				}
			}
			if(smoothedBuffer && gradientsBuffer) {
				smoothImage(smoothedBuffer);
				takeImageGradient(smoothedBuffer, gradientsBuffer);

				s.image(image, 0, 0, s.width / 2, s.height / 2);
				s.image(smoothedBuffer, s.width / 2, 0, s.width / 2, s.height / 2);
				s.image(gradientsBuffer, 0, s.height / 2, s.width / 2, s.height / 2);
				// const { x, y, width: scaledWidth, height: scaledHeight } = getImagePosition();
				// s.image(image, x, y, scaledWidth, scaledHeight);
				// s.image(edgeDetectedImage, x, y + propsStore.height / 2, scaledWidth, scaledHeight);
				// s.line(0, propsStore.height / 2, propsStore.width, propsStore.height / 2);
			}
		};
	}, []);

	return (
		<BaseSketch
			about={CannyEdgeDetectionAbout}
			options={CannyEdgeDetectionOptions}
			propsStore={propsStore}
			themeStore={themeStore}
			sketch={sketch} />
	);
});

export const CannyEdgeDetectionDefaultPropsStore = observable<CannyEdgeDetectionPropsStore>({
	name: 'SimpleCannyEdgeDetection',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	image: CannyEdgeDetectionTest,
	smoothingKernelSize: 3
});

export const CannyEdgeDetectionAgatePropsStore = observable<CannyEdgeDetectionPropsStore>({
	...toJS(CannyEdgeDetectionDefaultPropsStore),
	name: 'AgateCannyEdgeDetection',
	image: CannyEdgeDetectionTest1
});