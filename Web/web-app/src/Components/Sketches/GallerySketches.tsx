
import { BaseSketchPropsStore } from 'Models/Sketches/BaseSketchPropsStore';

import { BaseSketchProps } from './BaseSketch';
import { BouncyDVDSketch, BouncyDVDSketchDefaultPropsStore } from './BouncyDVD/BouncyDVDSketch';
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
		sketch: SinSumSketch,
		defaultPropsStore: SinSumSketchDefaultPropsStore
	},
	{
		sketch: BouncyDVDSketch,
		defaultPropsStore: BouncyDVDSketchDefaultPropsStore
	}
];