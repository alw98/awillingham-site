
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';

import { BaseSketchProps } from './BaseSketch';
import { BouncyDVDSketch, BouncyDVDSketchDefaultPropsStore } from './BouncyDVD/BouncyDVDSketch';
import { ParticleFieldSketch, ParticleFieldSketchDefaultPropsStore } from './ParticleField/ParticleFieldSketch';
import { SinSumSketch, SinSumSketchDefaultPropsStore } from './SinSum/SinSumSketch';
import { TimesTablesDefaultPropsStore, TimesTablesSketch } from './TimesTables/TimesTablesSketch';

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
		sketch: ParticleFieldSketch,
		defaultPropsStore: ParticleFieldSketchDefaultPropsStore
	},
	{
		sketch: SinSumSketch,
		defaultPropsStore: SinSumSketchDefaultPropsStore
	},
	{
		sketch: BouncyDVDSketch,
		defaultPropsStore: BouncyDVDSketchDefaultPropsStore
	}
];