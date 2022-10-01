
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';

import { BaseSketchProps } from './BaseSketch';
import { BouncyDVDSketch, BouncyDVDSketchDefaultPropsStore } from './BouncyDVD/BouncyDVDSketch';
import { ParticleFieldSketch, ParticleFieldSketchDefaultPropsStore, ParticleFieldSketchDefaultPropsStoreThree, ParticleFieldSketchDefaultPropsStoreTwo } from './ParticleField/ParticleFieldSketch';
import { SinSumSketch, SinSumSketchDefaultPropsStore, SinSumSketchDefaultPropsStoreTwo } from './SinSum/SinSumSketch';
import { TimesTablesDefaultPropsStore, TimesTablesDefaultPropsStoreTwo, TimesTablesSketch } from './TimesTables/TimesTablesSketch';

interface GallerySketch {
	sketch: React.ComponentType<BaseSketchProps>;
	propsStore: BaseSketchPropsStore;
}

export const GallerySketches: GallerySketch[] = [
	{
		sketch: TimesTablesSketch,
		propsStore: TimesTablesDefaultPropsStore
	},
	{
		sketch: TimesTablesSketch,
		propsStore: TimesTablesDefaultPropsStoreTwo
	},
	{
		sketch: ParticleFieldSketch,
		propsStore: ParticleFieldSketchDefaultPropsStore
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