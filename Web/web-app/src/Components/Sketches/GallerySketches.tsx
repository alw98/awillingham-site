
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';
import { ThemeStore } from 'Stores/ThemeStore';

import { BouncyDVDSketch, BouncyDVDSketchDefaultPropsStore } from './BouncyDVD/BouncyDVDSketch';
import { CannyEdgeDetectionAgatePropsStore, CannyEdgeDetectionSketch } from './CannyEdgeDetection/CannyEdgeDetectionSketch';
import { FireworksSketch, FireworksSketchDefaultPropsStore } from './Fireworks/FireworksSketch';
import { ParticleFieldSketch, ParticleFieldSketchDefaultPropsStore, ParticleFieldSketchDefaultPropsStoreThree, ParticleFieldSketchDefaultPropsStoreTwo } from './ParticleField/ParticleFieldSketch';
import { SimpleEdgeDetectionAgatePropsStore, SimpleEdgeDetectionDefaultPropsStore, SimpleEdgeDetectionSketch } from './SimpleEdgeDetection/SimpleEdgeDetectionSketch';
import { SinSumSketch, SinSumSketchDefaultPropsStore, SinSumSketchDefaultPropsStoreTwo } from './SinSum/SinSumSketch';
import { SkyscrapersImprovedSketch, SkyscrapersImprovedSketchDefaultPropsStore } from './SkyscrapersImproved/SkyscrapersImprovedSketch';
import { TimesTablesDefaultPropsStore, TimesTablesDefaultPropsStoreTwo, TimesTablesSketch } from './TimesTables/TimesTablesSketch';
import { SnowGlobeDefaultPropsStore, SnowGlobeSketch } from './SnowGlobe/SnowGlobeSketch';
import { StainedGlassDefaultPropsStore, StainedGlassSketch } from './StainedGlass/StainedGlassSketch';
import { TetrisDefaultPropsStore, TetrisSketch } from './Tetris/TetrisSketch';

interface MinimumSketchProps {
	propsStore: BaseSketchPropsStore;
	themeStore: ThemeStore;
}

interface GallerySketch {
	sketch: React.ComponentType<MinimumSketchProps>;
	propsStore: BaseSketchPropsStore;
}

export const GallerySketches: GallerySketch[] = [
	// {
	// 	sketch: PurgatorySketch,
	// 	propsStore: PurgatoryDefaultPropsStore
	// },
	// {
	// 	sketch: CannyEdgeDetectionSketch,
	// 	propsStore: CannyEdgeDetectionAgatePropsStore
	// },
	{
		sketch: TetrisSketch,
		propsStore: TetrisDefaultPropsStore
	},
	{
		sketch: StainedGlassSketch,
		propsStore: StainedGlassDefaultPropsStore
	},
	{
		sketch: SnowGlobeSketch,
		propsStore: SnowGlobeDefaultPropsStore
	},
	{
		sketch: SkyscrapersImprovedSketch,
		propsStore: SkyscrapersImprovedSketchDefaultPropsStore
	},
	{
		sketch: ParticleFieldSketch,
		propsStore: ParticleFieldSketchDefaultPropsStore
	},
	{
		sketch: FireworksSketch,
		propsStore: FireworksSketchDefaultPropsStore
	},
	{
		sketch: TimesTablesSketch,
		propsStore: TimesTablesDefaultPropsStore
	},
	{
		sketch: SimpleEdgeDetectionSketch,
		propsStore: SimpleEdgeDetectionAgatePropsStore
	},
	{
		sketch: SimpleEdgeDetectionSketch,
		propsStore: SimpleEdgeDetectionDefaultPropsStore
	},
	{
		sketch: ParticleFieldSketch,
		propsStore: ParticleFieldSketchDefaultPropsStoreTwo
	},
	{
		sketch: ParticleFieldSketch,
		propsStore: ParticleFieldSketchDefaultPropsStoreThree
	},
	{
		sketch: TimesTablesSketch,
		propsStore: TimesTablesDefaultPropsStoreTwo
	},
	{
		sketch: SinSumSketch,
		propsStore: SinSumSketchDefaultPropsStore
	},
	{
		sketch: SinSumSketch,
		propsStore: SinSumSketchDefaultPropsStoreTwo
	},
	{
		sketch: BouncyDVDSketch,
		propsStore: BouncyDVDSketchDefaultPropsStore
	}
];