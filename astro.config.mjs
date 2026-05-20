import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // Match Tauri's expected dev server config
  server: {
    port: 5173,
    strictPort: true,
  },
  outDir: 'dist',
  build: {
    assets: '_assets',
  },
  vite: {
    // Tauri env compatibility
    envPrefix: ['VITE_', 'TAURI_'],
    // Prevent Vite from obscuring Rust errors
    clearScreen: false,
    build: {
      // Tauri expects a single JS file for production
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
  },
});
