import { clamp } from './math';
import type { Point, Size } from './types';

export class RpsCamera {
  zoom = 1;
  center: Point;
  size: Size = { width: 320, height: 320 };
  constructor(readonly cells: number) { this.center = { x: cells / 2, y: cells / 2 }; }
  get scale() { return Math.min(this.size.width, this.size.height) / this.cells * this.zoom; }
  world(point: Point): Point {
    return { x: this.center.x + (point.x - this.size.width / 2) / this.scale, y: this.center.y + (point.y - this.size.height / 2) / this.scale };
  }
  zoomAt(factor: number, point: Point = { x: this.size.width / 2, y: this.size.height / 2 }) {
    const before = this.world(point);
    this.zoom = clamp(this.zoom * factor, .25, 32);
    const after = this.world(point);
    this.center.x += before.x - after.x; this.center.y += before.y - after.y;
    this.constrain();
  }
  pan(delta: Point) {
    this.center.x -= delta.x / this.scale; this.center.y -= delta.y / this.scale;
    this.constrain();
  }
  reset() { this.zoom = 1; this.center = { x: this.cells / 2, y: this.cells / 2 }; }
  private constrain() {
    this.center.x = clamp(this.center.x, 0, this.cells); this.center.y = clamp(this.center.y, 0, this.cells);
  }
}
