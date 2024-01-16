import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface SimpleEdgeDetectionAboutProps {
	onClose: () => void;
}

export const SimpleEdgeDetectionAbout: React.FC<SimpleEdgeDetectionAboutProps> = ({ onClose }) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				A simple edge detection algorithm, purely takes the difference between nearby pixels up and down.
			</div>
		</BaseOptions>
	);
};
