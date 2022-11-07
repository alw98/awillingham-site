import { StyledLink } from 'Components/Nav/StyledLink';
import React from 'react';

import { BaseOptions } from '../BaseOptions';

interface TimesTablesAboutProps {
	onClose: () => void;
}

export const TimesTablesAbout: React.FC<TimesTablesAboutProps> = ({onClose}) => {
	return (
		<BaseOptions onClose={onClose}>
			<div>
				This is a representation of times tables, inspired by Mathologer <StyledLink href='https://www.youtube.com/watch?v=qhbuKbxJsk8'>here</StyledLink>. 
				 In the settings you can control the rate of change of the multiplier, the multiplier start, the size, color and resolution.
			</div>
		</BaseOptions>
	);
};
