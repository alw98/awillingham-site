import p5 from 'p5';

import { Particle } from './Particle';

const STRENGTH_NOISE_OFFSET = 42069;

export class Field {
	field: p5.Vector[][];
	s: p5;
	w: number;
	h: number;
	fieldDirectionNoiseScale: number;
	fieldStrengthNoiseScale: number;
	fieldStrengthScale: number;
	fieldUniformStrength: boolean;

	constructor(
		w: number, 
		h: number, 
		fieldDirectionNoiseScale: number, 
		fieldStrengthNoiseScale: number, 
		fieldStrengthScale: number,
		fieldUniformStrength: boolean,
		s: p5) {
		this.field = new Array(h);
		this.fieldDirectionNoiseScale = fieldDirectionNoiseScale;
		this.fieldStrengthNoiseScale = fieldStrengthNoiseScale;
		this.fieldStrengthScale = fieldStrengthScale;
		this.fieldUniformStrength = fieldUniformStrength;
		this.w = w;
		this.h = h;
		this.s = s;
		for(let y = 0; y < h; ++y) {
			this.field[y] = new Array(w);
		}
		this.update(0, 0, 0);
	}

	update(step: number, directionChangeSpeed: number, strengthChangeSpeed: number) {
		for(let y = 0; y < this.h; ++y) {
			for(let x = 0; x < this.w; ++x) {
				let direction = this.s.noise(x * this.fieldDirectionNoiseScale, 
					y * this.fieldDirectionNoiseScale, 
					step * directionChangeSpeed);

				let strength = this.fieldUniformStrength ? 1 : 
					this.s.noise(x * this.fieldStrengthNoiseScale + STRENGTH_NOISE_OFFSET, 
						y * this.fieldStrengthNoiseScale + STRENGTH_NOISE_OFFSET,
						step * strengthChangeSpeed);

				direction *= Math.PI * 6;
				strength *= this.fieldStrengthScale;
				this.field[y][x] = new p5.Vector(Math.cos(direction) * strength, Math.sin(direction) * strength);
			}
		}
	};

	updateParticles(particles: Particle[], maxSpeed: number, particleTailLength: number) {
		particles.forEach((particle) => {
			const x = Math.floor(particle.pos.x / this.s.width * this.w);
			const y = Math.floor(particle.pos.y / this.s.height * this.h);
			particle.update(this.field[y][x], maxSpeed, particleTailLength);
		});
	}

	drawGrid(w: number, h: number) {
		const dy = h / this.field.length;
		const dx = w / this.field[0].length;
		this.s.stroke(0);
		this.s.noFill();
		for(let x = 0; x < w; x += dx) {
			for(let y = 0; y < h; y += dy) {
				this.s.rect(x, y, x + dx, y + dy);
			}
		}
	}

	drawFieldLines(w: number, h: number) {
		const dy = h / this.field.length;
		const dx = w / this.field[0].length;
		this.s.strokeWeight(1);
		this.s.noFill();
		const mag = Math.min(h / this.field.length, w / this.field[0].length) / 2;
		for(let y = 0; y < this.field.length; ++y) {
			for(let x = 0; x < this.field[0].length; ++x) {
				const fieldCell = this.field[y][x];
				const fromX = x * dx + dx / 2;
				const fromY = y * dy + dy / 2;
				const theta = Math.atan(fieldCell.y / fieldCell.x);
				const r = this.s.lerp(0, 255, theta);
				const g = this.s.lerp(255, 0, theta);
				
				const scaled = fieldCell.copy().setMag(mag);
				this.s.stroke(r, g, 0);
				this.s.line(fromX, fromY, fromX + scaled.x, fromY + scaled.y);
			}
		}
	}
}