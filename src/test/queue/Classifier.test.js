import assert from "assert";
import { ORDER } from "../../main/global.js"; // if needed for comparators
import { Classifier } from "../../main/queue/Classifier.js";

describe("Classifier", function () {

    let clf;

    beforeEach(() => {
        clf = new Classifier();
    });

    it("should initialize an empty classifier", () => {
        assert.strictEqual(clf.nin, 0);
        assert.strictEqual(clf.nout, 0);
        assert.strictEqual(clf.sortedKeys.size, 0);
        assert.strictEqual(clf.class.size, 0);
    });

    it("should add and count sequences correctly", () => {
        clf.add(['a', 'b'], "item1");
        clf.add(['a', 'c'], "item2");
        clf.add(['a', 'b'], "item3");

        assert.strictEqual(clf.has(['a', 'b']), true);
        assert.strictEqual(clf.has(['a', 'c']), true);
        assert.strictEqual(clf.has(['a', 'd']), false);

        const nodeAB = clf.with(['a', 'b']);
        assert.strictEqual(nodeAB.class.n(), 2);
        assert.strictEqual(nodeAB.nin, 2);
        assert.strictEqual(clf.n(), 3); // subtree occurrences: nin + nout
    });

    it("should remove sequences correctly", () => {
        clf.add(['x', 'y'], "itemX");
        clf.add(['x', 'y'], "itemY");

        const nodeXY = clf.with(['x', 'y']);
        assert.strictEqual(nodeXY.class.n(), 2);

        clf.remove(['x', 'y']);
        assert.strictEqual(clf.n(), 0);
        assert.strictEqual(clf.has(['x', 'y']), false);
    });

    it("should clear the tree", () => {
        clf.add(['p', 'q'], "itemP");
        clf.add(['r'], "itemR");

        clf.clear();
        assert.strictEqual(clf.nin, 0);
        assert.strictEqual(clf.nout, 0);
        assert.strictEqual(clf.sortedKeys.size, 0);
        assert.strictEqual(clf.class.size, 0);
    });

    it("should support get() with wildcard", () => {
        clf.add(['a', 'b'], "item1");
        clf.add(['a', 'c'], "item2");
        clf.add(['x', 'y'], "item3");

        const itemsA = [...clf.get(['a', undefined])];
        assert.deepStrictEqual(itemsA.sort(), ["item1", "item2"]);
    });

    it("should return items in reverse with reverse()", () => {
        clf.add(['a', 'b'], "item1");
        clf.add(['c'], "item2");

        const reversed = [...clf.reverse()];
        assert.deepStrictEqual(reversed, ["item2", "item1"]);
    });

    it("should peek first and last items", () => {
        clf.add(['a'], "item1");
        clf.add(['b'], "item2");

        assert.strictEqual(clf.peek(true), "item1");
        assert.strictEqual(clf.peek(false), "item2");
    });

    it("should iterate over keys, values, and entries", () => {
        clf.add(['a', 'b'], "item1");
        clf.add(['a', 'c'], "item2");
        clf.add(['x'], "item3");

        const keys = [...clf.keys()];
        const expectedKeys = [['a','b'], ['a','c'], ['x']];
        assert.deepStrictEqual(keys, expectedKeys);

        const values = [...clf.values()];
        assert.deepStrictEqual(values.sort(), ["item1","item2","item3"]);

        const entries = [...clf.entries()];
        assert.deepStrictEqual(
            entries,
            [[['a', 'b'],"item1"], [['a', 'c'],"item2"], [['x'],"item3"]]
        )
    });

    it("should prune empty nodes after removal", () => {
        clf.add(['a','b'], "item1");
        assert.strictEqual(clf.with(['a','b']).nin, 1);

        clf.remove(['a','b']);

        assert.strictEqual(clf.keyToChild.has('a'), false); // subtree removed
    });

});
