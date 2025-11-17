import assert from 'assert';
import { ArrayQueue } from '../../main/queue/ArrayQueue.js';

describe('ArrayQueue', () => {

  describe('constructor', () => {
    it('initializes with default fifo and empty items', () => {
      const queue = new ArrayQueue();
      assert.strictEqual(queue.fifo, true);
      assert.strictEqual(queue.n(), 0);
    });

    it('initializes with custom fifo and items', () => {
      const queue = new ArrayQueue(false, [1, 2]);
      assert.strictEqual(queue.fifo, false);
      assert.strictEqual(queue.n(), 2);
    });
  });

  describe('add()', () => {
    it('adds items to the queue', () => {
      const queue = new ArrayQueue();
      queue.add('a');
      queue.add('b');
      assert.deepStrictEqual(queue.items, ['a', 'b']);
    });
  });

  describe('peek()', () => {
    it('returns correct item in FIFO mode', () => {
      const queue = new ArrayQueue(true, ['x', 'y']);
      assert.strictEqual(queue.peek(), 'x');
      assert.strictEqual(queue.peek(false), 'y');
    });

    it('returns correct item in LIFO mode', () => {
      const queue = new ArrayQueue(false, ['x', 'y']);
      assert.strictEqual(queue.peek(), 'y');
      assert.strictEqual(queue.peek(false), 'x');
    });
  });

  describe('poll()', () => {
    it('removes and returns correct item in FIFO mode', () => {
      const queue = new ArrayQueue(true, ['a', 'b']);
      assert.strictEqual(queue.poll(), 'a');
      assert.strictEqual(queue.poll(), 'b');
      assert.strictEqual(queue.n(), 0);
    });

    it('removes and returns correct item in LIFO mode', () => {
      const queue = new ArrayQueue(false, ['a', 'b']);
      assert.strictEqual(queue.poll(), 'b');
      assert.strictEqual(queue.poll(), 'a');
      assert.strictEqual(queue.n(), 0);
    });
  });

  describe('has() and remove()', () => {
    it('always returns false', () => {
      const queue = new ArrayQueue();
      assert.strictEqual(queue.has('anything'), false);
      assert.strictEqual(queue.remove('anything'), false);
    });
  });

  describe('clear()', () => {
    it('empties the queue', () => {
      const queue = new ArrayQueue(true, [1, 2, 3]);
      queue.clear();
      assert.strictEqual(queue.n(), 0);
    });
  });

  describe('[Symbol.iterator]()', () => {
    it('iterates over items in insertion order', () => {
      const queue = new ArrayQueue(true, [1, 2, 3]);
      const result = Array.from(queue);
      assert.deepStrictEqual(result, [1, 2, 3]);
    });
  });

  describe('reverse()', () => {
    it('provides reverse iterable over the queue', () => {
      const queue = new ArrayQueue(true, ['a', 'b', 'c']);
      const reversed = Array.from(queue.reverse());
      assert.deepStrictEqual(reversed, ['c', 'b', 'a']);
    });

    it('works independently of fifo mode', () => {
      const queue = new ArrayQueue(false, ['x', 'y']);
      const reversed = Array.from(queue.reverse());
      assert.deepStrictEqual(reversed, ['y', 'x']);
    });
  });

  describe('Queue.select()', function() {

    let q;

    beforeEach(function() {
        q = new ArrayQueue(true, [1, 2, 3, 4, 5]);

    });

    it('should keep the first n items and discard the rest', function() {
        const discarded = q.select(2, true);
        assert.deepStrictEqual(q.items, [1, 2]);
        assert.deepStrictEqual(discarded, [3, 4, 5]);
    });

    it('should keep the last n items and discard the rest', function() {
        const discarded = q.select(2, false);
        assert.deepStrictEqual(q.items, [4, 5]);
        assert.deepStrictEqual(discarded, [1, 2, 3]);
    });

    it('should discard nothing when n equals the length', function() {
        const discarded = q.select(5);
        assert.deepStrictEqual(q.items, [1, 2, 3, 4, 5]);
        assert.deepStrictEqual(discarded, []);
    });

    it('should discard nothing when n is greater than the length', function() {
        const discarded = q.select(10);
        assert.deepStrictEqual(q.items, [1, 2, 3, 4, 5]);
        assert.deepStrictEqual(discarded, []);
    });

    it('should discard everything when n is zero', function() {
        const discarded = q.select(0);
        assert.deepStrictEqual(q.items, []);
        assert.deepStrictEqual(discarded, [1, 2, 3, 4, 5]);
    });

    it('should discard everything when n is negative', function() {
        const discarded = q.select(-3);
        assert.deepStrictEqual(q.items, []);
        assert.deepStrictEqual(discarded, [1, 2, 3, 4, 5]);
    });

    it('should work with n = 1, first=true', function() {
        const discarded = q.select(1, true);
        assert.deepStrictEqual(q.items, [1]);
        assert.deepStrictEqual(discarded, [2, 3, 4, 5]);
    });

    it('should work with n = 1, first=false', function() {
        const discarded = q.select(1, false);
        assert.deepStrictEqual(q.items, [5]);
        assert.deepStrictEqual(discarded, [1, 2, 3, 4]);
    });
});


});
