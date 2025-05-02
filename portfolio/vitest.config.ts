/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    includeSource: ['src/**/*.{ts,tsx}'],
    exclude: ['**/node_modules/**', '**/dist/**'],
  },
})
