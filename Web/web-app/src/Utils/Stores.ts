import { container } from 'inversify-hooks';
import { configure } from 'mobx';
import { Stores } from 'Stores/Stores';
import { ThemeStore } from 'Stores/ThemeStore';
import { TimerStore } from 'Stores/TimerStore';

export const setupStores = (): void => {
	configure({
		enforceActions: 'never'
	});

	container.addSingleton(ThemeStore, Stores.ThemeStore);
	container.addSingleton(TimerStore, Stores.TimerStore);
};