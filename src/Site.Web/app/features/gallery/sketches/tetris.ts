import { HeldKeys, TetrisEngine } from './tetris-engine';
import { number, type SketchFactory } from './types';

export const create: SketchFactory = ({ seed, settings }) => {
  const game = new TetrisEngine(seed, number(settings, 'dropFrames'));
  const held = new HeldKeys();
  let width = 320, height = 320;
  return {
    resize(size) { width = size.width; height = size.height; },
    update(dt) {
      held.update(dt, action => game.input(action)); game.update(dt);
    },
    configure(next) { game.setDropFrames(number(next, 'dropFrames')); },
    input(action) { if (action.startsWith('press:')) held.press(action.slice(6), key => game.input(key)); else if (action.startsWith('release:')) held.release(action.slice(8)); else if (action === 'release') held.release(); else game.input(action); },
    summary: () => `${game.lines} lines`,
    draw(ctx) {
      const cell = Math.min((width - 40) / 10, (height - 40) / 20), left = (width - cell * 10) / 2, top = 20;
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1;
      ctx.strokeRect(left, top, cell * 10, cell * 20);
      for (let y = 0; y < 20; y++) for (let x = 0; x < 10; x++) {
        if (game.board[y][x]) { ctx.fillStyle = game.board[y][x]!; ctx.fillRect(left + x * cell, top + y * cell, cell, cell); }
      }
      ctx.fillStyle = game.color;
      for (const [x, y] of game.cells) { ctx.fillRect(left + (game.x + x) * cell, top + (game.y + y) * cell, cell, cell); }
    },
    dispose() { /* No external resources. */ }
  };
};
