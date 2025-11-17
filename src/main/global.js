/**
 * Global collection of commonly used comparison functions.
 * These comparators are intended for use in sorted collections such as {@link Queue}.
 *
 * **Available comparators:**
 * - **ASCENDING**: Sorts values from smallest to largest.
 * - **DESCENDING**: Sorts values from largest to smallest.
 * - **INSERTION**: Disables sorting; preserves insertion order.
 * - **SINGULAR**: Treats all values as equivalent — only one unique item is kept.
 * - **BY_PROPERTY**: Produces a comparator that sorts objects by a specified property.
 * - **REVERSE**: Produces a comparator that inverts another comparator.
 * 
 * @namespace ORDER
 * @global
 */
export const ORDER = {

    /** 
     * Sorts primitive values in ascending order.
     * @memberof ORDER
     */
    ASCENDING: (a, b) =>
        a < b ? -1 : (a === b ? 0 : 1),

    /** 
     * Sorts primitive values in descending order. 
     * @memberof ORDER
     */
    DESCENDING: (a, b) =>
        a < b ? +1 : (a === b ? 0 : -1),

    /** 
     * No sorting; preserves insertion order. 
     * @memberof ORDER
     */
    INSERTION: undefined,

    /** 
     * Treats all values as equivalent.
     * @memberof ORDER
     */
    SINGULAR: (a, b) => 0,

    /**
     * Creates a comparator that sorts objects by a given property.
     * The provided comparator is applied to the property values.
     *
     * @param {string} name - The property name to compare.
     * @param {Function} [comparator=ORDER.ASCENDING] - Comparator applied to the property values.
     * @returns {Function} Comparator that compares `a[name]` and `b[name]`.
     * @memberof ORDER
     */
    BY_PROPERTY(name, comparator = ORDER.ASCENDING) {
        return (a, b) => {
            const av = a?.[name];
            const bv = b?.[name];
            return comparator(av, bv);
        };
    },

    /**
     * Returns a comparator that reverses the order of another comparator.
     *
     * **Example:**
     * `const cmp = ORDER.REVERSE(ORDER.ASCENDING);`
     * `items.sort(cmp); // same as DESCENDING`
     *
     * @param {Function} comparator - Any comparator `(a, b) => number`.
     * @returns {Function} A comparator that negates the result of the given comparator.
     * 
     * @memberof ORDER
     */
    REVERSE(comparator) {
        return (a, b) => -comparator(a, b);
    }

};

/**
 * Factory functions that create `sorter` functions.
 *
 * A `sorter(node)` function must return a tuple:
 *
 *     sorter(node) → [keyComparator, valueComparatorOrFlag]
 *
 * This tuple controls how each node computes:
 * - **sortedKeys**   — ordering of its child keys
 * - **sortedValues** — ordering of values (its equivalence class)
 *
 * @namespace SORTER
 * @global
 */
export const SORTER = {

    /**
     * Creates a depth-aware `sorter(node)` function.
     *
     * @param {Function|Array<Function>} keyComparators
     * A key comparator or an array of comparators indexed by depth.  
     * If a single function is provided, it is wrapped into an array.
     *
     * The comparator chosen for a node is:
     * - `keyComparators[node.depth]` if it exists  
     * - otherwise the **last** comparator in the array
     *
     * @param {Function|boolean|Array<Function|boolean>} valueComparatorsOrFlags
     * Comparator(s) or boolean flag(s) controlling ordering of stored values.
     * A single entry is upgraded to an array.
     *
     * - comparator → values stored in a `SortedArray`
     * - boolean    → values stored in an `ArrayQueue`
     *     - `false` → FIFO  
     *     - `true`  → LIFO
     *
     * @returns {function(node): Array<Function, Function|boolean>}
     * Returns a function that, for each node, selects:
     * - the appropriate **key comparator** based on depth
     * - the appropriate **value comparator/flag** based on depth
     *
     * @memberof SORTER
     * 
     * @example
     * const sorter = SORTER.BY_DEPTH([ORDER.ASCENDING, ORDER.DESCENDING], true);
     */
    BY_DEPTH: (keyComparators, valueComparatorsOrFlags) => {
        if (!Array.isArray(keyComparators)) keyComparators = [keyComparators];
        if (!Array.isArray(valueComparatorsOrFlags)) valueComparatorsOrFlags = [valueComparatorsOrFlags];

        return node => [
            keyComparators[node.depth] ??
                keyComparators[keyComparators.length - 1],
            valueComparatorsOrFlags[node.depth] ??
                valueComparatorsOrFlags[valueComparatorsOrFlags.length - 1]
        ];
    },


    /**
     * Creates a **uniform** `sorter(node)` function where all nodes,
     * at any depth, use the **same** key comparator and the **same**
     * value comparator/flag.
     *
     * This is the opposite of {@link SORTER.BY_DEPTH}.  
     * Instead of varying by `node.depth`, the sorting strategy is
     * globally consistent across the entire classifier.
     *
     * @param {Function} keyComparator
     * Comparator used to order all child keys in every node.
     *
     * @param {Function|boolean} valueComparatorOrFlag
     * Comparator or queue-flag used to order values in all nodes.
     *
     * - comparator → values stored in a `SortedArray`
     * - boolean    → values stored in an `ArrayQueue`
     *     - `false` → FIFO  
     *     - `true`  → LIFO
     *
     * @returns {function(node): Array<Function, Function|boolean>}
     * A `sorter(node)` function that always returns the same tuple.
     *
     * @example
     * const sorter = SORTER.UNIFORM(ORDER.ASCENDING, false);
     *
     * @memberof SORTER
     */
    UNIFORM: (keyComparator, valueComparatorOrFlag) => {
        return () => [keyComparator, valueComparatorOrFlag];
    }
};


