
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild',
    target: 'es2020',
    modulePreload: false, // Fix: Disable preloading to stop Admin chunk loading on Home
    esbuild: {
      drop: ['console', 'debugger'],
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler')) {
              return 'vendor-core';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@google/genai')) {
              return 'vendor-ai';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-libs';
          }
          if (id.includes('/pages/admin') || id.includes('/components/admin')) {
            return 'feature-admin';
          }
          if (id.includes('/components/shop')) {
            return 'feature-shop';
          }
        }
      }
    }
  }
});
