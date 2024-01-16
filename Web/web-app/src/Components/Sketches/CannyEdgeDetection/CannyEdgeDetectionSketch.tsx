import { observable, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { CannyEdgeDetectionPropsStore } from 'Models/Sketches/CannyEdgeDetection/CannyEdgeDetectionPropsStore';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';
import CannyEdgeDetectionTest from 'wwwroot/images/EdgeDetectionTest.png';
import CannyEdgeDetectionTest1 from 'wwwroot/images/EdgeDetectionTest1.png';
import CannyEdgeDetectionFrag from 'wwwroot/shaders/edgedetection/cannyEdgeDetection.frag';
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
		let edgeDetectedImage: p5.Image;
		
		const makeGaussianKernel = (sigma: number): number[] => {
			let sum = 0;
			const kernel = [0, 0, 0, 0, 0, 0, 0, 0, 0];
			for (let i = 0; i < 3; i++) {
			  for (let j = 0; j < 3; j++) {
					kernel[i * 3 + j] = Math.exp(-(Math.pow(i - 1, 2) + Math.pow(j - 1, 2)) / (2 * Math.pow(sigma, 2)));
					sum += kernel[i * 3 + j];
			  }
			}
			// Normalize the kernel by dividing each element by the sum of the kernel elements
			for (let i = 0; i < 9; i++) {
			  kernel[i] /= sum;
			}
			return kernel;
		};

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height, s.WEBGL);
			
			image = s.loadImage(propsStore.image, () => {
				edgeDetectedImage = s.createImage(image.width, image.height);

				// Create a p5.Shader object for Canny edge detection
				const edgeDetectionShader = s.createShader(TexturedRectVert, CannyEdgeDetectionFrag);

				// Set the Gaussian kernel as a uniform for the shader
				const kernel = makeGaussianKernel(propsStore.sigma);
				const edgeDetectedGraphics = s.createGraphics(image.width, image.height, s.WEBGL);

				edgeDetectionShader.setUniform('gaussian_kernel', kernel);

				// Apply the shader to the image
				edgeDetectionShader.setUniform('tex0', image);
				edgeDetectionShader.setUniform('low_threshold', propsStore.lowerEdgeThreshold);
				edgeDetectionShader.setUniform('high_threshold', propsStore.upperEdgeThreshold);
				edgeDetectedGraphics.shader(edgeDetectionShader);
				edgeDetectedGraphics.copy(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);
			});
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);

			if (image && edgeDetectedImage) {
				s.translate(-s.width / 2, -s.height / 2);
				// Draw the original image on the left half of the canvas
				s.image(image, 0, 0, s.width / 2, s.height);

				// Draw the edge-detected image on the right half of the canvas
				s.image(edgeDetectedImage, s.width / 2, 0, s.width / 2, s.height);
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
	smoothingKernelSize: 9,
	useBilateralSmoothing: false,
	upperEdgeThreshold: 2.5,
	lowerEdgeThreshold: 1,
	lightnessBound: 66,
	saveNextFrame: false,
	sigma: .2
});

export const CannyEdgeDetectionAgatePropsStore = observable<CannyEdgeDetectionPropsStore>({
	...toJS(CannyEdgeDetectionDefaultPropsStore),
	name: 'AgateCannyEdgeDetection',
	image: CannyEdgeDetectionTest1
});