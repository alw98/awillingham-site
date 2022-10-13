export const solveEulerProblem9 = (): number => {
	for(let a = 1; a <= 1000; ++a) {
		for(let b = a; b + a <= 1000; ++b) {
			const c = 1000 - b - a;
			if(a * a + b * b === c * c) {
				return a * b * c;
			}
		}
	}
	return 0;
};