import { BaseSketchPropsStore } from '../BaseSketchPropsStore';
import { GridCell } from './GridCell';
import { Tetrimino } from './Tetrimino';

export interface TetrisPropsStore extends BaseSketchPropsStore {
	rows: number;
	cols: number;
	activeTetrimino?: {
		tetrimino: Tetrimino,
		x: number,
		y: number
	}
	grid?: GridCell[][];
}