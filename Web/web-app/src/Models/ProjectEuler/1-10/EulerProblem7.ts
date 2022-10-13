export const solveEulerProblem7 = (): number => {
	const primes = getPrimeArray(10001);
	return primes.at(-1);
};

const getPrimeArray = (size: number): number[] => {
	const primes = [2];
	let toCheck = primes.at(-1) + 1;
	while(primes.length !== size) {
		let curPrimeInd = 0;
		let curPrime = primes[curPrimeInd];
		const toCheckSqRt = Math.sqrt(toCheck);
		while(curPrime <= toCheckSqRt) {
			if(toCheck % curPrime === 0) {
				curPrime = Number.MAX_VALUE;
			} else {
				++curPrimeInd;
				curPrime = primes[curPrimeInd];
			}
		}

		if(curPrime !== Number.MAX_VALUE) {
			primes.push(toCheck);
		}
		++toCheck;
	}

	return primes;
};
