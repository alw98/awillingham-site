export const recursiveCopyStrings = <T>(to: T, from: T) => {
	for(const key in to) {
		const val = from[key];
		if(typeof val === 'string') {
			to[key] = val;
		} else if (typeof val === 'object') {
			recursiveCopyStrings(to[key], val);
		}
	}
};