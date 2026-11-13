import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const standaloneDemo = process.env.VERCEL === '1';

export default defineConfig({
  base: '/',
  define: standaloneDemo
    ? { 'import.meta.env.VITE_STANDALONE': JSON.stringify('true') }
    : {},
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
      },
    },
  },
});
