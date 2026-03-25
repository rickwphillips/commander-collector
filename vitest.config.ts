import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    globals: true,
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
