/**
 * This global object provides commonly used comparators as properties:
 * 
 * - `ASCENDING`: Sorts values from smallest to largest.
 * - `DESCENDING`: Sorts values from largest to smallest.
 * - `INSERTION`: Disables sorting; preserves insertion order.
 * - `SINGULAR`: Treats all values as equivalent — only one unique item is allowed in the queue.
 * 
 * These are intended for use with sorted collections, such as {@link Queue}.
 * 
 * @global
 */
export const ORDER = {

    /** 
     * Sorts values in ascending order (smallest to largest).
     * 
     * @example
     * [3, 1, 2].sort(ORDER.ASCENDING); // → [1, 2, 3]
     * 
     * @param {*} a - Any value
     * @param {*} b - Any value
     * @returns {number} -1 if a < b, 1 if a > b, 0 if equal
     */
    ASCENDING: (a, b) =>
        a === b ? 0 :
        a < b ? -1 :
        b < a ? 1 :
        0,

    /** 
     * Sorts values in descending order (largest to smallest).
     * 
     * @example
     * [1, 2, 3].sort(ORDER.DESCENDING); // → [3, 2, 1]
     * 
     * @param {*} a - Any value
     * @param {*} b - Any value
     * @returns {number} -1 if a > b, 1 if a < b, 0 if equal
     */
    DESCENDING: (a, b) =>
        a === b ? 0 :
        a > b ? -1 :
        b > a ? 1 :
        0,

    /**
     * No sorting; maintains the insertion order of elements.
     * This is equivalent to passing `undefined` to Array.prototype.sort().
     * 
     * @example
     * array.sort(ORDER.INSERTION); // equivalent to array.sort()
     */
    INSERTION: undefined,

    /**
     * Treats all values as equivalent — comparison always returns 0.
     * Ensures the {@link Queue} only contains one item.
     * 
     * @param {*} a - Any value
     * @param {*} b - Any value
     * @returns {number} Always 0
     */
    SINGULAR: (a, b) => 0
};



