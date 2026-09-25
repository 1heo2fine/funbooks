import { defineConfig } from 'vite';
import path from 'path';
import tailwindcssPostcss from '@tailwindcss/postcss';

export default defineConfig({
  root: 'src',
  css: {
    postcss: {
      plugins: [
        tailwindcssPostcss(),
      ],
    },
  },
  publicDir: '../public',
  build: {
    outDir: '../dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});