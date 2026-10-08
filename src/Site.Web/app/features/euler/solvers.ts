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
export const solveEulerProblem2 = (): number => {
	const fibonacciSeq: number[] = [1, 2];
	let total = 2;

	while(fibonacciSeq.at(-1)! < 4_000_000) {
		const newNum = fibonacciSeq.at(-1)! + fibonacciSeq.at(-2)!;
		fibonacciSeq.push(newNum);
		if(newNum % 2 === 0) {
			total += newNum;
		}
	}

	return total;
};
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
export const solveEulerProblem4 = (): number => {
	const isPalindrome = (str: string): boolean => {
		for(let i = 0; i < str.length / 2; ++i) {
			if(str.charAt(i) !== str.charAt(str.length - i - 1)) {
				return false;
			}
		}
		return true;
	};

	let largest = 0;
	for(let i = 100; i < 1000; ++i) {
		for(let j = i; j < 1000; ++j) {
			const val = i * j;
			if(val > largest && isPalindrome('' + val)) {
				largest = val;
			}
		}
	}

	return largest;
};
export const solveEulerProblem5 = (): number => {
	const isEvenlyDivisibleByNumbersUpToTwenty = (val: number): boolean => {
		for(let i = 1; i <= 20; ++i) {
			if(val % i !== 0) {
				return false;
			}
		}
		return true;
	};

	let n = 20;
		while(true) {
		if(isEvenlyDivisibleByNumbersUpToTwenty(n)) {
			return n;
		}
		n += 20;
	}
};
export const solveEulerProblem6 = (): number => {
	let sumOfSquares = 0;
	let squareOfSums = 0;
	for(let i = 1; i <= 100; ++i) {
		sumOfSquares += i * i;
		squareOfSums += i;
	}
	squareOfSums *= squareOfSums;
	return squareOfSums - sumOfSquares;
};

export const solveEulerProblem7 = (): number => {
	const getPrimeArray = (size: number): number[] => {
		const primes = [2];
		let toCheck = primes.at(-1)! + 1;
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

	const primes = getPrimeArray(10001);
	return primes.at(-1)!;
};

export const solveEulerProblem8 = (): number => {
	const numberStr = '7316717653133062491922511967442657474235534919493496983520312774506326239578318016984801869478851843858615607891129494954595017379583319528532088055111254069874715852386305071569329096329522744304355766896648950445244523161731856403098711121722383113622298934233803081353362766142828064444866452387493035890729629049156044077239071381051585930796086670172427121883998797908792274921901699720888093776657273330010533678812202354218097512545405947522435258490771167055601360483958644670632441572215539753697817977846174064955149290862569321978468622482839722413756570560574902614079729686524145351004748216637048440319989000889524345065854122758866688116427171479924442928230863465674813919123162824586178664583591245665294765456828489128831426076900422421902267105562632111110937054421750694165896040807198403850962455444362981230987879927244284909188845801561660979191338754992005240636899125607176060588611646710940507754100225698315520005593572972571636269561882670428252483600823257530420752963450';
	let max = 0;
	for(let i = 0; i < numberStr.length - 13; ++i) {
		const subStr = numberStr.slice(i, i + 13);
		let product = Number.parseInt(subStr.charAt(0));
		for(let j = 1; j < subStr.length; ++j) {
			product *= Number.parseInt(subStr.charAt(j));
		}
		if(product > max) {
			max = product;
		}
	}
	return max;
};
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
export const solveEulerProblem10 = (): number => {
	const getPrimeArrayUpToPrime = (max: number): number[] => {
		const primes = [2];
		let toCheck = primes.at(-1)! + 1;
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


export const solvers = [solveEulerProblem1, solveEulerProblem2, solveEulerProblem3, solveEulerProblem4, solveEulerProblem5, solveEulerProblem6, solveEulerProblem7, solveEulerProblem8, solveEulerProblem9, solveEulerProblem10];
