import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface StainedGlassAboutProps {
	onClose: () => void;
}

export const StainedGlassAbout: React.FC<StainedGlassAboutProps> = ({ onClose }) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				A beautiful stained glass mosaic, randomly generated
			</div>
		</BaseOptions>
	);
};
