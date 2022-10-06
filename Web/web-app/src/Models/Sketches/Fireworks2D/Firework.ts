import { Comparable } from 'Models/DataStructures/Comparable';
import p5 from 'p5';

import { FireworksSketchPropsStore } from './FireworksSketchPropsStore';
import { Particle } from './Particle';

export class Firework implements Comparable<Firework> {
	s: p5;
	pos: p5.Vector;
	vel: p5.Vector;
	color: string;
	fuse: number;
	store: FireworksSketchPropsStore;

	constructor(s: p5, pos: p5.Vector, vel: p5.Vector, color: string, settingsStore: FireworksSketchPropsStore) {
		this.s = s;
		this.pos = pos;
		this.vel = vel;
		this.color = color;
		this.store = settingsStore;
		this.fuse = this.store.fireworkLifeSpan + Math.random() * this.store.fireworkLifeSpanVariance;
	}

	draw() {
		this.s.fill(this.color);
		this.s.noStroke();
		this.s.ellipse(this.pos.x, this.pos.y, this.store.fireworkSize, this.store.fireworkSize);
	}

	update(gravity: p5.Vector): boolean {
		this.vel.add(gravity);
		this.pos.add(this.vel);
		this.fuse--;
		return this.fuse <= 0;
	}
	
	explode(): Particle[] {
		const result: Particle[] = [];
		for(let i = 0; i < this.store.explosionParticleCount; ++i) {
			const vel = this.vel.copy();
			const randomAngle = (Math.random() - .5) * this.store.explosionArc;
			const explosionVel = p5.Vector.fromAngle(this.vel.heading() + randomAngle, this.store.explosionForce);
			vel.add(explosionVel);
			result.push(new Particle(this.s, this.pos.copy(), vel, this.color, this.store));
		}
		return result;
	}

	compare(val1: Firework, val2: Firework): number {
		return val1.fuse - val2.fuse;
	}
}