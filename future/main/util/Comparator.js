import { What } from "@fizzwiz/fluent/core/What.js";
import { Mem } from "./Mem.js"; // Assuming it's in the same project structure

/**
 * A `What` that performs a comparison between two values.
 * Subclasses or instances must implement `compare(a, b)` which returns:
 * - A negative number if `a < b`
 * - Zero if `a === b`
 * - A positive number if `a > b`
 */
export class Comparator extends What {

    /**
     * Compares two items.
     * Must be implemented by subclasses or assigned dynamically.
     * 
     * @param {*} a - First item to compare.
     * @param {*} b - Second item to compare.
     * @returns {number} Negative if a < b, 0 if equal, positive if a > b.
     */
    compare(a, b) {
        throw new Error("Abstract method Comparator.compare(a, b) must be implemented in subclasses");
    }

    /**
     * Delegates to compare(...args).
     */
    what(...args) {
        return this.compare(...args);
    }

    /**
     * Returns a new Comparator that negates the result of this comparator.
     * 
     * @returns {Comparator}
     */
    negate() {
        const got = new Comparator();
        got.compare = (a, b) => -this.compare(a, b);
        return got;
    }

    /**
     * Constructs a Comparator based on evaluating values from an evaluator function.
     * Items are compared by the result of evaluator(item), and sorted accordingly.
     * 
     * @param {Function|Mem} evaluator - A function or Mem returning a numeric value.
     * @returns {Comparator}
     */
    static byValue(evaluator) {
        if (!(evaluator instanceof Mem)) {
            evaluator = new Mem(evaluator);
        }

        const got = new Comparator();
        got.compare = (a, b) => Math.sign(What.what(evaluator, a) - What.what(evaluator, b));
        return got;
    }
}
