import { App } from 'App';
import React from 'react';
import { render } from 'react-dom';

export const InitApp = (): void => {
	render(<App />, document.getElementById('root'));
};

declare global {
	interface Window { InitApp: () => void }
}

(window).InitApp = InitApp;