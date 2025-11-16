# ☯️ @fizzwiz/sorted

**Sorted collections for JavaScript — powered by expressive equivalence.**

`@fizzwiz/sorted` provides expressive, sorted data structures for JavaScript using **ordering**, **selection**, and **equivalence**.

---

### 📣 Equivalence

Instead of relying only on primitive equality, this library uses **representation functions** to define equivalence classes for objects. Comparators are used to sort keys and values. See [Contemplating a True Set](https://sorted.blog.fizzwiz.cloud/2025/06/contemplating-true-set.html) for details.

---

## 🧩 Core Data Structures

### `ArrayQueue`, `SortedArray`, `Classifier`, `TrueSet`

* **`ArrayQueue`** – Array-like FIFO structure, duplicates allowed:

```js
import { ArrayQueue } from "@fizzwiz/sorted";

const queue = new ArrayQueue();

queue.add('Bob');
queue.add('Alice');
queue.add('Bob');

console.log(queue.toArray()); // ['Bob', 'Alice', 'Bob']
```

* **`SortedArray`** – Array sorted by a comparator, duplicates not allowed:

```js
import { SortedArray, ORDER } from "@fizzwiz/sorted";
const sorted = new SortedArray(ORDER.ASCENDING);

sorted.add('Bob');
sorted.add('Alice');
sorted.add('Bob');

console.log(sorted.toArray()); // ['Alice', 'Bob']
```

* **`Classifier`** – Tree of equivalence classes by key paths. Wildcards allowed:

```js
import { Classifier } from "@fizzwiz/sorted";

const classifier = new Classifier();

classifier.add(['b','o','b'], 'Bob');
classifier.add(['a','l','b','e','r','t'], 'Albert');

const items = classifier.get([undefined, undefined, 'b']);  // undefined acts as wildcard

console.log(items.toArray());   // ['Bob', 'Albert']
```

* **`TrueSet`** – Set with equivalence defined by a `repr(item)` function:

```js
import { TrueSet, ORDER, SORTER } from "@fizzwiz/sorted";

const repr = user => user.age;
const trueSet = new TrueSet(repr, new Classifier(SORTER.UNIFORM(
  ORDER.ASCENDING,            // for keys
  ORDER.SINGULAR              // for items: only one item per equivalence class
)));

trueSet.add({name:'Alice', age:21});
trueSet.add({name:'Bob', age:18});
trueSet.add({name:'Carol', age:18}); // ignored

console.log(trueSet.toArray()); // [{name:'Bob', age:18}, {name:'Alice', age:21}]
```

---

## 🧩 Equivalence and Coexistence

`Classifier` and `TrueSet` control whether equivalent items coexist or are aggregated:

```js
import { TrueSet, ORDER, SORTER } from "@fizzwiz/sorted";

const repr = user => user.age;
const users = new TrueSet(repr, new Classifier(SORTER.UNIFORM(
  ORDER.ASCENDING,            // for keys
  ORDER.BY_PROPERTY('name')   // for items
)));

users.add({name:'Carol', age:21});
users.add({name:'Bob', age:18});
users.add({name:'Alice', age:18});

console.log(users.toArray()); // [{name:'Alice', age:18},{name:'Bob', age:18},{name:'Carol', age:21}]
console.log(users.classifier.get(18).toArray()); // [{name:'Alice', age:18},{name:'Bob', age:18}]
```

---

## 🛠️ Installation & Usage

### ✅ Node.js (ES Modules)

```bash
npm install @fizzwiz/sorted
```

```js
import { ArrayQueue } from '@fizzwiz/sorted';
const queue = new ArrayQueue();
```

### ✅ Browser (via CDN)

```html
<script src="https://cdn.jsdelivr.net/npm/@fizzwiz/sorted/dist/sorted.bundle.js"></script>
<script>
  const queue = new sorted.ArrayQueue();
</script>
```
The global `sorted` object exposes all classes.

---

## 📄 Documentation

### 📘 API Reference

🔗 [fizzwiz.github.io/sorted](https://fizzwiz.github.io/sorted)

### 🧠 Guides & Tutorials

🔗 [sorted.blog.fizzwiz.cloud](https://sorted.blog.fizzwiz.cloud)
