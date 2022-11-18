import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { PurgatoryPropsStore } from 'Models/Sketches/Purgatory/PurgatoryPropsStore';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';
import UpshurEdgeDetected from 'wwwroot/images/UpshurCracked.png';
import FillEdgesFrag from 'wwwroot/shaders/purgatory/fillEdges.frag';
import TexturedRectVert from 'wwwroot/shaders/texturedRect.vert';

import { BaseSketch } from '../BaseSketch';
import { PurgatoryAbout } from './PurgatoryAbout';
import { PurgatoryOptions } from './PurgatoryOptions';

export interface PurgatorySketchProps {
	themeStore: ThemeStore;
	propsStore: PurgatoryPropsStore;
}

export const PurgatorySketch: React.FC<PurgatorySketchProps> = observer(({ themeStore, propsStore }) => {
	const sketch = useCallback((s: p5) => {
		let image: p5.Image;
		let shader: p5.Shader;
		let shaderBuffer: p5.Graphics;

		s.preload = () => {
			image = s.loadImage(UpshurEdgeDetected, () => {
				shader = s.loadShader(TexturedRectVert, FillEdgesFrag, () => {
					shaderBuffer = s.createGraphics(image.width, image.height, s.WEBGL);
				});
			});
		};

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};

		const getSmoothingKernel = () => {
			const result = [];
			const size = 9;
			for(let i = 0; i < size; ++i) {
				result.push(1.0 / size);
			}
			return result;
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				if (s.width !== propsStore.width || s.height != propsStore.height) {
					s.resizeCanvas(propsStore.width, propsStore.height);
				}
			}
			if(shaderBuffer) {
				if(s.frameCount < 5) {
					shader.setUniform('uTexImg', image);
				} else {
					shader.setUniform('uTexImg', shaderBuffer);
				}
				shaderBuffer.shader(shader);
				shader.setUniform('uKernelSize', 3);
				shader.setUniform('uKernel', getSmoothingKernel());
				shader.setUniform('uTexSize', image.width);
				shaderBuffer.rect(0, 0, s.width, s.height);

				s.image(shaderBuffer, 0, 0, s.width, s.height);
			}
			if(propsStore.saveNextFrame) {
				propsStore.saveNextFrame = false;
				shaderBuffer.save();
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
	isGallery: false,
	saveNextFrame: false
});
