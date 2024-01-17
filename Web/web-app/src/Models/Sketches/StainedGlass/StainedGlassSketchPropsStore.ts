import { BaseSketchPropsStore } from "../BaseSketchPropsStore";


export interface StainedGlassSketchPropsStore extends BaseSketchPropsStore {
    // Grid params
    showGrid: boolean;
    gridCellWidth: number;
    gridCellHeight: number;

    // Strip (glass strips) params
    stripCount: number;
    stripDeltaTheta: number;
    minStripWidth: number;
    maxStripWidth: number;
    minStripDist: number;
    maxStripDist: number;
    averageStripDistPct: number;
}