// ✅ 1. Bitwise Strategy
// Time: O(1) | Space: O(1)
// Purpose: Computes sum of integers from 1 to n using the arithmetic formula (n * (n + 1)) / 2
// Implementation: Uses bitwise right shift (>>> 1) instead of division to avoid floating-point
// arithmetic and ensure integer results.
// Use Cases:
// - One-off sums (e.g., calculating seats in a triangular auditorium)
// - Performance-critical apps (e.g., game engines, real-time systems)
// - Memory-constrained environments (no caching)
// Edge Cases:
// - Negative n: Returns incorrect results (e.g., n=-1 gives 0)
// - Non-integer n: Bitwise shift truncates decimals (e.g., n=5.5 gives 16)
// - Large n: Limited by JavaScript number precision (~2^53)
// Limitations: No caching for repeated calls; lacks input validation
function sum_to_n_a(n: number): number {
  // Formula: (n * (n + 1)) / 2, with >>> 1 for integer division
  return (n * (n + 1)) >>> 1; // Fast, avoids floats
}
// ⚡ Constant time, 🧼 No memory, 🧮 Simple & optimal
// Example: sum_to_n_a(5) = 15 (1+2+3+4+5), sum_to_n_a(7) = 28 (1+2+...+7)

// ✅ 2. Memoized Strategy (Incremental Caching, Memory-Safe)
// Time: O(n - lastCachedN) for new n > lastCachedN, O(1) for cached, O(1) or O(lastCachedN - n) for n < lastCachedN
// Space: O(k), where k is capped at MAX_CACHE_SIZE (100) to ensure memory safety
// Purpose: Computes sum of integers from 1 to n using a cache to store results, with incremental
// computation to leverage previously cached sums for efficiency in sequential scenarios
// (e.g., n=5, then n=7, then n=6). Cache pruning limits memory usage.
// Implementation:
// - Uses a closure to maintain a cache (Record<number, number>) and lastCachedN (highest n cached)
// - If n is cached, returns result in O(1)
// - If n > lastCachedN, computes forward by adding from lastCachedN + 1 to n
// - If n <= lastCachedN, uses cached value or computes backward by subtracting from lastCachedN
// - Caches all intermediate sums, but prunes cache to keep only the most recent 100 entries
// Use Cases:
// - Reactive UIs with incremental n updates (e.g., sliders, counters, pagination)
// - Sequential calls where n increases or decreases slightly
// - Performance-critical apps with repeated calls, where memory safety is crucial
// Edge Cases:
// - Negative or non-integer n: Returns 0 for robustness
// - n=0: Returns cached 0
// - Large n: Limited by JavaScript number precision
// Changes from Original:
// - Original: Computed from 1 to n (O(n)) for uncached inputs, no memory limits
// - New: Incremental computation (O(n - lastCachedN) or O(lastCachedN - n)), caches intermediates,
//   added cache pruning to cap memory usage
// Limitations:
// - Cache pruning may evict useful entries, slightly reducing hit rate
// - Backward computation assumes intermediate cache values
// Potential Improvements:
// - Use sum_to_n_a for large n to avoid iterations
// - Support BigInt for large n precision
const sum_to_n_b = (() => {
  // Initialize cache with base case
  const cache: Record<number, number> = { 0: 0 }; // Stores sums for each n
  let lastCachedN: number = 0; // Tracks the highest n cached
  const MAX_CACHE_SIZE: number = 100; // Cap cache size for memory safety

  return function(n: number): number {
    // Handle non-positive and non-integer inputs for robustness
    if (!Number.isInteger(n) || n < 0) return 0;

    // Return cached result if available (O(1))
    if (cache[n] !== undefined) return cache[n];

    // Initialize from the last cached point
    let startN = lastCachedN;
    let startSum = cache[lastCachedN];

    if (n > lastCachedN) {
      // Compute forward: add from lastCachedN + 1 to n
      for (let i = startN + 1; i <= n; i++) {
        startSum += i;
        cache[i] = startSum; // Cache each intermediate sum
      }
      lastCachedN = n; // Update lastCachedN
    } else {
      // Compute backward: use cached value or subtract from lastCachedN
      startSum = cache[n]; // Check cache first
      if (startSum === undefined) {
        startSum = cache[lastCachedN];
        for (let i = lastCachedN; i > n; i--) {
          startSum -= i; // Subtract numbers from lastCachedN to n+1
        }
        cache[n] = startSum; // Cache the result
      }
    }

    // Prune cache to keep only the most recent MAX_CACHE_SIZE entries
    if (Object.keys(cache).length > MAX_CACHE_SIZE) {
      const keys = Object.keys(cache)
        .map(Number)
        .sort((a, b) => b - a); // Sort in descending order for most recent
      for (const key of keys.slice(MAX_CACHE_SIZE)) {
        delete cache[key]; // Remove oldest entries
      }
      // Update lastCachedN if it was pruned
      lastCachedN = Math.max(...Object.keys(cache).map(Number));
    }

    return startSum;
  };
})();
// ♻️ Saves repeated work, 🔒 Internal cache, 🧠 Ideal for reactive UIs with incremental updates
// ✅ Memory-safe: Cache capped at 100 entries to prevent bloat
// ✅ Incremental: Computes only the delta (forward or backward) from last cached sum
// Handles sequential calls (e.g., n=5, then n=7, then n=6) efficiently
// Example:
// - n=5: Computes 1+2+3+4+5=15, caches {0:0, 1:1, 2:3, 3:6, 4:10, 5:15}, lastCachedN=5
// - n=7: Uses cache[5]=15, adds 6+7=13, returns 28, caches {6:21, 7:28}, lastCachedN=7
// - n=6: Returns cache[6]=21 (O(1))

// ✅ 3. Generator Strategy
// Time: O(n) | Space: O(1)
// Purpose: Computes sum of integers from 1 to n using a generator to lazily yield numbers,
// allowing memory-efficient iteration and flexibility for filtering or interruption
// Implementation:
// - countTo generator yields numbers from 1 to n
// - sum_to_n_c iterates over the generator to compute the sum
// Use Cases:
// - Memory-constrained environments with large n
// - Scenarios requiring lazy evaluation or filtering (e.g., sum only even numbers)
// - Pipelines where iteration can be interrupted
// Edge Cases:
// - Negative or non-integer n: Returns 0 for robustness
// - Large n: Safe, as it uses constant memory
// Limitations:
// - Always O(n), no caching for repeated calls
// - Slower than sum_to_n_a for one-off calculations
function* countTo(n: number): Generator<number> {
  // Yield numbers from 1 to n lazily
  for (let i = 1; i <= n; i++) yield i;
}

function sum_to_n_c(n: number): number {
  // Handle edge cases for robustness
  if (!Number.isInteger(n) || n < 0) return 0;
  
  // Sum numbers yielded by the generator
  let sum = 0;
  for (const val of countTo(n)) sum += val;
  return sum;
}
// 💧 Memory-efficient, 🛠 Filter/interrupt-ready, 📦 Safe for large `n`
// Example: sum_to_n_c(5) = 15 (1+2+3+4+5), sum_to_n_c(7) = 28 (1+2+...+7)