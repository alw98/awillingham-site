import { ColorChancesType } from './ColorChances';

export const getColorsByChance = <T>(colors: T, chances: ColorChancesType<T>) => {
	const colorProbs: string[] = [];

	for(const i in colors) {
		const val = colors[i];
		const prob = chances[i];
		if(typeof val === 'string') {
			if(typeof prob === 'number') {
				for(let i = 0; i < prob; ++i) {
					colorProbs.push(val);
				}
			}
		} else if(typeof val === 'object' && typeof prob === 'object'){
			colorProbs.push(...getColorsByChance(val, prob as ColorChancesType<typeof val>));
		}
	}

	return colorProbs;
};