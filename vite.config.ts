
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild', // Gunakan esbuild untuk minifikasi cepat
    target: 'es2020',
    modulePreload: false, // MATIKAN PRELOAD OTOMATIS: Mencegah browser mendownload chunk lazy (Admin/AI) di awal.
    esbuild: {
      drop: ['console', 'debugger'], // Hapus console.log di production untuk mengurangi ukuran
    },
    rollupOptions: {
      output: {
        // Smart Chunking Strategy - Optimized for Reduced Depth
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Core Essentials (React + Router + Utils + UI Icons)
            // Grouping these reduces the number of initial requests
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler') || id.includes('lucide-react')) {
              return 'vendor-core';
            }
            // Supabase (Large, heavy, distinct)
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // AI SDKs (Very heavy, must be isolated)
            if (id.includes('@google/genai')) {
              return 'vendor-ai';
            }
            // Remaining libs (small utilities)
            return 'vendor-libs';
          }
          
          // Split Admin Pages (Security & Performance: Ordinary users don't need this)
          if (id.includes('/pages/admin') || id.includes('/components/admin')) {
            return 'feature-admin';
          }
          
          // Split Shop Logic (Optional, keep if Shop is heavy)
          if (id.includes('/components/shop')) {
            return 'feature-shop';
          }
        }
      }
    }
  }
});
