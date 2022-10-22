import p5 from 'p5';

import { BaseSketchPropsStore } from '../BaseSketchPropsStore';
import { Skyscraper } from './Skyscraper';

export interface SkyscrapersSketchPropsStore extends BaseSketchPropsStore {
	startCount: number;
	updateDelay: number;
	minSSHeight: number;
	maxSSHeight: number;
	minSSWidth: number;
	maxSSWidth: number;
	resetOnFinish: boolean;
	
	skyscrapers: Skyscraper[];
	points: p5.Vector[];
	curSSInd: number;
	checkingSSInd: number;
	updateCallbackId: NodeJS.Timeout;
}