import { action, autorun, makeObservable, observable, toJS } from 'mobx';
import { Theme } from 'Models/Theme';
import { DarkTheme } from 'Themes/DarkTheme';
import { LightTheme } from 'Themes/LightTheme';

import { AutoSavingStore } from './AutoSavingStore';

export class ThemeStore extends AutoSavingStore {
	theme: Theme = new DarkTheme();
	colorPageThemeStore = { theme: this.theme };
	usingLightTheme = true;
	usingDefaultTheme = true;
	STORE_KEY = 'ThemeStore';

	constructor() {
		super();
		makeObservable(this, {
			theme: observable,
			colorPageThemeStore: observable,
			usingLightTheme: observable,
			usingDefaultTheme: observable,
			switchDefaultTheme: action,
			setTheme: action
		});

		autorun(this.updateColorPageThemeStore.bind(this));
		this.setupAutoSaving();
	}

	updateColorPageThemeStore() {
		this.colorPageThemeStore.theme = {...toJS(this.theme)};
	}

	setTheme(theme: Theme) {
		this.theme = theme;
	}

	switchDefaultTheme() {
		if(!this.usingDefaultTheme)
			return;
		if(this.usingLightTheme) {
			this.usingLightTheme = false;
			this.theme = new DarkTheme(); 
		} else {
			this.usingLightTheme = true;
			this.theme = new LightTheme();
		}
	}
}

export interface PropsWithThemeStore {
	themeStore: ThemeStore;
}

//What do we want this to do?
//Keep track of all the existing themes
//Keep track of the current theme
//Allow switching between themes
//Allow editing/adding/removing themes
//Handle automatically saving and loading themes from localstorage
//Handle automatically saving and loading from server?
