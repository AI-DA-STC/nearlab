import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { newsImages } from './vite/newsImages';
import { previewBase } from './vite/previewBase';

const src = (p: string) => fileURLToPath(new URL(`./src/${p}`, import.meta.url));

// Aliases mirror tsconfig.json so the Vite resolver and TypeScript agree.
export default defineConfig({
  // `/` for the live site; the deploy workflow sets BASE_PATH=/preview/ for
  // the test copy built from the development branch.
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), newsImages(), previewBase()],
  resolve: {
    alias: {
      '@/app': src('app'),
      '@/pages': src('pages'),
      '@/features': src('features'),
      '@/entities': src('entities'),
      '@/shared': src('shared'),
    },
  },
});
