export interface EulerProblem {
	title: string;
	text: string;
	getAnswer: () => unknown;
	id: number;
}