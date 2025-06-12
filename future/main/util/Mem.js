import { Classifier } from "../queue/Classifier.js";
import { What } from "@fizzwiz/fluent/core/What.js";

/**
 * A memoizing `What` that reuses previous results to avoid redundant computation.
 * 
 * Stores computed results for previously seen arguments up to a fixed memory capacity.
 * Evicts oldest entries in a FIFO manner when the capacity is reached.
 */
export class Mem extends What {

    /**
     * Constructs a new Mem.
     * 
     * @param {Function} f - The function to wrap with memoization.
     * @param {number} [memCapacity=256] - Maximum number of stored entries.
     */
    constructor(f, memCapacity = 256) {
        super();
        this._inner = f;
        this._memCapacity = memCapacity;
        this._mem = new Classifier();     
        this._chronology = [];            // Stores entries in insertion order for eviction
    }

    /** @returns {Function} The original function being wrapped */
    get inner() {
        return this._inner;
    }

    /** @returns {number} Maximum number of memoized entries */
    get memCapacity() {
        return this._memCapacity;
    }

    /** @returns {Classifier} The underlying memory classifier holding cached results */
    get mem() {
        return this._mem;
    }

    /** @returns {Array} Chronological list of cached entries for eviction management */
    get chronology() {
        return this._chronology;
    }

    /**
     * Evaluates the function with given arguments, using cache if available.
     * 
     * If the result for the given arguments has already been computed, returns the cached result.
     * Otherwise, computes the result via the inner function, stores it, and returns it.
     * 
     * @param  {...any} args - Arguments to apply to the function.
     * @returns {*} Cached or newly computed result.
     */
    what(...args) {
        let got = this._mem.class(false, ...args).then(array => array[0]).what();
        
        if (got === undefined) {
            got = What.what(this.inner, ...args);
            this.mem([...args, got]);
        }

        return got;
    }

    /**
     * Adds a new memoized entry and handles capacity limits.
     * 
     * @param {Array} entry - An array of form [...args, result]
     * @returns {this}
     */
    mem(entry) {
        if (this._chronology.length >= this._memCapacity) {
            this._mem.remove(this._chronology.shift());
        }
        this._mem.add(entry);
        this._chronology.push(entry);
        return this;
    }
}
