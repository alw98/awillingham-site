import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface SkyscrapersAboutProps {
	onClose: () => void;
}

export const SkyscrapersImprovedAbout: React.FC<SkyscrapersAboutProps> = ({onClose}) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				Draws the skyline for the given skyscrapers. Improved to O(nlogn) with priority queue.
			</div>
		</BaseOptions>
	);
};
