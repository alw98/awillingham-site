import { BaseSketchPropsStore } from '../BaseSketchPropsStore';
import { TimesTable } from './TimesTable';

export interface TimesTablesPropsStore extends BaseSketchPropsStore {
	tables: TimesTable[];
}