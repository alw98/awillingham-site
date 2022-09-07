import { App } from 'App';
import { ColorsPage } from 'Components/Pages/Colors';
import { HomePage } from 'Components/Pages/Home';
import React, { StrictMode } from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export const InitApp = (): void => {
	const rootElement = document.getElementById('root');
	const root = createRoot(rootElement);
	root.render(
		<StrictMode>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App/>}>
						<Route path="/" element={<HomePage />} />
						<Route path="colors" element={<ColorsPage />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</StrictMode>
	);
};

declare global {
	interface Window { InitApp: () => void }
}

(window).InitApp = InitApp;