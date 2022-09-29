import { BaseSketchPropsStore } from '../BaseSketchPropsStore';
import { Field } from './Field';
import { Particle } from './Particle';

export interface ParticleFieldSketchPropsStore extends BaseSketchPropsStore {
	particleSpeed: number;
	particleTrailLength: number;
	particleSize: number;
	fieldDirectionChangeSpeed: number;
	fieldStrengthChangeSpeed: number;
	fieldDirectionNoiseScale: number;
	fieldStrengthNoiseScale: number;
	fieldStrengthScale: number;
	gridWidth: number;
	gridHeight: number;
	step: number;
	initialParticles: number;
	particleAlpha: number;

	particleTrailShrinks: boolean;
	drawFieldLines: boolean;
	drawGrid: boolean;
	uniformStrength: boolean;
	resetBackground: boolean;

	field: Field;
	particles: Particle[];
}