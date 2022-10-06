import { Heap } from 'DataStructures/Heap';
import { Comparable } from 'Models/DataStructures/Comparable';

describe('Heap', () => {
	describe('constructors', () => {
		it('creates an empty heap when using no params', () => {
			const heap = new Heap<MinHeapItem>();

			expect(heap.size()).toBe(0);
		});

		it('creates a min heap when given values', () => {
			const heap = new Heap(defaultMinHeapValues);

			expect(heap.size()).toBe(defaultMinHeapValues.length);
			expect(heap.heapArray.map((val) => val.val)).toEqual([0, 3, 1, 5, 4, 2]);
		});

		it('creates a max heap when given values', () => {
			const heap = new Heap(defaultMaxHeapValues);

			expect(heap.size()).toBe(defaultMaxHeapValues.length);
			expect(heap.heapArray.map((val) => val.val)).toEqual([5, 2, 4, 0, 1, 3]);
		});

		it('doesn\'t heapify when made if flag passed', () => {
			const heap = new Heap(defaultMinHeapValues, false);

			expect(heap.size()).toBe(defaultMinHeapValues.length);
			expect(heap.heapArray.map((val) => val.val)).toEqual([5, 2, 0, 3, 4, 1]);
		});
	});

	describe('siftUp', () => {
		it('sifts a value from the bottom of the heap to the top for a min heap', () => {
			const heap = new Heap(defaultMinHeapValues);
			heap.push(new MinHeapItem(-1));
			heap.siftUp();

			expect(heap.heapArray.map((val) => val.val)).toEqual([-1, 3, 0, 5, 4, 2, 1]);
		});

		it('sifts a value from the bottom of the heap to the top for a max heap', () => {
			const heap = new Heap(defaultMaxHeapValues);
			heap.push(new MaxHeapItem(6));
			heap.siftUp();

			expect(heap.heapArray.map((val) => val.val)).toEqual([6, 2, 5, 0, 1, 3, 4]);
		});
	});


	describe('siftUpOneStep', () => {
		it('sifts a value from the bottom of the heap to the top for a min heap', () => {
			const heap = new Heap<MinHeapItem>();
			heap.heapifyOnChange = false;
			heap.push(new MinHeapItem(4));
			heap.push(new MinHeapItem(3));
			heap.push(new MinHeapItem(5));
			heap.push(new MinHeapItem(1));
			
			let newInd = heap.siftUpOneStep(heap.heapArray.length - 1);

			expect(heap.heapArray.map((val) => val.val)).toEqual([4, 1, 5, 3]);
			expect(newInd).toBe(1);

			newInd = heap.siftUpOneStep(newInd);

			expect(heap.heapArray.map((val) => val.val)).toEqual([1, 4, 5, 3]);
			expect(newInd).toBe(0);

			newInd = heap.siftUpOneStep(newInd);

			expect(heap.heapArray.map((val) => val.val)).toEqual([1, 4, 5, 3]);
			expect(newInd).toBe(0);
		});

		it('sifts a value from the bottom of the heap to the top for a max heap', () => {
			const heap = new Heap<MaxHeapItem>();
			heap.heapifyOnChange = false;
			heap.push(new MaxHeapItem(4));
			heap.push(new MaxHeapItem(3));
			heap.push(new MaxHeapItem(1));
			heap.push(new MaxHeapItem(5));

			let newInd = heap.siftUpOneStep(heap.heapArray.length - 1);

			expect(heap.heapArray.map((val) => val.val)).toEqual([4, 5, 1, 3]);
			expect(newInd).toBe(1);

			newInd = heap.siftUpOneStep(newInd);

			expect(heap.heapArray.map((val) => val.val)).toEqual([5, 4, 1, 3]);
			expect(newInd).toBe(0);

			newInd = heap.siftUpOneStep(newInd);

			expect(heap.heapArray.map((val) => val.val)).toEqual([5, 4, 1, 3]);
			expect(newInd).toBe(0);
		});
	});

	describe('peek', () => {
		it('should return the top value without modifying', () => {
			const heap = new Heap(defaultMinHeapValues);
			
			const val = heap.peek();

			expect(heap.size()).toBe(defaultMinHeapValues.length);
			expect(val).toBe(defaultMinHeapValues[2]);
		});
	});

	describe('pop', () => {
		it('pops top value off, then re-heapifies the structure for a min heap', () => {
			const heap = new Heap(defaultMinHeapValues);

			const val = heap.pop();

			expect(heap.size()).toBe(defaultMinHeapValues.length - 1);
			expect(val).toBe(defaultMinHeapValues[2]);
			expect(heap.heapArray.map((val) => val.val)).toEqual([1, 3, 2, 5, 4]);
		});

		it('pops top value off, then re-heapifies the structure for a max heap', () => {
			const heap = new Heap(defaultMaxHeapValues);

			const val = heap.pop();

			expect(heap.size()).toBe(defaultMaxHeapValues.length - 1);
			expect(val).toBe(defaultMaxHeapValues[2]);
			expect(heap.heapArray.map((val) => val.val)).toEqual([4, 2, 3, 0, 1]);
		});

		it('can be emptied as a min heap', () => {
			const heap = new Heap(defaultMinHeapValues);
			const vals = [];

			while(!heap.isEmpty()) {
				vals.push(heap.pop().val);
			}

			expect(vals).toEqual([0, 1, 2, 3, 4, 5]);
		});

		it('can be emptied as a max heap', () => {
			const heap = new Heap(defaultMaxHeapValues);
			const vals = [];

			while(!heap.isEmpty()) {
				vals.push(heap.pop().val);
			}

			expect(vals).toEqual([5, 4, 3, 2, 1, 0]);
		});
	});

	describe('push', () => {
		it('pushes and heapifies with new items', () => {
			const heap = new Heap(defaultMinHeapValues);
			const toPush = new MinHeapItem(-1);

			heap.push(toPush);
			
			expect(heap.peek()).toBe(toPush);
		});

		it('pushes and heapifies with multiples items', () => {
			const heap = new Heap(defaultMinHeapValues);
			const toPush = [new MinHeapItem(-1), new MinHeapItem(-3), new MinHeapItem(-2)];

			heap.push(...toPush);
			
			const top = [heap.pop(), heap.pop(), heap.pop()];
			expect(top.map((val) => val.val)).toEqual([-3, -2, -1]);
		});
	});
	describe('size', () => {
		it.each([
			[[1, 2, 3, 4, 5], 5],
			[[1, 2], 2],
			[[], 0]
		])('should return the correct size', (vals, expected) => {
			const heap = new Heap(vals.map((val) => new MinHeapItem(val)));

			expect(heap.size()).toBe(expected);
		});
	});

	describe('isEmpty', () => {
		it('returns true when it is empty', () => {
			const heap = new Heap<MinHeapItem>();

			expect(heap.isEmpty()).toBeTruthy();

			heap.push(new MinHeapItem(5));
			heap.pop();

			expect(heap.isEmpty()).toBeTruthy();
		});
	});

	describe('siftDownOneStep', () => {
		it('sifts a value from the top of the heap to the bottom for a min heap', () => {
			const heap = new Heap<MinHeapItem>();
			heap.heapifyOnChange = false;
			heap.push(new MinHeapItem(4));
			heap.push(new MinHeapItem(3));
			heap.push(new MinHeapItem(5));
			heap.push(new MinHeapItem(1));
			
			let newInd = heap.siftDownOneStep(0);

			expect(heap.heapArray.map((val) => val.val)).toEqual([3, 4, 5, 1]);
			expect(newInd).toBe(1);

			newInd = heap.siftDownOneStep(newInd);

			expect(heap.heapArray.map((val) => val.val)).toEqual([3, 1, 5, 4]);
			expect(newInd).toBe(3);

			newInd = heap.siftDownOneStep(newInd);

			expect(heap.heapArray.map((val) => val.val)).toEqual([3, 1, 5, 4]);
			expect(newInd).toBe(3);
		});

		it('sifts a value from the top of the heap to the bottom for a max heap', () => {
			const heap = new Heap<MaxHeapItem>();
			heap.heapifyOnChange = false;
			heap.push(new MaxHeapItem(1));
			heap.push(new MaxHeapItem(3));
			heap.push(new MaxHeapItem(4));
			heap.push(new MaxHeapItem(5));
			
			let newInd = heap.siftDownOneStep(0);

			expect(heap.heapArray.map((val) => val.val)).toEqual([4, 3, 1, 5]);
			expect(newInd).toBe(2);

			newInd = heap.siftDownOneStep(newInd);

			expect(heap.heapArray.map((val) => val.val)).toEqual([4, 3, 1, 5]);
			expect(newInd).toBe(2);
		});
	});

	describe('getParentIndex', () => {
		it.each([[0, 1], [0, 2], [1, 3], [1, 4], [4, 10], [5, 11]])
		('should return %p for %p', (expected, childInd) => {
			expect(Heap.getParentIndex(childInd)).toBe(expected);
		});
	});

	describe('getFirstChildIndex', () => {
		it.each([[1, 0], [3, 1], [11, 5], [5, 2]])
		('should return %p for %p', (expected, parentInd) => {
			expect(Heap.getFirstChildIndex(parentInd)).toBe(expected);
		});
	});
});

class MinHeapItem implements Comparable<MinHeapItem> {
	val: number;
	constructor(val: number) {
		this.val = val;
	}

	compare(val1: MinHeapItem, val2: MinHeapItem): number {
		return val1.val - val2.val;
	}
}

class MaxHeapItem extends MinHeapItem {
	compare(val1: MinHeapItem, val2: MinHeapItem): number {
		return val2.val - val1.val;
	}
}

const defaultMinHeapValues = [
	new MinHeapItem(5),
	new MinHeapItem(2),
	new MinHeapItem(0),
	new MinHeapItem(3),
	new MinHeapItem(4),
	new MinHeapItem(1),
];

const defaultMaxHeapValues = [
	new MaxHeapItem(0),
	new MaxHeapItem(3),
	new MaxHeapItem(5),
	new MaxHeapItem(1),
	new MaxHeapItem(2),
	new MaxHeapItem(4)
];