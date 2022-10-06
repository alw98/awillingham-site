import { Comparator } from './Comparator';

export interface Comparable<T> {
	compare: Comparator<T>;
}