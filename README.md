# @fizzwiz/sorted

**Sorted collections for JavaScript — powered by expressive equivalence and queue-based selection.**

The `@fizzwiz/sorted` library introduces sorted data structures to JavaScript, enabling powerful abstractions built around ordering, selection, and equivalence. It was designed to support the `Search-and-Select pattern` as detailed in the companion library [`@fizzwiz/fluent`](https://fluent.blog.fizzwiz.cloud).

## ✨ Why Use This Library?

### 🧬 Search-and-Select Pattern

At its core, `@fizzwiz/sorted` provides sorted queues — essential for implementing the `Search-and-Select` pattern. This pattern offers a clean, declarative approach to exploring solution spaces, particularly when paired with constructs like `Each` and `What` from [`@fizzwiz/fluent`](https://fluent.blog.fizzwiz.cloud). 

### 📣 A New Perspective on Equivalence

This library also introduces a novel approach to **object equivalence**. Unlike JavaScript's built-in equality by value (which only applies to primitives), `@fizzwiz/sorted` lets you define **custom equivalence classes** using **representation functions**.

This means you can group and sort objects based on structural, semantic, or domain-specific criteria — unlocking more meaningful comparisons in everyday code.

## 📦 Package Structure

The library is modular, with each component in its own directory:

| Package   | Description                                   |
|-----------|-----------------------------------------------|
| `core`    | Base abstractions — includes `Collection` and `Queue` |
| `queue`   | Queue implementations built on the `Queue` base class |
| `util`    | Utility classes and general-purpose helpers    |

Each file in a package typically defines a single class.

## 🛠️ Installation & Usage

### ✅ Node.js (ES Modules)

Install via npm:

```bash
npm install @fizzwiz/sorted
```
Then import in your project

### ✅ Browser (via CDN)

Include the bundle directly in your HTML:
```html
<script src="https://cdn.jsdelivr.net/gh/fizzwiz/sorted@v0.0.0-dev.1/dist/sorted.bundle.js"></script>
<script>
  const queue = new sorted.ArrayQueue();
</script>
```

This exposes a global `sorted` object with all exported classes.

##📄 Documentation

### 📘 **API Reference**

Explore the full API with jsDoc-style documentation:  
🔗 [fizzwiz.github.io/sorted](https://fizzwiz.github.io/sorted)

### 🧠 **Concepts, Guides & Tutorials**
Understand the concepts behind sorting, equivalence, and expressive problem solving:  
🔗 [sorted-js.blogspot.com](https://sorted-js.blogspot.com)
