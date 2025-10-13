import { Each } from "@fizzwiz/fluent";
import { Collection } from "./Collection.js";

/**
 * The {@link Queue} class extends {@link Collection} and acts as a 
 * template for defining essential methods that every sorted collection should implement:
 * 
 * - [peek()](#peek)
 * - [poll()](#poll) 
 * - [reverse()](#reverse)
 *  
 * It also provides concrete implementations based on these abstract methods, 
 * inherited by all subclasses of sorted collections: 
 * 
 *  - [select()](#select)
 * 
 */
export class Queue extends Collection {
	
	constructor() {
		super();
	}

	/**
	 * Retrieves the first item of `this` {@link Queue}.
	 * 
	 * @param {boolean} [first=true] If false, retrieves the last item instead.
	 * @returns {any} The retrieved item.
	 */
	peek(first = true) {
		throw new Error('Abstract method: peek() must be implemented by subclass.');
	}

	/**
	 * Extracts (removes and returns) the first item of `this` {@link Queue}.
	 * 
	 * @param {boolean} [first=true] If false, extracts the last item instead.
	 * @returns {any} The extracted item.
	 */
	poll(first = true) {
		throw new Error('Abstract method: poll() must be implemented by subclass.');
	}

	/**
	 * Provides an iterable reversed view of `this` {@link Queue}.
	 * 
	 * @returns {Each<any>} An iterable over the queue's elements in reverse order.
	 */
	reverse() {
		throw new Error('Abstract method: reverse() must be implemented by subclass.');
	}
	
	/**
	 * Selects and keeps the first `n` items of the queue, removing all other items.
	 * 
	 * @param {number} n - Number of items to keep in the queue
	 * @param {boolean} [first=true] - If true, selects items from the start; if false, from the end.
	 * @returns {Array<any>} An array containing the discarded items removed from the queue.
	 * 
	 */
	select(n, first = true) {
		if (n < 0) n = 0;
		const m = this.n() - n;
		const got = new Array(m < 0 ? 0 : m).fill(undefined);

		let i = first ? got.length - 1 : 0;
		const inc = first ? -1 : 1;
		
		while (this.n() > n) {
			const next = this.poll(!first);
			got[i] = next;
			i += inc;
		}
		
		return got;
	}

}
