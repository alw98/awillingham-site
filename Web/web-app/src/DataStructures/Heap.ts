import { Comparable } from 'Models/DataStructures/Comparable';
import { IHeap } from 'Models/DataStructures/IHeap';

//If compare(1, 2) returns negative, this is a min heap.
export class Heap<T extends Comparable<T>> implements IHeap<T> {
	heapArray: T[];
	heapifyOnChange: boolean;

	constructor(vals?: T[], heapifyOnChange?: boolean) {
		this.heapArray = vals ? [...vals] : [];
		this.heapifyOnChange = heapifyOnChange ?? true;
		if(this.heapifyOnChange){
			this.heapify();
		}
	}

	//peek at the top value without modifying the heap
	peek(): T {
		return this.heapArray[0];
	}

	//pop the top value off the top of the heap, then re-heapify
	pop(): T {
		const result = this.heapArray[0];
		if(!this.isEmpty()) {
			const popped = this.heapArray.pop();
			if(!this.isEmpty()) {
				this.heapArray[0] = popped;
			}
			if(this.heapifyOnChange) {
				this.siftDown();
			}
		}
		return result;
	}

	push(...vals: T[]) {
		vals.forEach((val) => {
			this.heapArray.push(val);
			if(this.heapifyOnChange) {
				this.siftUp();
			}
		});
		
	}

	//Heapify the internal values array.
	heapify() {
		const tmp: T[] = this.heapArray;
		this.heapArray = [];
		tmp.forEach((val) => {
			this.heapArray.push(val);
			this.siftUp();
		});
	}

	//Move the last node in the tree up until the heap condition is satisfied
	siftUp() {
		let nodeInd = this.heapArray.length - 1;
		let newNodeInd = this.siftUpOneStep(nodeInd);
		while(newNodeInd !== nodeInd) {
			nodeInd = newNodeInd;
			newNodeInd = this.siftUpOneStep(nodeInd);
		}
	}

	//Move the first node in the tree down until the heap condition is satisfied
	siftDown() {
		let nodeInd = 0;
		let newNodeInd = this.siftDownOneStep(nodeInd);
		while(newNodeInd !== nodeInd) {
			nodeInd = newNodeInd;
			newNodeInd = this.siftDownOneStep(nodeInd);
		}
	}

	//Move the node ind up the tree by one level, if it satifies the heap condition.
	//Returns the new node position.
	siftUpOneStep(nodeInd: number): number {
		if(nodeInd === 0) return nodeInd;
		const curNode = this.heapArray[nodeInd];
		const parentInd = Heap.getParentIndex(nodeInd);
		const parentNode = this.heapArray[parentInd];
		if(curNode.compare(curNode, parentNode) < 0) {
			this.heapArray[nodeInd] = parentNode;
			this.heapArray[parentInd] = curNode;
			nodeInd = parentInd;
		}
		return nodeInd;
	}

	//Move the node ind down the tree by one level, if it satisfies the heap condition.
	//Returns the new node position.
	siftDownOneStep(nodeInd: number): number {
		const childOneInd = Heap.getFirstChildIndex(nodeInd);
		if(childOneInd >= this.heapArray.length) return nodeInd;
		const curNode = this.heapArray[nodeInd];
		const childTwoInd = childOneInd + 1;
		const childOne = this.heapArray[childOneInd];
		const childTwo = this.heapArray[childTwoInd];

		let toCheckInd = childOneInd;
		let toCheck = childOne;
		if(childTwo && childTwo.compare(childTwo, childOne) < 0) {
			toCheckInd = childTwoInd;
			toCheck = childTwo;
		}

		if(curNode.compare(curNode, toCheck) > 0) {
			this.heapArray[nodeInd] = toCheck;
			this.heapArray[toCheckInd] = curNode;
			nodeInd = toCheckInd;
		}
		return nodeInd;
	}

	//Return the number of elements in the heap
	size(): number {
		return this.heapArray.length;
	}

	//Return if the heap is empty
	isEmpty(): boolean {
		return this.heapArray.length === 0;
	}

	//Get the parent index of the given node index
	static getParentIndex(nodeInd: number): number {
		return Math.floor((nodeInd - 1) / 2);
	}

	//Get the index of the first child of the given node. Not guaranteed to exist.
	static getFirstChildIndex(nodeInd: number): number {
		return nodeInd * 2 + 1;
	}
}