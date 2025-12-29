import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 3000,
  },
  // Base path: use environment variable or default to '/' for local development
  // Set VITE_BASE_PATH='/myself/' for GitHub Pages deployment
  base: (process.env as { VITE_BASE_PATH?: string }).VITE_BASE_PATH || '/',
});
