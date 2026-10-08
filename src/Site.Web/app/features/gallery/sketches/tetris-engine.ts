import { FixedClock, random } from './math';

export type Cell = [number, number];
export class HeldKeys {
  private keys = new Set<string>();
  private elapsed = 0;
  private next = 200;
  press(key: string, act: (key: string) => void) { if (this.keys.has(key)) return; this.keys.add(key); this.elapsed = 0; this.next = 200; act(key); }
  release(key?: string) { if (key) this.keys.delete(key); else this.keys.clear(); }
  update(milliseconds: number, act: (key: string) => void) {
    if (!this.keys.size) return;
    this.elapsed += milliseconds;
    while (this.elapsed >= this.next) { for (const key of this.keys) if (['left', 'right', 'down'].includes(key)) act(key); this.next += 50; }
  }
}
export const shapes: { cells: Cell[]; color: string }[] = [
  { cells: [[0, 0], [0, 1], [1, 0], [1, 1]], color: '#d4ec18' },
  { cells: [[0, 0], [0, 1], [0, 2], [0, 3]], color: '#5bd1d7' },
  { cells: [[-1, 0], [0, 0], [0, 1], [1, 1]], color: '#c21414' },
  { cells: [[-1, 1], [0, 1], [0, 0], [1, 0]], color: '#59a108' },
  { cells: [[0, 2], [0, 1], [0, 0], [1, 0]], color: '#dc8f09' },
  { cells: [[0, 2], [0, 1], [0, 0], [-1, 0]], color: '#c01b80' },
  { cells: [[-1, 1], [0, 1], [0, 0], [1, 1]], color: '#66055e' }
];
export class TetrisEngine {
  board: (string | null)[][] = Array.from({ length: 20 }, () => Array<string | null>(10).fill(null));
  cells: Cell[] = [];
  color = '';
  x = 5;
  y = 0;
  lines = 0;
  resets = 0;
  private clock = new FixedClock();
  private ticks = 0;
  private rng: () => number;
  constructor(seed: number, private dropFrames = 25) { this.rng = random(seed); this.spawn(); }
  setDropFrames(frames: number) { this.dropFrames = frames; }
  valid(cells = this.cells, x = this.x, y = this.y) {
    return cells.every(([dx, dy]) => x + dx >= 0 && x + dx < 10 && y + dy >= 0 && y + dy < 20 && !this.board[y + dy][x + dx]);
  }
  spawn() {
    const shape = shapes[Math.floor(this.rng() * shapes.length)];
    this.cells = shape.cells.map(([x, y]) => [x, y]); this.color = shape.color; this.x = 5; this.y = 0;
    if (!this.valid()) { this.board.forEach(row => row.fill(null)); this.lines = 0; this.resets++; }
  }
  move(dx: number) { if (this.valid(this.cells, this.x + dx)) this.x += dx; }
  rotate(clockwise: boolean) {
    const cx = Math.floor((Math.min(...this.cells.map(c => c[0])) + Math.max(...this.cells.map(c => c[0]))) / 2);
    const cy = Math.floor((Math.min(...this.cells.map(c => c[1])) + Math.max(...this.cells.map(c => c[1]))) / 2);
    const rotated: Cell[] = this.cells.map(([x, y]) => [cx + (clockwise ? y - cy : cy - y), cy + (clockwise ? cx - x : x - cx)]);
    if (this.valid(rotated)) this.cells = rotated;
  }
  clearLines() {
    const remaining = this.board.filter(row => row.some(cell => !cell));
    const cleared = 20 - remaining.length;
    this.lines += cleared;
    this.board = [...Array.from({ length: cleared }, () => Array<string | null>(10).fill(null)), ...remaining];
    return cleared;
  }
  down() {
    if (this.valid(this.cells, this.x, this.y + 1)) { this.y++; return true; }
    for (const [dx, dy] of this.cells) this.board[this.y + dy][this.x + dx] = this.color;
    this.clearLines(); this.spawn(); this.ticks = 0; return false;
  }
  drop() { while (this.valid(this.cells, this.x, this.y + 1)) this.y++; this.down(); }
  update(milliseconds: number) {
    this.clock.advance(milliseconds, () => { if (++this.ticks >= this.dropFrames) { this.ticks = 0; this.down(); } });
  }
  input(action: string) {
    if (action === 'left') this.move(-1);
    if (action === 'right') this.move(1);
    if (action === 'down') this.down();
    if (action === 'clockwise') this.rotate(true);
    if (action === 'counterclockwise') this.rotate(false);
    if (action === 'drop') this.drop();
  }
}
