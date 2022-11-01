import { Heap } from 'DataStructures/Heap';
import p5 from 'p5';

import { BaseSketchPropsStore } from '../BaseSketchPropsStore';
import { Skyscraper } from './Skyscraper';

export interface SkyscrapersImprovedSketchPropsStore extends BaseSketchPropsStore {
	startCount: number;
	updateDelay: number;
	minSSHeight: number;
	maxSSHeight: number;
	minSSWidth: number;
	maxSSWidth: number;
	resetOnFinish: boolean;
	
	skyscrapers: Skyscraper[];
	ssHeap: Heap<Skyscraper>;
	points: p5.Vector[];
	curSSInd: number;
	checkingSSInd: number;
	updateCallbackId: NodeJS.Timeout;
}