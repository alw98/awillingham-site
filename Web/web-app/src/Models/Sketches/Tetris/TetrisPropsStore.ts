import p5 from 'p5';
import { BaseSketchPropsStore } from '../BaseSketchPropsStore';
import { Tetrimino } from './Tetrimino';
import { GridCell } from './GridCell';

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