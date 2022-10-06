import p5 from 'p5';
import { getRandomColor } from 'Themes/ColorPalletes';
import { alphaToHex } from 'Utils/AlphaToHex';

export class Particle {
	pos: p5.Vector;
	vel: p5.Vector;
	color: string;
	trail: (p5.Vector|null)[];
	s: p5;

	constructor(s: p5, x: number, y: number, vx?: number, vy?: number) {
		this.s = s;
		this.pos = new p5.Vector(x, y);
		this.vel = new p5.Vector(vx ?? 0, vy ?? 0);
		this.color = getRandomColor();
		this.trail = [];
	}

	update(force: p5.Vector, maxSpeed: number, trailLength: number) {
		this.vel.add(force);
		if(this.vel.mag() > maxSpeed) {
			this.vel.setMag(maxSpeed);
		}
		this.pos.add(this.vel);
		this.trail.push(this.pos.copy());
		this.handleBounds();
		if(this.trail.length > trailLength) {
			this.trail.splice(0, this.trail.length - trailLength);
		}
	}

	handleBounds() {
		if(this.pos.x < 0) {
			this.trail.push(null);
			this.pos.x = this.s.width - 1;
		} else if(this.pos.x >= this.s.width) {
			this.trail.push(null);
			this.pos.x = 1;	
		}
		if(this.pos.y < 0) {
			this.trail.push(null);
			this.pos.y = this.s.height - 1;
		} else if(this.pos.y >= this.s.height) {
			this.trail.push(null);
			this.pos.y = 1;	
		}
	}

	draw(size: number, tailShrinks: boolean, alpha: number) {
		const alphaHex = alphaToHex(alpha);
		this.s.fill(this.color + alphaHex);
		this.s.stroke(this.color + alphaHex);
		this.s.strokeWeight(1);
		this.s.ellipse(this.pos.x, this.pos.y, size, size);
		for(let i = 1; i < this.trail.length; ++i) {
			if(tailShrinks) {
				this.s.strokeWeight(this.s.lerp(0, size, i / this.trail.length));
			}
			const from = this.trail[i - 1];
			const to = this.trail[i];
			if(from !== null && to !== null){
				this.s.line(from.x, from.y, to.x, to.y);
			}
		}
	}
}