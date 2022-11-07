
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';

import { BaseSketchProps } from './BaseSketch';
import { BouncyDVDSketch, BouncyDVDSketchDefaultPropsStore } from './BouncyDVD/BouncyDVDSketch';
import { EdgeDetectionDefaultPropsStore, EdgeDetectionSketch } from './EdgeDetection/EdgeDetectionSketch';
import { FireworksSketch, FireworksSketchDefaultPropsStore } from './Fireworks/FireworksSketch';
import { ParticleFieldSketch, ParticleFieldSketchDefaultPropsStore, ParticleFieldSketchDefaultPropsStoreThree, ParticleFieldSketchDefaultPropsStoreTwo } from './ParticleField/ParticleFieldSketch';
import { PurgatorySketch, PurgatorySketchDefaultPropsStore as PurgatoryDefaultPropsStore } from './Purgatory/PurgatorySketch';
import { SinSumSketch, SinSumSketchDefaultPropsStore, SinSumSketchDefaultPropsStoreTwo } from './SinSum/SinSumSketch';
import { SkyscrapersImprovedSketch, SkyscrapersImprovedSketchDefaultPropsStore } from './SkyscrapersImproved/SkyscrapersImprovedSketch';
import { TimesTablesDefaultPropsStore, TimesTablesDefaultPropsStoreTwo, TimesTablesSketch } from './TimesTables/TimesTablesSketch';

interface GallerySketch {
	sketch: React.ComponentType<BaseSketchProps>;
	propsStore: BaseSketchPropsStore;
}

export const GallerySketches: GallerySketch[] = [
	{
		sketch: EdgeDetectionSketch,
		propsStore: EdgeDetectionDefaultPropsStore
	},
	{
		sketch: PurgatorySketch,
		propsStore: PurgatoryDefaultPropsStore
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