import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface EdgeDetectionAboutProps {
	onClose: () => void;
}

export const EdgeDetectionAbout: React.FC<EdgeDetectionAboutProps> = ({ onClose }) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				A simple edge detection algorithm, purely takes the difference between nearby pixels up and down.
			</div>
		</BaseOptions>
	);
};
