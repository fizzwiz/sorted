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

    /** Sorts primitives in ascending order */
    ASCENDING: (a, b) => a < b
        ? -1
        : a === b
            ? 0
            : 1,

    /** Sorts primitives in descending order */
    DESCENDING: (a, b) => -ORDER.ASCENDING(a, b),

    /** No sorting; preserves insertion order */
    INSERTION: undefined,

    /** Treats all values as equivalent */
    SINGULAR: (a, b) => 0
};
