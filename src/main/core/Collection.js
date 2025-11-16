import { Each } from "@fizzwiz/fluent";

/**
 * Abstract base class for iterable collections.<br>
 * The `Collection` class defines a unified, database-inspired interface<br>
 * for both sorted and unsorted data structures. It combines abstract<br>
 * collection primitives with concrete CRUD-style operations and utility<br>
 * methods.<br><br>
 *
 * <b>Abstract Methods</b>:<br>
 * Subclasses must implement the following:<br>
 * - {@link n} — number of items in the collection<br>
 * - {@link has} — check item membership<br>
 * - {@link add} — add a new item<br>
 * - {@link remove} — remove an existing item<br>
 * - {@link clear} — clear all items<br>
 * - {@link get} — retrieve items matching a query<br>
 * - {@link [Symbol.iterator]} — iterate over the collection<br><br>
 *
 * <b>Concrete Methods</b>:<br>
 * Built on top of the abstract primitives, the base class provides:<br>
 * - CRUD operations: {@link create}, {@link read}, {@link update}, {@link delete}<br>
 * - Query helpers: {@link query}, {@link readAll}<br>
 * - Utility methods: {@link isEmpty}, {@link let}, {@link letAll}, {@link removeAll}, {@link deleteAll}<br>
 */
export class Collection extends Each {
	constructor() {
		super();
	}

	// -----------------------------------------------------
	// Abstract primitives
	// -----------------------------------------------------

	/**
	 * Returns the number of items in the collection.
	 * @abstract
	 * @returns {number}
	 */
	n() {
		throw new Error("Abstract method: n()");
	}

	/**
	 * Checks whether the collection contains the given item.
	 * @abstract
	 * @param {any} item - The item to test for membership.
	 * @returns {boolean} True if the item is present, false otherwise.
	 */
	has(item) {
		throw new Error("Abstract method: has(item)");
	}

	/**
	 * Adds the given item to the collection.
	 * Semantics (allowing or rejecting duplicates) depend on the concrete subclass.
	 * @abstract
	 * @param {any} item - The item to add.
	 * @returns {boolean} True if the collection was modified.
	 */
	add(item) {
		throw new Error("Abstract method: add(item)");
	}

	/**
	 * Removes the given item from the collection.
	 * @abstract
	 * @param {any} item - The item to remove.
	 * @returns {boolean} True if the collection was modified.
	 */
	remove(item) {
		throw new Error("Abstract method: remove(item)");
	}

	/**
	 * Removes all items from the collection.
	 * @abstract
	 * @returns {boolean} True if the collection was cleared.
	 */
	clear() {
		throw new Error("Abstract method: clear()");
	}

	/**
	 * Retrieves items matching a given query.
	 * In the simplest case, the query is an item, and all equivalent items
	 * are returned. Subclasses may support richer query semantics.
	 * @abstract
	 * @param {any} query - The query object or value.
	 * @returns {Iterable<any>} An iterable of all matching items.
	 */
	get(query) {
		throw new Error("Abstract method: get(query)");
	}

	/**
	 * Returns an iterator over all items in the collection.
	 * @abstract
	 * @returns {Iterator<any>}
	 */
	[Symbol.iterator]() {
		throw new Error("Abstract method: Symbol.iterator()");
	}

	// -----------------------------------------------------
	// CRUD operations
	// -----------------------------------------------------

	/**
	 * **Create (C in CRUD):**
	 * Adds a new item if it is not already present.
	 * @param {any} item - The item to create.
	 * @returns {boolean} True if the collection was modified.
	 */
	create(item) {
		if (this.has(item)) return false;
		return this.add(item);
	}

	/**
	 * **Read (R in CRUD):**
	 * Returns a single matching item, or `undefined` if none exist.
	 * By default, this retrieves the "first" match from {@link get}.
	 * @param {any} item - The item or query to read.
	 * @returns {any|undefined} The matching item, or `undefined`.
	 */
	read(item) {
		return this.has(item) ? Each.as(this.get(item)).what() : undefined;
	}

	/**
	 * **Read All (extended CRUD):**
	 * Returns all items that match the given query.
	 * @param {any} query - The query to evaluate.
	 * @returns {Iterable<any>} All matching items.
	 */
	readAll(query) {
		return this.get(query);
	}

	/**
	 * **Update (U in CRUD):**
	 * Replaces an existing item with a new one.
	 * If the old item does not exist, inserts the new item if `upsert` is true.
	 * @param {any} oldItem - The item to be replaced.
	 * @param {any} newItem - The new item to insert.
	 * @param {boolean} [upsert=false] - Whether to insert if `oldItem` is not found.
	 * @returns {boolean} True if updated or inserted, false otherwise.
	 */
	update(oldItem, newItem, upsert = false) {
		if (this.has(oldItem)) {
			return this.remove(oldItem) && this.add(newItem);
		} else if (upsert) {
			return this.add(newItem);
		}
		return false;
	}

	/**
	 * **Delete (D in CRUD):**
	 * Removes an item from the collection.
	 * @param {any} item - The item to delete.
	 * @returns {boolean} True if the collection was modified.
	 */
	delete(item) {
		return this.remove(item);
	}

	/**
	 * **Delete Many (extended CRUD):**
	 * Removes all the given items from the collection.
	 * Alias of {@link removeAll}.
	 * @param {Iterable<any>} items - Items to delete.
	 * @returns {boolean} True if all the items were removed.
	 */
	deleteAll(items) {
		return this.removeAll(items);
	}

	// -----------------------------------------------------
	// Query helpers
	// -----------------------------------------------------

	/**
	 * Alias for {@link get}, for database-style terminology.
	 * @param {any} query - The query to evaluate.
	 * @returns {Iterable<any>} All matching items.
	 */
	query(query) {
		return this.get(query);
	}

	// -----------------------------------------------------
	// Aliases
	// -----------------------------------------------------

  	/**
	 * Size getter (ergonomic alias for n()).
	 * Read-only property.
	 * @returns {number}
	*/
	get size() {
		return this.n();
	}

	// -----------------------------------------------------
	// Utility methods
	// -----------------------------------------------------

	/**
	 * Checks whether the collection is empty.
	 * @returns {boolean} True if the collection has no items.
	 */
	isEmpty() {
		return this.n() === 0;
	}

	/**
	 * Adds the given item and returns the collection (fluent API).
	 * @param {any} item - The item to add.
	 * @returns {Collection} The collection itself.
	 */
	let(item) {
		this.add(item);
		return this;
	}

	/**
	 * Adds all items from an iterable.
	 * @param {Iterable<any>} items - Items to add.
	 * @returns {any[]} List of actually removed items.
	 */
	addAll(items) {
		const added = []
		for (const item of items) {
			if(this.add(item)) added.push(item);
		}
		return this;
	}

	/**
	 * Removes all given items from the collection.
	 * @param {Iterable<any>} items - Items to remove.
	 * @returns {any[]} List of actually removed items.
	 */
	removeAll(items) {
		const removed = [];
		for (const item of items) {
			if (this.remove(item)) removed.push(item);
		}
		return removed;
	}

}
