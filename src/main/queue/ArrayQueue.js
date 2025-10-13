import { Queue } from "../core/Queue.js";
import { Collection } from "../core/Collection.js";
import { Each } from "@fizzwiz/fluent";

/**
 * A basic queue implementation based on an internal array.
 * 
 * In {@link ArrayQueue}, newly added items are always appended to the end of the internal array.
 * The extraction order is controlled by a Boolean flag:
 * 
 * - {@link ArrayQueue#fifo | fifo}  
 * 
 * When `fifo` is `true`, items follow First-In-First-Out (FIFO) behavior; otherwise, they follow LIFO.
 * 
 * Notably, all items are treated as unique: no equivalence or identity checking is used.
 * Even identical items are considered distinct, and:
 * 
 * - {@link Collection#has}
 * - {@link Collection#remove}
 * 
 * always return `false`.
 * 
 * The class is optimized for usage of:
 * - {@link ArrayQueue#add}
 * - {@link ArrayQueue#peek}
 * - {@link ArrayQueue#poll}
 * 
 */
export class ArrayQueue extends Queue {
	
	/**
	 * Creates an {@link ArrayQueue}.
	 * 
	 * @param {boolean} [fifo=true] - If true, uses FIFO ordering; otherwise, LIFO.
	 * @param {Array<any>} [items=[]] - Optional initial array of items.
	 */
	constructor(fifo = true, items = []) {
		super();
		this._fifo = fifo;
		this._items = items;
	}

	/** @returns {boolean} Whether extraction follows FIFO (otherwise, LIFO). */
	get fifo() {
		return this._fifo;
	}

	/** @returns {Array<any>} The internal array of stored items. */
	get items() {
		return this._items;
	}
	
	/** @returns {number} The number of items in the queue. */
	n() {
		return this.items.length;
	}

	/** 
	 * Always returns `false` because this queue does not support item equivalence.
	 * 
	 * @returns {boolean}
	 */
	has(item) {
		return false;
	}

	/** 
	 * Appends an item to the queue.
	 * 
	 * @param {*} item - The item to add.
	 * @returns {boolean} Always `true`.
	 */
	add(item) {
		this.items.push(item);
		return true;
	}

	/**
	 * Always returns `false`. Items cannot be removed by value.
	 * 
	 * @param {*} item - The item to remove.
	 * @returns {boolean} Always `false`.
	 */
	remove(item) {
		return false;
	}
	
	/**
	 * Retrieves (without removing) the first or last item based on direction.
	 * 
	 * @param {boolean} [first=true] - If false, retrieves the last item.
	 * @returns {*} The retrieved item.
	 */
	peek(first = true) {
		return this.items[this.index(first)];
	}

	/**
	 * Retrieves and removes the first or last item based on direction.
	 * 
	 * @param {boolean} [first=true] - If false, removes from the end.
	 * @returns {*} The extracted item.
	 */
	poll(first = true) {
		const index = this.index(first);
		return index === 0 ? this.items.shift() : this.items.pop();
	}

	/**
	 * Computes the internal array index for first or last item depending on `fifo`.
	 * 
	 * @param {boolean} first - Whether to return the index of the first or last item.
	 * @returns {number} The index in the array.
	 * @private
	 */
	index(first) {
		if (this.fifo) {
			return first ? 0 : this.items.length - 1;
		} else {
			return first ? this.items.length - 1 : 0;
		}
	}	
	
	/**
	 * Removes all items from the queue.
	 */
	clear() {
		this.items.length = 0;
		return true;
	}
	
	/**
	 * Provides a default forward iterator over the queue.
	 * 
	 * @returns {Iterator<any>}
	 */
	[Symbol.iterator]() {
		return this.items[Symbol.iterator]();
	}

	/**
	 * Returns an iterable view over this queue in reverse order.
	 * 
	 * @returns {Each<any>} An `Each` instance yielding the queue items from end to start.
	 * 
	 * @remarks
	 * The result is an {@link Each}, not a new {@link Queue} instance.
	 * The original queue is left unchanged.
	 */
	reverse() {
		const view = new Each();
		const outer = this;
		
		view[Symbol.iterator] = function* () {
			let i = outer.items.length - 1;
			while (i >= 0) {
				yield outer.items[i];
				i--;
			}
		};

		return view;
	}
}
