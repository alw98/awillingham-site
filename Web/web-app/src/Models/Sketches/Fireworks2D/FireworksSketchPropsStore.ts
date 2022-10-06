import { Heap } from 'DataStructures/Heap';

import { BaseSketchPropsStore } from '../BaseSketchPropsStore';
import { Firework } from './Firework';
import { Particle } from './Particle';

export interface FireworksSketchPropsStore extends BaseSketchPropsStore {
	fireworks: Heap<Firework>;
	particles: Heap<Particle>;
	step: number;
	gravity: number;
	fireworkSize: number;
	explosionForce: number;
	explosionParticleCount: number;
	explosionArc: number;
	particleTrailLength: number;
	particleTrailLengthVariance: number;
	particleSize: number;
	particleLifeSpan: number;
	particleLifeSpanVariance: number;
	fireworkLifeSpan: number;
	fireworkLifeSpanVariance: number;
	spawner: boolean;
	spawnRate: number;
}