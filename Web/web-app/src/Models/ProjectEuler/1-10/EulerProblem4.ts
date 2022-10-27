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