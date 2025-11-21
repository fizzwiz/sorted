import { Queue } from "../core/Queue.js";
import { ArrayQueue } from "./ArrayQueue.js";
import { SortedArray } from "./SortedArray.js";
import { ORDER, SORTER } from "../global.js";
import { Each, Path } from "@fizzwiz/fluent";

/**
 * Classifier
 * 
 * A hierarchical, prefix-based multimap where keys are **sequences** and
 * values are grouped by their key sequence (equivalence classes).
 *
 * ## Concept
 * - Keys are iterables (e.g., `['a','b','c']`).
 * - Multiple values may be stored per key sequence.
 * - Keys are stored in a `SortedArray` for efficient prefix queries.
 * - Values at each node form an **equivalence class**, optionally sorted or queued.
 *
 * ## Node Structure
 * Each node contains:
 * - `parent` — parent node (null for root)
 * - `key` — key for this node (undefined for root)
 * - `depth` — depth in the tree (root = 0)
 * - `sortedKeys` — sorted list of child keys
 * - `keyToChild` — map of key → child node
 * - `nin` — number of sequences ending **at** this node
 * - `nout` — number of sequences ending **below** this node
 * - `class` — container of values for this node’s key sequence
 * - `sorter(node)` — function defining key and value order
 *
 * ## Features
 * - Multimap: multiple values per key sequence.
 * - SortedMap: both keys and values are ordered.
 * - Prefix queries with wildcards.
 * - Efficient traversal, insertion, and removal.
 *
 * ## Example
 * ```js
 * const clf = new Classifier();
 * clf.add(['a','b','c'], 'abc');   // store item "abc"
 * for (const item of clf.get([undefined,'b'])) {
 *     console.log(item);            // all items with repr[1] === 'b'
 * }
 * ```
 *
 * @class
 * @extends Queue
 */

export class Classifier extends Queue {

    /**
     * Creates a classifier node.
     *
     * @constructor
     * @param {Function} [sorter]
     *     Function receiving the newly created node and returning a pair [keyComparator, itemComparator]:
     *     - `keyComparator(a, b)` — for sorting child keys.
     *     - `itemComparator(a, b)` — for sorting items inside `.class`.
     *       Optional: if a Boolean flag is provided instead of a itemComparator, `.class` becomes an `ArrayQueue(flag)`
     *       (`true` | undefined = FIFO, `false` = LIFO), allowing duplicates.
     *
     * @param {Classifier|null} parent
     *     The parent node, or `null` for the root.
     *
     * @param {*} key
     *     The key leading from the parent to this node
     *     (`undefined` for the root node).
     */
    constructor(
        sorter = SORTER.UNIFORM(ORDER.ASCENDING, ORDER.INSERTION),
        parent = null,
        key = undefined
    ) {
        super();

        /** @type {Classifier|null} */
        this.parent = parent;

        /** @type {*} */
        this.key = key;

        /**
         * Function returning a couple of comparators: for child keys and class items.
         * @type {Function}
         */
        this.sorter = sorter;

        /** @type {number} */
        this.depth = (parent?.depth ?? -1) + 1;

        /** @type {number} */
        this.nin = 0;

        /** @type {number} */
        this.nout = 0;

        const [keyComparator, itemComparator] = sorter(this);

        /** @type {SortedArray<*>} */
        this.sortedKeys = new SortedArray(keyComparator);

        /** @type {Map<*,Classifier>} */
        this.keyToChild = new Map();

        /**
         * Items whose representation corresponds exactly to this node's
         * full key-path. Acts as an equivalence class container.
         *
         * - If an item-comparator is provided → `SortedArray`
         * - Otherwise → `ArrayQueue` preserving insertion order
         *
         * @type {Queue}
         */
        this.class = typeof(itemComparator) === 'function'
            ? new SortedArray(itemComparator)
            : new ArrayQueue(itemComparator);  // either undefined or a boolean
    }

    // ---------------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------------

    /**
     * Returns the child associated with `key`.
     * If `creating` is true and the child does not exist, it is created.
     *
     * @param {*} key - Child key.
     * @param {boolean} [creating=false] - Whether to create the child if missing.
     * @returns {Classifier|undefined} - The child node, or undefined.
     */
    getChild(key, creating = false) {
        let child = this.keyToChild.get(key);
        if (!child && creating) {
            child = new Classifier(this.sorter, this, key);
            this.keyToChild.set(key, child);
            this.sortedKeys.add(key);
        }
        return child;
    }

    /**
     * Descends through a sequence of keys and returns the final node.
     *
     * @param {Iterable<*> | *} keys - Sequence of keys (or single key) to follow.
     * @param {boolean} [creating=false] - Whether to create missing nodes.
     * @returns {Classifier|undefined} - The descendant node, or undefined.
     */
    with(keys, creating = false) {
        let node = this;
        for (const key of Each.as(keys)) {
            node = node.getChild(key, creating);
            if (!node) return undefined;
        }
        return node;
    }

    /**
     * Adjusts occurrence counters along this node's ancestor chain.
     *
     * - `nin` is incremented only on this node.
     * - `nout` is incremented on all ancestor nodes.
     *
     * @param {number} [value=1] - Amount to increment (or decrement).
     * @returns {void}
     */
    increment(value = 1) {
        this.nin += value;
        let node = this.parent;
        while (node) {
            node.nout += value;
            node = node.parent;
        }
    }

    /**
     * Removes empty nodes from the tree, traversing bottom-up.
     *
     * A node is removed if both its `nin` and `nout` are zero.
     * The process continues up the parent chain until reaching a non-empty node or the root.
     *
     * @returns {void}
     */
    pruneIfEmpty() {
        let node = this;
        while (node.parent && node.nin === 0 && node.nout === 0) {
            const parent = node.parent;
            parent.keyToChild.delete(node.key);
            parent.sortedKeys.remove(node.key);

            // Detach node from tree
            node.parent = null;
            node.depth = 0;

            node = parent;
        }
    }


    // ---------------------------------------------------------------------
    // Collection
    // ---------------------------------------------------------------------

    /**
     * Returns the number of item occurrences stored in this node's subtree.
     *
     * @returns {number} Total occurrences `.nin` + `.nout`.
     */
    n() {
        return this.nin + this.nout;
    }

    /**
     * Total number of item occurrences `.nin` + `.nout` stored in the subtree rooted at this node.
     *
     * @type {number}
     * @readonly
     */
    get size() {
        return this.nin + this.nout;
    }

    /**
     * Returns `true` iff the sequence exists and ends at a terminating node.
     *
     * @param {Iterable<*> | *} keys (or key)
     * @returns {boolean}
     */
    has(keys) {
        const node = this.with(keys);
        return node !== undefined && node.nin > 0;
    }

    /**
     * Adds or removes occurrences of an entry >keys, obj> .
     * If `xTimes` > 0, missing nodes are created.
     *
     * @param {Iterable<*> | *} keys (or key)
     * @param {any} item
     * @param {number} [xTimes=1] - Positive to add, negative to remove. A float number is allowed.
     * @returns {boolean} - Whether the operation succeeded.
     */
    add(keys, item, xTimes = 1) {
        const node = this.with(keys, xTimes > 0);
        if (!node) return false;
        const got = node.class.add(item); 

        node.increment(xTimes);
        node.pruneIfEmpty();
        return got;
    }

    /**
     * Removes occurrences of a stored sequence identified by `keys`.
     *
     * - Decrements `.nin` of the terminal node by up to `xTimes`.
     * - Updates `.nout` counters along ancestor nodes.
     * - Prunes nodes that become empty.
     *
     * @param {Iterable<*> | *} keys - Sequence of keys (or key) representing the stored path.
     * @param {number} [xTimes=Infinity] - Maximum number of occurrences to remove.
     * @returns {boolean} `true` if any sequences were removed, `false` if the path did not exist.
     */
    remove(keys, xTimes = Infinity) {
        const node = this.with(keys);
        if (!node) return false;

        node.increment(-Math.min(xTimes, node.nin));
        node.pruneIfEmpty();
        return true;
    }

    /**
     * Removes all entries stored in this node and its entire subtree.
     *
     * This method:
     * - Resets `.nin` (sequences ending at this node) and `.nout` (sequences passing below)
     * - Clears all child nodes (`keyToChild` and `sortedKeys`)
     * - Clears the `.class` collection of items associated with this node
     * - Prunes this node from its parent if it becomes empty
     *
     * @returns {void}
     */
    clear() {
        this.nin = 0;
        this.nout = 0;
        this.sortedKeys.clear();
        this.keyToChild.clear();
        this.class.clear();
        this.pruneIfEmpty();
    }

    /**
     * Retrieves all items stored in nodes whose key-path matches the given prefix.
     *
     * - Each node along the tree whose path matches `query` contributes its `.class` items.
     * - `undefined` in `query` is treated as a wildcard (matches any key at that level).
     * - Returns a flattened `Each<*>` of all matching items.
     *
     * Conceptually, this works like `Map.get(key)` but supports **prefix matching**:
     * all items under nodes that match the query are included.
     *
     * @param {Array<*>} query - Prefix of keys to match.
     * @param {boolean} [first=true] - If `false`, traversal order is reversed.
     * @returns {Each<*>} An iterable of all items stored in nodes matching the query.
     *
     * @example
     * // Store items under sequences
     * clf.add(['a','b'], 'item1');
     * clf.add(['a','c'], 'item2');
     *
     * // Get items under 'a' prefix
     * const items = clf.get(['a']);
     * console.log([...items]); // ['item1', 'item2']
     */
    get(query, first = true) {
        return Each.else(
            this
                .descendants(query, first)
                .sthen(node => first? node.class: node.class.reverse())
        );
    }

    /**
     * Returns all items contained in this `Classifier` in **reverse order**.
     *
     * This is equivalent to calling `get([], false)`, i.e., retrieving all items
     * from the tree in reverse traversal order.
     *
     * @returns {Each<*>} Iterable of all stored items, reversed.
     */
    reverse() {
        return this.get([], false);
    }

    /**
     * Returns the first or last stored item in this subtree.
     *
     * - `first = true` → returns the first item in traversal order
     * - `first = false` → returns the last item
     *
     * @param {boolean} [first=true] - Whether to retrieve the first (`true`) or last (`false`) item.
     * @returns {*|undefined} The first/last item, or `undefined` if the tree is empty.
     */
    peek(first = true) {
        return this.get([], first).what();
    }

    /**
     * Returns the path from the root node to this node.
     *
     * @returns {Path<Classifier>} Absolute path containing all nodes from the root (excluded) to this node (included).
     */
    path() {
        return this.parent
            ? this.parent.path().add(this)
            : new Path();
    }

    /**
     * Iterates over all stored items in this subtree.
     *
     * Equivalent to `get([], true)`.
     *
     * @generator
     * @yields {*} Each item in the classifier, in traversal order.
     */
    *[Symbol.iterator]() {
        yield* this.get([], true);
    }

    /**
     * Returns the child classifier nodes.
     *
     * By default, children are returned in arbitrary iteration order
     * (the natural order of `Map.prototype.values()`).
     *
     * If `sorted` is `true`, the children are returned in the order defined
     * by `this.sortedKeys`, which stores the classifier's sorted key sequence.
     *
     * ## Invariants
     * - Every key in `this.sortedKeys` MUST correspond to an existing child
     *   in `this.keyToChild`.  
     * - Therefore, calling this method with `sorted = true` will *never*
     *   return `undefined` elements.  
     *   If that happens, it indicates an internal consistency error elsewhere.
     *
     * ## Notes
     * - No filtering is performed: missing children are treated as fatal
     *   structural violations and will propagate errors naturally.
     *
     * @param {boolean} [sorted=false]
     *     Whether to return children in sorted key order.
     *
     * @returns {Each<Classifier>}
     *     An `Each` iterable of child classifier nodes.
     */
    children(sorted = false) {
        return sorted
            ? this.sortedKeys.sthen(key => this.keyToChild.get(key))
            : Each.as(this.keyToChild.values());
    }

    // ---------------------------------------------------------------------
    // Traversal
    // ---------------------------------------------------------------------

    /**
     * Performs a depth-first traversal of all **descendant classifier nodes**
     * starting from this node. The node itself is *not* included.
     *
     * This is the primitive traversal operation used internally by
     * `keys()`, `values()`, and `entries()`.
     *
     * ---
     * ### Prefix filtering (`query`)
     *
     * A `query` is an array of expected child keys at each depth:
     *
     * - `query[d]` = required key at depth `d`
     * - `undefined` = wildcard → all keys here are accepted
     * - If `query.length === 0`, the traversal is unrestricted
     *
     * Matching proceeds depth-by-depth as the traversal descends.
     *
     * ---
     * ### Traversal order
     *
     * - `first = true` → children visited in sorted ascending key order
     * - `first = false` → children visited in reversed order
     *
     * ---
     *
     * @param {Array<*>} [query=[]]
     *     Optional prefix constraint. `undefined` acts as a wildcard.
     *
     * @param {boolean} [first=true]
     *     Whether to traverse children in normal (`true`) or reversed (`false`) order.
     *
     * @param {number} [index=0]
     *     Internal recursion depth. Users should normally ignore this.
     *
     * @returns {Each<Classifier>}
     *     An `Each` iterable yielding all matching descendant nodes,
     *     in depth-first search order.
     *
     * @example
     * // Iterate all descendants
     * for (const node of clf.descendants()) {
     *     console.log(node.key);
     * }
     *
     * @example
     * // Prefix-filtered traversal (e.g., only under ['A', *, 'C'])
     * const nodes = clf.descendants(['A', undefined, 'C']);
     * console.log(nodes.toArray());
     */
    descendants(query = [], first = true, index = 0) {
        if (!Array.isArray(query)) query = Each.as(query).toArray(); 
        const self = this;
        const got = {
            *[Symbol.iterator]() {
                const keys = first ? self.sortedKeys : [...self.sortedKeys].reverse();
                const matchKey = query[index];

                for (const key of keys) {
                    if (matchKey !== undefined && key !== matchKey) continue;

                    const child = self.keyToChild.get(key);
                    if (!child) continue;

                    yield child;
                    yield* child.descendants(query, first, index + 1);
                }
            }
        }
        return Each.as(got);
    }

    /**
     * Returns an iterable over all key-paths in the classifier.
     *
     * A “key-path” is an array of keys describing the path from the root
     * to a node containing at least one stored item.
     *
     * @returns {Each<Array<*>>}
     *     An `Each` iterable yielding arrays of keys.
     *
     * @example
     * for (const keys of clf.keys()) {
     *     console.log(keys);
     * }
     */
    keys() {
        const self = this;
        const got = {
            *[Symbol.iterator]() {
                for (const node of self.descendants()) {
                    if (node.nin > 0) yield node.path().toArray().map(next => next.key);
                }
            }
        };
        return Each.as(got);
    }

    /**
     * Returns an iterable over **all items** stored anywhere in this
     * classifier subtree.
     *
     * Items are drawn from the equivalence class stored at each node.
     *
     * @returns {Each<*>}
     *     An `Each` iterable yielding all stored items.
     *
     * @example
     * for (const value of clf.values()) {
     *     console.log(value);
     * }
     */
    values() {
        const self = this;
        const got = {
            *[Symbol.iterator]() {
                for (const node of self.descendants()) {
                    for (const item of node.class) yield item;
                }
            }
        };

        return Each.as(got);
    }    

    /**
     * Returns an iterable of `[keys, item]` pairs, similar to `Map.prototype.entries()`.
     *
     * - `keys` is the full key-path from the root to the node.
     * - `item` is one element stored in that node's class.
     *
     * Only nodes with positive weight (`nin > 0`) are included.
     *
     * @returns {Each<Array<Array<*>, *>>}
     *     An `Each` iterable yielding `[keys, item]` pairs.
     *
     * @example
     * for (const [keys, value] of clf.entries()) {
     *     console.log(keys, value);
     * }
     */
    entries() {
        const self = this;
        const got = {
            *[Symbol.iterator]() {
                for (const node of self.descendants()) {
                    if (node.nin <= 0) continue;
                    const keys = node.path().toArray().map(next => next.key);
                    for (const item of node.class) {
                        yield [keys, item];
                    }
                }
            }
        };

        return Each.as(got);
    }  
}

