import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
    // userEvent component tests (e.g. GameForm) accumulate real per-keystroke
    // delays and exceed the 5s default on slower CI runners. 15s gives headroom
    // (the Lint+Build+Test job has a 15-minute budget).
    testTimeout: 15000,
    exclude: ['**/node_modules/**', '**/e2e/**', '**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['app/lib/**/*.ts', 'app/components/**/*.tsx'],
      exclude: ['app/lib/types.ts', 'app/lib/version.ts'],
    },
  },
  resolve: {
    // Match tsconfig "@/*": ["./app/*"] so test imports resolve the same as app imports
    alias: { '@': path.resolve(__dirname, 'app') },
  },
});
