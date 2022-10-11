export const solveEulerProblem1 = (): number => {
	let total = 0;
	for(let i = 5; i < 1000; i += 5) {
		total += i;
	}
	
	for(let i = 3; i < 1000; i += 3) {
		if(i % 5 !== 0) {
			total += i;
		}
	}

	return total;
};