import { App } from 'App';
import { InitApp } from 'index';
import React from 'react';
import * as reactdom from 'react-dom';

jest.mock('react-dom');

describe('index', () => {
	it('calls react-dom render', () => {
		const renderSpy = jest.spyOn(reactdom, 'render');
		InitApp();
		expect(renderSpy).toHaveBeenCalledTimes(1);
		expect(renderSpy).toHaveBeenCalledWith(<App />, document.getElementById('root'));
	});

	it('attaches to window.InitApp', () => {
		expect(window.InitApp).not.toBeUndefined();
		expect(window.InitApp).toBe(InitApp);
	});
});