export const solveEulerProblem2 = (): number => {
	const fibonacciSeq: number[] = [1, 2];
	let total = 2;

	while(fibonacciSeq.at(-1) < 4_000_000) {
		const newNum = fibonacciSeq.at(-1) + fibonacciSeq.at(-2);
		fibonacciSeq.push(newNum);
		if(newNum % 2 === 0) {
			total += newNum;
		}
	}

	return total;
};