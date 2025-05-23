import { defineConfig } from 'vitest/config';
import baseVitestConfig from './base.vitest.config.mjs';

export default defineConfig({
  ...baseVitestConfig,
  test: {
    ...baseVitestConfig.test,
    include: ['**/*.unit.test.ts'],
    fileParallelism: true,
  },
});
