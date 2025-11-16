import { Queue } from "../core/Queue.js";
import { Classifier } from "./Classifier.js";
import { Each } from "@fizzwiz/fluent";

/**
 * A TrueSet is a multiset-like collection where item equivalence
 * is determined by a user-provided `repr(item)` function.
 *
 * Internally, the set stores elements inside a {@link Classifier} as:
 *     classifier.add(repr(item), item)
 *
 * Unlike a normal Set, equivalent items may coexist.  
 * Both classes (repr values) and the items inside each class are sorted
 * according to the sorting configuration of the underlying Classifier.
 *
 * This class exposes:
 *  - A Collection interface (add, remove, has, n, clear, iteration)
 *  - A Queue interface (peek, poll, reverse)
 *
 * The `.classifier` property is intentionally public so users may
 * inspect or query the internal structure.
 */
export class TrueSet extends Queue {

    /**
     * @param {function(*): *} repr  A function producing the class key for each item.
     * @param {Classifier} [classifier=new Classifier()]  The internal classifier.
     */
    constructor(repr, classifier = new Classifier()) {
        super();
        
        this.repr = item => Each.as(repr(item));
        this.classifier = classifier;
    }

    // -----------------------------------------------------------
    // Collection interface
    // -----------------------------------------------------------

    /** @returns {Iterator<*>} Iterates stored items */
    [Symbol.iterator]() { 
        return this.classifier.values(); 
    }

    /** Total number of stored items */
    n() { 
        return this.classifier.n(); 
    }

    /**
     * @param {*} item
     * @returns {boolean} whether an equivalent item exists
     */
    has(item) { 
        return this.classifier.has(this.repr(item)); 
    }

    /**
     * Adds the item `xTimes` times.
     * @param {*} item 
     * @param {number} [xTimes=1]
     * @returns {this}
     */
    add(item, xTimes = 1) { 
        this.classifier.add(this.repr(item), item, xTimes);
        return this;
    }

    /**
     * Removes up to `xTimes` occurrences of the item.
     * @param {*} item 
     * @param {number} [xTimes=Infinity]
     * @returns {boolean} true if removal occurred
     */
    remove(item, xTimes = Infinity) { 
        return this.classifier.remove(this.repr(item), xTimes);
    }

    /** Remove all items */
    clear() { 
        this.classifier.clear(); 
    }

    /** Iterates all the equivalent items */
    get(item, first = true) {
        return this.classifier.get(this.repr(item), first)
    }

    // -----------------------------------------------------------
    // Queue interface
    // -----------------------------------------------------------

    /**
     * Returns (without removing) the first or last stored item.
     * @param {boolean} [first=true]
     * @returns {*} the peeked item or undefined
     */
    peek(first = true) { 
        const node = this.classifier.peek(first);
        return node;
    }

    /**
     * Returns an iterator of all items in reverse order.
     * @returns {Iterator<*>}
     */
    reverse() { 
        return this.classifier.values(false); 
    }
}
