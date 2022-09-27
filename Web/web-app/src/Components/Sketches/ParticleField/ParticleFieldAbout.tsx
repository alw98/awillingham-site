import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface ParticleFieldAboutProps {
	onClose: () => void;
}

export const ParticleFieldAbout: React.FC<ParticleFieldAboutProps> = ({onClose}) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				Drag your mouse to create particles.
				This is a particle flow field. The flow field itself is controlled by perlin noise.
				In order to make the transitions from one side of the screen to another, the plane is mapped onto a torus before generating the noise field.
				Almost every parameter can be controlled in the settings.
			</div>
		</BaseOptions>
	);
};
