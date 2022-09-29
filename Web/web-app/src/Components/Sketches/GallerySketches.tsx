
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';

import { BaseSketchProps } from './BaseSketch';
import { BouncyDVDSketch, BouncyDVDSketchDefaultPropsStore } from './BouncyDVD/BouncyDVDSketch';
import { ParticleFieldSketch, ParticleFieldSketchDefaultPropsStore, ParticleFieldSketchDefaultPropsStoreThree, ParticleFieldSketchDefaultPropsStoreTwo } from './ParticleField/ParticleFieldSketch';
import { SinSumSketch, SinSumSketchDefaultPropsStore, SinSumSketchDefaultPropsStoreTwo } from './SinSum/SinSumSketch';
import { TimesTablesDefaultPropsStore, TimesTablesDefaultPropsStoreTwo, TimesTablesSketch } from './TimesTables/TimesTablesSketch';

interface GallerySketch {
	sketch: React.ComponentType<BaseSketchProps>;
	defaultPropsStore: BaseSketchPropsStore;
}

export const GallerySketches: GallerySketch[] = [
	{
		sketch: TimesTablesSketch,
		defaultPropsStore: TimesTablesDefaultPropsStore
	},
	{
		sketch: TimesTablesSketch,
		defaultPropsStore: TimesTablesDefaultPropsStoreTwo
	},
	{
		sketch: ParticleFieldSketch,
		defaultPropsStore: ParticleFieldSketchDefaultPropsStore
	},
	{
		sketch: ParticleFieldSketch,
		defaultPropsStore: ParticleFieldSketchDefaultPropsStoreTwo
	},
	{
		sketch: ParticleFieldSketch,
		defaultPropsStore: ParticleFieldSketchDefaultPropsStoreThree
	},
	{
		sketch: SinSumSketch,
		defaultPropsStore: SinSumSketchDefaultPropsStore
	},
	{
		sketch: SinSumSketch,
		defaultPropsStore: SinSumSketchDefaultPropsStoreTwo
	},
	{
		sketch: BouncyDVDSketch,
		defaultPropsStore: BouncyDVDSketchDefaultPropsStore
	}
];