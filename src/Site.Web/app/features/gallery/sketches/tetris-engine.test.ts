import { describe, expect, it } from 'vitest';
import { HeldKeys, TetrisEngine } from './tetris-engine';
import { definitions, parsePreset } from './definitions';

describe('versioned sketch definitions', () => {
  it('validates all 15 immutable defaults and rejects obsolete/unsafe data', () => {
    expect(definitions).toHaveLength(15);
    expect(new Set(definitions.map(d => d.presetId)).size).toBe(15);
    for (const d of definitions) {
      expect(parsePreset({ version: 1, presetId: d.presetId, seed: 42, settings: d.defaults }).settings).toEqual(d.defaults);
      expect(() => d.schema.parse({ ...d.defaults, unknown: 1 })).toThrow();
    }
    const d = definitions[0];
    expect(() => parsePreset({ version: 2, presetId: d.presetId, seed: 42, settings: d.defaults })).toThrow();
    expect(() => d.schema.parse({ dropFrames: Infinity })).toThrow();
    expect(() => d.schema.parse({ dropFrames: 0 })).toThrow();
  });
});
describe('Tetris', () => {
  it('repeats held movement after 200ms and every 50ms, releasing on blur without repeating rotations', () => {
    const held = new HeldKeys(), actions: string[] = [], act = (key: string) => actions.push(key);
    held.press('left', act); held.press('left', act); held.update(199, act);
    expect(actions).toEqual(['left']);
    held.update(1, act); held.update(100, act);
    expect(actions).toEqual(['left', 'left', 'left', 'left']);
    held.release(); held.update(1000, act); expect(actions).toHaveLength(4);
    held.press('clockwise', act); held.update(1000, act); expect(actions.at(-1)).toBe('clockwise'); expect(actions).toHaveLength(5);
  });
  it('uses independent reproducible pieces and boards', () => {
    const a = new TetrisEngine(42), b = new TetrisEngine(42);
    expect(a.cells).toEqual(b.cells); expect(a.cells).not.toBe(b.cells);
    a.drop(); expect(b.board.flat().filter(Boolean)).toHaveLength(0);
    const c = new TetrisEngine(42); c.drop(); expect(a.board).toEqual(c.board);
  });
  it('rejects wall, floor and occupied-cell moves and rotations', () => {
    const game = new TetrisEngine(1);
    game.cells = [[0, 0], [0, 1], [0, 2], [0, 3]]; game.x = 0;
    game.move(-1); expect(game.x).toBe(0);
    const cells = structuredClone(game.cells); game.rotate(true); expect(game.cells).toEqual(cells);
    game.x = 9; game.move(1); expect(game.x).toBe(9);
    game.x = 5; game.board[1][6] = 'occupied'; game.move(1); expect(game.x).toBe(5);
    game.y = 17; expect(game.valid()).toBe(false);
  });
  it('clears multiple rows and shifts the remaining cells', () => {
    const game = new TetrisEngine(4);
    game.board[19].fill('red'); game.board[18].fill('blue'); game.board[17][3] = 'green';
    expect(game.clearLines()).toBe(2); expect(game.lines).toBe(2);
    expect(game.board[19][3]).toBe('green'); expect(game.board.slice(0, 2).flat().every(c => c === null)).toBe(true);
  });
  it('locks hard drops and automatically resets a blocked spawn', () => {
    const game = new TetrisEngine(17); game.drop();
    expect(game.board.flat().filter(Boolean)).toHaveLength(4);
    game.board.forEach(row => row.fill('blocked')); game.spawn();
    expect(game.resets).toBe(1); expect(game.board.flat().filter(Boolean)).toHaveLength(0); expect(game.valid()).toBe(true);
  });
  it('produces the same result at 30, 60 and 144 render frames per second', () => {
    const games = [30, 60, 144].map(fps => { const game = new TetrisEngine(99); for (let i = 0; i < fps * 10; i++) game.update(1000 / fps); return game; });
    for (const game of games.slice(1)) { expect(game.board).toEqual(games[0].board); expect([game.x, game.y, game.cells]).toEqual([games[0].x, games[0].y, games[0].cells]); }
  });
});
