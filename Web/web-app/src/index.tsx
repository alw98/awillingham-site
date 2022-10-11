import 'reflect-metadata';

import { App } from 'App';
import { ColorsPage } from 'Components/Pages/Colors/ColorsPage';
import { EulerPage } from 'Components/Pages/Euler/EulerPage';
import { Gallery } from 'Components/Pages/Gallery';
import { HomePage } from 'Components/Pages/Home';
import { GallerySketches } from 'Components/Sketches/GallerySketches';
import { container } from 'inversify-hooks';
import React from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Stores } from 'Stores/Stores';
import { ThemeStore } from 'Stores/ThemeStore';
import { setupStores } from 'Utils/Stores';

export const InitApp = (): void => {
	setupStores();
	const themeStore = container.get<ThemeStore>(Stores.ThemeStore);

	const galleryElementRoutes = GallerySketches.map((val, i) => {
		
		return <Route key={i} path={'gallery/' + val.propsStore.name} element={<val.sketch themeStore={themeStore} propsStore={val.propsStore} />} />;
	});	

	const rootElement = document.getElementById('root');
	const root = createRoot(rootElement);
	root.render(
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App/>}>
					<Route path="/" element={<HomePage themeStore={themeStore} />} />
					<Route path="colors" element={<ColorsPage themeStore={themeStore} />} />
					<Route path="projecteuler" element={<EulerPage themeStore={themeStore} />} />
					<Route path="gallery" element={<Gallery />} />
					{galleryElementRoutes}
					<Route path="*" element={<Navigate to="/" />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
};

declare global {
	interface Window { InitApp: () => void }
}

(window).InitApp = InitApp;