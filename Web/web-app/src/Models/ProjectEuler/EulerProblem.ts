export interface EulerProblem {
	title: string;
	text: string;
	getAnswer: () => string | number;
	id: number;
}