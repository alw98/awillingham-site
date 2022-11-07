
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';
import p5 from 'p5';
import React, { useCallback } from 'react';
import { getRandomColor } from 'Themes/ColorPalletes';
import DVDLogo from 'wwwroot/images/DVDLogo.png';

import { BaseSketch, BaseSketchProps } from '../BaseSketch';

export const BouncyDVDSketchDefaultPropsStore = observable<BaseSketchPropsStore>({
	name: 'BouncyDVD',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false
});

export const BouncyDVDSketch: React.FC<BaseSketchProps> = observer(({ themeStore, propsStore }) => {
	const sketch = useCallback((s: p5) => {
		const dvdLogo = s.loadImage(DVDLogo);
		const aspectRatio = .5;
		let vx = (Math.random() * 5 + 3) * propsStore.width / 500;
		let vy = (Math.random() * 5 + 3) * propsStore.height / 500;
		const imageWidth = propsStore.width / 6;
		const imageHeight = propsStore.width / 6 * aspectRatio;
		let x = Math.random() * propsStore.width - imageWidth;
		let y = Math.random() * propsStore.height - imageHeight;
		let color = getRandomColor();

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				s.resizeCanvas(propsStore.width, propsStore.height);
				propsStore.mustResize = false;
			}
			const imageWidth = propsStore.width / 6;
			const imageHeight = propsStore.width / 6 * aspectRatio;
			s.stroke(themeStore.theme.accentColor.primary);
			s.noFill();
			s.rect(0, 0, propsStore.width, propsStore.height);
			s.tint(color);
			s.image(dvdLogo, x, y, imageWidth, imageHeight);
			x += vx;
			y += vy;
			if (x < 0) {
				x = -x;
				vx = -vx;
				color = getRandomColor();
			} else if (x + imageWidth > propsStore.width) {
				vx = -vx;
				color = getRandomColor();
			}
			if (y < 0) {
				y = -y;
				vy = -vy;
				color = getRandomColor();
			} else if (y + imageHeight > propsStore.height) {
				vy = -vy;
				color = getRandomColor();
			}
		};
	}, []);

	return (
		<BaseSketch sketch={sketch} propsStore={propsStore} themeStore={themeStore} />
	);
});
