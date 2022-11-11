import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface CannyEdgeDetectionAboutProps {
	onClose: () => void;
}

export const CannyEdgeDetectionAbout: React.FC<CannyEdgeDetectionAboutProps> = ({ onClose }) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				A Canny edge detection algorithm, purely takes the difference between nearby pixels up and down.
			</div>
		</BaseOptions>
	);
};
