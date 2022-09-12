import { container } from 'inversify-hooks';
import { ThemeStore } from 'Stores/ThemeStore';

export const setupStores = (): void => {
	container.addSingleton(ThemeStore);
};