import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      { test: { name: 'generators', include: ['generators/**/*.test.ts'], environment: 'node', setupFiles: ['generators/test/setup.ts'] } },
      { test: { name: 'lib', include: ['src/lib/**/*.test.ts', 'src/data/**/*.test.ts', 'scripts/**/*.test.ts', 'worker/**/*.test.ts', 'tests/unit/**/*.test.ts'], environment: 'node' } },
      { test: { name: 'app', include: ['src/islands/**/*.test.ts'], environment: 'node' } },
    ],
  },
});
