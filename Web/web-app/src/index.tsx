import 'reflect-metadata';

import { App } from 'App';
import { ColorsPage } from 'Components/Pages/Colors/ColorsPage';
import { HomePage } from 'Components/Pages/Home';
import { container } from 'inversify-hooks';
import React from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Stores } from 'Stores/Stores';
import { ThemeStore } from 'Stores/ThemeStore';
import { setupStores } from 'Utils/Stores';

export const InitApp = (): void => {
	setupStores();
	const themeStore = container.get<ThemeStore>(Stores.ThemeStore);

	const rootElement = document.getElementById('root');
	const root = createRoot(rootElement);
	root.render(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App/>}>
					<Route path="/" element={<HomePage />} />
					<Route path="colors" element={<ColorsPage themeStore={themeStore} />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

declare global {
	interface Window { InitApp: () => void }
}

(window).InitApp = InitApp;