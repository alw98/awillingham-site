import { Heap } from 'DataStructures/Heap';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Skyscraper } from 'Models/Sketches/SkyscrapersImproved/Skyscraper';
import { SkyscrapersImprovedSketchPropsStore } from 'Models/Sketches/SkyscrapersImproved/SkyscrapersSketchPropsStore';
import p5 from 'p5';
import React, { useCallback, useEffect } from 'react';
import { ThemeStore } from 'Stores/ThemeStore';

import { BaseSketch } from '../BaseSketch';
import { SkyscrapersImprovedAbout } from './SkyscrapersImprovedAbout';
import { SkyscrapersImprovedOptions } from './SkyscrapersImprovedOptions';

export interface SkyscrapersSketchProps {
	themeStore: ThemeStore;
	propsStore: SkyscrapersImprovedSketchPropsStore;
}

export const SkyscrapersImprovedSketch: React.FC<SkyscrapersSketchProps> = observer(({ themeStore, propsStore }) => {
	const addLastPoints = () => {
		let cur = propsStore.ssHeap.pop();
		while (!propsStore.ssHeap.isEmpty()) {
			const curRight = cur.x + cur.w;
			const next = propsStore.ssHeap.pop();
			const nextRight = next.x + next.w;
			if (nextRight > curRight) {
				propsStore.points.push(new p5.Vector(curRight, cur.h));
				propsStore.points.push(new p5.Vector(curRight, next.h));
				cur = next;
			}
		}

		propsStore.points.push(...cur.getRightSidePoints());
	};

	const addNewSkyScraperThatIntersects = (toAdd: Skyscraper, tallest: Skyscraper) => {
		//add to the heap, move up if needed
		propsStore.ssHeap.push(toAdd);
		if (toAdd.h > tallest.h) {
			propsStore.points.push(new p5.Vector(toAdd.x, tallest.h));
			propsStore.points.push(new p5.Vector(toAdd.x, toAdd.h));
		}
		propsStore.curSSInd++;
	};

	const addNewSkyScraperThatDoesntIntersect = () => {
		const tallest = propsStore.ssHeap.pop();
		const tallestRight = tallest.x + tallest.w;
		//move down
		let nextTallest = tallest;
		let nextTallestRight = nextTallest.x + nextTallest.w;
		while (!propsStore.ssHeap.isEmpty() && nextTallestRight <= tallestRight) {
			nextTallest = propsStore.ssHeap.pop();
			nextTallestRight = nextTallest.x + nextTallest.w;
		}

		if (nextTallest === tallest || nextTallestRight <= tallestRight) {
			//straight down to ground
			propsStore.points.push(new p5.Vector(tallestRight, tallest.h));
			propsStore.points.push(new p5.Vector(tallestRight, 0));
		} else {
			//down to next tallest		
			propsStore.points.push(new p5.Vector(tallestRight, tallest.h));
			propsStore.points.push(new p5.Vector(tallestRight, nextTallest.h));
			propsStore.ssHeap.push(nextTallest);
		}
	};

	const updatePoints = () => {
		propsStore.updateCallbackId = setTimeout(updatePoints, propsStore.updateDelay * 1000);
		if (propsStore.curSSInd >= propsStore.skyscrapers.length) {
			if (propsStore.ssHeap.isEmpty()) {
				return;
			} else {
				addLastPoints();
				if (propsStore.resetOnFinish) {
					setTimeout(() => propsStore.mustResize = true, 2000);
				}
				return;
			}
		}

		const toAdd = propsStore.skyscrapers[propsStore.curSSInd];
		if (propsStore.ssHeap.isEmpty()) {
			//Add the first skyscraper
			propsStore.points.push(...toAdd.getLeftSidePoints());
			propsStore.ssHeap.push(toAdd);
			propsStore.curSSInd++;
			return;
		}

		const tallest = propsStore.ssHeap.peek();
		const tallestRight = tallest.x + tallest.w;
		if (tallestRight > toAdd.x) {
			addNewSkyScraperThatIntersects(toAdd, tallest);
		} else {
			addNewSkyScraperThatDoesntIntersect();
		}

	};

	useEffect(() => {
		propsStore.updateCallbackId = setTimeout(updatePoints, propsStore.updateDelay * 1000);

		return () => {
			clearTimeout(propsStore.updateCallbackId);
		};
	}, []);

	const sketch = useCallback((s: p5) => {
		const createSkyscrapers = () => {
			for (let i = 0; i < propsStore.startCount; ++i) {
				const w = s.lerp(propsStore.minSSWidth, propsStore.maxSSWidth, Math.random());
				const h = s.lerp(propsStore.minSSHeight, propsStore.maxSSHeight, Math.random());
				const x = s.lerp(0, propsStore.width - w, Math.random());
				propsStore.skyscrapers.push(new Skyscraper(x, w, h));
			}

			propsStore.skyscrapers.sort((a, b) => {
				if (a.x === b.x) {
					return a.h - b.h;
				}
				return a.x - b.x;
			});
		};

		s.setup = () => {
			s.createCanvas(propsStore.width, propsStore.height);
		};

		s.draw = () => {
			s.background(themeStore.theme.backgroundColor.primary);
			if (propsStore.mustResize) {
				if (s.width !== propsStore.width || s.height != propsStore.height) {
					s.resizeCanvas(propsStore.width, propsStore.height);
				}
				propsStore.mustResize = false;
				propsStore.points = [];
				propsStore.skyscrapers = [];
				propsStore.curSSInd = 0;
				propsStore.checkingSSInd = 0;
				createSkyscrapers();
			}
			s.translate(0, propsStore.height);
			s.scale(1, -1);
			propsStore.skyscrapers.forEach((ss) => ss.draw(s));
			s.stroke(255, 0, 0);
			s.fill(255, 0, 0);
			for (let i = 0; i < propsStore.points.length - 1; ++i) {
				const p1 = propsStore.points[i];
				const p2 = propsStore.points[i + 1];
				s.line(p1.x, p1.y, p2.x, p2.y);
			}
			const last = propsStore.points[propsStore.points.length - 1];
			s.ellipse(last?.x, last?.y, 10);
		};
	}, []);

	return (
		<BaseSketch
			about={SkyscrapersImprovedAbout}
			options={SkyscrapersImprovedOptions}
			sketch={sketch}
			themeStore={themeStore}
			propsStore={propsStore} />
	);
});

export const SkyscrapersImprovedSketchDefaultPropsStore = observable<SkyscrapersImprovedSketchPropsStore>({
	name: 'SkyscrapersImproved',
	backgroundColor: '',
	width: 320,
	height: 320,
	mustResize: false,
	isGallery: false,
	startCount: 10,
	updateDelay: .1,
	minSSHeight: 10,
	maxSSHeight: 250,
	minSSWidth: 10,
	maxSSWidth: 100,
	skyscrapers: [],
	ssHeap: new Heap<Skyscraper>(),
	points: [],
	curSSInd: 0,
	checkingSSInd: 1,
	updateCallbackId: setTimeout(() => { }),
	resetOnFinish: true
});
