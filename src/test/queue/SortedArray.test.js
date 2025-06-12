import assert from 'assert';
import { SortedArray } from '../../main/queue/SortedArray.js';
import { ORDER } from '../../main/global.js';

describe('SortedArray', function () {

  describe('constructor()', function () {
    it('should initialize with default comparator and empty array', function () {
      const q = new SortedArray();
      assert.strictEqual(typeof q.comparator, 'function');
      assert.deepStrictEqual(q.items, []);
    });

    it('should add and sort initial items', function () {
      const q = new SortedArray(ORDER.ASCENDING, [3, 1, 2]);
      assert.deepStrictEqual(q.items, [1, 2, 3]);
    });
  });

  describe('add()', function () {
    it('should insert items in sorted order', function () {
      const q = new SortedArray(ORDER.ASCENDING);
      q.add(5);
      q.add(2);
      q.add(4);
      assert.deepStrictEqual(q.items, [2, 4, 5]);
    });

    it('should prevent duplicate items based on comparator', function () {
      const q = new SortedArray(ORDER.ASCENDING);
      q.add(1);
      const result = q.add(1);
      assert.strictEqual(result, false);
      assert.deepStrictEqual(q.items, [1]);
    });
  });

  describe('has()', function () {
    it('should return true if item is present', function () {
      const q = new SortedArray(ORDER.ASCENDING);
      q.add(10);
      assert.strictEqual(q.has(10), true);
    });

    it('should return false if item is not present', function () {
      const q = new SortedArray(ORDER.ASCENDING);
      q.add(10);
      assert.strictEqual(q.has(5), false);
    });
  });

  describe('remove()', function () {
    it('should remove an item if present', function () {
      const q = new SortedArray(ORDER.ASCENDING, [1, 2, 3]);
      const removed = q.remove(2);
      assert.strictEqual(removed, true);
      assert.deepStrictEqual(q.items, [1, 3]);
    });

    it('should return false if item is not found', function () {
      const q = new SortedArray(ORDER.ASCENDING, [1, 2, 3]);
      const removed = q.remove(4);
      assert.strictEqual(removed, false);
    });
  });

  describe('logSearch()', function () {
    it('should return correct insertion index and undefined if item not found', function () {
      const arr = [2, 4, 6];
      const [index, found] = SortedArray.logSearch(5, arr, ORDER.ASCENDING);
      assert.strictEqual(index, 2);
      assert.strictEqual(found, undefined);
    });

    it('should return correct index and item if found', function () {
      const arr = [1, 3, 5, 7];
      const [index, found] = SortedArray.logSearch(5, arr, ORDER.ASCENDING);
      assert.strictEqual(index, 2);
      assert.strictEqual(found, 5);
    });
  });

});
