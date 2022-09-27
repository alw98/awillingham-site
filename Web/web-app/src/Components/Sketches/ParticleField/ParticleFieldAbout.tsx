import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface ParticleFieldAboutProps {
	onClose: () => void;
}

export const ParticleFieldAbout: React.FC<ParticleFieldAboutProps> = ({onClose}) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				This is a particle flow field. Almost every parameter can be controlled in the settings.
			</div>
		</BaseOptions>
	);
};
