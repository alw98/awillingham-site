import { BaseSketchPropsStore } from '../BaseSketchPropsStore';

export interface CannyEdgeDetectionPropsStore extends BaseSketchPropsStore {
	image: string;
	smoothingKernelSize: number;
	upperEdgeThreshold: number;
	lowerEdgeThreshold: number;
	lightnessBound: number;
	useBilateralSmoothing: boolean;
}