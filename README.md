# 👨‍👩‍👧‍👦 @fizzwiz/sorted

**Sorted collections for JavaScript — powered by expressive equivalence.**

`@fizzwiz/sorted` introduces expressive, sorted data structures for JavaScript — built around the core concepts of **ordering**, **selection**, and **equivalence**.

---

### 📣 Rethinking Equivalence

`@fizzwiz/sorted` introduces a fresh model of equivalence for JavaScript collections. Instead of relying solely on primitive equality, it supports **custom equivalence classes** for any object type, defined by any **representation function**.

While traditional approaches often rely on **hash functions**, in this library, hash functions are just one way to represent an item—any **representation function** is valid. At its core, representation-based equivalence is implemented using **comparators**, which serve as the fundamental mechanism for defining equivalence. Consequently, every collection in the library is inherently **sorted**. For a deeper dive, read [Contemplating a True Set](https://sorted.blog.fizzwiz.cloud/2025/06/contemplating-true-set.html).

---

## 🧩 Core Data Structures

### `ArrayQueue`, `SortedArray`, `Classifier`, and `TrueSet`

Once the equivalence model is embraced, these data structures emerge naturally:

* **`ArrayQueue`** – An array-like structure sorted by **insertion order**. Items are unique by insertion-order, so duplicates coexist.

```js
import { ArrayQueue } from "@fizzwiz/sorted";

const queue = new ArrayQueue();
queue.add('Bob');
queue.add('Alice');
queue.add('Bob');
console.log(queue.toArray());  // -> ['Bob', 'Alice', 'Bob']
```

* **`SortedArray`** – An array sorted by a **comparator function**. Equivalent items cannot coexist.

```js
import { SortedArray, ORDER } from "@fizzwiz/sorted";

const comparator = ORDER.ASCENDING;
const sorted = new SortedArray(comparator);
sorted.add('Bob');
sorted.add('Alice');
sorted.add('Bob');
console.log(sorted.toArray());  // -> ['Alice', 'Bob']
```

* **`Classifier`** – A tree of `SortedArray` instances. Each path represents an array, with sorted items at each node. `get(...keys)` retrieves arrays sharing the specified keys.

```js
import { Classifier, ORDER } from "@fizzwiz/sorted";

const classifier = new Classifier(ORDER.ASCENDING, ORDER.DESCENDING);
classifier.add(['Bob', 'Alpha']);
classifier.add(['Alice', 'Zebra']);
classifier.add(['Alice', 'Alpha']);
classifier.add(['Alice', 'Zebra']);
console.log(classifier.toArray());  // -> [['Alice', 'Zebra'], ['Alice', 'Alpha'], ['Bob', 'Alpha']]
console.log(classifier.get(undefined, 'Alpha'));  // -> [['Alice', 'Alpha'], ['Bob', 'Alpha']]
```

* **`TrueSet`** – A set whose equivalence is defined by a **representation function**. Internally, items are stored as `[...repr(item), item]` in a `Classifier`.

```js
import { TrueSet, ORDER } from "@fizzwiz/sorted";

const repr = user => user.age;
const trueSet = new TrueSet(repr, ORDER.ASCENDING, ORDER.SINGULAR);
trueSet.add({name: 'Alice', age: 21});
trueSet.add({name: 'Bob', age: 18});
trueSet.add({name: 'Carol', age: 18}); // ignored due to ORDER.SINGULAR
console.log(trueSet.toArray());  // -> [{name: 'Bob', age: 18}, {name: 'Alice', age: 21}]
```

---

## 🧩 Equivalence and Coexistence

`TrueSet` allows control over whether:

* Equivalent items coexist, or
* Equivalent items are aggregated for enumeration.

```js
import { TrueSet, ORDER } from "@fizzwiz/sorted";

const repr = user => user.age;
const userByName = (a, b) => a.name < b.name ? -1 : a.name === b.name ? 0 : 1;
const users = new TrueSet(repr, ORDER.ASCENDING, userByName);
users.add({name: 'Carol', age: 21});
users.add({name: 'Bob', age: 18});
users.add({name: 'Alice', age: 18}); // added before Bob

console.log(users.toArray());  // -> [{name: 'Alice', age: 18}, {name: 'Bob', age: 18}, {name: 'Carol', age: 21}]
console.log(users.classifier.get(18).toArray());  // -> [[18, {name: 'Alice', age: 18}], [18, {name: 'Bob', age: 18}]]
```

---

## 🛠️ Installation & Usage

### ✅ Node.js (ES Modules)

Install via npm:

```bash
npm install @fizzwiz/sorted
```

Then import:

```js
import { ArrayQueue } from '@fizzwiz/sorted';
const queue = new ArrayQueue();
```

### ✅ Browser (via CDN)

Include the bundle in HTML:

```html
<script src="https://cdn.jsdelivr.net/npm/@fizzwiz/sorted/dist/sorted.bundle.js"></script>
<script>
  const queue = new sorted.ArrayQueue();
</script>
```

This exposes a global `sorted` object with all exported classes.

---

## 📄 Documentation

### 📘 API Reference

Full API documentation:

🔗 [fizzwiz.github.io/sorted](https://fizzwiz.github.io/sorted)

### 🧠 Concepts, Guides & Tutorials

Learn more about sorting, equivalence, and expressive problem-solving:

🔗 [sorted.blog.fizzwiz.cloud](https://sorted.blog.fizzwiz.cloud)

---

## ✨ Why Use This Library?

### 🧬 The Search-and-Select Pattern

Sorted queues are a fundamental component of the 👉 [**Search-and-Select**](https://blog.fizzwiz.cloud/2025/06/search-and-select-pattern.html) pattern. This approach allows for a clean, declarative way to explore solution spaces, particularly when paired with constructs like `Each` and `What` from [`@fizzwiz/fluent`](https://fluent.blog.fizzwiz.cloud).

> **@fizzwiz/sorted** — because sorting is solving.

