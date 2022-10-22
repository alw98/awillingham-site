import p5 from 'p5';
import { getRandomColor } from 'Themes/ColorPalletes';

export class Skyscraper {
	x: number;
	w: number;
	h: number;
	color: string;

	constructor(x: number, w: number, h: number) {
		this.x = x;
		this.w = w;
		this.h = h;
		this.color = getRandomColor();
	}

	draw(s: p5) {
		s.stroke(this.color);
		s.strokeWeight(1);
		s.noFill();
		s.rect(this.x, 0, this.w, this.h);
	}

	getLeftSidePoints(): [p5.Vector, p5.Vector] {
		return [new p5.Vector(this.x, 0), new p5.Vector(this.x, this.h)];
	}

	getRightSidePoints(): [p5.Vector, p5.Vector] {
		return [new p5.Vector(this.x + this.w, this.h), new p5.Vector(this.x + this.w, 0)];
	}
}