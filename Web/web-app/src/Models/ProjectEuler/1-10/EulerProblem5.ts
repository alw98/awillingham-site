export const solveEulerProblem5 = (): number => {
	let n = 20;
	// eslint-disable-next-line no-constant-condition
	while(true) {
		if(isEvenlyDivisibleByNumbersUpToTwenty(n)) {
			return n;
		}
		n += 20;
	}
};

const isEvenlyDivisibleByNumbersUpToTwenty = (val: number): boolean => {
	for(let i = 1; i <= 20; ++i) {
		if(val % i !== 0) {
			return false;
		}
	}
	return true;
};