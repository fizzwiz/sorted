// ==============================
// Central Export for @fizzwiz/sorted
// ==============================

// Core abstract interfaces
import { Collection } from "./core/Collection.js"; 
import { AsyncCollection } from "./core/AsyncCollection.js"; 
import { Queue } from "./core/Queue.js";

// Queue implementations
import { ArrayQueue } from "./queue/ArrayQueue.js";
import { SortedArray } from "./queue/SortedArray.js";

// Global constants
import { ORDER } from "./global.js";

// Re-exports
export {
  Collection,
  AsyncCollection,
  Queue,
  ArrayQueue,
  SortedArray,
  ORDER,
};

/**
 *
 * Core abstract interfaces for collections and queues:
 *
 * - {@link Collection} — base class for synchronous iterable collections with CRUD support.
 * - {@link AsyncCollection} — async variant of Collection, using async iteration and promises.
 * - {@link Queue} — abstract interface for ordered Collections.
 * 
 * @module core
 */

/**
 *
 * Concrete implementations of {@link Queue}:
 *
 * - {@link ArrayQueue} — array-backed queue, ordered by insertion (FIFO/LIFO).
 * - {@link SortedArray} — queue/collection backed by a sorted array, ordered by a comparator.
 * @module queue
 */

/**
 *
 * Global constants and shared utilities:
 *
 * - {@link ORDER} — standard ordering constants (`ASC`, `DESC`, etc.) for use in comparators and sorting.
 * @module global
 */
