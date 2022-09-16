import { useInject } from 'inversify-hooks';
import { observer } from 'mobx-react';
import React from 'react';
import { Stores } from 'Stores/Stores';
import { ThemeStore } from 'Stores/ThemeStore';

import { ColorsPage } from './ColorsPage';


export const ColorsPageContainer: React.FC = observer(() => {
	const [themeStore] = useInject<ThemeStore>(Stores.ThemeStore);

	return <ColorsPage themeStore={themeStore} />;
});