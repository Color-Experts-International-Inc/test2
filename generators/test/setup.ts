// Generators must be deterministic: forbid ambient randomness and clocks while their tests run.
import { beforeAll } from 'vitest';

beforeAll(() => {
  Math.random = () => {
    throw new Error('Math.random is forbidden in generators; use the injected Rng');
  };
});
