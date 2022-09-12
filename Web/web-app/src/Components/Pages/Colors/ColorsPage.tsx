import { cid,useInject } from 'inversify-hooks';
import React from 'react';
import { ThemeStore } from 'Stores/ThemeStore';

import { ColorPicker } from './ColorPicker';

export const ColorsPage: React.FC = () => {
	const [themeStore] = useInject<ThemeStore>(cid.ThemeStore);

	return (
		<ColorPicker />
	);
};
