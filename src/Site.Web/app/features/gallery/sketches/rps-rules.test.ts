import { describe, expect, it } from 'vitest';
import { interact, stepReference } from './rps-rules';
import { definitions } from './definitions';

const cell = (color: number, level: number) => color | (level << 2);
describe('rock paper scissors strength rules', () => {
  it('accepts supported even board sizes and rejects unsafe configurations', () => {
    const definition = definitions.find(entry => entry.slug === 'rock-paper-scissors')!;
    for (const boardSize of [200, 400, 10000]) expect(definition.schema.safeParse({ ...definition.defaults, boardSize }).success).toBe(true);
    for (const boardSize of [0, 199, 201, 200.5, 10001, NaN, Infinity]) expect(definition.schema.safeParse({ ...definition.defaults, boardSize }).success).toBe(false);
  });
  it('empty and level-zero cells cannot reproduce', () => {
    expect(interact(0, 0)).toEqual([0, 0]);
    expect(interact(cell(1, 0), 0)).toEqual([cell(1, 0), 0]);
    expect(interact(0, cell(1, 4))).toEqual([0, cell(1, 4)]);
  });
  it('reproduction spends one inherited level, without weakening the parent', () => {
    for (let level = 1; level <= 4; level++) for (let color = 1; color <= 3; color++)
      expect(interact(cell(color, level), 0)).toEqual([cell(color, level), cell(color, level - 1)]);
  });
  it.each([[2, 1], [3, 2], [1, 3]])('color %i beats color %i', (winner, loser) => {
    expect(interact(cell(winner, 0), cell(loser, 4))).toEqual([cell(winner, 1), cell(loser, 3)]);
    expect(interact(cell(winner, 3), cell(loser, 1))).toEqual([cell(winner, 4), cell(loser, 0)]);
    expect(interact(cell(winner, 4), cell(loser, 0))).toEqual([cell(winner, 4), cell(winner, 0)]);
    expect(interact(cell(loser, 4), cell(winner, 0))).toEqual([cell(loser, 4), cell(winner, 0)]);
  });
  it('same-color neighbors leave all levels unchanged', () => {
    for (let color = 1; color <= 3; color++) for (let a = 0; a <= 4; a++) for (let b = 0; b <= 4; b++)
      expect(interact(cell(color, a), cell(color, b))).toEqual([cell(color, a), cell(color, b)]);
  });
  it('monochrome growth stops within four neighbor steps, including across wrapped edges', () => {
    const size = 20;
    let board = new Uint8Array(size * size); board[0] = cell(1, 4);
    for (let generation = 0; generation < 600; generation++) board = stepReference(board, size, generation, 42);
    expect(board.filter(Boolean).length).toBeGreaterThan(10);
    expect(board[0]).toBe(cell(1, 4));
    expect(board[size - 1]).toBeGreaterThan(0); expect(board[(size - 1) * size]).toBeGreaterThan(0);
    board.forEach((value, i) => {
      if (value) {
        const x = i % size, y = Math.floor(i / size);
        expect(Math.max(Math.min(x, size - x), Math.min(y, size - y))).toBeLessThanOrEqual(4);
      }
    });
  });
  it('conflict restores strength and supports expansion beyond the monochrome limit', () => {
    const size = 40;
    let board = new Uint8Array(size * size);
    for (let y = 17; y <= 22; y++) for (let x = 17; x <= 22; x++) board[y * size + x] = cell((x + y) % 3 + 1, 4);
    for (let generation = 0; generation < 800; generation++) board = stepReference(board, size, generation, 17);
    expect(board.filter(Boolean).length).toBeGreaterThan(14 * 14);
    for (const value of board) { expect(value >>> 2).toBeLessThanOrEqual(4); if (value) expect(value & 3).toBeGreaterThan(0); }
  });
});
