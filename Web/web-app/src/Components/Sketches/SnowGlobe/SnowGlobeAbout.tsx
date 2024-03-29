import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface SnowGlobeAboutProps {
	onClose: () => void;
}

export const SnowGlobeAbout: React.FC<SnowGlobeAboutProps> = ({ onClose }) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				A simple snow globe simulation using perlin noise and matter.js
			</div>
		</BaseOptions>
	);
};
