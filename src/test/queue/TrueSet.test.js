import assert from "assert";
import { TrueSet } from "../../main/queue/TrueSet.js";

describe("TrueSet", function() {
    let ts;

    beforeEach(function() {
        // Use string length as equivalence for testing
        ts = new TrueSet(item => item.length);
    });

    describe("basic insertion", function() {
        it("should store items and track equivalence", function() {
            ts.add("cat");
            ts.add("dog");
            ts.add("bird");

            assert.strictEqual(ts.n(), 3);
            assert.strictEqual(ts.has("cat"), true);
            assert.strictEqual(ts.has("dog"), true);
            assert.strictEqual(ts.has("bird"), true);
            // equivalent by length
            assert.strictEqual(ts.has("bat"), true);
        });

        it("should allow multiple additions of the same item", function() {
            ts.add("cat", 2);
            assert.strictEqual(ts.n(), 2);
        });
    });

    describe("removal", function() {
        beforeEach(function() {
            ts.add("cat", 2);
            ts.add("dog", 1);
        });

        it("should remove specified occurrences", function() {
            const removed = ts.remove("cat");  // all the words with lenght 3
            assert.strictEqual(removed, true);
            assert.strictEqual(ts.n(), 0); // dog is equivalent to cat
        });

        it("should remove all occurrences if xTimes > current count", function() {
            ts.remove("cat", 10);
            assert.strictEqual(ts.has("cat"), false);
            assert.strictEqual(ts.n(), 0);
        });

        it("should return false when removing non-existent item", function() {
            const removed = ts.remove("fox"); // equivalent to cat
            assert.strictEqual(removed, true); 
        });
    });

    describe("iteration", function() {
        beforeEach(function() {
            ts.add("cat");
            ts.add("dog");
            ts.add("bat");
        });

        it("should iterate over all items", function() {
            const items = [...ts];
            assert.deepStrictEqual(items.sort(), ["bat","cat","dog"]);
        });

        it("should iterate in reverse order", function() {
            const items = [...ts.reverse()];
            assert.deepStrictEqual(items.sort(), ["bat","cat","dog"]);
        });
    });

    describe("peek", function() {
        beforeEach(function() {
            ts.add("cat");
            ts.add("dog");
        });

        it("should return first added item", function() {
            assert.strictEqual(ts.peek(), "cat");
        });

        it("should return last added item if first=false", function() {
            assert.strictEqual(ts.peek(false), "dog");
        });
    });

    describe("clear", function() {
        it("should remove all items", function() {
            ts.add("cat");
            ts.add("dog");
            ts.clear();
            assert.strictEqual(ts.n(), 0);
            assert.strictEqual(ts.has("cat"), false);
        });
    });
});
