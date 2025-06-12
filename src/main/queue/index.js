/**
 * The `queue` module provides queue-based data structures with different ordering strategies:
 *
 * - {@link ArrayQueue}: A simple, insertion-ordered queue supporting FIFO or LIFO behavior.
 * - {@link SortedArray}: A sorted queue maintaining items in comparator-defined order.
 *
 * These structures implement the {@link Queue} interface and support various use cases 
 * such as priority queues, bounded collections, or symbolic iteration backends.
 *
 * @module queue
 */
export { ArrayQueue } from "./ArrayQueue.js";
export { SortedArray } from "./SortedArray.js";

