import { Each } from "@fizzwiz/fluent/core/Each.js";

/**
 * Abstract base class for iterable collections.
 *
 * The `Collection` class extends {@link Each} and defines a common interface
 * for both sorted and unsorted collection types.
 *
 * Subclasses must implement the following abstract methods:
 * 
 * - [n()](#n) 
 * - [has()](#has)
 * - [add()](#add)
 * - [remove()](#remove)
 * - [clear()](#clear)
 *
 * On top of these, `Collection` provides concrete utility methods:
 * 
 * - [isEmpty()](#isEmpty)
 * - [let()](#let)
 * - [letAll()](#letAll)
 * - [removeAll()](#removeAll)
 * 
 */
export class Collection extends Each {
	constructor() {
		super();
	}

	/**
	 * Returns the number of items in the collection.
	 * @returns {number}
	 */
	n() {
		throw new Error('Abstract method: n()');
	}

	/**
	 * Checks whether the collection contains the given item.
	 * @param {any} item
	 * @returns {boolean}
	 */
	has(item) {
		throw new Error('Abstract method: has(item)');
	}

	/**
	 * Adds the given item, if not already present.
	 * @param {any} item
	 * @returns {boolean} True if the collection was modified.
	 */
	add(item) {
		throw new Error('Abstract method: add(item)');
	}

	/**
	 * Removes the given item, if present.
	 * @param {any} item
	 * @returns {boolean} True if the collection was modified.
	 */
	remove(item) {
		throw new Error('Abstract method: remove(item)');
	}

	/**
	 * Removes all items from the collection.
	 */
	clear() {
		throw new Error('Abstract method: clear()');
	}

	/**
	 * Returns an iterator over the collection.
	 * @returns {Iterator}
	 */
	[Symbol.iterator]() {
		throw new Error('Abstract method: Symbol.iterator()');
	}

	/**
	 * Checks whether the collection is empty.
	 * @returns {boolean}
	 */
	isEmpty() {
		return this.n() === 0;
	}

	/**
	 * Adds the given item and returns the collection for chaining.
	 * @param {any} item
	 * @returns {Collection}
	 */
	let(item) {
		this.add(item);
		return this;
	}

	/**
	 * Adds all items from the iterable and returns the collection.
	 * @param {Iterable<any>} items
	 * @returns {Collection}
	 */
	letAll(items) {
		for (const item of items) {
			this.add(item);
		}
		return this;
	}

	/**
	 * Removes all given items from the collection.
	 * @param {Iterable<any>} items
	 * @returns {boolean} True if any items were removed.
	 */
	removeAll(items) {
		let modified = false;
		for (const item of items) {
			modified ||= this.remove(item);
		}
		return modified;
	}
}
