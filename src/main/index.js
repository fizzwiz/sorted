// Grouped re-exports for documentation and bundling
import * as core from './core/index.js';
import * as queue from './queue/index.js';

// Export namespaces for structured imports
export { core, queue };

// Flatten key exports for convenience
export { Collection, Queue } from './core/index.js';
export { ArrayQueue, SortedArray } from './queue/index.js';
export { ORDER } from './global.js';

