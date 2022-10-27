export const solveEulerProblem10 = (): number => {
	const getPrimeArrayUpToPrime = (max: number): number[] => {
		const primes = [2];
		let toCheck = primes.at(-1) + 1;
		while(toCheck < max) {
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
	
	const primes = getPrimeArrayUpToPrime(2000000);
	return primes.reduce((prev, cur) => prev + cur);
};

