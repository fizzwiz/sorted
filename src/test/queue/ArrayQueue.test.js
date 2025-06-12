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

});
