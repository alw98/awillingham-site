import { BaseSketchPropsStore } from '../BaseSketchPropsStore';
import { SinFunction } from './SineFunction';

export interface SinSumSketchPropsStore extends BaseSketchPropsStore {
	functions: SinFunction[];
	drawn: {x: number, y: number}[];
	speed: number;
	step: number;
}