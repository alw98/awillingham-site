import { makeObservable, observable } from 'mobx';
import { Schedule } from 'Models/Timer/Schedule';

import { AutoSavingStore } from './AutoSavingStore';

export class TimerStore extends AutoSavingStore {
	timerItems: Schedule = [];
	currentItem = 0;
	STORE_KEY = 'TimerStore';

	constructor() {
		super();
		makeObservable(this, {
			timerItems: observable,
			currentItem: observable
		});
		
		this.setupAutoSaving();
	}

}

export interface PropsWithTimerStore {
	timerStore: TimerStore;
}