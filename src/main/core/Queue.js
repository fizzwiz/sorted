import { Each } from "@fizzwiz/fluent";
import { Collection } from "./Collection.js";

/**
 * The {@link Queue} class extends {@link Collection} and acts as a<br>
 * template for defining essential methods that every sorted collection should implement:<br><br>
 *
 * <b>Abstract Methods</b>:<br>
 * - [peek()](#peek)<br>
 * - [poll()](#poll)<br>
 * - [reverse()](#reverse)<br><br>
 *
 * <b>Concrete Methods</b>:<br>
 * Based on the abstract methods, these are inherited by all subclasses<br>
 * of sorted collections:<br>
 * - [select()](#select)<br>
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
		const got = this.peek(first);
		this.remove(got);
		return got;
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
