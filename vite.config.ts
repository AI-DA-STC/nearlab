import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const src = (p: string) => fileURLToPath(new URL(`./src/${p}`, import.meta.url));

// Aliases mirror tsconfig.json so the Vite resolver and TypeScript agree.
export default defineConfig({
  plugins: [react()],
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
