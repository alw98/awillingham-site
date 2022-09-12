import { autorun } from 'mobx';

export abstract class AutoSavingStore {
	setupAutoSaving() {
		this.loadFromLocalStorage();
		autorun(this.saveToLocalStorage.bind(this));
	}

	loadFromLocalStorage() {
		type KeyType = keyof this;
		const saved: {[prop: string]: never} = JSON.parse(localStorage.getItem(this.STORE_KEY));
		if(saved) {
			for(const key of Object.keys(saved)) {
				this[key as KeyType] = saved[key];
			}
		}
	}

	saveToLocalStorage() {
		type KeyType = keyof this;
		const toSave: {[prop: string]: unknown} = {};
		for(const key of Object.keys(this)) {
			if(key !== 'STORE_KEY'){
				toSave[key] = this[key as KeyType];
			}
		}
		localStorage.setItem(this.STORE_KEY, JSON.stringify(toSave));
	}

	abstract get STORE_KEY(): string;
}