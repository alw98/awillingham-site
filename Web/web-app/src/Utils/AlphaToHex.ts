export const alphaToHex = (alpha: number): string => {
	let alphaHex = alpha.toString(16);
	if(alphaHex.length === 1) 
		alphaHex = '0' + alphaHex;
	return alphaHex;
};
