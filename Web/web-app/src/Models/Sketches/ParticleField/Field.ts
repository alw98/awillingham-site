import p5 from 'p5';

import { Particle } from './Particle';
import { convertPlaneCoordsToTorus } from './Utils';

const STRENGTH_NOISE_OFFSET = 42069;

export class Field {
	field: p5.Vector[][];
	s: p5;
	w: number;
	h: number;
	fieldDirectionNoiseScale: number;
	fieldStrengthNoiseScale: number;
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
		this.fieldUniformStrength = fieldUniformStrength;
		this.w = w;
		this.h = h;
		this.s = s;
		for(let y = 0; y < h; ++y) {
			this.field[y] = new Array(w);
		}
		this.update(0, 0, 0, fieldStrengthScale);
	}

	update(step: number, directionChangeSpeed: number, strengthChangeSpeed: number, fieldStrengthScale: number) {
		for(let y = 0; y < this.h; ++y) {
			for(let x = 0; x < this.w; ++x) {
				const fieldToroidPos = convertPlaneCoordsToTorus(this.s, x, y, this.w, this.h);
				let direction = this.s.noise(fieldToroidPos.x * this.fieldDirectionNoiseScale + step * directionChangeSpeed, 
					fieldToroidPos.y * this.fieldDirectionNoiseScale + step * directionChangeSpeed, 
					fieldToroidPos.z + step * directionChangeSpeed);

				let strength = this.fieldUniformStrength ? 1 : 
					this.s.noise(fieldToroidPos.x * this.fieldStrengthNoiseScale + STRENGTH_NOISE_OFFSET + step * strengthChangeSpeed, 
						fieldToroidPos.y * this.fieldStrengthNoiseScale + STRENGTH_NOISE_OFFSET + step * strengthChangeSpeed,
						fieldToroidPos.z + step * strengthChangeSpeed);

				direction *= Math.PI * 6;
				strength *= fieldStrengthScale;
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

	drawFieldLines(w: number, h: number, fieldStrengthScale: number) {
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
				const str = fieldCell.mag() / fieldStrengthScale;
				const r = this.s.lerp(0, 255, str);
				const g = this.s.lerp(255, 0, str);
				
				const scaled = fieldCell.copy().setMag(mag);
				this.s.stroke(r, g, 0);
				this.s.line(fromX, fromY, fromX + scaled.x, fromY + scaled.y);
			}
		}
	}
}