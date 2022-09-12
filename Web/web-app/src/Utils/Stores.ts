import { container } from 'inversify-hooks';
import { Stores } from 'Stores/Stores';
import { ThemeStore } from 'Stores/ThemeStore';

export const setupStores = (): void => {
	container.addSingleton(ThemeStore, Stores.ThemeStore);
};