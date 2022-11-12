import { BaseSketchPropsStore } from '../BaseSketchPropsStore';

export interface CannyEdgeDetectionPropsStore extends BaseSketchPropsStore {
	image: string;
	smoothingKernelSize: number;
	edgeThreshold: number;
	lightnessBound: number;
	useBilateralSmoothing: boolean;
}