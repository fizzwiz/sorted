// ==============================
// Central Export
// ==============================

// Core abstract interfaces
import { Collection } from "./core/Collection.js"; 
import { AsyncCollection } from "./core/AsyncCollection.js"; 
import { Queue } from "./core/Queue.js";

// Queue implementations
import { ArrayQueue } from "./queue/ArrayQueue.js";
import { SortedArray } from "./queue/SortedArray.js";
import { Classifier } from "./queue/Classifier.js";
import { TrueSet } from "./queue/TrueSet.js";

// Global constants
import { ORDER, SORTER } from "./global.js";

// Re-exports
export {
  Collection,
  AsyncCollection,
  Queue,
  ArrayQueue,
  SortedArray,
  Classifier,
  TrueSet,
  ORDER,
  SORTER
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
 * - {@link Classifier} — queue/collection of objects aggregated by some representation function.
 * - {@link TrueSet} — queue/collection of objects aggregated by some representation function.
 * 
 * @module queue
 */

/**
 * Global constants and shared utilities.
 * 
 * This module exports two primary namespaces:
 * 
 * - {@link ORDER} — A collection of standard comparison utilities
 *   (e.g., ASCENDING, DESCENDING, SINGULAR, BY_PROPERTY, etc.)
 *   intended for configuring sorted containers such as Queue or SortedArray.
 *
 * - {@link SORTER} — Factory functions (e.g., BY_DEPTH, UNIFORM)
 *   that produce sorter(node) functions used when constructing a Classifier.
 *   Sorters determine how child keys and stored values are ordered at every node.
 *
 * These utilities form the common configuration layer shared across all
 * higher-level data structures in the library.
 * 
 * @module global
 */

