import * as p5 from "p5";
import { GridCell } from "./GridCell";

export interface TetriminoData {
  name: string;
  cells: [number, number][];
  color: [number, number, number]; // store as RGB, p5.Color comes later
}

export const TetriminoDefaults: TetriminoData[] = [
  {
    name: "O",
    cells: [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    color: [212, 236, 24],
  },
  {
    name: "I",
    cells: [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    color: [91, 209, 215],
  },
  {
    name: "S",
    cells: [
      [-1, 0],
      [0, 0],
      [0, 1],
      [1, 1],
    ],
    color: [194, 20, 20],
  },
  {
    name: "Z",
    cells: [
      [-1, 1],
      [0, 1],
      [0, 0],
      [1, 0],
    ],
    color: [89, 161, 8],
  },
  {
    name: "L",
    cells: [
      [0, 2],
      [0, 1],
      [0, 0],
      [1, 0],
    ],
    color: [220, 143, 9],
  },
  {
    name: "J",
    cells: [
      [0, 2],
      [0, 1],
      [0, 0],
      [-1, 0],
    ],
    color: [192, 27, 128],
  },
  {
    name: "T",
    cells: [
      [-1, 1],
      [0, 1],
      [0, 0],
      [1, 1],
    ],
    color: [102, 5, 94],
  },
];

export class Tetrimino {
  name: string;
  cells: [number, number][];
  color: p5.Color;
  rotation: number = 0;

  constructor(p: p5, data: TetriminoData) {
    this.name = data.name;
    this.cells = data.cells.map((c) => [...c] as [number, number]); // clone
    this.color = p.color(...data.color);
  }

  private getBoundingBoxCenter(): [number, number] {
    const xs = this.cells.map(([x]) => x);
    const ys = this.cells.map(([_, y]) => y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    // Force integer center for stability
    return [Math.floor((minX + maxX) / 2), Math.floor((minY + maxY) / 2)];
  }
  getOccupiedCells(
    board: GridCell[][],
    posX: number,
    posY: number
  ): GridCell[] {
    const cells: GridCell[] = [];
    for (const [dx, dy] of this.cells) {
      const x = dx + posX;
      const y = dy + posY;
      if (y >= 0 && y < board.length && x >= 0 && x < board[0].length) {
        cells.push(board[y][x]);
      }
    }
    return cells;
  }

  private simulateRotation(clockwise: boolean): [number, number][] {
    const [cx, cy] = this.getBoundingBoxCenter();
    return this.cells.map(([x, y]) => {
      const relX = x - cx;
      const relY = y - cy;

      // No per-cell rounding — keep math exact
      const nx = clockwise ? relY : -relY;
      const ny = clockwise ? -relX : relX;

      return [cx + nx, cy + ny] as [number, number];
    });
  }

  isRotationValid(
    board: GridCell[][],
    posX: number,
    posY: number,
    clockwise: boolean
  ): boolean {
    const rotatedCells = this.simulateRotation(clockwise);

    for (const [dx, dy] of rotatedCells) {
      const x = posX + dx;
      const y = posY + dy;

      // Out of bounds?
      if (y < 0 || y >= board.length || x < 0 || x >= board[0].length) {
        return false;
      }

      // Collides with another piece?
      if (board[y][x].color) {
        return false;
      }
    }
    return true;
  }

  rotateIfValid(
    board: GridCell[][],
    posX: number,
    posY: number,
    clockwise: boolean
  ) {
    if (this.isRotationValid(board, posX, posY, clockwise)) {
      this.cells = this.simulateRotation(clockwise);
      this.rotation = (this.rotation + (clockwise ? 1 : 3)) % 4;
      return true;
    }
    return false;
  }

  // draw(p: p5, offsetX = 0, offsetY = 0) {
  //   p.fill(this.color);
  //   p.noStroke();
  //   for (const [x, y] of this.cells) {
  //     p.rect(
  //       (x + offsetX) * this.size,
  //       (y + offsetY) * this.size,
  //       this.size,
  //       this.size
  //     );
  //   }
  // }
}
