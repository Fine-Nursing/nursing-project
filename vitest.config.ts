import { defineConfig } from 'vitest/config'
// @ts-ignore
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      'src': path.resolve(__dirname, './src'),
    },
  },
})