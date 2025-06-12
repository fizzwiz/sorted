/**
 * The `core` module defines the foundational abstract data structures used for organizing and manipulating collections.
 *
 * - {@link Collection}: The base interface representing a generic collection of items.
 * - {@link Queue}: An abstract subclass of `Collection` that defines queue-like behavior with `peek`, `poll`, and `select` methods.
 *
 * @module core
 */
export { Collection } from "./Collection.js";
export { Queue } from "./Queue.js";
