import 'reflect-metadata';

import { App } from 'App';
import { ColorsPageContainer } from 'Components/Pages/Colors/ColorsPageContainer';
import { HomePage } from 'Components/Pages/Home';
import React from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { setupStores } from 'Utils/Stores';

export const InitApp = (): void => {
	setupStores();
	
	const rootElement = document.getElementById('root');
	const root = createRoot(rootElement);
	root.render(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App/>}>
					<Route path="/" element={<HomePage />} />
					<Route path="colors" element={<ColorsPageContainer />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

declare global {
	interface Window { InitApp: () => void }
}

(window).InitApp = InitApp;