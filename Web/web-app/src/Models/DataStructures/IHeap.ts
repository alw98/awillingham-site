export interface IHeap<T> {
	peek: () => T;
	pop: () => T;
	push: (val: T) => void;
	size: () => number;
	isEmpty: () => boolean;
}