import { Queue } from "../core/Queue.js";
import { ORDER } from "../global.js";
import { ArrayQueue } from "./ArrayQueue.js";

/**
 * A {@link Queue} that keeps its items <b>sorted</b> using a comparator.<br><br>
 *
 * - Uniqueness is based on the comparator result (`0`).<br>
 * - Insertion maintains order.<br>
 * - Use {@link ORDER} for common comparators.<br><br>
 *
 * Example:<br>
 * <pre><code>
 * const queue = new SortedArray(ORDER.ASCENDING);
 * queue.add(3);
 * queue.add(1);  // inserted before 3
 * </code></pre>
 */
export class SortedArray extends ArrayQueue {

	/**
	 * @param {function} [comparator=ORDER.ASCENDING] Comparator function `(a, b) => -1|0|1`
	 * @param {Array<*>} [items=[]] Optional array of items (will be sorted)
	 */
	constructor(comparator = ORDER.ASCENDING, items = []) {
		super(true, []); // empty FIFO base
		this._comparator = comparator;
		this._items = [];

		for (const item of items) this.add(item);
	}

	/** @returns {Array<*>} Sorted internal array */
	get items() {
		return this._items;
	}

	/** @returns {function} The sorting comparator */
	get comparator() {
		return this._comparator;
	}

	/**
	 * Tests if an equivalent item exists (based on comparator).
	 * @param {*} item 
	 * @returns {boolean}
	 */
	has(item) {
		const [_, result] = SortedArray.logSearch(item, this.items, this.comparator);
		return result !== undefined;
	}

	/**
	 * Adds the `item` in sorted position if no equivalent exists.
	 * @param {*} item 
	 * @returns {boolean} True if added
	 */
	add(item) {
		const [index, found] = SortedArray.logSearch(item, this.items, this.comparator);
		if (found === undefined) {
			this.items.splice(index, 0, item);
			return true;
		}
		return false;
	}

	/**
	 * Removes an equivalent item (if present).
	 * @param {*} item 
	 * @returns {boolean} True if removed
	 */
	remove(item) {
		const [index, found] = SortedArray.logSearch(item, this.items, this.comparator);
		if (found !== undefined) {
			this.items.splice(index, 1);
			return true;
		}
		return false;
	}

	/**
	 * Performs binary search over a sorted array.
	 * 
	 * @param {*} item The item to search
	 * @param {Array<*>} array A sorted array
	 * @param {function} comparator Comparison function `(a, b) => -1|0|1`
	 * @param {number} [start=0] Inclusive start index
	 * @param {number} [end=array.length] Exclusive end index
	 * @returns {Array<number, * | undefined>} A pair `[index, result]`
	 */
	static logSearch(item, array, comparator, start = 0, end = array.length) {
		while (start < end) {
			const mid = (start + end) >>> 1;
			const cmp = comparator(array[mid], item);
			if (cmp === 0) return [mid, array[mid]];
			if (cmp < 0) start = mid + 1;
			else end = mid;
		}
		return [start, undefined];
	}
}

