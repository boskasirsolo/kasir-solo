
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
    esbuild: {
      drop: ['console', 'debugger'], // Hapus console.log di production untuk mengurangi ukuran
    },
    rollupOptions: {
      output: {
        // Smart Chunking Strategy
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Core React (Stable, jarang berubah)
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            // Supabase (Berat, dipisah)
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            // Lucide Icons (Berat jika tidak tree-shaken, pisahkan agar tidak memblokir render utama)
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            // AI SDKs (Sangat berat, wajib isolasi)
            if (id.includes('@google/genai')) {
              return 'vendor-ai';
            }
            // Sisa libs lainnya
            return 'vendor-libs';
          }
          
          // Split Admin Pages agar tidak diload user biasa
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
