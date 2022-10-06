import { Comparable } from 'Models/DataStructures/Comparable';
import p5 from 'p5';

import { FireworksSketchPropsStore } from './FireworksSketchPropsStore';

export class Particle implements Comparable<Particle> {
	s: p5;
	pos: p5.Vector;
	vel: p5.Vector;
	color: string;
	life: number;
	trail: p5.Vector[] = [];
	trailLengthVariance: number;
	store: FireworksSketchPropsStore;

	constructor(s: p5, pos: p5.Vector, vel: p5.Vector, color: string, store: FireworksSketchPropsStore) {
		this.s = s;
		this.pos = pos;
		this.trail.push(this.pos.copy());
		this.vel = vel;
		this.color = color;
		this.store = store;
		this.life = this.store.particleLifeSpan + Math.random() * this.store.particleLifeSpanVariance;
		this.trailLengthVariance = Math.floor(this.store.particleTrailLengthVariance * (Math.random() - .5));
	}

	draw() {
		this.s.fill(this.color);
		this.s.noStroke();
		this.s.ellipse(this.pos.x, this.pos.y, this.store.particleSize, this.store.particleSize);

		this.s.stroke(this.color);
		this.s.noFill();
		this.s.beginShape();
		for(let i = this.trail.length -1; i > 0; --i) {
			this.s.vertex(this.trail[i].x, this.trail[i].y);
		}
		this.s.endShape();
	}

	update(gravity: p5.Vector): boolean {
		this.vel.add(gravity);
		this.trail.push(this.pos.copy());
		this.pos.add(this.vel);
		this.life--;
		if(this.life < this.trail.length) {
			this.trail.splice(0, this.trail.length - this.life);
		}
		if(this.trail.length > this.store.particleTrailLength + this.trailLengthVariance) {
			this.trail.splice(0, this.trail.length - this.store.particleTrailLength);
		}
		return this.life <= 0;
	}

	compare(val1: Particle, val2: Particle): number {
		return val1.life - val2.life;
	}
}