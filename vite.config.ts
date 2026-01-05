
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true, // Ensure CSS is also split per chunk
    rollupOptions: {
      output: {
        // Smart Chunking Strategy to reduce main thread blocking
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Core React Bundle
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            // Supabase Client (Heavy)
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Lucide Icons (Very Heavy if not tree-shaken perfectly)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // AI SDKs (Isolate them)
            if (id.includes('@google/genai')) {
              return 'vendor-ai';
            }
            // Other smaller libs
            return 'vendor-libs';
          }
          
          // Group Admin Components to prevent them from leaking into client-side bundles
          if (id.includes('/components/admin') || id.includes('/pages/admin')) {
            return 'feature-admin';
          }
        }
      }
    }
  }
});
