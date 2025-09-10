import { AsyncEach } from "@fizzwiz/fluent";

/**
 * Abstract base class for asynchronous iterable collections.
 *
 * The `AsyncCollection` class mirrors the synchronous {@link Collection}
 * interface, providing async CRUD-style operations and utilities for
 * sorted or unsorted data structures.
 *
 * ## Abstract Methods
 * Subclasses must implement the following:
 * - {@link n} — number of items in the collection
 * - {@link has} — check item membership
 * - {@link add} — add a new item
 * - {@link remove} — remove an existing item
 * - {@link clear} — clear all items
 * - {@link get} — retrieve items matching a query
 * - {@link [Symbol.asyncIterator]} — iterate over the collection
 *
 * ## Concrete Methods
 * Built on top of the abstract primitives:
 * - CRUD operations: {@link create}, {@link read}, {@link update}, {@link delete}
 * - Query helpers: {@link query}, {@link readAll}
 * - Utility methods: {@link isEmpty}, {@link let}, {@link addAll}, {@link removeAll}, {@link deleteAll}
 */
export class AsyncCollection extends AsyncEach {
	constructor() {
		super();
	}

	// ------------------ Abstract primitives ------------------

	/**
	 * Returns the number of items in the collection.
	 * @abstract
	 * @returns {Promise<number>}
	 */
	async n() {
		throw new Error("Abstract method: n()");
	}

	/**
	 * Checks whether the collection contains the given item.
	 * @abstract
	 * @param {any} item - The item to test for membership.
	 * @returns {Promise<boolean>} True if the item is present.
	 */
	async has(item) {
		throw new Error("Abstract method: has(item)");
	}

	/**
	 * Adds the given item to the collection.
	 * Semantics (allowing or rejecting duplicates) depend on the concrete subclass.
	 * @abstract
	 * @param {any} item - The item to add.
	 * @returns {Promise<boolean>} True if the collection was modified.
	 */
	async add(item) {
		throw new Error("Abstract method: add(item)");
	}

	/**
	 * Removes the given item from the collection.
	 * @abstract
	 * @param {any} item - The item to remove.
	 * @returns {Promise<boolean>} True if the collection was modified.
	 */
	async remove(item) {
		throw new Error("Abstract method: remove(item)");
	}

	/**
	 * Removes all items from the collection.
	 * @abstract
	 * @returns {Promise<void>}
	 */
	async clear() {
		throw new Error("Abstract method: clear()");
	}

	/**
	 * Retrieves items matching a given query.
	 * In the simplest case, the query is an item, and all equivalent items
	 * are returned. Subclasses may support richer query semantics.
	 * @abstract
	 * @param {any} query - The query object or value.
	 * @returns {AsyncEach<any>} A fluent AsyncEAch of all matching items.
	 */
	get(query) {
		throw new Error("Abstract method: get(query)");
	}

	/**
	 * Returns an async iterator over all items in the collection.
	 * @abstract
	 * @returns {AsyncIterator<any>}
	 */
	[Symbol.asyncIterator]() {
		throw new Error("Abstract method: Symbol.asyncIterator()");
	}

	// ------------------ CRUD operations ------------------

	/**
	 * **Create (C in CRUD)**
	 * Adds a new item if it is not already present.
	 * @param {any} item - The item to create.
	 * @returns {Promise<boolean>} True if the collection was modified.
	 */
	async create(item) {
		if (await this.has(item)) return false;
		return this.add(item);
	}

	/**
	 * **Read (R in CRUD)**
	 * Returns a single matching item, or `undefined` if none exist.
	 * Retrieves the "first" match from {@link get}.
	 * @param {any} item - The item or query to read.
	 * @returns {Promise<any|undefined>} The matching item or `undefined`.
	 */
	async read(item) {
		if (await this.has(item)) {
			for await (const val of this.get(item)) return val;
		}
		return undefined;
	}

	/**
	 * **Read All (extended CRUD)**
	 * Returns all items that match the given query.
	 * @param {any} query - The query to evaluate.
	 * @returns {AsyncIterable<any>} All matching items.
	 */
	readAll(query) {
		return this.get(query);
	}

	/**
	 * **Update (U in CRUD)**
	 * Replaces an existing item with a new one.
	 * Inserts the new item if `upsert` is true and old item is not found.
	 * @param {any} oldItem - The item to be replaced.
	 * @param {any} newItem - The new item to insert.
	 * @param {boolean} [upsert=false] - Whether to insert if `oldItem` is not found.
	 * @returns {Promise<boolean>} True if updated or inserted, false otherwise.
	 */
	async update(oldItem, newItem, upsert = false) {
		if (await this.has(oldItem)) {
			return (await this.remove(oldItem)) && (await this.add(newItem));
		} else if (upsert) {
			return this.add(newItem);
		}
		return false;
	}

	/**
	 * **Delete (D in CRUD)**
	 * Removes an item from the collection.
	 * @param {any} item - The item to delete.
	 * @returns {Promise<boolean>} True if the collection was modified.
	 */
	async delete(item) {
		return this.remove(item);
	}

	/**
	 * **Delete Many (extended CRUD)**
	 * Removes all given items from the collection.
	 * Alias of {@link removeAll}.
	 * @param {Iterable<any> | AsyncIterable<any>} items - Items to delete.
	 * @returns {Promise<any[]>} List of actually removed items.
	 */
	async deleteAll(items) {
		return this.removeAll(items);
	}

	// ------------------ Query helpers ------------------

	/**
	 * Alias for {@link get}, for database-style terminology.
	 * @param {any} query - The query to evaluate.
	 * @returns {AsyncEach<any>} All matching items.
	 */
	query(query) {
		return this.get(query);
	}

	// ------------------ Utility methods ------------------

	/**
	 * Checks whether the collection is empty.
	 * @returns {Promise<boolean>} True if the collection has no items.
	 */
	async isEmpty() {
		return (await this.n()) === 0;
	}

	/**
	 * Adds all items from an iterable.
	 * @param {Iterable<any> | AsyncIterable<any>} items - Items to add.
	 * @returns {Promise<any[]>} List of actually added items.
	 */
	async addAll(items) {
		const added = [];
		for await (const item of items) {
			if (await this.add(item)) added.push(item);
		}
		return added;
	}

	/**
	 * Removes all given items from the collection.
	 * @param {Iterable<any> | AsyncIterable<any>} items - Items to remove.
	 * @returns {Promise<any[]>} List of actually removed items.
	 */
	async removeAll(items) {
		const removed = [];
		for await (const item of items) {
			if (await this.remove(item)) removed.push(item);
		}
		return removed;
	}
}
