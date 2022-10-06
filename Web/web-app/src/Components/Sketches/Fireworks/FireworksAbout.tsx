import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface FireworksAboutAboutProps {
	onClose: () => void;
}

export const FireworksAbout: React.FC<FireworksAboutAboutProps> = ({onClose}) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				Simple fireworks with gravity. Firework lifespan dealt with priority queue.
			</div>
		</BaseOptions>
	);
};
