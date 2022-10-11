export const solveEulerProblem3 = (): number => {
	let n = 600851475143;
	let div = 2;
	while(div !== n) {
		if(n % div === 0) {
			n /= div;
			div = 2;
		} else {
			div++;
		}
	}
	return n;
};