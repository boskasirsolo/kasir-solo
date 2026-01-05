
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', 
  build: {
    outDir: 'dist',
    sourcemap: false,
    cssCodeSplit: true,
    minify: 'esbuild', // Esbuild sudah sangat cepat dan efisien
    target: 'es2020',
    modulePreload: false, // MATIKAN PRELOAD: Sangat penting untuk mencegah download chunk Admin/AI di awal.
    esbuild: {
      drop: ['console', 'debugger'], // Hapus log untuk ukuran lebih kecil
    },
    rollupOptions: {
      output: {
        // Smart Chunking Strategy
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Core React (Wajib load di awal)
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler')) {
              return 'vendor-core';
            }
            // Supabase (Berat, dipisah)
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // AI SDKs (Sangat berat, wajib isolasi total)
            if (id.includes('@google/genai')) {
              return 'vendor-ai';
            }
            // Lucide Icons (Pisahkan agar tidak masuk core, biar tree-shaking berjalan per-file jika memungkinkan)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // Sisa libs lainnya
            return 'vendor-libs';
          }
          
          // Split Admin Pages (Security & Performance)
          if (id.includes('/pages/admin') || id.includes('/components/admin')) {
            return 'feature-admin';
          }
          
          // Split Shop Logic
          if (id.includes('/components/shop')) {
            return 'feature-shop';
          }
        }
      }
    }
  }
});
