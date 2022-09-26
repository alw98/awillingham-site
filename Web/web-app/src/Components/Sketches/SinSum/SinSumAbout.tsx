import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface SinSumAboutProps {
	onClose: () => void;
}

export const SinSumAbout: React.FC<SinSumAboutProps> = ({onClose}) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				This is a simulation of cycloid motion. Each circle can be represented as a 
				sin function with a frequency, amplitude and phase, which can all be controlled in the settings.
			</div>
		</BaseOptions>
	);
};
