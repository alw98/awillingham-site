import { TimesTable } from 'Models/Sketches/TimesTables/TimesTable';
import { TimesTablesPropsStore } from 'Models/Sketches/TimesTables/TimesTablesPropsStore';
import p5 from 'p5';

export const drawTables = (s: p5, store: TimesTablesPropsStore) => {
	for(const table of store.tables) {
		s.noFill();
		s.circle(table.x + store.width / 2, table.y + store.height / 2, table.radius * 2);
		drawLines(s, table, store);
	}
};

export const drawLines = (s: p5, table: TimesTable, store: TimesTablesPropsStore) => {
	const dt = Math.PI * 2 / table.resolution;
	const offX = store.width / 2;
	const offY = store.height / 2;
	for(let i = 0; i < table.resolution; ++i) {
		const theta = i * dt;
		const x = Math.cos(theta) * table.radius + offX;
		const y = Math.sin(theta) * table.radius + offY;
		const toTheta = i * table.multiplier * dt;
		const toX = Math.cos(toTheta) * table.radius + offX;
		const toY = Math.sin(toTheta) * table.radius + offY;
		s.line(x, y, toX, toY);
	}
	table.multiplier += .01;
};