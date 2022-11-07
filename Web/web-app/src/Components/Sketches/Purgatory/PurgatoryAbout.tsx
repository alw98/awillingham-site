import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface PurgatoryAboutProps {
	onClose: () => void;
}

export const PurgatoryAbout: React.FC<PurgatoryAboutProps> = ({ onClose }) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				Inspired by the album Purgatory by Tyler Childers
			</div>
		</BaseOptions>
	);
};
