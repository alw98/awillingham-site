import p5 from "p5";

export class GridCell {
  color?: p5.Color;
  x: number;
  y: number;
  size: number;

  constructor(x: number, y: number, size: number) {
    this.x = x;
    this.y = y;
    this.size = size;
  }

  draw(s: p5): void {
    if (this.color !== undefined) {
      s.fill(this.color);
    } else {
      s.fill(0, 0, 0, 0);
    }
    s.noStroke();
    s.rect(this.x, this.y, this.size, this.size);
  }

  drawTetriminoColor(s: p5, color: p5.Color): void {
    s.fill(color);
    s.noStroke();
    s.rect(this.x, this.y, this.size, this.size);
  }
}
