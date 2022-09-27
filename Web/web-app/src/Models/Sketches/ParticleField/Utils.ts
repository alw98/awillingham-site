import p5 from 'p5';

export const convertPlaneCoordsToTorus = (s: p5, x: number, y: number, width: number, height: number): p5.Vector => {
	const tubeRadius = 10;
	const torusRadius = .1;
	const theta = s.lerp(0, Math.PI * 2, y / height);
	const phi = s.lerp(0, Math.PI * 2, x / width);
	const nx = (torusRadius + tubeRadius * Math.cos(theta)) * Math.cos(phi);
	const ny = (torusRadius + tubeRadius * Math.cos(theta)) * Math.sin(phi);
	const nz = torusRadius * Math.sin(theta);
	return new p5.Vector(nx, ny, nz);
};